'use client'

import { useEffect } from 'react'

// (main) 레이아웃 에러 바운더리
// ChunkLoadError (배포 후 구 번들 참조) 감지 시 자동 새로고침
export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // ChunkLoadError: 배포 후 브라우저가 캐시한 구 청크 해시 참조 실패
    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed')

    if (isChunkError) {
      window.location.reload()
    }
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-12 h-12 bg-[#EEEEEE] rounded-full flex items-center justify-center mb-4">
        <span
          className="material-symbols-outlined text-[#747878] text-xl"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
        >
          refresh
        </span>
      </div>
      <h2 className="font-headline text-lg font-bold text-[#1A1C1C] mb-1">페이지를 불러오지 못했습니다</h2>
      <p className="text-sm text-[#747878] mb-6">새로고침하면 대부분 해결됩니다</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-[#1A1C1C] text-white text-sm font-semibold rounded-[10px] hover:bg-[#1A1C1C]/80 transition-colors"
      >
        새로고침
      </button>
    </div>
  )
}
