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

// Dear My Son 편지 아코디언 아이템 — Midnight Archive / dear_my_son_3 디자인
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
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'bg-white shadow-lg border-l-4 border-l-[#006B5F]'
          : 'bg-[#f3f3f3] border border-[#eeeeee]'
      }`}
      id={`dear-${entry.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:opacity-80"
        onClick={onToggle}
      >
        {/* 날짜 블록 */}
        <div className="flex-shrink-0 w-10 text-center">
          <div className="text-2xl font-bold leading-none text-[#1a1c1c] font-headline">{day}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#747878] mt-0.5">{month}</div>
        </div>

        {/* 수신자 뱃지 + 제목 */}
        <div className="flex-1 min-w-0">
          {recipient && (
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: badgeColor }}
              >
                To. {recipient.name}
              </span>
              <span className="text-[10px] text-[#747878]">{getRoleLabel(recipient.role)}</span>
            </div>
          )}
          <h3 className="text-sm font-semibold text-[#1a1c1c] truncate">
            {entry.title || '제목 없음'}
          </h3>
          <p className="text-xs text-[#747878] mt-0.5 truncate">
            {entry.content_text || '내용 없음'}
          </p>
        </div>

        {/* 미전달 뱃지 + 쉐브론 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
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
            <div className="px-4 pb-4 pt-1">
              {/* 메타데이터 */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs text-[#747878] bg-[#f3f3f3] rounded-full px-2.5 py-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {formatTime(date)}
                </span>
                {recipient && (
                  <span
                    className="inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1"
                    style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
                  >
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    {recipient.name}에게
                  </span>
                )}
              </div>

              {/* 본문 */}
              <p className="text-sm text-[#1a1c1c] leading-relaxed whitespace-pre-wrap mb-4">
                {entry.content_text}
              </p>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dear/${entry.id}/edit`)}
                  className="flex items-center gap-1 text-xs bg-[#f3f3f3] rounded-full px-3 py-1.5 text-[#444748] hover:bg-[#eeeeee] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  편집
                </button>
                <button
                  onClick={() => router.push(`/publish?entry=${entry.id}`)}
                  className="flex items-center gap-1 text-xs rounded-full px-3 py-1.5 transition-colors"
                  style={{ backgroundColor: `${badgeColor}15`, color: badgeColor }}
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
