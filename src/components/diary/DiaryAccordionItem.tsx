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

// 일기 목록 아코디언 아이템 — Midnight Archive 디자인
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
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const month = monthNames[date.getMonth()]

  // 사진 URL 목록
  const supabase = createClient()
  const photoUrls = entry.media
    .filter((m) => m.media_type === 'photo')
    .map((m) => supabase.storage.from('media').getPublicUrl(m.storage_path).data.publicUrl)

  const hasPhoto = photoUrls.length > 0

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'bg-white shadow-md border-l-4 border-l-[#0061A5]'
          : 'bg-[#f3f3f3]'
      }`}
      id={`entry-${entry.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer active:opacity-80"
        onClick={onToggle}
      >
        {/* 날짜 블록 */}
        <div className="flex-shrink-0 w-10 text-center">
          <div className="text-2xl font-bold leading-none text-[#1a1c1c] font-headline">{day}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#747878] mt-0.5">{month}</div>
        </div>

        {/* 썸네일 (사진 있을 때) */}
        {hasPhoto && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
            <Image
              src={photoUrls[0]}
              alt="썸네일"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 제목 + 미리보기 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1a1c1c] truncate">
            {entry.title || '제목 없음'}
          </h3>
          <p className="text-xs text-[#747878] mt-0.5 truncate">
            {entry.content_text || '내용 없음'}
          </p>
        </div>

        {/* 즐겨찾기 + 쉐브론 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {entry.is_favorite && (
            <span className="material-symbols-outlined text-[18px] text-[#FFD93D]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          )}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[20px] text-[#747878]"
          >
            keyboard_arrow_down
          </motion.span>
        </div>
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
            <div className="px-4 pb-4">
              {/* 메타데이터 칩 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {entry.location_name && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#747878] bg-[#f3f3f3] rounded-full px-2.5 py-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {entry.location_name}
                  </span>
                )}
                {entry.weather && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#747878] bg-[#f3f3f3] rounded-full px-2.5 py-1">
                    {entry.weather}
                    {entry.temperature && ` ${entry.temperature}°`}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-[#747878] bg-[#f3f3f3] rounded-full px-2.5 py-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {formatTime(date)}
                </span>
              </div>

              {/* 본문 */}
              <p className="text-sm text-[#1a1c1c] leading-relaxed whitespace-pre-wrap mb-3">
                {entry.content_text}
              </p>

              {/* 사진 가로 스크롤 */}
              {photoUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                  {photoUrls.map((url, i) => (
                    <div key={i} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
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
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => router.push(`/diary/${entry.id}/edit`)}
                  className="flex items-center gap-1 text-xs bg-[#f3f3f3] rounded-full px-3 py-1.5 text-[#444748] hover:bg-[#eeeeee] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  편집
                </button>
                <button
                  onClick={onFavoriteToggle}
                  className={`flex items-center gap-1 text-xs rounded-full px-3 py-1.5 transition-colors ${
                    entry.is_favorite
                      ? 'bg-[#fff8e1] text-[#f59e0b]'
                      : 'bg-[#f3f3f3] text-[#444748] hover:bg-[#eeeeee]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: entry.is_favorite ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                  즐겨찾기
                </button>
                <button
                  onClick={() => router.push(`/publish?entry=${entry.id}`)}
                  className="flex items-center gap-1 text-xs bg-[#f3f3f3] rounded-full px-3 py-1.5 text-[#444748] hover:bg-[#eeeeee] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">menu_book</span>
                  출판
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 text-xs bg-[#fff0f0] rounded-full px-3 py-1.5 text-[#ba1a1a] hover:bg-[#ffe0e0] transition-colors ml-auto"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  삭제
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
