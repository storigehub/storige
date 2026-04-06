'use client'

import { useSSSKeyManager, computeThreshold } from '@/hooks/useSSSKeyManager'
import type { FamilyMember } from '@/types/database'

interface SSSKeySetupProps {
  members: FamilyMember[]
  onDistributed: () => void
}

// 복구 키 배분 카드 — 가족 구성원에게 SSS 조각 생성/저장
export function SSSKeySetup({ members, onDistributed }: SSSKeySetupProps) {
  const { distributing, error, distribute } = useSSSKeyManager()

  const n = members.length
  const k = computeThreshold(n)
  const distributed = members.filter((m) => m.sss_share).length
  const allDistributed = distributed === n && n > 0

  const handleDistribute = async () => {
    const ok = await distribute(members)
    if (ok) onDistributed()
  }

  if (n === 0) return null

  return (
    <div className="mt-6 bg-[#f0f7ff] rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl mt-0.5">🔑</span>
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">복구 키 배분</p>
          <p className="text-[11px] text-[#888] mt-0.5 leading-relaxed">
            유고 시 가족 {k}명이 모이면 시크릿 코드를 열람할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 상태 */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${allDistributed ? 'bg-[#2ED573]' : 'bg-[#FFD93D]'}`} />
        <p className="text-xs text-[#555]">
          {allDistributed
            ? `${n}명 전원에게 복구 키 배분 완료 (${k}-of-${n})`
            : `${distributed}/${n}명 배분됨 — 재배분이 필요합니다`}
        </p>
      </div>

      {error && (
        <p className="text-xs text-[#FF4757] mb-2">{error}</p>
      )}

      <button
        onClick={handleDistribute}
        disabled={distributing}
        className="w-full py-2.5 bg-[#4A90D9] text-white rounded-xl text-sm font-semibold disabled:opacity-40"
      >
        {distributing ? '배분 중...' : allDistributed ? '🔄 재배분' : '🔑 복구 키 생성 및 배분'}
      </button>

      <p className="text-[10px] text-[#B0B0B0] mt-2 text-center">
        재배분 시 기존 조각은 무효화됩니다
      </p>
    </div>
  )
}
