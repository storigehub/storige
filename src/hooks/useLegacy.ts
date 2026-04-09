'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LegacySettings, LegacyRequest, Entry, FamilyMember } from '@/types/database'

export interface LegacyAccessState {
  settings: LegacySettings | null
  request: LegacyRequest | null
  loading: boolean
  error: string | null
}

// 유고 후 열람 요청 — 가족 구성원용
export function useLegacyRequest(ownerUserId: string, familyMemberId: string) {
  const [state, setState] = useState<LegacyAccessState>({
    settings: null,
    request: null,
    loading: true,
    error: null,
  })
  const supabase = createClient()

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true }))
    // 오너의 legacy_settings 조회
    const { data: settings } = await supabase
      .from('legacy_settings')
      .select('*')
      .eq('user_id', ownerUserId)
      .single()

    // 기존 요청 조회
    const { data: request } = await supabase
      .from('legacy_requests')
      .select('*')
      .eq('owner_id', ownerUserId)
      .eq('requester_family_id', familyMemberId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    setState({ settings: settings ?? null, request: request ?? null, loading: false, error: null })
  }, [ownerUserId, familyMemberId, supabase])

  useEffect(() => { load() }, [load])

  const submitRequest = useCallback(async (documentUrl?: string) => {
    setState(s => ({ ...s, loading: true }))
    const { data, error } = await supabase
      .from('legacy_requests')
      .insert({
        owner_id: ownerUserId,
        requester_family_id: familyMemberId,
        status: 'pending',
        document_url: documentUrl ?? null,
      })
      .select('*')
      .single()

    if (error) {
      setState(s => ({ ...s, loading: false, error: '요청 제출 실패. 다시 시도해주세요.' }))
    } else {
      setState(s => ({ ...s, request: data, loading: false }))
    }
  }, [ownerUserId, familyMemberId, supabase])

  return { ...state, submitRequest, reload: load }
}

// 관리자용: 오너의 전체 열람 요청 목록 조회 + 승인/거부
export function useLegacyAdmin() {
  const [requests, setRequests] = useState<LegacyRequest[]>([])
  const [settings, setSettings] = useState<LegacySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.from('legacy_settings').select('*').eq('user_id', user.id).single(),
      supabase.from('legacy_requests').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
    ])
    setSettings(s ?? null)
    setRequests(r ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const updateLegacySettings = useCallback(async (update: Partial<LegacySettings>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('legacy_settings')
      .upsert({ user_id: user.id, ...update }, { onConflict: 'user_id' })
    load()
  }, [supabase, load])

  const reviewRequest = useCallback(async (
    requestId: string,
    status: 'approved' | 'rejected',
    adminNote?: string
  ) => {
    await supabase
      .from('legacy_requests')
      .update({ status, admin_note: adminNote ?? null, reviewed_at: new Date().toISOString() })
      .eq('id', requestId)
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status, admin_note: adminNote ?? null } : r))
  }, [supabase])

  const activateLegacy = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('legacy_settings').upsert({
      user_id: user.id,
      is_active: true,
      activated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    load()
  }, [supabase, load])

  return { requests, settings, loading, updateLegacySettings, reviewRequest, activateLegacy, reload: load }
}

// 승인된 가족이 유고 기록 열람
export function useLegacyViewer(ownerUserId: string) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // 현재 사용자가 오너의 가족 구성원인지 확인
      const { data: member } = await supabase
        .from('family_members')
        .select('*')
        .eq('owner_id', ownerUserId)
        .eq('linked_user_id', user.id)
        .single()

      if (!member) { setLoading(false); return }

      // 승인된 열람 요청 확인
      const { data: request } = await supabase
        .from('legacy_requests')
        .select('*')
        .eq('owner_id', ownerUserId)
        .eq('requester_family_id', member.id)
        .eq('status', 'approved')
        .single()

      if (!request) { setLoading(false); return }

      setAuthorized(true)

      // 오너의 공개 기록 열람 (is_encrypted=false 만 허용)
      const { data } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', ownerUserId)
        .eq('is_encrypted', false)
        .order('created_at', { ascending: false })

      setEntries(data ?? [])
      setLoading(false)
    }
    checkAndLoad()
  }, [ownerUserId, supabase])

  return { entries, loading, authorized }
}
