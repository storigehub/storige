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

// Dear My Son 편지 아코디언 아이템 — 왼쪽 보더 mint
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
  const dow = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  const badgeColor = recipient ? getBadgeColor(recipient.role) : '#00C9B7'

  return (
    <div
      className={`bg-white border-b border-[#f5f5f5] transition-all ${
        isOpen ? 'border-l-4 border-l-[#00C9B7]' : ''
      }`}
      id={`dear-${entry.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-[#fafafa]"
        onClick={onToggle}
      >
        {/* 날짜 */}
        <div className="flex-shrink-0 w-10 text-center">
          <div className="text-lg font-bold text-[#1A1A1A] leading-none">{day}</div>
          <div className="text-xs text-[#888] mt-0.5">{dow}</div>
        </div>

        {/* 수신자 뱃지 + 제목 */}
        <div className="flex-1 min-w-0">
          {recipient && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: badgeColor }}
              >
                {recipient.name}
              </span>
              <span className="text-[10px] text-[#B0B0B0]">{getRoleLabel(recipient.role)}</span>
            </div>
          )}
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
              {/* 작성 시각 */}
              <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                <span>🕐 {formatTime(date)}</span>
                {recipient && (
                  <span style={{ color: badgeColor }}>
                    To. {recipient.name}
                  </span>
                )}
              </div>

              {/* 본문 */}
              <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap mb-4">
                {entry.content_text}
              </p>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dear/${entry.id}/edit`)}
                  className="text-xs border border-[#e0e0e0] rounded-full px-3 py-1 text-[#555] hover:bg-[#f5f5f5]"
                >
                  ✎ 편집
                </button>
                <button
                  onClick={() => router.push(`/publish?entry=${entry.id}`)}
                  className="text-xs border border-[#00C9B7] rounded-full px-3 py-1 text-[#00C9B7] hover:bg-[#f0fffd]"
                >
                  📖 출판
                </button>
                <button
                  onClick={onDelete}
                  className="text-xs border border-[#FF4757] rounded-full px-3 py-1 text-[#FF4757] hover:bg-[#ffeef0] ml-auto"
                >
                  ✕ 삭제
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
