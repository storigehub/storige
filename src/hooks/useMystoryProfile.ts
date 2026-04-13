'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MystoryProfile } from '@/types/database'

// 사용자 바이오 프로필 훅
// - 프로필 로드 (인터뷰 시작 시 컨텍스트 주입용)
// - 토픽 완료 시 팩트 추출 트리거
export function useMystoryProfile() {
  const [profile, setProfile] = useState<MystoryProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('mystory_profile')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setProfile({
        ...data,
        facts: (data.facts ?? {}) as Record<string, unknown>,
      })
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  // 프로필을 인터뷰 API에 전달할 컨텍스트 문자열로 변환
  const buildProfileContext = useCallback((currentTopicId: string): string => {
    if (!profile || Object.keys(profile.facts).length === 0) return ''

    const facts = profile.facts
    const lines: string[] = []

    const mapping: Record<string, string> = {
      birthplace: '출생지',
      birth_decade: '출생 시기',
      hometown_features: '고향 특징',
      family_father: '아버지',
      family_mother: '어머니',
      family_siblings: '형제자매',
      career: '직업',
      career_duration: '근무 기간',
      spouse_met: '배우자 만난 계기',
      hobbies: '취미',
      values: '삶의 가치관',
    }

    for (const [key, label] of Object.entries(mapping)) {
      if (facts[key]) {
        const val = Array.isArray(facts[key])
          ? (facts[key] as unknown[]).join(', ')
          : String(facts[key])
        lines.push(`${label}: ${val}`)
      }
    }

    // 매핑에 없는 추가 사실도 포함
    for (const [key, val] of Object.entries(facts)) {
      if (!mapping[key] && val) {
        const valStr = Array.isArray(val) ? val.join(', ') : String(val)
        lines.push(`${key}: ${valStr}`)
      }
    }

    return lines.join('\n')
  }, [profile])

  // 토픽 완료 시 호출 — 팩트 추출 API 호출 후 프로필 갱신
  const extractAndSave = useCallback(async (
    topicId: string,
    messages: { role: string; content: string; ts: string }[]
  ): Promise<void> => {
    // 이미 추출된 토픽은 스킵
    if (profile?.completed_topics.includes(topicId)) return

    try {
      await fetch('/api/ai/profile-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, messages }),
      })
      // 추출 후 프로필 재로드
      await load()
    } catch {
      // 팩트 추출 실패는 인터뷰 흐름에 영향 없음 (silent fail)
    }
  }, [profile, load])

  return { profile, loading, buildProfileContext, extractAndSave }
}
