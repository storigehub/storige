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
 * 일기 아코디언 아이템 — Midnight Archive / _5 editorial style
 * 닫힌 상태: 날짜 좌측 + 제목/프리뷰 중앙 + 메타아이콘 우측 (horizontal layout)
 * 열린 상태: white card, 대형 날짜 헤더, 메타데이터 행, 본문, 이미지 갤러리
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
  const dowNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const monthLabel = monthNames[date.getMonth()]
  const dowLabel = dowNames[date.getDay()]

  const supabase = createClient()
  const photoUrls = entry.media
    .filter((m) => m.media_type === 'photo')
    .map((m) => supabase.storage.from('media').getPublicUrl(m.storage_path).data.publicUrl)

  return (
    <div
      className={`rounded-xl transition-all duration-300 ${
        isOpen
          ? 'bg-white border border-[#c4c7c7]/30 shadow-md'
          : 'group bg-[#f3f3f3] hover:bg-white hover:border hover:border-[#c4c7c7]/30 hover:shadow-sm cursor-pointer'
      }`}
      id={`entry-${entry.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className={`flex items-center gap-5 md:gap-8 ${isOpen ? 'p-6 md:p-8' : 'px-5 py-4'} transition-all cursor-pointer`}
        onClick={onToggle}
      >
        {/* 날짜 블록 — 숫자 크게, month/dow 위아래 */}
        <div className="flex flex-col items-center shrink-0 w-10 md:w-12">
          <span className={`font-headline font-extrabold text-[#0061A5] leading-none ${isOpen ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
            {day}
          </span>
          <span className="font-headline text-[9px] uppercase tracking-widest text-[#747878] mt-1 leading-none">
            {monthLabel}
          </span>
          <span className="font-headline text-[8px] uppercase tracking-widest text-[#c4c7c7] leading-none">
            {dowLabel}
          </span>
        </div>

        {/* 수직 구분선 */}
        <div className={`self-stretch w-px bg-[#e8e8e8] shrink-0 ${isOpen ? 'hidden' : 'block'}`} />

        {/* 본문 영역 */}
        <div className="flex-1 min-w-0">
          {isOpen ? (
            /* 열린 상태: 제목 + 액션 버튼 */
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-headline font-extrabold text-xl md:text-2xl text-[#1a1c1c] leading-snug mb-1">
                  {entry.title || '제목 없음'}
                </h3>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/diary/${entry.id}/edit`) }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-[#f3f3f3] rounded-full text-[#747878] transition-colors"
                  aria-label="편집"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onFavoriteToggle() }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-[#f3f3f3] rounded-full transition-colors"
                  aria-label="즐겨찾기"
                  style={{ color: entry.is_favorite ? '#f59e0b' : '#747878' }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: entry.is_favorite ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/publish?entry=${entry.id}`) }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-[#f3f3f3] rounded-full text-[#747878] transition-colors"
                  aria-label="공유"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
              </div>
            </div>
          ) : (
            /* 닫힌 상태: 제목 + 미리보기 텍스트 */
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-headline font-bold text-sm md:text-base text-[#1a1c1c] truncate group-hover:text-[#0061A5] transition-colors">
                  {entry.title || '제목 없음'}
                </h3>
                <p className="text-xs text-[#747878] mt-0.5 truncate">
                  {entry.content_text || '내용 없음'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-[#c4c7c7]">
                {entry.location_name && (
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                )}
                {entry.weather && (
                  <span className="material-symbols-outlined text-[16px]">cloud</span>
                )}
                {entry.is_favorite && (
                  <span className="material-symbols-outlined text-[16px] text-[#f59e0b]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                )}
                <span className="material-symbols-outlined text-[18px] text-[#c4c7c7] group-hover:text-[#0061A5] transition-colors">
                  keyboard_arrow_right
                </span>
              </div>
            </div>
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
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <div className="border-t border-[#e8e8e8] pt-5">
                {/* 메타데이터 행 */}
                <div className="flex flex-wrap gap-4 text-[#747878] text-xs mb-5">
                  {entry.location_name && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {entry.location_name}
                    </span>
                  )}
                  {entry.weather && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">cloud</span>
                      {entry.weather}{entry.temperature && ` ${entry.temperature}°`}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {formatTime(date)}
                  </span>
                </div>

                {/* 본문 */}
                <p className="text-[#444748] leading-[1.8] text-base whitespace-pre-wrap mb-5 max-w-3xl">
                  {entry.content_text}
                </p>

                {/* 사진 갤러리 — 가로 스크롤 */}
                {photoUrls.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 mb-5" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {photoUrls.map((url, i) => (
                      <div key={i} className="flex-shrink-0 w-40 h-28 md:w-56 md:h-36 rounded-xl overflow-hidden shadow-sm border border-[#c4c7c7]/20">
                        <Image src={url} alt={`사진 ${i + 1}`} width={224} height={144} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 삭제 버튼 */}
                <div className="flex justify-end">
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 px-3 py-2 rounded-lg transition-colors"
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
