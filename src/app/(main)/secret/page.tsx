'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { SecretListView } from '@/components/secret/SecretListView'

// 시크릿 코드 메인 페이지
export default function SecretPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div>
      {/* 페이지 헤더 — Midnight Archive _4 스타일 */}
      <div className="px-5 pt-5 pb-4 bg-white/80 backdrop-blur-sm">
        <span className="text-[10px] tracking-[0.2em] font-bold text-[#0061A5] uppercase block mb-1">Archive Section 08</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1c1c] font-headline leading-tight">Secret Code</h1>
        <p className="text-sm text-[#747878] mt-1">Your encrypted memories, locked behind the veil of time.</p>
      </div>

      <SecretListView />
    </div>
  )
}
