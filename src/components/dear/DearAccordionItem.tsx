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
 * Dear My Son 편지 아코디언 — dear_my_son_2 editorial style
 * 닫힘: border-l-4 border-transparent, hover:border-dear/40
 * 열림: border-l-4 border-dear, letter-texture 배경, shadow-md
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
      className={`rounded-none md:rounded-xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-dear-open-bg shadow-md border-l-4'
          : 'group bg-surface-container-low hover:bg-white border-l-4 border-transparent hover:border-dear/30 hover:shadow-sm cursor-pointer'
      }`}
      style={isOpen ? { borderLeftColor: '#006B5F' } : undefined}
      id={`dear-${entry.id}`}
    >
      {/* 카드 헤더 */}
      <div
        className={`flex items-center gap-5 ${isOpen ? 'px-6 md:px-8 pt-6 pb-4' : 'px-5 py-4'} cursor-pointer`}
        onClick={onToggle}
      >
        {/* 날짜 블록 */}
        <div className="flex flex-col items-center shrink-0">
          <span className={`font-headline font-extrabold text-dear leading-none ${isOpen ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
            {day}
          </span>
          <span className="font-headline text-[9px] uppercase tracking-widest text-outline mt-1 leading-none">
            {month}
          </span>
        </div>

        {/* 수직 구분선 */}
        <div className="self-stretch w-px bg-surface-container-high shrink-0" />

        {/* 제목 영역 */}
        <div className="flex-1 min-w-0">
          {recipient && (
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block mb-1.5"
              style={{ backgroundColor: `${badgeColor}18`, color: badgeColor }}
            >
              {getRoleLabel(recipient.role)}
            </span>
          )}
          <h3 className={`font-headline font-bold text-on-surface leading-snug transition-colors ${
            isOpen ? 'text-xl md:text-2xl' : 'text-sm truncate group-hover:text-dear'
          }`}>
            {entry.title || '제목 없음'}
          </h3>
          {!isOpen && (
            <p className="text-xs text-outline mt-0.5 truncate">{entry.content_text || '내용 없음'}</p>
          )}
        </div>

        {/* 열림 표시 */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-[20px] text-outline shrink-0"
        >
          expand_more
        </motion.span>
      </div>

      {/* 아코디언 콘텐츠 — 편지지 스타일 */}
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
              {/* 편지지 영역 — letter-texture 라인 배경 */}
              <div
                className="relative p-6 md:p-8 rounded-xl border border-surface-container-high shadow-inner mb-5"
                style={{
                  backgroundImage: 'linear-gradient(#e8e8e8 1px, transparent 1px)',
                  backgroundSize: '100% 2.5rem',
                  backgroundColor: '#fefefe',
                }}
              >
                {/* 인용 워터마크 */}
                <span
                  className="material-symbols-outlined absolute top-4 right-4 text-dear/10 text-5xl pointer-events-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  format_quote
                </span>
                <p className="text-on-surface-variant leading-[2.5rem] text-base whitespace-pre-wrap relative z-10">
                  {entry.content_text}
                </p>
              </div>

              {/* 시간 + 액션 버튼 */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {formatTime(date)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dear/${entry.id}/edit`)}
                    className="text-sm font-bold text-outline hover:text-on-surface px-4 py-2 transition-colors"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => router.push(`/publish?entry=${entry.id}`)}
                    className="bg-dear text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    미리보기
                  </button>
                  <button
                    onClick={onDelete}
                    className="text-sm font-bold text-error hover:bg-error-container/40 px-3 py-2 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] align-middle">delete</span>
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
