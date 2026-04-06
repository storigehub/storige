'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useDiaryList } from '@/hooks/useDiaryList'
import { BookPreview } from '@/components/publish/BookPreview'
import { PublishOrderForm } from '@/components/publish/PublishOrderForm'
import { PublishSelectStep } from '@/components/publish/PublishSelectStep'

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
  const pageCount = Math.max(selectedEntries.length * 2, 20)

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

  const STEPS: Step[] = ['select', 'preview', 'order']

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
          <div className="ml-auto flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s ? 'bg-[#4A90D9]' : i < STEPS.indexOf(step) ? 'bg-[#4A90D9]/40' : 'bg-[#e0e0e0]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {step === 'select' && (
          <PublishSelectStep
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
