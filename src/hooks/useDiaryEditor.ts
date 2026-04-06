'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { JSONContent } from '@tiptap/react'
import type { Json } from '@/types/database'

interface UseDiaryEditorOptions {
  entryId?: string        // 수정 시 기존 ID
  journalType?: string    // 'diary' | 'dear'
}

// 일기 에디터 상태 및 자동저장 로직
export function useDiaryEditor({ entryId, journalType = 'diary' }: UseDiaryEditorOptions = {}) {
  const [id, setId] = useState<string | undefined>(entryId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<JSONContent | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = useMemo(() => createClient(), [])

  // 실제 저장 로직 — 저장된 entry ID 반환
  const save = useCallback(async (
    titleVal: string,
    contentVal: JSONContent | null
  ): Promise<string | undefined> => {
    // 빈 내용은 저장 안 함
    if (!titleVal.trim() && !contentVal) return undefined

    setIsSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return undefined

      // content에서 평문 추출 (검색용)
      const contentText = extractText(contentVal)

      if (id) {
        // 수정 — 기존 ID 반환
        await supabase.from('entries').update({
          title: titleVal,
          content: contentVal as unknown as Json,
          content_text: contentText,
          updated_at: new Date().toISOString(),
        }).eq('id', id)
        setLastSaved(new Date())
        return id
      } else {
        // 신규 생성 — 새 ID 반환
        const { data } = await supabase.from('entries').insert({
          user_id: user.id,
          journal_type: journalType,
          title: titleVal,
          content: contentVal as unknown as Json,
          content_text: contentText,
        }).select('id').single()

        if (data) {
          setId(data.id)
          setLastSaved(new Date())
          return data.id
        }
        return undefined
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.')
      return undefined
    } finally {
      setIsSaving(false)
    }
  }, [id, journalType, supabase])

  // 자동저장 — 2초 디바운스
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)

    autoSaveTimer.current = setTimeout(() => {
      save(title, content)
    }, 2000)

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [title, content, save])

  // 수동 즉시 저장 — 저장된 entry ID 반환
  const saveNow = useCallback(async (): Promise<string | undefined> => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    return save(title, content)
  }, [title, content, save])

  // 에디터 내용 변경 핸들러
  const handleContentChange = useCallback((newContent: JSONContent) => {
    setContent(newContent)
  }, [])

  return {
    id,
    title,
    setTitle,
    content,
    handleContentChange,
    isSaving,
    lastSaved,
    error,
    saveNow,
  }
}

// Tiptap JSONContent에서 평문 추출
function extractText(content: JSONContent | null): string {
  if (!content) return ''

  const texts: string[] = []

  function traverse(node: JSONContent) {
    if (node.type === 'text' && node.text) {
      texts.push(node.text)
    }
    if (node.content) {
      node.content.forEach(traverse)
    }
  }

  traverse(content)
  return texts.join(' ')
}
