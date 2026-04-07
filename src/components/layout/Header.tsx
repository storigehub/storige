'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// 사이드 메뉴 항목
const NAV_ITEMS = [
  { href: '/diary', label: '일기', icon: 'book_2' },
  { href: '/dear', label: '편지', icon: 'mail' },
  { href: '/secret', label: '시크릿 코드', icon: 'lock' },
  { href: '/album', label: '포토앨범', icon: 'photo_library' },
  { href: '/publish', label: '출판하기', icon: 'menu_book' },
  { href: '/settings', label: '설정', icon: 'manage_accounts' },
]

// 앱 헤더 — Midnight Archive 디자인
export function Header() {
  const router = useRouter()
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#c4c7c7]/20">
      <div className="flex justify-between items-center h-16 px-5 max-w-lg mx-auto">
        {/* 왼쪽: 햄버거 메뉴 + 브랜드 */}
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f3] active:opacity-70 transition-colors"
              aria-label="메뉴 열기"
            >
              <span className="material-symbols-outlined text-[22px] text-[#1a1c1c]">menu</span>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 bg-[#f9f9f9]">
              {/* 프로필 영역 */}
              <div className="p-6 bg-white border-b border-[#eeeeee]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0061A5] flex items-center justify-center text-white text-base font-bold overflow-hidden border border-[#c4c7c7]/20">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1c1c] text-sm">{profile?.full_name ?? '사용자'}</p>
                    <p className="text-xs text-[#747878] mt-0.5">{profile?.email}</p>
                  </div>
                </div>
              </div>

              {/* 네비게이션 */}
              <nav className="py-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-[#1a1c1c] hover:bg-[#eeeeee] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#0061A5]">{item.icon}</span>
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

          <h1 className="text-xl font-bold tracking-tight text-[#1a1c1c] font-headline">Storige</h1>
        </div>

        {/* 오른쪽: 검색 + 아바타 */}
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f3] active:opacity-70 transition-colors">
            <span className="material-symbols-outlined text-[22px] text-[#1a1c1c]">search</span>
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="w-9 h-9 rounded-full bg-[#e8e8e8] overflow-hidden border border-[#c4c7c7]/30 flex items-center justify-center text-sm font-bold text-[#747878] active:opacity-70"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
