'use client'

import { useState, useCallback } from 'react'
import { splitSecret, combineSecrets } from '@/lib/encryption/sss'
import { createClient } from '@/lib/supabase/client'
import type { FamilyMember } from '@/types/database'

/** 256-bit 마스터 복구 키 생성 (hex 64자) */
export function generateMasterKey(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** 과반수 임계값 계산: n명 중 ceil((n+1)/2)명 필요 */
export function computeThreshold(n: number): number {
  if (n <= 1) return 1
  return Math.ceil((n + 1) / 2)
}

/** 마스터 키를 n개 조각으로 분할하여 memberIds에 매핑 */
export function buildShareMap(masterKey: string, memberIds: string[]): Record<string, string> {
  const n = memberIds.length
  const k = computeThreshold(n)
  const shares = n >= 2 ? splitSecret(masterKey, n, k) : [masterKey]

  return Object.fromEntries(memberIds.map((id, i) => [id, shares[i]]))
}

/** 가족 구성원의 sss_share 조각들로 마스터 키 복원 */
export { combineSecrets as combineRecoveryKey }

interface UseSSSKeyManagerResult {
  distributing: boolean
  error: string | null
  distribute: (members: FamilyMember[]) => Promise<boolean>
}

// 가족 구성원 전체에게 복구 키 조각을 배분하는 훅
export function useSSSKeyManager(): UseSSSKeyManagerResult {
  const [distributing, setDistributing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const distribute = useCallback(async (members: FamilyMember[]): Promise<boolean> => {
    if (members.length === 0) {
      setError('가족 구성원이 없습니다')
      return false
    }

    setDistributing(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      // 마스터 키 생성 + 조각 분할
      const masterKey = generateMasterKey()
      const memberIds = members.map((m) => m.id)
      const shareMap = buildShareMap(masterKey, memberIds)
      const n = members.length
      const k = computeThreshold(n)

      // 각 가족 구성원에게 조각 저장 (병렬)
      await Promise.all(
        members.map((m) =>
          supabase
            .from('family_members')
            .update({ sss_share: shareMap[m.id] })
            .eq('id', m.id)
        )
      )

      // legacy_settings upsert (threshold, total 기록)
      await supabase.from('legacy_settings').upsert(
        { user_id: user.id, sss_threshold: k, sss_total: n, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )

      return true
    } catch (err) {
      console.error(err)
      setError('복구 키 배분 중 오류가 발생했습니다')
      return false
    } finally {
      setDistributing(false)
    }
  }, [])

  return { distributing, error, distribute }
}
