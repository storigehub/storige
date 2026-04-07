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
      {/* 히어로 — 다크 그라디언트 배너 */}
      <div className="mx-5 mt-8 mb-6 rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0061A5 0%, #00201C 100%)' }}
      >
        <div className="px-6 pt-6 pb-5">
          <span className="text-[10px] tracking-[0.25em] font-bold text-white/50 uppercase block mb-3">
            Archive Section 08
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-headline leading-tight mb-1">
            Secret Code
          </h1>
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            Your encrypted memories, locked behind the veil of time.
          </p>
          {/* 보안 상태 */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <span
              className="material-symbols-outlined text-2xl text-white/40"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
            >
              fingerprint
            </span>
            <div>
              <p className="text-xs font-bold text-white/80">AES-256-GCM 암호화 활성</p>
              <p className="text-[10px] text-white/40">패스프레이즈 + 시스템 암호화로 이중 보호</p>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* "Encrypted Records" 섹션 레이블 */}
      <div className="px-5 mb-3 flex items-center gap-3">
        <span className="w-1.5 h-5 bg-[#E91E63] rounded-full" />
        <p className="text-[10px] tracking-[0.2em] font-bold text-[#747878] uppercase font-headline">
          Encrypted Records
        </p>
      </div>

      {/* 아코디언 목록 */}
      <SecretListView />
    </div>
  )
}
