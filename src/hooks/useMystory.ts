'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  Database,
  Json,
  MystorySession,
  MystoryMessage,
} from '@/types/database'

type MystoryRow = Database['public']['Tables']['mystory_sessions']['Row']

function parseMystorySession(row: MystoryRow): MystorySession {
  const raw = row.messages
  const messages: MystoryMessage[] = Array.isArray(raw)
    ? (raw as unknown as MystoryMessage[])
    : []
  return {
    ...row,
    messages,
    status: row.status as MystorySession['status'],
  }
}

function messagesToJson(messages: MystoryMessage[]): Json {
  return messages as unknown as Json
}

// 세션 목록 조회
export function useMystorySessions() {
  const [sessions, setSessions] = useState<MystorySession[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('mystory_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    setSessions((data ?? []).map(parseMystorySession))
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  return { sessions, loading, refetch: load }
}

// 개별 세션 인터뷰 훅
export function useMystoryInterview(topicId: string) {
  const [session, setSession] = useState<MystorySession | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [generating, setGenerating] = useState(false)
  const supabase = createClient()

  // 세션 로드 또는 생성
  const loadOrCreate = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // 기존 세션 조회
    const { data: existing } = await supabase
      .from('mystory_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing) {
      setSession(parseMystorySession(existing))
    } else {
      // 새 세션 생성
      const { getTopicById } = await import('@/lib/mystory/questions')
      const topic = getTopicById(topicId)
      if (!topic) { setLoading(false); return }

      const firstMsg: MystoryMessage = {
        role: 'assistant',
        content: `안녕하세요! "${topic.title}"에 대한 이야기를 나눠볼게요.\n\n${topic.questions[0]}`,
        ts: new Date().toISOString(),
      }

      const { data: created } = await supabase
        .from('mystory_sessions')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          topic_category: topic.category,
          status: 'in_progress',
          messages: messagesToJson([firstMsg]),
        })
        .select('*')
        .single()

      if (created) setSession(parseMystorySession(created))
    }
    setLoading(false)
  }, [topicId, supabase])

  useEffect(() => { loadOrCreate() }, [loadOrCreate])

  // 사용자 답변 전송 → AI 다음 질문 받기
  const sendAnswer = useCallback(async (answer: string) => {
    if (!session || !answer.trim()) return

    setSending(true)
    const userMsg: MystoryMessage = {
      role: 'user',
      content: answer.trim(),
      ts: new Date().toISOString(),
    }

    const updatedMessages = [...session.messages, userMsg]

    // AI 다음 질문 API 호출
    let aiReply = ''
    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: session.topic_id,
          messages: updatedMessages,
        }),
      })
      const data = await res.json()
      aiReply = data.reply ?? ''
    } catch {
      aiReply = '잘 들었습니다. 더 하고 싶으신 이야기가 있으시면 계속 말씀해 주세요.'
    }

    const aiMsg: MystoryMessage = {
      role: 'assistant',
      content: aiReply,
      ts: new Date().toISOString(),
    }

    const finalMessages = [...updatedMessages, aiMsg]
    const wordCount = finalMessages
      .filter(m => m.role === 'user')
      .reduce((acc, m) => acc + m.content.length, 0)

    await supabase
      .from('mystory_sessions')
      .update({
        messages: messagesToJson(finalMessages),
        word_count: wordCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id)

    setSession(s => s ? { ...s, messages: finalMessages, word_count: wordCount } : s)
    setSending(false)
  }, [session, supabase])

  // 자서전 원고 생성
  const generateManuscript = useCallback(async () => {
    if (!session) return
    setGenerating(true)

    try {
      const res = await fetch('/api/ai/manuscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: session.topic_id,
          topicCategory: session.topic_category,
          messages: session.messages,
        }),
      })
      const data = await res.json()
      const generatedText = data.manuscript ?? ''

      await supabase
        .from('mystory_sessions')
        .update({ generated_text: generatedText, status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', session.id)

      setSession(s => s ? { ...s, generated_text: generatedText, status: 'completed' } : s)
    } finally {
      setGenerating(false)
    }
  }, [session, supabase])

  return { session, loading, sending, generating, sendAnswer, generateManuscript }
}
