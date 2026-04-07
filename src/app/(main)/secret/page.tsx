'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { SecretListView } from '@/components/secret/SecretListView'

/**
 * 시크릿 코드 메인 페이지 — Midnight Archive / _4 템플릿 기준
 * 히어로 + "Encrypted Records" 섹션 레이블 + 아코디언 목록
 */
export default function SecretPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      {/* 히어로 — _4 "Archive Section 08" */}
      <div className="px-5 pt-8 pb-6">
        <span className="text-[10px] tracking-[0.2em] font-bold text-[#0061A5] uppercase block mb-2">
          Archive Section 08
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1c1c] font-headline leading-tight mb-2">
          Secret Code
        </h1>
        <p className="text-sm text-[#747878] leading-relaxed">
          Your encrypted memories, locked behind the veil of time.
        </p>
      </div>

      {/* 보안 상태 배너 — _4 "Biometric Lock Active" */}
      <div className="mx-5 mb-6 p-5 rounded-xl bg-[#e8e8e8] text-center">
        <span
          className="material-symbols-outlined text-4xl text-[#c4c7c7] block mb-2"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
        >
          fingerprint
        </span>
        <h5 className="font-bold text-sm text-[#1a1c1c] mb-1">AES-256-GCM 암호화 활성</h5>
        <p className="text-xs text-[#747878]">
          시스템 수준 암호화와 패스프레이즈로 보호되고 있습니다.
        </p>
      </div>

      {/* "Encrypted Records" 섹션 레이블 */}
      <div className="px-5 mb-3">
        <p className="text-[10px] tracking-widest font-bold text-[#747878] uppercase">
          Encrypted Records
        </p>
      </div>

      {/* 아코디언 목록 */}
      <SecretListView />
    </div>
  )
}
