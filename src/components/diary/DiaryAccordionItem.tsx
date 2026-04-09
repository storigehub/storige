'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { EntryWithMedia } from '@/hooks/useDiaryList'
import { formatTime } from '@/lib/utils/date'
import { createClient } from '@/lib/supabase/client'
import { DiaryLightbox } from './DiaryLightbox'
import { useDiarySummary } from '@/hooks/useAI'

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showAISummary, setShowAISummary] = useState(false)
  const { result: aiSummary, loading: aiLoading, error: aiError, summarize, clear: clearAI } = useDiarySummary()
  const date = new Date(entry.created_at)
  const day = date.getDate()
  // _5 기준: 한국어 "10월 / 목" 형식
  const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dowLabels = ['일', '월', '화', '수', '목', '금', '토']
  const monthLabel = monthLabels[date.getMonth()]
  const dowLabel = dowLabels[date.getDay()]

  const supabase = createClient()
  const photoUrls = entry.media
    .filter((m) => m.media_type === 'photo')
    .map((m) => supabase.storage.from('media').getPublicUrl(m.storage_path).data.publicUrl)

  return (
    <div
      className={`rounded-xl transition-all duration-300 ${
        isOpen
          ? 'bg-surface-container-lowest border border-outline-variant/30 shadow-sm'
          : 'group bg-surface-container-low hover:bg-surface-container-highest border border-transparent hover:border-outline-variant/30 cursor-pointer'
      }`}
      id={`entry-${entry.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className={`flex items-center gap-5 md:gap-8 ${isOpen ? 'p-6 md:p-8' : 'p-6'} transition-all cursor-pointer`}
        onClick={onToggle}
      >
        {/* 날짜 블록 — 숫자 크게, month/dow 위아래 */}
        <div className="flex flex-col items-center shrink-0 w-10 md:w-12">
          <span className={`font-headline font-extrabold text-primary leading-none ${isOpen ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
            {day}
          </span>
          {/* _5: "10월 / 목" 한 줄로 */}
          <span className="font-headline text-[9px] tracking-widest text-outline mt-1 leading-none whitespace-nowrap">
            {monthLabel} / {dowLabel}
          </span>
        </div>

        {/* 수직 구분선 */}
        <div className={`self-stretch w-px bg-surface-container-high shrink-0 ${isOpen ? 'hidden' : 'block'}`} />

        {/* 본문 영역 */}
        <div className="flex-1 min-w-0">
          {isOpen ? (
            /* 열린 상태: 제목 + 액션 버튼 */
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-headline font-extrabold text-xl md:text-2xl text-on-surface leading-snug mb-1">
                  {entry.title || '제목 없음'}
                </h3>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/diary/${entry.id}/edit`) }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-low rounded-full text-outline transition-colors"
                  aria-label="편집"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onFavoriteToggle() }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-low rounded-full transition-colors"
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
                  className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-low rounded-full text-outline transition-colors"
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
                <h3 className="font-headline font-bold text-sm md:text-base text-on-surface truncate group-hover:text-primary transition-colors">
                  {entry.title || '제목 없음'}
                </h3>
                <p className="text-xs text-outline mt-0.5 truncate">
                  {entry.content_text || '내용 없음'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-outline-variant">
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
                <span className="material-symbols-outlined text-[18px] text-outline-variant group-hover:text-primary transition-colors">
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
              <div className="border-t border-surface-container-high pt-5">
                {/* 메타데이터 행 */}
                <div className="flex flex-wrap gap-4 text-outline text-xs mb-5">
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
                <p className="text-on-surface-variant leading-[1.8] text-base whitespace-pre-wrap mb-5 max-w-3xl">
                  {entry.content_text}
                </p>

                {/* 사진 갤러리 — 가로 스크롤, 클릭 시 라이트박스 */}
                {photoUrls.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 mb-5" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {photoUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxIndex(i)}
                        className="flex-shrink-0 w-40 h-28 md:w-56 md:h-36 rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 group/img"
                        aria-label={`사진 ${i + 1} 크게 보기`}
                      >
                        <Image
                          src={url}
                          alt={`사진 ${i + 1}`}
                          width={224}
                          height={144}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* 라이트박스 */}
                {lightboxIndex !== null && (
                  <DiaryLightbox
                    urls={photoUrls}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() => setLightboxIndex((i) => ((i ?? 0) - 1 + photoUrls.length) % photoUrls.length)}
                    onNext={() => setLightboxIndex((i) => ((i ?? 0) + 1) % photoUrls.length)}
                  />
                )}

                {/* AI 요약 패널 */}
                {showAISummary && (
                  <div className="mb-5 p-4 bg-primary-container/40 rounded-xl border border-primary/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase font-headline flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        AI 요약
                      </span>
                      <button onClick={() => { setShowAISummary(false); clearAI() }} className="text-outline hover:text-on-surface">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    {aiLoading && (
                      <div className="flex items-center gap-2 text-sm text-outline">
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        분석 중…
                      </div>
                    )}
                    {aiError && <p className="text-xs text-error">{aiError}</p>}
                    {aiSummary && !aiLoading && (
                      <div className="space-y-2">
                        <p className="text-sm text-on-surface leading-relaxed">{aiSummary.summary}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {aiSummary.mood && (
                            <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-full">{aiSummary.mood}</span>
                          )}
                          {aiSummary.keywords.map(k => (
                            <span key={k} className="text-[10px] px-2.5 py-1 bg-surface-container text-outline rounded-full">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 하단 액션 바 */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!showAISummary) {
                        setShowAISummary(true)
                        if (!aiSummary) summarize(entry.content_text ?? '')
                      } else {
                        setShowAISummary(false)
                        clearAI()
                      }
                    }}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 text-xs text-primary hover:bg-primary-container/40 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    {showAISummary && aiSummary ? 'AI 요약 닫기' : 'AI 요약'}
                  </button>
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 text-xs text-error hover:bg-error-container/40 px-3 py-2 rounded-lg transition-colors"
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
