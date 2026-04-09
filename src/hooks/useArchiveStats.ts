'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ArchiveStats {
  diaryCount: number
  dearCount: number
  secretCount: number
  storageMB: number
  loading: boolean
}

/**
 * 설정 페이지 아카이브 통계 — Supabase count + storage sum
 */
export function useArchiveStats(): ArchiveStats {
  const [stats, setStats] = useState<ArchiveStats>({
    diaryCount: 0,
    dearCount: 0,
    secretCount: 0,
    storageMB: 0,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function fetchStats() {
      const [diaryRes, dearRes, secretRes, mediaRes] = await Promise.all([
        supabase
          .from('entries')
          .select('id', { count: 'exact', head: true })
          .eq('journal_type', 'diary'),
        supabase
          .from('entries')
          .select('id', { count: 'exact', head: true })
          .eq('journal_type', 'dear'),
        supabase
          .from('secret_codes')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('media')
          .select('file_size'),
      ])

      const totalBytes = (mediaRes.data ?? []).reduce(
        (acc, m) => acc + (m.file_size ?? 0),
        0
      )

      setStats({
        diaryCount: diaryRes.count ?? 0,
        dearCount: dearRes.count ?? 0,
        secretCount: secretRes.count ?? 0,
        storageMB: Math.round((totalBytes / (1024 * 1024)) * 10) / 10,
        loading: false,
      })
    }

    fetchStats()
  }, [])

  return stats
}
