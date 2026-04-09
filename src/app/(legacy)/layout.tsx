import type { ReactNode } from 'react'

/**
 * Legacy Access 레이아웃 — 유고 후 열람 전용
 * 메인 앱 Nav/Header 없이 독립 표시.
 */
export default function LegacyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {children}
    </div>
  )
}
