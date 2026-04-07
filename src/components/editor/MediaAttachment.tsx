'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import type { Media } from '@/types/database'

interface MediaAttachmentProps {
  entryId?: string
  mediaList: MediaItem[]
  onUploaded: (media: Media, url: string) => void
}

interface MediaItem {
  media: Media
  url: string
}

// 미디어 첨부 컴포넌트 — 사진 업로드 + 미리보기
export function MediaAttachment({ entryId, mediaList, onUploaded }: MediaAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploading, progress, error, uploadFiles } = useMediaUpload(entryId)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const results = await uploadFiles(files)
    results.forEach(({ media, url }) => onUploaded(media, url))

    // input 초기화
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="px-4 pb-3">
      {/* 업로드 버튼 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs text-[#0061A5] border border-[#0061A5] rounded-full px-3 py-1.5 active:bg-[#f0f7ff]"
        >
          <span>📷</span>
          <span>{uploading ? `업로드 중... ${progress}%` : '사진 추가'}</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-[#FF4757] mb-2">{error}</p>
      )}

      {/* 업로드된 사진 미리보기 */}
      {mediaList.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mediaList.map(({ media, url }) => (
            <div key={media.id} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-[#f5f5f5]">
              {media.media_type === 'photo' ? (
                <Image
                  src={url}
                  alt="첨부 사진"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {media.media_type === 'video' ? '🎥' : '🎵'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 숨김 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
