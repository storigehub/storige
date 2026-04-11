'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/utils/compressImage'

interface UseMystoryPhotoResult {
  uploading: boolean
  uploadPhoto: (file: File, sessionId: string) => Promise<string | null>
}

/**
 * MyStory 인터뷰 사진 첨부 업로드 훅
 * Supabase Storage 'mystory-photos' 버킷 사용
 */
export function useMystoryPhoto(): UseMystoryPhotoResult {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const uploadPhoto = useCallback(async (
    file: File,
    sessionId: string
  ): Promise<string | null> => {
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // 이미지 압축 (3MB 이하, 최대 1920px)
      const compressed = await compressImage(file)

      const ext = compressed.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${sessionId}/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('mystory-photos')
        .upload(path, compressed, { upsert: false })

      if (error) return null

      const { data } = supabase.storage
        .from('mystory-photos')
        .getPublicUrl(path)

      return data.publicUrl
    } catch {
      return null
    } finally {
      setUploading(false)
    }
  }, [supabase])

  return { uploading, uploadPhoto }
}
