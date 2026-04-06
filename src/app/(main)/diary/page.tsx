import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// 일기 목록 페이지 (Phase 1 — 빈 화면)
export default async function DiaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="text-5xl">📓</div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          첫 번째 일기를 작성해보세요
        </h2>
        <p className="text-sm text-[#888] max-w-xs">
          오늘의 이야기를 기록하고,
          <br />
          소중한 기억을 보관하세요
        </p>
        <p className="text-xs text-[#B0B0B0]">
          우측 하단 + 버튼을 눌러 시작하세요
        </p>
      </div>
    </div>
  )
}
