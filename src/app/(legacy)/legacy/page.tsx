'use client'

import { Suspense } from 'react'
import { LegacyAccessContent } from './LegacyAccessContent'

/**
 * Legacy Access — 유고 후 열람 전용 화면
 * URL: /legacy?owner=<userId>
 */
export default function LegacyPage() {
  return (
    <Suspense fallback={<LegacyLoadingScreen />}>
      <LegacyAccessContent />
    </Suspense>
  )
}

function LegacyLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
        <p className="text-white/40 text-sm">인증 확인 중…</p>
      </div>
    </div>
  )
}
