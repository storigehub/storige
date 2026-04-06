'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants, type Transition } from 'framer-motion'
import type { EntryWithMedia } from '@/hooks/useDiaryList'
import { formatDate } from '@/lib/utils/date'

interface BookPreviewProps {
  entries: EntryWithMedia[]
  title: string
}

// 출판 미리보기 — 책 형태 페이지 뷰어
export function BookPreview({ entries, title }: BookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  // 엔트리 → 책 페이지 변환 (표지 + 내용 페이지)
  const pages: BookPage[] = [
    { type: 'cover', title },
    ...entries.map((entry, i) => ({
      type: 'entry' as const,
      entry,
      pageNum: i + 1,
    })),
    { type: 'back_cover', title },
  ]

  const totalPages = pages.length
  const page = pages[currentPage]

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection('next')
      setCurrentPage((p) => p + 1)
    }
  }

  const goPrev = () => {
    if (currentPage > 0) {
      setDirection('prev')
      setCurrentPage((p) => p - 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 책 프레임 */}
      <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white border border-[#e0e0e0]">
        {/* 책 등(spine) 효과 */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#e0d0b0] to-[#f5f0e8] z-10" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 pl-5"
          >
            <PageContent page={page} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 페이지 번호 */}
      <p className="text-xs text-[#888]">
        {currentPage + 1} / {totalPages}
      </p>

      {/* 네비게이션 */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="w-10 h-10 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#555] disabled:opacity-30"
        >
          ‹
        </button>

        {/* 페이지 점 인디케이터 */}
        <div className="flex gap-1">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentPage ? 'next' : 'prev')
                setCurrentPage(i)
              }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentPage ? 'bg-[#4A90D9]' : 'bg-[#e0e0e0]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
          className="w-10 h-10 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#555] disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  )
}

// 페이지 타입 정의
type BookPage =
  | { type: 'cover'; title: string }
  | { type: 'entry'; entry: EntryWithMedia; pageNum: number }
  | { type: 'back_cover'; title: string }

// 페이지 콘텐츠 렌더링
function PageContent({ page }: { page: BookPage }) {
  if (page.type === 'cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white px-6 text-center">
        <div className="text-4xl mb-4">📖</div>
        <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">{page.title}</h1>
        <p className="text-xs text-[#888]">Storige에서 출판</p>
        <div className="mt-8 w-16 h-0.5 bg-[#4A90D9]" />
      </div>
    )
  }

  if (page.type === 'back_cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#4A90D9] px-6 text-center">
        <p className="text-white text-sm font-medium mb-2">이야기저장소</p>
        <p className="text-white/70 text-xs">storige.co.kr</p>
      </div>
    )
  }

  // 내용 페이지
  const { entry, pageNum } = page
  const date = new Date(entry.created_at)

  return (
    <div className="h-full flex flex-col px-4 py-5 overflow-hidden">
      {/* 페이지 헤더 */}
      <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-[#f0f0f0]">
        <h2 className="text-sm font-bold text-[#1A1A1A] truncate flex-1">
          {entry.title || '제목 없음'}
        </h2>
        <span className="text-[10px] text-[#888] flex-shrink-0 ml-2">{pageNum}</span>
      </div>

      {/* 날짜 */}
      <p className="text-[10px] text-[#B0B0B0] mb-2">{formatDate(date)}</p>

      {/* 본문 */}
      <p className="text-xs text-[#333] leading-relaxed line-clamp-[12] flex-1">
        {entry.content_text || '내용 없음'}
      </p>

      {/* 위치/날씨 */}
      {(entry.location_name || entry.weather) && (
        <p className="text-[9px] text-[#B0B0B0] mt-2">
          {entry.location_name && `📍 ${entry.location_name}`}
          {entry.weather && ` ${entry.weather}`}
        </p>
      )}
    </div>
  )
}

// 페이지 전환 애니메이션
const centerTransition: Transition = { duration: 0.3, ease: 'easeInOut' }
const exitTransition: Transition = { duration: 0.2 }

const pageVariants: Variants = {
  enter: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: centerTransition,
  },
  exit: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? -200 : 200,
    opacity: 0,
    transition: exitTransition,
  }),
}
