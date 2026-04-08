'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useRouter } from 'next/navigation'
import { useDiaryEditor } from '@/hooks/useDiaryEditor'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { formatDate } from '@/lib/utils/date'

interface DiaryEditorProps {
  entryId?: string
  initialTitle?: string
}

// 일기 작성/편집 메인 컴포넌트
export function DiaryEditor({ entryId, initialTitle }: DiaryEditorProps) {
  const router = useRouter()
  const { title, setTitle, handleContentChange, isSaving, lastSaved, saveNow } =
    useDiaryEditor({ entryId })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: '오늘의 이야기를 기록하세요...' }),
    ],
    onUpdate({ editor }) {
      handleContentChange(editor.getJSON())
    },
    immediatelyRender: false,
  })

  const handleDone = async () => {
    await saveNow()
    router.push('/diary')
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#f0f0f0]">
        <button
          onClick={() => router.back()}
          className="text-[#888] text-sm"
        >
          취소
        </button>

        {/* 저장 상태 */}
        <span className="text-xs text-[#B0B0B0]">
          {isSaving
            ? '저장 중...'
            : lastSaved
            ? `저장됨 ${formatTime(lastSaved)}`
            : ''}
        </span>

        <button
          onClick={handleDone}
          className="text-primary font-semibold text-sm"
        >
          완료
        </button>
      </div>

      {/* 날짜 표시 */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-[#B0B0B0]">{formatDate(new Date())}</p>
      </div>

      {/* 제목 입력 */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="제목"
          value={initialTitle ?? title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold text-[#1A1A1A] placeholder-[#B0B0B0] outline-none bg-transparent"
        />
      </div>

      {/* 서식 툴바 */}
      <EditorToolbar editor={editor} />

      {/* 에디터 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <RichTextEditor
          onChange={handleContentChange}
        />
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}
