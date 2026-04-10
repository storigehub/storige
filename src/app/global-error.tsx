'use client'

import { useEffect } from 'react'

// 최상위 글로벌 에러 바운더리 — root layout 오류 포함
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
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
    <html lang="ko">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <p style={{ fontSize: '14px', color: '#747878', marginBottom: '16px' }}>페이지를 불러오지 못했습니다</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 24px', background: '#1A1C1C', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            새로고침
          </button>
        </div>
      </body>
    </html>
  )
}
