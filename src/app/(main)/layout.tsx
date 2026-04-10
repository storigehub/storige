import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { FAB } from '@/components/layout/FAB'

// 메인 레이아웃 — 서버사이드 인증 체크 + 헤더/하단 네비/FAB
// middleware.ts 대신 레이아웃에서 인증 처리 (Turbopack nft.json 버그 회피)
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      {/* pb-24: 모바일 BottomNav 여백 / md:pb-0: 데스크탑은 BottomNav hidden */}
      <main className="pb-24 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <FAB />
    </div>
  )
}
