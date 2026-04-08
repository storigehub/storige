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
      {/* 히어로 섹션 — dear_my_son_2 editorial style */}
      <section className="px-6 pt-10 pb-6 md:pt-14 md:pb-8">
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-dear" />
          <p className="font-headline text-dear uppercase tracking-[0.25em] text-[10px] font-bold">Private Archive</p>
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight text-on-surface mb-3">
          마음을 담은 <span className="text-dear">영원한</span> 기록
        </h1>
        <p className="text-outline max-w-xl text-sm leading-relaxed">
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
