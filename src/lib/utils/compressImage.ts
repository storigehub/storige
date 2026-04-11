/**
 * Canvas API를 이용한 이미지 압축 유틸리티
 * Vercel Serverless 4.5MB 한도 및 Supabase Storage 업로드 최적화용
 * 최대 1920px, 3MB 이하로 압축
 */

const MAX_WIDTH = 1920
const MAX_SIZE_BYTES = 3 * 1024 * 1024 // 3MB

export async function compressImage(file: File): Promise<File> {
  // 이미지가 아닌 파일은 그대로 반환
  if (!file.type.startsWith('image/')) return file

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // 크기 조정 계산
      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }

      ctx.drawImage(img, 0, 0, width, height)

      // 품질을 낮춰가며 목표 크기 이하로 압축
      const compress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }

            if (blob.size <= MAX_SIZE_BYTES || quality <= 0.3) {
              const compressed = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressed)
            } else {
              compress(quality - 0.1)
            }
          },
          'image/jpeg',
          quality
        )
      }

      compress(0.85)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}
