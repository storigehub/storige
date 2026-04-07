'use client'

import { useRouter, usePathname } from 'next/navigation'

// 경로별 FAB 액션
const FAB_ACTIONS: Record<string, { href: string; label: string }> = {
  '/diary': { href: '/diary/new', label: '새 일기 작성' },
  '/dear': { href: '/dear/new', label: '새 편지 작성' },
  '/secret': { href: '/secret/new', label: '새 시크릿 코드' },
  '/album': { href: '/album/new', label: '사진 추가' },
}

// 플로팅 액션 버튼 — Midnight Archive 디자인 (Cobalt Blue)
export function FAB() {
  const router = useRouter()
  const pathname = usePathname()

  const action = Object.entries(FAB_ACTIONS).find(([key]) =>
    pathname.startsWith(key)
  )?.[1]

  if (!action) return null

  return (
    <button
      onClick={() => router.push(action.href)}
      aria-label={action.label}
      className="fixed bottom-24 right-5 z-50 w-14 h-14 bg-[#0061A5] hover:bg-[#004c82] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95"
    >
      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}>add</span>
    </button>
  )
}
