'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Entry, Media } from '@/types/database'

export interface EntryWithMedia extends Entry {
  media: Media[]
}

interface UseDiaryListOptions {
  journalType?: string
  searchQuery?: string
}

// 일기 목록 조회 훅
export function useDiaryList({ journalType = 'diary', searchQuery }: UseDiaryListOptions = {}) {
  const [entries, setEntries] = useState<EntryWithMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('entries')
        .select('*, media(*)')
        .eq('journal_type', journalType)
        .order('created_at', { ascending: false })

      // 검색어가 있을 경우 필터
      if (searchQuery?.trim()) {
        query = query.ilike('content_text', `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setEntries((data as EntryWithMedia[]) ?? [])
    } catch {
      setError('일기를 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [journalType, searchQuery, supabase])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(async (id: string, current: boolean) => {
    await supabase.from('entries').update({ is_favorite: !current }).eq('id', id)
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_favorite: !current } : e))
    )
  }, [supabase])

  // 삭제
  const deleteEntry = useCallback(async (id: string) => {
    await supabase.from('entries').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [supabase])

  return { entries, loading, error, refetch: fetchEntries, toggleFavorite, deleteEntry }
}
