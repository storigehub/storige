/**
 * 카메라 유틸 — Capacitor Camera / Web fallback
 * Capacitor 환경: 네이티브 카메라 촬영
 * 웹 환경: file input 위임 (caller 책임)
 */

// Capacitor 환경 여부 확인
export function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()
}

// Capacitor Camera로 사진 촬영 → Blob 반환
export async function takeCameraPhoto(): Promise<File | null> {
  if (!isCapacitor()) return null

  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    })

    if (!photo.dataUrl) return null

    // DataURL → Blob → File
    const res = await fetch(photo.dataUrl)
    const blob = await res.blob()
    const filename = `photo_${Date.now()}.${photo.format ?? 'jpeg'}`
    return new File([blob], filename, { type: blob.type || 'image/jpeg' })
  } catch {
    // 사용자 취소 등 무시
    return null
  }
}

// 갤러리에서 사진 선택 → File[] 반환
export async function pickFromGallery(): Promise<File[]> {
  if (!isCapacitor()) return []

  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
    const result = await Camera.pickImages({
      quality: 90,
      limit: 10,
    })

    const files: File[] = []
    for (const photo of result.photos) {
      if (!photo.webPath) continue
      const res = await fetch(photo.webPath)
      const blob = await res.blob()
      const ext = photo.webPath.split('.').pop()?.split('?')[0] ?? 'jpeg'
      const filename = `photo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      files.push(new File([blob], filename, { type: blob.type || 'image/jpeg' }))
    }
    return files
  } catch {
    return []
  }
}
