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

/**
 * 일기 아코디언 아이템 — Midnight Archive / _5 템플릿 기준
 * 닫힌 상태: surface-container-low, 열린 상태: white rounded-xl p-6 shadow-sm border border-outline-variant/30
 * 날짜: text-4xl font-extrabold text-primary (day) + text-[10px] uppercase tracking-widest (month/dow)
 */
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
  const dowNames = ['일', '월', '화', '수', '목', '금', '토']
  const monthLabel = `${monthNames[date.getMonth()]} / ${dowNames[date.getDay()]}`

  const supabase = createClient()
  const photoUrls = entry.media
    .filter((m) => m.media_type === 'photo')
    .map((m) => supabase.storage.from('media').getPublicUrl(m.storage_path).data.publicUrl)

  return (
    <div
      className={`rounded-xl transition-all duration-300 ${
        isOpen
          ? 'bg-white border border-[#c4c7c7]/30 shadow-sm'
          : 'bg-[#f3f3f3] hover:bg-[#eeeeee] cursor-pointer'
      }`}
      id={`entry-${entry.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className={`flex items-start gap-6 md:gap-10 ${isOpen ? 'p-6 md:p-8' : 'p-4'} transition-all cursor-pointer`}
        onClick={onToggle}
      >
        {/* 날짜 블록 — _5 asymmetric layout */}
        <div className="flex flex-col items-center md:items-start shrink-0 w-10 md:w-14">
          <span className="font-headline text-3xl md:text-4xl font-extrabold text-[#0061A5] leading-none">
            {day}
          </span>
          <span className="font-headline text-[9px] md:text-[10px] uppercase tracking-widest text-[#747878] mt-1">
            {monthLabel}
          </span>
        </div>

        {/* 본문 영역 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <h3 className={`font-headline font-bold text-[#1a1c1c] leading-snug ${isOpen ? 'text-xl md:text-2xl mb-1' : 'text-sm truncate'}`}>
              {entry.title || '제목 없음'}
            </h3>
            {/* 아이콘 버튼 (열린 상태) */}
            {isOpen && (
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/diary/${entry.id}/edit`) }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f3f3f3] rounded-full text-[#747878] transition-colors"
                  aria-label="편집"
                >
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onFavoriteToggle() }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f3f3f3] rounded-full text-[#747878] transition-colors"
                  aria-label="즐겨찾기"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: entry.is_favorite ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/publish?entry=${entry.id}`) }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f3f3f3] rounded-full text-[#747878] transition-colors"
                  aria-label="공유"
                >
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
              </div>
            )}
            {/* 쉐브론 (닫힌 상태) */}
            {!isOpen && (
              <div className="flex items-center gap-1 shrink-0">
                {entry.is_favorite && (
                  <span className="material-symbols-outlined text-[18px] text-[#f59e0b]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                )}
                <span className="material-symbols-outlined text-[20px] text-[#747878]">keyboard_arrow_right</span>
              </div>
            )}
          </div>
          {/* 닫힌 상태 미리보기 */}
          {!isOpen && (
            <p className="text-sm text-[#747878] mt-0.5 truncate">{entry.content_text || '내용 없음'}</p>
          )}
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
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <div className="border-t border-[#c4c7c7]/20 pt-5">
                {/* 메타데이터 */}
                <div className="flex flex-wrap gap-3 text-[#747878] text-xs mb-4">
                  {entry.location_name && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {entry.location_name}
                    </span>
                  )}
                  {entry.weather && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">cloud</span>
                      {entry.weather}{entry.temperature && ` ${entry.temperature}°`}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {formatTime(date)}
                  </span>
                </div>

                {/* 본문 */}
                <p className="text-[#444748] leading-relaxed text-base whitespace-pre-wrap mb-4 max-w-3xl">
                  {entry.content_text}
                </p>

                {/* 사진 */}
                {photoUrls.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                    {photoUrls.map((url, i) => (
                      <div key={i} className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                        <Image src={url} alt={`사진 ${i + 1}`} width={96} height={96} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 삭제 버튼 */}
                <div className="flex justify-end">
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-1 text-xs bg-[#fff0f0] rounded-full px-3 py-1.5 text-[#ba1a1a] hover:bg-[#ffe0e0] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
