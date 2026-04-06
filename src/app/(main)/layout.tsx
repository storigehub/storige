import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { FAB } from '@/components/layout/FAB'

// 메인 레이아웃 — 헤더, 하단 네비, FAB 포함
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <main className="pb-20 pt-2">
        {children}
      </main>
      <BottomNav />
      <FAB />
    </div>
  )
}
