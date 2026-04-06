'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { FamilyMember } from '@/types/database'

// 가족 구성원 목록 조회 훅
export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })

    setMembers(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  return { members, loading, refetch: fetchMembers }
}

// 가족 역할별 뱃지 색상
export function getBadgeColor(role: string): string {
  const map: Record<string, string> = {
    spouse: '#4A90D9',
    son: '#FFD93D',
    daughter: '#FF6B9D',
    lawyer: '#2ED573',
    parent: '#00C9B7',
    other: '#B0B0B0',
  }
  return map[role] ?? '#B0B0B0'
}

// 가족 역할 한글 라벨
export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    spouse: '배우자',
    son: '아들',
    daughter: '딸',
    lawyer: '변호사',
    parent: '부모',
    other: '기타',
  }
  return map[role] ?? role
}
