'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Media } from '@/types/database'

interface UploadResult {
  media: Media
  url: string
}

// 미디어 파일 업로드 훅
export function useMediaUpload(entryId?: string) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const uploadFile = useCallback(async (
    file: File,
    targetEntryId?: string
  ): Promise<UploadResult | null> => {
    const id = targetEntryId ?? entryId
    if (!id) {
      setError('일기를 먼저 저장해주세요.')
      return null
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // 파일 크기 검사 (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('파일 크기는 50MB 이하여야 합니다.')
        return null
      }

      const ext = file.name.split('.').pop()
      const path = `${user.id}/${id}/${Date.now()}.${ext}`
      const mediaType = getMediaType(file.type)

      // Supabase Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        setError('업로드에 실패했습니다.')
        return null
      }

      setProgress(80)

      // media 테이블에 메타데이터 저장
      const { data: mediaData, error: dbError } = await supabase
        .from('media')
        .insert({
          entry_id: id,
          user_id: user.id,
          media_type: mediaType,
          storage_path: path,
          file_size: file.size,
        })
        .select('*')
        .single()

      if (dbError || !mediaData) {
        setError('메타데이터 저장에 실패했습니다.')
        return null
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(path)

      setProgress(100)
      return { media: mediaData, url: urlData.publicUrl }
    } catch {
      setError('업로드 중 오류가 발생했습니다.')
      return null
    } finally {
      setUploading(false)
    }
  }, [entryId, supabase])

  // 다중 파일 업로드
  const uploadFiles = useCallback(async (
    files: FileList | File[],
    targetEntryId?: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = []
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const result = await uploadFile(file, targetEntryId)
      if (result) results.push(result)
    }

    return results
  }, [uploadFile])

  return { uploading, progress, error, uploadFile, uploadFiles }
}

function getMediaType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'photo'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType === 'application/pdf') return 'pdf'
  return 'photo'
}
