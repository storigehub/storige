'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// 네비게이션 메뉴 항목 정의
const NAV_ITEMS = [
  { href: '/diary', label: '홈 (일기)', icon: '🏠' },
  { href: '/dear', label: 'Dear My Son', icon: '✉️' },
  { href: '/secret', label: '시크릿 코드', icon: '🔐' },
  { href: '/album', label: '포토앨범', icon: '📸' },
  { href: '/publish', label: '출판하기', icon: '📖' },
  { href: '/settings', label: '내 스토리지 관리', icon: '⚙️' },
]

interface HeaderProps {
  title?: string
}

// 앱 헤더 — 햄버거 메뉴 + 타이틀
export function Header({ title = '스토리지' }: HeaderProps) {
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const handleNav = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#f0f0f0] h-14 flex items-center px-4">
      {/* 햄버거 메뉴 */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="w-9 h-9 flex flex-col justify-center gap-1.5 rounded-lg hover:bg-[#f5f5f5] px-2"
          aria-label="메뉴 열기"
        >
          <span className="w-full h-0.5 bg-[#1A1A1A] rounded" />
          <span className="w-full h-0.5 bg-[#1A1A1A] rounded" />
          <span className="w-full h-0.5 bg-[#1A1A1A] rounded" />
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0">
          {/* 프로필 영역 */}
          <div className="p-6 bg-[#FAFAFA]">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-[#4A90D9] text-white text-sm">
                  {profile?.full_name?.[0] ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-[#1A1A1A] text-sm">
                  {profile?.full_name ?? '사용자'}
                </p>
                <p className="text-xs text-[#888]">{profile?.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 네비게이션 항목 */}
          <nav className="py-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-[#1A1A1A] hover:bg-[#f5f5f5] transition-colors"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <Separator />

          <div className="py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-[#888] hover:bg-[#f5f5f5] transition-colors"
            >
              <span>🚪</span>
              <span>로그아웃</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 타이틀 */}
      <h1 className="flex-1 text-center text-base font-semibold text-[#1A1A1A] -ml-9">
        {title}
      </h1>
    </header>
  )
}
