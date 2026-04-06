'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { DearListView } from '@/components/dear/DearListView'

// Dear My Son 편지 메인 페이지
export default function DearPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="px-4 py-4 bg-white border-b border-[#f0f0f0]">
        <h1 className="text-lg font-bold text-[#1A1A1A]">편지</h1>
        <p className="text-xs text-[#888] mt-0.5">소중한 사람에게 마음을 전하세요</p>
      </div>

      <DearListView />
    </div>
  )
}
