'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

/**
 * 앱 헤더 — Midnight Archive / _5 템플릿 기준
 * - 모바일: 햄버거 + Storige + 검색/아바타
 * - 데스크탑(md+): 인라인 4링크 nav (일기|편지|비밀|관리) + hidden 햄버거
 * - 검색 버튼: /diary?search=1 으로 포커스 이동 (접근성 — href 명시)
 */
const NAV_ITEMS = [
  { href: '/diary',    label: '일기' },
  { href: '/dear',     label: '편지' },
  { href: '/secret',   label: '비밀' },
  { href: '/settings', label: '관리' },
]

const SIDE_ITEMS = [
  { href: '/diary',    label: '일기',       icon: 'auto_stories' },
  { href: '/dear',     label: '편지',       icon: 'mail' },
  { href: '/secret',   label: '비밀 코드',  icon: 'lock' },
  { href: '/album',    label: '포토앨범',   icon: 'photo_library' },
  { href: '/publish',  label: '출판하기',   icon: 'menu_book' },
  { href: '/settings', label: '관리',       icon: 'manage_accounts' },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const handleNav = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    router.push('/login')
  }

  const initials = profile?.full_name?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-50 bg-[#f9f9f9]/80 backdrop-blur-xl border-b border-[#c4c7c7]/10">
      <div className="flex justify-between items-center h-16 px-6 max-w-6xl mx-auto">

        {/* 왼쪽: 햄버거(모바일) + 브랜드 */}
        <div className="flex items-center gap-4">
          {/* 햄버거 — 모바일 전용 */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f3] active:opacity-70 transition-colors"
              aria-label="메뉴 열기"
            >
              <span className="material-symbols-outlined text-[22px] text-[#1a1c1c]">menu</span>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 bg-[#f9f9f9]">
              <div className="p-6 bg-white border-b border-[#eeeeee]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0061A5] flex items-center justify-center text-white font-bold overflow-hidden border border-[#c4c7c7]/20">
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
                      : initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1c1c] text-sm">{profile?.full_name ?? '사용자'}</p>
                    <p className="text-xs text-[#747878] mt-0.5">{profile?.email}</p>
                  </div>
                </div>
              </div>
              <nav className="py-2">
                {SIDE_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'text-[#0061A5] bg-[#d2e4ff]/30 font-semibold'
                        : 'text-[#1a1c1c] hover:bg-[#eeeeee]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${pathname.startsWith(item.href) ? 'text-[#0061A5]' : 'text-[#0061A5]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="border-t border-[#eeeeee] py-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-[#747878] hover:bg-[#eeeeee] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span>로그아웃</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          {/* 브랜드 */}
          <h1
            className="text-2xl font-bold tracking-tighter text-[#1a1c1c] font-headline cursor-pointer"
            onClick={() => router.push('/diary')}
          >
            Storige
          </h1>

          {/* 데스크탑 인라인 nav */}
          <nav className="hidden md:flex gap-8 items-center ml-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-headline tracking-tight text-sm transition-opacity ${
                    isActive
                      ? 'text-[#0061A5] font-bold'
                      : 'text-[#444748] hover:opacity-70'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>

        {/* 오른쪽: 검색 + 아바타 */}
        <div className="flex items-center gap-4">
          <a
            href="/diary"
            aria-label="검색"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f3] active:opacity-70 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px] text-[#1a1c1c]">search</span>
          </a>
          <button
            onClick={() => router.push('/settings')}
            className="w-8 h-8 rounded-full bg-[#e8e8e8] overflow-hidden border border-[#c4c7c7]/30 flex items-center justify-center text-sm font-bold text-[#747878] active:opacity-70"
            aria-label="프로필 설정"
          >
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
              : initials}
          </button>
        </div>
      </div>
    </header>
  )
}
