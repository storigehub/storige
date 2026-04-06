'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { EntryWithMedia } from '@/hooks/useDiaryList'

interface DiaryMediaViewProps {
  entries: EntryWithMedia[]
}

// 미디어 그리드 뷰 — 사진/비디오 그리드 표시
export function DiaryMediaView({ entries }: DiaryMediaViewProps) {
  const router = useRouter()
  const supabase = createClient()

  // 모든 미디어 수집
  const allMedia = entries.flatMap((entry) =>
    entry.media
      .filter((m) => m.media_type === 'photo' || m.media_type === 'video')
      .map((m) => ({
        ...m,
        entryId: entry.id,
        url: supabase.storage.from('media').getPublicUrl(m.storage_path).data.publicUrl,
      }))
  )

  if (allMedia.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="text-4xl">📷</div>
        <p className="text-sm text-[#888]">첨부된 사진이 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 p-0.5">
      {allMedia.map((media) => (
        <button
          key={media.id}
          onClick={() => router.push(`/diary/${media.entryId}`)}
          className="aspect-square overflow-hidden bg-[#f5f5f5] relative"
        >
          {media.media_type === 'photo' ? (
            <Image
              src={media.url}
              alt="일기 사진"
              fill
              className="object-cover"
              sizes="33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl">🎥</span>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
