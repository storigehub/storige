'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PRIMARY_NAV_ITEMS } from '@/lib/navigation'

/**
 * 모바일 하단 5탭 네비게이션 — Midnight Archive / _5 템플릿 기준
 * breakpoint 정책: md 이상(768px+)에서 hidden (데스크탑은 Header 인라인 nav 사용)
 * 데스크탑/사이드 메뉴와 같은 5개 핵심 메뉴명을 사용
 */
export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-8 pt-3 bg-white/90 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-8px_32px_rgba(0,0,0,0.06)] md:hidden">
      {PRIMARY_NAV_ITEMS.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
          >
            <div className={`rounded-2xl px-4 py-1.5 transition-colors ${
              isActive ? 'bg-primary-container' : 'bg-transparent'
            }`}>
              <span
                className={`material-symbols-outlined text-[22px] transition-colors ${
                  isActive ? 'text-primary' : 'text-outline'
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
              isActive ? 'text-primary' : 'text-outline'
            }`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
