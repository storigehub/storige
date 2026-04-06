'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import type { JSONContent } from '@tiptap/react'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content?: JSONContent | null
  placeholder?: string
  onChange?: (content: JSONContent) => void
  editable?: boolean
}

// Tiptap 리치 텍스트 에디터
export function RichTextEditor({
  content,
  placeholder = '오늘의 이야기를 기록하세요...',
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
    ],
    content: content ?? '',
    editable,
    onUpdate({ editor }) {
      onChange?.(editor.getJSON())
    },
    // SSR 방지
    immediatelyRender: false,
  })

  // 외부에서 content 변경 시 동기화 (읽기 전용 모드)
  useEffect(() => {
    if (editor && !editable && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content, editable])

  return (
    <div className="relative min-h-[200px]">
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_p]:text-[#1A1A1A] [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[#B0B0B0] [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}
