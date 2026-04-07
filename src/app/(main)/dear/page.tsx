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
      {/* 페이지 헤더 — Midnight Archive dear_my_son_3 스타일 */}
      <div className="px-5 pt-5 pb-4 bg-white/80 backdrop-blur-sm">
        <span className="text-[10px] tracking-[0.2em] font-bold text-[#006B5F] uppercase block mb-1">Letters Archive</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1c1c] font-headline leading-tight">Letters</h1>
        <p className="text-sm text-[#747878] mt-1">SHARED ARCHIVES</p>
      </div>

      <DearListView />
    </div>
  )
}
