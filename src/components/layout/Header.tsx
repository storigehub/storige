'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
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
  { href: '/mystory',  label: 'AI 자서전',  icon: 'history_edu' },
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="flex justify-between items-center h-20 px-6 max-w-6xl mx-auto">

        {/* 왼쪽: 햄버거(모바일) + 브랜드 */}
        <div className="flex items-center gap-4">
          {/* 햄버거 — 모바일 전용 */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low active:opacity-70 transition-colors"
              aria-label="메뉴 열기"
            >
              <span className="material-symbols-outlined text-[22px] text-on-surface">menu</span>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 bg-[#f9f9f9]">
              {/* 사이드 프로필 헤더 */}
              <div className="p-6 bg-white border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                      {profile?.avatar_url
                        ? <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm font-headline">{profile?.full_name ?? '사용자'}</p>
                    <p className="text-xs text-outline">{profile?.email}</p>
                  </div>
                </div>
              </div>
              <nav className="py-2">
                {SIDE_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                        isActive
                          ? 'text-primary bg-primary-container/30 font-bold'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-outline'}`}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  )
                })}
              </nav>
              <div className="border-t border-surface-container py-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-6 py-3 text-sm text-outline hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span>로그아웃</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          {/* 브랜드 */}
          <button onClick={() => router.push('/diary')} aria-label="홈으로">
            <Image src="/logo.png" alt="Storige" width={120} height={36} className="h-[4.5rem] w-auto object-contain" priority />
          </button>

          {/* 데스크탑 인라인 nav */}
          <nav className="hidden md:flex items-center ml-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-5 font-headline text-sm transition-colors ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </a>
              )
            })}
          </nav>
        </div>

        {/* 오른쪽: 검색 + 아바타 */}
        <div className="flex items-center gap-2">
          <a
            href="/diary"
            aria-label="검색"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low active:opacity-70 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-outline">search</span>
          </a>
          <button
            onClick={() => router.push('/settings')}
            className="w-8 h-8 rounded-full bg-primary overflow-hidden flex items-center justify-center text-xs font-bold text-white shadow-sm active:opacity-80 transition-opacity"
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
