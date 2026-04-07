'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { EntryWithMedia } from '@/hooks/useDiaryList'
import { formatTime } from '@/lib/utils/date'
import { getBadgeColor, getRoleLabel } from '@/hooks/useFamilyMembers'
import type { FamilyMember } from '@/types/database'

interface DearAccordionItemProps {
  entry: EntryWithMedia
  isOpen: boolean
  onToggle: () => void
  onDelete: () => void
  recipient?: FamilyMember
}

/**
 * Dear My Son 편지 아코디언 — Midnight Archive / dear_my_son_1 compact card 기준
 * 닫힘: surface-container-low rounded-2xl, hover:bg-white, border border-transparent hover:border-primary/30
 * 열림: bg-white shadow-xl border border-outline-variant/20
 */
export function DearAccordionItem({
  entry,
  isOpen,
  onToggle,
  onDelete,
  recipient,
}: DearAccordionItemProps) {
  const router = useRouter()
  const date = new Date(entry.created_at)
  const day = date.getDate()
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const month = monthNames[date.getMonth()]
  const badgeColor = recipient ? getBadgeColor(recipient.role) : '#006B5F'

  return (
    <div
      className={`rounded-2xl transition-all duration-300 cursor-pointer ${
        isOpen
          ? 'bg-white shadow-xl border border-[#c4c7c7]/20'
          : 'bg-[#f3f3f3] border border-transparent hover:border-[#006B5F]/30 hover:bg-white hover:shadow-xl'
      }`}
      id={`dear-${entry.id}`}
    >
      {/* 카드 헤더 */}
      <div className="p-6 md:p-8" onClick={onToggle}>
        <div className="flex justify-between items-start">
          {/* 수신자 뱃지 */}
          {recipient && (
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg inline-block mb-4"
              style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
            >
              {getRoleLabel(recipient.role)}
            </span>
          )}
          {/* 날짜 */}
          <div className="text-right shrink-0 ml-auto">
            <span className="font-headline text-3xl font-extrabold text-[#0061A5] leading-none block">{day}</span>
            <span className="font-headline text-[9px] uppercase tracking-widest text-[#747878] mt-0.5 block">{month}</span>
          </div>
        </div>

        <h3 className={`font-headline font-bold text-[#1a1c1c] leading-snug transition-colors ${
          isOpen ? 'text-xl md:text-2xl' : 'text-lg group-hover:text-[#006B5F]'
        }`}>
          {entry.title || '제목 없음'}
        </h3>

        {!isOpen && (
          <p className="mt-2 text-[#747878] text-sm truncate">{entry.content_text || '내용 없음'}</p>
        )}

        {/* 열림 표시 */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-[#747878]">{formatTime(date)}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[20px] text-[#747878]"
          >
            expand_more
          </motion.span>
        </div>
      </div>

      {/* 아코디언 콘텐츠 — 편지지 스타일 */}
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
              {/* 편지지 영역 — dear_my_son_1 paper-texture 스타일 */}
              <div className="relative p-6 md:p-8 bg-[#fefefe] rounded-2xl border border-[#c4c7c7]/30 shadow-inner mb-4">
                <span
                  className="material-symbols-outlined absolute top-6 right-6 text-[#006B5F]/10 text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  format_quote
                </span>
                <p className="text-[#444748] leading-relaxed italic text-base whitespace-pre-wrap">
                  {entry.content_text}
                </p>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => router.push(`/dear/${entry.id}/edit`)}
                  className="text-sm font-bold text-[#747878] hover:text-[#1a1c1c] px-5 py-2.5 transition-colors"
                >
                  수정하기
                </button>
                <button
                  onClick={() => router.push(`/publish?entry=${entry.id}`)}
                  className="bg-[#006B5F] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#006B5F]/20 hover:-translate-y-0.5 hover:shadow-xl transition-all"
                >
                  미리보기
                </button>
                <button
                  onClick={onDelete}
                  className="text-sm font-bold text-[#ba1a1a] hover:bg-[#fff0f0] px-4 py-2.5 rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] align-middle">delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
