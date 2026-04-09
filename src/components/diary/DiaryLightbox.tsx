'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface DiaryLightboxProps {
  urls: string[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

/**
 * 일기 사진 갤러리 라이트박스 — 키보드/스와이프 지원
 */
export function DiaryLightbox({ urls, currentIndex, onClose, onPrev, onNext }: DiaryLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-white text-[22px]">close</span>
        </button>

        {/* 인덱스 표시 */}
        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/60 font-mono">
          {currentIndex + 1} / {urls.length}
        </span>

        {/* 이전 버튼 */}
        {urls.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="이전"
          >
            <span className="material-symbols-outlined text-white text-[22px]">chevron_left</span>
          </button>
        )}

        {/* 이미지 */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-[90vw] max-h-[85vh] rounded-xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={urls[currentIndex]}
            alt={`사진 ${currentIndex + 1}`}
            width={1200}
            height={900}
            className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
            priority
          />
        </motion.div>

        {/* 다음 버튼 */}
        {urls.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="다음"
          >
            <span className="material-symbols-outlined text-white text-[22px]">chevron_right</span>
          </button>
        )}

        {/* 썸네일 스트립 (3장 이상일 때) */}
        {urls.length > 2 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {urls.map((url, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); /* index jump */ if (i < currentIndex) onPrev(); else if (i > currentIndex) onNext() }}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                aria-label={`사진 ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
