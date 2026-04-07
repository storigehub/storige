'use client'

import { usePathname, useRouter } from 'next/navigation'

// 하단 4탭 — Midnight Archive 디자인
const TABS = [
  { href: '/diary', label: '일기', icon: 'book_2' },
  { href: '/dear', label: '편지', icon: 'mail' },
  { href: '/secret', label: '시크릿', icon: 'lock' },
  { href: '/settings', label: '설정', icon: 'manage_accounts' },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#f9f9f9]/90 backdrop-blur-lg rounded-t-2xl border-t border-[#c4c7c7]/20 safe-area-bottom">
      <div className="flex items-center h-16 max-w-lg mx-auto px-2">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition-colors ${
                isActive ? 'text-[#0061A5]' : 'text-[#747878]'
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
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
