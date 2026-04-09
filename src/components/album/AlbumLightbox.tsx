'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AlbumLightboxProps {
  urls: string[]
  currentIndex: number
  caption?: string | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function AlbumLightbox({ urls, currentIndex, caption, onClose, onPrev, onNext }: AlbumLightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={onClose}
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      {/* 인덱스 표시 */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
        {currentIndex + 1} / {urls.length}
      </p>

      {/* 이전 버튼 */}
      {urls.length > 1 && (
        <button
          className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      )}

      {/* 이미지 */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={urls[currentIndex]}
          alt={`사진 ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl select-none"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {/* 다음 버튼 */}
      {urls.length > 1 && (
        <button
          className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onNext() }}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      )}

      {/* 캡션 */}
      {caption && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-4 py-2 rounded-full max-w-xs text-center">
          {caption}
        </p>
      )}

      {/* 도트 네비게이션 (3개 이상) */}
      {urls.length >= 3 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {urls.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
