'use client'

import { usePathname, useRouter } from 'next/navigation'

/**
 * 모바일 하단 4탭 네비게이션 — Midnight Archive / _5 템플릿 기준
 * breakpoint 정책: md 이상(768px+)에서 hidden (데스크탑은 Header 인라인 nav 사용)
 * 라벨: CLAUDE.md 네비 레이블 기준 — 일기/편지/비밀/관리
 */
const TABS = [
  { href: '/diary',    label: '일기',  icon: 'auto_stories' },
  { href: '/dear',     label: '편지',  icon: 'mail' },
  { href: '/secret',   label: '비밀',  icon: 'lock' },
  { href: '/settings', label: '관리',  icon: 'settings' },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-[#f9f9f9]/95 backdrop-blur-xl border-t border-[#c4c7c7]/10 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] md:hidden">
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`flex flex-col items-center justify-center transition-colors ${
              isActive ? 'text-[#0061A5]' : 'text-[#747878] hover:text-[#1a1c1c]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[26px]"
              style={{
                fontVariationSettings: isActive
                  ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              }}
            >
              {tab.icon}
            </span>
            <span className="font-headline text-[10px] uppercase tracking-wider mt-1 font-bold">
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
