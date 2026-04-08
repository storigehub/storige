'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { useDiaryEditor } from '@/hooks/useDiaryEditor'
import { useFamilyMembers, getBadgeColor, getRoleLabel } from '@/hooks/useFamilyMembers'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { formatDate } from '@/lib/utils/date'
import { createClient } from '@/lib/supabase/client'
// createClient는 handleDone에서 recipient_id 저장 시 사용

// Dear My Son 편지 에디터 — 수신자 선택 + 리치 텍스트
export function DearEditor() {
  const router = useRouter()
  const { members, loading: membersLoading } = useFamilyMembers()
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null)
  const [showRecipientPicker, setShowRecipientPicker] = useState(false)

  const { title, setTitle, handleContentChange, isSaving, lastSaved, saveNow, id } =
    useDiaryEditor({ journalType: 'dear' })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: '사랑하는 사람에게 마음을 전하세요...' }),
    ],
    onUpdate({ editor }) {
      handleContentChange(editor.getJSON())
    },
    immediatelyRender: false,
  })

  // 수신자 선택 — 실제 DB 저장은 완료(handleDone) 시점에 처리
  const handleSelectRecipient = useCallback((memberId: string) => {
    setSelectedRecipientId(memberId)
    setShowRecipientPicker(false)
  }, [])

  const handleDone = async () => {
    // saveNow()가 저장 완료 후 확정된 ID를 반환
    const savedId = await saveNow()

    // 수신자가 선택되어 있으면 recipient_id 업데이트
    if (savedId && selectedRecipientId) {
      const supabase = createClient()
      await supabase.from('entries').update({ recipient_id: selectedRecipientId }).eq('id', savedId)
    }
    router.push('/dear')
  }

  const selectedMember = members.find((m) => m.id === selectedRecipientId)

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#f0f0f0]">
        <button onClick={() => router.back()} className="text-[#888] text-sm">
          취소
        </button>

        <span className="text-xs text-[#B0B0B0]">
          {isSaving ? '저장 중...' : lastSaved ? `저장됨 ${formatTime(lastSaved)}` : ''}
        </span>

        <button
          onClick={handleDone}
          className="text-dear font-semibold text-sm"
        >
          완료
        </button>
      </div>

      {/* 날짜 + 수신자 선택 */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="text-xs text-[#B0B0B0]">{formatDate(new Date())}</p>

        {/* 수신자 버튼 */}
        <button
          onClick={() => setShowRecipientPicker(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors"
          style={
            selectedMember
              ? {
                  backgroundColor: getBadgeColor(selectedMember.role),
                  borderColor: getBadgeColor(selectedMember.role),
                  color: '#fff',
                }
              : {
                  borderColor: '#006B5F',
                  color: '#006B5F',
                }
          }
        >
          {selectedMember
            ? `To. ${selectedMember.name}`
            : '+ 받는 사람 선택'}
        </button>
      </div>

      {/* 수신자 선택 시트 */}
      {showRecipientPicker && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowRecipientPicker(false)}>
          <div
            className="w-full bg-white rounded-t-2xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">받는 사람을 선택하세요</h3>

            {membersLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-dear border-t-transparent rounded-full animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-[#888]">등록된 가족 구성원이 없습니다</p>
                <p className="text-xs text-[#B0B0B0] mt-1">설정 {'>'} 가족 관리에서 추가하세요</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectRecipient(member.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#f0f0f0] active:bg-[#fafafa] text-left"
                  >
                    {/* 역할 색상 도트 */}
                    <span
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getBadgeColor(member.role) }}
                    >
                      {member.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{member.name}</p>
                      <p className="text-xs text-[#888]">{getRoleLabel(member.role)}</p>
                    </div>
                    {selectedRecipientId === member.id && (
                      <span className="ml-auto text-dear">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 제목 입력 */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="편지 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold text-[#1A1A1A] placeholder-[#B0B0B0] outline-none bg-transparent"
        />
      </div>

      {/* 서식 툴바 */}
      <EditorToolbar editor={editor} />

      {/* 에디터 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <RichTextEditor onChange={handleContentChange} />
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}
