'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useDiaryList } from '@/hooks/useDiaryList'
import { BookPreview } from '@/components/publish/BookPreview'
import { PublishOrderForm } from '@/components/publish/PublishOrderForm'

type Step = 'select' | 'preview' | 'order'
type PublishType = 'diary' | 'dear' | 'album'

// 출판 메인 페이지 — 3단계: 선택 → 미리보기 → 주문
export default function PublishPage() {
  const [step, setStep] = useState<Step>('select')
  const [publishType, setPublishType] = useState<PublishType>('diary')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { entries: diaryEntries } = useDiaryList({ journalType: 'diary' })
  const { entries: dearEntries } = useDiaryList({ journalType: 'dear' })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  const sourceEntries = publishType === 'dear' ? dearEntries : diaryEntries
  const selectedEntries = sourceEntries.filter((e) => selectedIds.includes(e.id))
  const pageCount = Math.max(selectedEntries.length * 2, 20) // 최소 20페이지

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === sourceEntries.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(sourceEntries.map((e) => e.id))
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 헤더 */}
      <div className="px-4 py-4 bg-white border-b border-[#f0f0f0] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {step !== 'select' && (
            <button
              onClick={() => setStep(step === 'order' ? 'preview' : 'select')}
              className="text-[#888]"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A]">출판</h1>
            <p className="text-xs text-[#888]">
              {step === 'select' && '출판할 글을 선택하세요'}
              {step === 'preview' && '책 미리보기'}
              {step === 'order' && '배송 및 결제'}
            </p>
          </div>
          {/* 진행 단계 표시 */}
          <div className="ml-auto flex gap-1.5">
            {(['select', 'preview', 'order'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s ? 'bg-[#4A90D9]' : i < ['select', 'preview', 'order'].indexOf(step) ? 'bg-[#4A90D9]/40' : 'bg-[#e0e0e0]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Step 1: 선택 */}
        {step === 'select' && (
          <SelectStep
            publishType={publishType}
            setPublishType={setPublishType}
            entries={sourceEntries}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            onSelectAll={handleSelectAll}
            onNext={() => {
              if (selectedIds.length === 0) {
                alert('하나 이상의 글을 선택하세요')
                return
              }
              setStep('preview')
            }}
          />
        )}

        {/* Step 2: 미리보기 */}
        {step === 'preview' && (
          <div className="space-y-6">
            <BookPreview
              entries={selectedEntries}
              title={publishType === 'dear' ? '편지 모음집' : '나의 이야기'}
            />
            <div className="text-center text-xs text-[#888]">
              총 {pageCount}페이지 예상 · {selectedEntries.length}편 수록
            </div>
            <button
              onClick={() => setStep('order')}
              className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-semibold"
            >
              출판 신청하기
            </button>
          </div>
        )}

        {/* Step 3: 주문 */}
        {step === 'order' && (
          <PublishOrderForm
            selectedEntryIds={selectedIds}
            publishType={publishType}
            pageCount={pageCount}
            onBack={() => setStep('preview')}
          />
        )}
      </div>
    </div>
  )
}

// Step 1 — 타입 선택 + 글 목록 선택
function SelectStep({
  publishType,
  setPublishType,
  entries,
  selectedIds,
  onToggle,
  onSelectAll,
  onNext,
}: {
  publishType: PublishType
  setPublishType: (t: PublishType) => void
  entries: ReturnType<typeof useDiaryList>['entries']
  selectedIds: string[]
  onToggle: (id: string) => void
  onSelectAll: () => void
  onNext: () => void
}) {
  const types: { value: PublishType; label: string; icon: string; desc: string }[] = [
    { value: 'diary', label: '일기 단행본', icon: '📓', desc: '일기를 모아 한 권의 책으로' },
    { value: 'dear', label: '편지 모음집', icon: '✉️', desc: '소중한 편지를 책으로 엮어' },
    { value: 'album', label: '포토앨범', icon: '📸', desc: '사진 중심의 추억 앨범' },
  ]

  return (
    <div className="space-y-5">
      {/* 출판 유형 선택 */}
      <div>
        <p className="text-xs text-[#888] mb-2">출판 유형</p>
        <div className="space-y-2">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setPublishType(t.value)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                publishType === t.value
                  ? 'border-[#4A90D9] bg-[#f0f7ff]'
                  : 'border-[#f0f0f0] bg-white'
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${publishType === t.value ? 'text-[#4A90D9]' : 'text-[#1A1A1A]'}`}>
                  {t.label}
                </p>
                <p className="text-xs text-[#888]">{t.desc}</p>
              </div>
              {publishType === t.value && <span className="ml-auto text-[#4A90D9]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 글 목록 선택 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[#888]">
            글 선택 <span className="text-[#4A90D9]">({selectedIds.length}/{entries.length})</span>
          </p>
          <button onClick={onSelectAll} className="text-xs text-[#4A90D9]">
            {selectedIds.length === entries.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-[#888] text-center py-6">
            출판할 글이 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const selected = selectedIds.includes(entry.id)
              return (
                <button
                  key={entry.id}
                  onClick={() => onToggle(entry.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    selected ? 'border-[#4A90D9] bg-[#f0f7ff]' : 'border-[#f0f0f0] bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                      selected ? 'border-[#4A90D9] bg-[#4A90D9] text-white' : 'border-[#e0e0e0]'
                    }`}
                  >
                    {selected && '✓'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">
                      {entry.title || '제목 없음'}
                    </p>
                    <p className="text-xs text-[#888] truncate">{entry.content_text}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={selectedIds.length === 0}
        className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-semibold disabled:opacity-40"
      >
        미리보기 →
      </button>
    </div>
  )
}
