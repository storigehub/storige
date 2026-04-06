'use client'

import { usePathname, useRouter } from 'next/navigation'

// 하단 탭 네비게이션 항목
const TABS = [
  { href: '/diary', label: '일기', icon: '📓' },
  { href: '/dear', label: '편지', icon: '✉️' },
  { href: '/album', label: '앨범', icon: '📸' },
  { href: '/publish', label: '출판', icon: '📖' },
  { href: '/settings', label: '설정', icon: '⚙️' },
]

// 하단 탭 네비게이션 바
export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#f0f0f0] h-16 flex items-center safe-area-bottom">
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 transition-colors ${
              isActive ? 'text-[#4A90D9]' : 'text-[#B0B0B0]'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
