import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { FAB } from '@/components/layout/FAB'

// 메인 레이아웃 — 헤더, 하단 네비, FAB 포함
export default function MainLayout({ children }: { children: React.ReactNode }) {
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
