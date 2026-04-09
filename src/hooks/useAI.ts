'use client'

import { useState, useCallback } from 'react'

interface SummaryResult {
  summary: string
  mood: string
  keywords: string[]
}

interface SuggestionResult {
  prompts: string[]
}

// 일기 요약 훅
export function useDiarySummary() {
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const summarize = useCallback(async (content: string) => {
    if (!content || content.trim().length < 20) {
      setError('내용이 너무 짧습니다. (최소 20자)')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'AI 요약 실패')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 요약 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => { setResult(null); setError(null) }, [])

  return { result, loading, error, summarize, clear }
}

// 글감 제안 훅
export function useWritingSuggestions() {
  const [prompts, setPrompts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const suggest = useCallback(async (recentTitles: string[] = [], mood?: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recentTitles, mood }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '글감 제안 실패')
      setPrompts(data.prompts ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '글감 제안 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  return { prompts, loading, error, suggest }
}
