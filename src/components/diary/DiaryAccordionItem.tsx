'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { EntryWithMedia } from '@/hooks/useDiaryList'
import { formatTime } from '@/lib/utils/date'
import { createClient } from '@/lib/supabase/client'

interface DiaryAccordionItemProps {
  entry: EntryWithMedia
  isOpen: boolean
  onToggle: () => void
  onFavoriteToggle: () => void
  onDelete: () => void
}

// 일기 목록 아코디언 아이템 — 프로토타입 기준 UI
export function DiaryAccordionItem({
  entry,
  isOpen,
  onToggle,
  onFavoriteToggle,
  onDelete,
}: DiaryAccordionItemProps) {
  const router = useRouter()
  const date = new Date(entry.created_at)
  const day = date.getDate()
  const dow = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]

  // 사진 URL 목록
  const photoUrls = entry.media
    .filter((m) => m.media_type === 'photo')
    .map((m) => {
      const supabase = createClient()
      return supabase.storage.from('media').getPublicUrl(m.storage_path).data.publicUrl
    })

  return (
    <div
      className={`bg-white border-b border-[#f5f5f5] transition-all ${
        isOpen ? 'border-l-4 border-l-[#4A90D9]' : ''
      }`}
      id={`entry-${entry.id}`}
    >
      {/* 아코디언 헤더 — 터치 시 펼침 */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-[#fafafa]"
        onClick={onToggle}
      >
        {/* 날짜 */}
        <div className="flex-shrink-0 w-10 text-center">
          <div className="text-lg font-bold text-[#1A1A1A] leading-none">{day}</div>
          <div className="text-xs text-[#888] mt-0.5">{dow}</div>
        </div>

        {/* 제목 + 미리보기 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">
            {entry.title || '제목 없음'}
          </h3>
          <p className="text-xs text-[#888] mt-0.5 truncate">
            {entry.content_text || '내용 없음'}
          </p>
        </div>

        {/* 쉐브론 */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#B0B0B0] flex-shrink-0"
        >
          ∨
        </motion.span>
      </div>

      {/* 아코디언 콘텐츠 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-[3.25rem]">
              {/* 메타데이터 */}
              <div className="flex flex-wrap gap-2 text-xs text-[#888] mb-3">
                {entry.location_name && <span>📍 {entry.location_name}</span>}
                {entry.weather && <span>{entry.weather}</span>}
                {entry.temperature && <span>{entry.temperature}°C</span>}
                <span>🕐 {formatTime(date)}</span>
              </div>

              {/* 본문 전체 */}
              <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap mb-3">
                {entry.content_text}
              </p>

              {/* 사진 가로 스크롤 */}
              {photoUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                  {photoUrls.map((url, i) => (
                    <div key={i} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={`사진 ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/diary/${entry.id}/edit`)}
                  className="text-xs border border-[#e0e0e0] rounded-full px-3 py-1 text-[#555] hover:bg-[#f5f5f5]"
                >
                  ✎ 편집
                </button>
                <button
                  onClick={onFavoriteToggle}
                  className={`text-xs border rounded-full px-3 py-1 transition-colors ${
                    entry.is_favorite
                      ? 'border-[#FFD93D] text-[#FFD93D]'
                      : 'border-[#e0e0e0] text-[#555] hover:bg-[#f5f5f5]'
                  }`}
                >
                  {entry.is_favorite ? '★ 즐겨찾기' : '☆ 즐겨찾기'}
                </button>
                <button
                  onClick={() => router.push(`/publish?entry=${entry.id}`)}
                  className="text-xs border border-[#e0e0e0] rounded-full px-3 py-1 text-[#555] hover:bg-[#f5f5f5]"
                >
                  📖 출판
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
