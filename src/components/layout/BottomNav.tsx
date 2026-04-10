'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

/**
 * 모바일 하단 5탭 네비게이션 — Midnight Archive / _5 템플릿 기준
 * breakpoint 정책: md 이상(768px+)에서 hidden (데스크탑은 Header 인라인 nav 사용)
 * 5번째 탭(나의이야기): 사용자 프로필 사진 사용 — Instagram/TikTok 패턴
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
  const { profile } = useAuth()

  const initials = profile?.full_name?.[0]?.toUpperCase() ?? '나'
  const mystoryActive = pathname.startsWith('/mystory')

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-8 pt-3 bg-white/90 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-8px_32px_rgba(0,0,0,0.06)] md:hidden">
      {TABS.map((tab) => {
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
                  isActive ? 'text-primary' : 'text-[#a0a3a3]'
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
              isActive ? 'text-primary' : 'text-[#a0a3a3]'
            }`}>
              {tab.label}
            </span>
          </button>
        )
      })}

      {/* 5번째 탭 — 나의이야기 (프로필 사진) */}
      <button
        onClick={() => router.push('/mystory')}
        className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
      >
        <div className={`rounded-2xl px-3 py-1 transition-colors ${
          mystoryActive ? 'bg-primary-container' : 'bg-transparent'
        }`}>
          <div className={`w-[26px] h-[26px] rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold transition-all ${
            mystoryActive
              ? 'ring-2 ring-primary ring-offset-1 text-white bg-primary'
              : 'ring-2 ring-[#d0d0d0] text-[#a0a3a3] bg-[#f0f0f0]'
          }`}>
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="내 프로필"
                width={26}
                height={26}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`font-headline font-bold ${mystoryActive ? 'text-white' : 'text-[#a0a3a3]'}`}>
                {initials}
              </span>
            )}
          </div>
        </div>
        <span className={`font-headline text-[9px] uppercase tracking-wider font-bold transition-colors ${
          mystoryActive ? 'text-primary' : 'text-[#a0a3a3]'
        }`}>
          이야기
        </span>
      </button>
    </nav>
  )
}
