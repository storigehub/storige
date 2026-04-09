'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MemorialPage, MemorialMessage } from '@/types/database'

// 내 추모관 관리 훅 (설정용)
export function useMyMemorial() {
  const [memorial, setMemorial] = useState<MemorialPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('memorial_pages')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    setMemorial(data as MemorialPage | null)
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const saveMemorial = useCallback(async (fields: Partial<MemorialPage>) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    if (memorial) {
      const { data } = await supabase
        .from('memorial_pages')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', memorial.id)
        .select('*')
        .single()
      if (data) setMemorial(data as MemorialPage)
    } else {
      // 슬러그 자동 생성
      const slug = `${user.id.slice(0, 8)}-${Date.now()}`
      const { data } = await supabase
        .from('memorial_pages')
        .insert({ owner_id: user.id, slug, title: '나의 추모관', ...fields })
        .select('*')
        .single()
      if (data) setMemorial(data as MemorialPage)
    }
    setSaving(false)
  }, [memorial, supabase])

  return { memorial, loading, saving, saveMemorial, refetch: load }
}

// 공개 추모관 조회 (slug 기반)
export function usePublicMemorial(slug: string) {
  const [memorial, setMemorial] = useState<MemorialPage | null>(null)
  const [messages, setMessages] = useState<MemorialMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: page } = await supabase
        .from('memorial_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single()

      if (!page) { setLoading(false); return }
      setMemorial(page as MemorialPage)

      const { data: msgs } = await supabase
        .from('memorial_messages')
        .select('*')
        .eq('memorial_id', page.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      setMessages((msgs ?? []) as MemorialMessage[])
      setLoading(false)
    }
    load()
  }, [slug, supabase])

  const leaveMessage = useCallback(async (
    authorName: string,
    content: string,
    relation?: string
  ) => {
    if (!memorial) return false
    setSubmitting(true)
    const { error } = await supabase
      .from('memorial_messages')
      .insert({
        memorial_id: memorial.id,
        author_name: authorName,
        content,
        relation: relation ?? null,
        is_approved: false, // 오너 승인 후 노출
      })
    setSubmitting(false)
    return !error
  }, [memorial, supabase])

  return { memorial, messages, loading, submitting, leaveMessage }
}

// 오너용: 메시지 승인/거절
export function useMemorialAdmin() {
  const [messages, setMessages] = useState<MemorialMessage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // 내 추모관 ID 조회
    const { data: page } = await supabase
      .from('memorial_pages')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!page) { setLoading(false); return }

    const { data } = await supabase
      .from('memorial_messages')
      .select('*')
      .eq('memorial_id', page.id)
      .order('created_at', { ascending: false })

    setMessages((data ?? []) as MemorialMessage[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const approveMessage = useCallback(async (id: string, approved: boolean) => {
    await supabase
      .from('memorial_messages')
      .update({ is_approved: approved })
      .eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_approved: approved } : m))
  }, [supabase])

  const deleteMessage = useCallback(async (id: string) => {
    await supabase.from('memorial_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [supabase])

  return { messages, loading, approveMessage, deleteMessage, refetch: load }
}
