'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { DearListView } from '@/components/dear/DearListView'

/**
 * Dear My Son 편지 메인 페이지 — Midnight Archive / dear_my_son_1 템플릿 기준
 * 히어로: "마음을 담은 영원한 기록" + 설명 텍스트
 */
export default function DearPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* 히어로 섹션 — dear_my_son_1 */}
      <section className="px-6 pt-10 pb-8 md:pt-16 md:pb-12">
        <p className="font-headline text-[#747878] uppercase tracking-[0.2em] text-[10px] mb-2">Letters Archive</p>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#1a1c1c] mb-4">
          마음을 담은 <span className="text-[#006B5F]">영원한</span> 기록
        </h1>
        <p className="text-[#444748] max-w-xl text-base leading-relaxed">
          소중한 사람에게 전하고 싶은 말을 지금 기록하세요.
          지정한 순간이 오면 자동으로 전달됩니다.
        </p>
      </section>

      {/* 편지 목록 */}
      <div className="px-6">
        <DearListView />
      </div>
    </div>
  )
}
