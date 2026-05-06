'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDiaryList, type EntryWithMedia } from '@/hooks/useDiaryList'
import { useMystorySessions } from '@/hooks/useMystory'
import { getTopicById } from '@/lib/mystory/questions'
import { BookPreview } from '@/components/publish/BookPreview'
import { PublishOrderForm } from '@/components/publish/PublishOrderForm'
import { PublishSelectStep } from '@/components/publish/PublishSelectStep'

type Step = 'select' | 'preview' | 'order'
type PublishType = 'diary' | 'dear' | 'album' | 'mystory'

const STEP_LABELS: Record<Step, string> = {
  select: '1. 글 선택',
  preview: '2. 미리보기',
  order: '3. 주문 / 결제',
}

// 출판 메인 페이지 — Midnight Archive / 3단계 위저드
export default function PublishPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-outline">잠시만 기다려주세요...</div>}>
      <PublishContent />
    </Suspense>
  )
}

function PublishContent() {
  const searchParams = useSearchParams()
  const initType = (searchParams.get('type') as PublishType) || 'diary'
  const autoSelect = searchParams.get('autoSelect') === 'true'

  const [step, setStep] = useState<Step>('select')
  const [publishType, setPublishType] = useState<PublishType>(initType)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { entries: diaryEntries } = useDiaryList({ journalType: 'diary' })
  const { entries: dearEntries } = useDiaryList({ journalType: 'dear' })
  const { sessions: mystorySessions } = useMystorySessions()

  // MyStory 세션을 EntryWithMedia 규격으로 매핑
  const mystoryEntries = useMemo(() => {
    return mystorySessions
      .filter(s => s.status === 'completed' && s.generated_text)
      .map(s => {
        const topic = getTopicById(s.topic_id)
        return {
          id: s.id,
          title: topic?.title ?? s.topic_id,
          content_text: s.generated_text,
          created_at: s.updated_at,
          location_name: null,
          weather: null,
          media: [],
          journal_type: 'mystory',
        } as unknown as EntryWithMedia
      })
  }, [mystorySessions])

  const sourceEntries = useMemo(() => {
    if (publishType === 'dear') return dearEntries
    if (publishType === 'mystory') return mystoryEntries
    return diaryEntries
  }, [publishType, dearEntries, mystoryEntries, diaryEntries])

  const selectedEntries = sourceEntries.filter((e) => selectedIds.includes(e.id))
  const pageCount = Math.max(selectedEntries.length * 2, 20)

  // autoSelect 처리
  useEffect(() => {
    if (autoSelect && sourceEntries.length > 0 && selectedIds.length === 0) {
      setSelectedIds(sourceEntries.map(e => e.id))
    }
  }, [autoSelect, sourceEntries, selectedIds])

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
  const currentStepIdx = STEPS.indexOf(step)

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* ── Sticky 헤더 (Backdrop Blur Rule) ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#E2E2E2]/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* 뒤로 가기 */}
          {step !== 'select' && (
            <button
              onClick={() => setStep(step === 'order' ? 'preview' : 'select')}
              className="w-8 h-8 rounded-xl bg-[#F3F3F3] flex items-center justify-center hover:bg-[#E8E8E8] transition-colors"
              aria-label="이전 단계"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface">arrow_back</span>
            </button>
          )}

          {/* 타이틀 */}
          <div className="flex-1">
            <h1 className="text-sm font-extrabold text-on-surface font-headline">종이책 출판</h1>
          </div>

          {/* 스텝 인디케이터 */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  i < currentStepIdx
                    ? 'bg-primary text-white'
                    : i === currentStepIdx
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-[#E8E8E8] text-outline'
                }`}>
                  {i < currentStepIdx
                    ? <span className="material-symbols-outlined text-[12px]">check</span>
                    : i + 1
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px transition-colors ${i < currentStepIdx ? 'bg-primary' : 'bg-[#E2E2E2]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ── 히어로 (선택 단계에서만) ── */}
        {step === 'select' && (
          <section className="px-6 pt-10 pb-6 md:pt-14 md:pb-8">
            <span className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-primary" />
              <p className="font-headline text-primary uppercase tracking-[0.25em] text-[10px] font-bold">POD Publishing</p>
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-2">
              나의 이야기를<br className="md:hidden" /> 책으로
            </h2>
            <p className="text-sm text-outline leading-relaxed max-w-md">
              기록한 일기와 편지를 한 권의 아름다운 종이책으로 만들어드립니다.
            </p>

            {/* 통계 배너 */}
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-outline">선택된 글 <strong className="text-on-surface">{selectedIds.length}편</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/40" />
                <span className="text-sm text-outline">예상 페이지 <strong className="text-on-surface">{pageCount}p</strong></span>
              </div>
            </div>
          </section>
        )}

        {/* ── 단계별 헤더 (미리보기·주문) ── */}
        {step !== 'select' && (
          <div className="px-6 pt-8 pb-4">
            <p className="text-[10px] tracking-[0.22em] font-bold text-outline uppercase font-headline mb-1">
              {STEP_LABELS[step]}
            </p>
            <h2 className="text-2xl font-bold text-on-surface font-headline">
              {step === 'preview' ? '책 미리보기' : '주문 / 결제'}
            </h2>
          </div>
        )}

        {/* ── 콘텐츠 ── */}
        <div className="px-6 pb-32">
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
                title={
                  publishType === 'dear' ? '편지 모음집' : 
                  publishType === 'mystory' ? '나의 자서전' : 
                  '나의 이야기'
                }
              />
              <div className="text-center text-xs text-outline">
                총 {pageCount}페이지 예상 · {selectedEntries.length}편 수록
              </div>
              <button
                onClick={() => setStep('order')}
                className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-[#004c82] transition-colors"
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
    </div>
  )
}
