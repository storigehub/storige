'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlbumPhoto } from '@/types/database'

// 앨범 사진 목록 + 업로드 훅
export function useAlbum() {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data, error: fetchError } = await supabase
      .from('album_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (!fetchError && data) setPhotos(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  // 사진 공개 URL 반환
  const getPhotoUrl = useCallback((storagePath: string): string => {
    const { data } = supabase.storage.from('media').getPublicUrl(storagePath)
    return data.publicUrl
  }, [supabase])

  // 파일 업로드
  const uploadPhotos = useCallback(async (files: FileList | File[]): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUploading(true)
    setError(null)

    const fileArray = Array.from(files)
    const inserted: AlbumPhoto[] = []

    for (const file of fileArray) {
      if (file.size > 50 * 1024 * 1024) {
        setError('파일 크기는 50MB 이하여야 합니다.')
        continue
      }
      const ext = file.name.split('.').pop()
      const path = `${user.id}/album/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: false })

      if (uploadError) continue

      const { data: row, error: dbError } = await supabase
        .from('album_photos')
        .insert({
          user_id: user.id,
          storage_path: path,
          file_size: file.size,
          taken_at: new Date().toISOString(),
        })
        .select('*')
        .single()

      if (!dbError && row) inserted.push(row)
    }

    setPhotos(prev => [...inserted.reverse(), ...prev])
    setUploading(false)
  }, [supabase])

  // 사진 삭제
  const deletePhoto = useCallback(async (photo: AlbumPhoto): Promise<void> => {
    await supabase.storage.from('media').remove([photo.storage_path])
    await supabase.from('album_photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }, [supabase])

  // 캡션 수정
  const updateCaption = useCallback(async (id: string, caption: string): Promise<void> => {
    await supabase.from('album_photos').update({ caption }).eq('id', id)
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption } : p))
  }, [supabase])

  return { photos, loading, uploading, error, getPhotoUrl, uploadPhotos, deletePhoto, updateCaption, refetch: fetchPhotos }
}
