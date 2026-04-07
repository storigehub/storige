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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-white/90 backdrop-blur-xl border-t border-[#e8e8e8] shadow-[0_-8px_32px_rgba(0,0,0,0.06)] md:hidden">
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
          >
            <div className={`rounded-2xl px-4 py-1.5 transition-colors ${
              isActive ? 'bg-[#d2e4ff]' : 'bg-transparent'
            }`}>
              <span
                className={`material-symbols-outlined text-[22px] transition-colors ${
                  isActive ? 'text-[#0061A5]' : 'text-[#a0a3a3]'
                }`}
                style={{
                  fontVariationSettings: isActive
                    ? "'FILL' 1, 'wght' 600"
                    : "'FILL' 0, 'wght' 400",
                }}
              >
                {tab.icon}
              </span>
            </div>
            <span className={`font-headline text-[9px] uppercase tracking-wider font-bold transition-colors ${
              isActive ? 'text-[#0061A5]' : 'text-[#a0a3a3]'
            }`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
