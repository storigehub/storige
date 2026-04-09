'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { DiaryListView } from '@/components/diary/DiaryListView'
import { DiaryCalendarView } from '@/components/diary/DiaryCalendarView'
import { DiaryMediaView } from '@/components/diary/DiaryMediaView'
import { DiaryMapView } from '@/components/diary/DiaryMapView'
import { DiarySearchBar } from '@/components/diary/DiarySearchBar'
import { useDiaryList } from '@/hooks/useDiaryList'
import { useWritingSuggestions } from '@/hooks/useAI'

const TABS = ['요약', '목록', '캘린더', '미디어', '지도'] as const
type Tab = typeof TABS[number]

/**
 * 일기 메인 페이지 — Midnight Archive / _5 템플릿 기준
 * 히어로 헤더 + 탭(border-b 2px cobalt 언더라인) + 5개 뷰
 */
export default function DiaryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('목록')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const { entries } = useDiaryList()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* 히어로 헤더 — 그라디언트 레이블 + 대형 타이포 */}
      <section className="px-6 pt-10 pb-6 md:pt-14 md:pb-8">
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-primary" />
          <p className="font-headline text-primary uppercase tracking-[0.25em] text-[10px] font-bold">오늘의 성찰</p>
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-1">
          나의 살아있는 유산
        </h2>
        <p className="text-sm text-outline mt-2 leading-relaxed">기억을 기록하고, 이야기를 이어가세요.</p>
      </section>

      {/* 탭 + 뷰 전환 — _5 tab-active 스타일 */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-headline text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-outline font-semibold hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* 뷰 전환 버튼 — 목록 탭에서만, 모바일+데스크탑 모두 */}
        {activeTab === '목록' && (
          <div className="flex items-center bg-surface-container-low rounded-lg p-1 ml-4 self-center mb-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
              aria-label="목록 보기"
            >
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
              aria-label="그리드 보기"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
          </div>
        )}
      </div>

      {/* 검색 바 — 목록 탭 */}
      {activeTab === '목록' && (
        <div className="px-6 pt-2">
          <DiarySearchBar onSearch={setSearchQuery} />
        </div>
      )}

      {/* 탭 콘텐츠 */}
      <div className="px-6">
        {activeTab === '요약' && <DiarySummaryView entries={entries} />}
        {activeTab === '목록' && <DiaryListView searchQuery={searchQuery} viewMode={viewMode} />}
        {activeTab === '캘린더' && <DiaryCalendarView entries={entries} />}
        {activeTab === '미디어' && <DiaryMediaView entries={entries} />}
        {activeTab === '지도' && <DiaryMapView entries={entries} />}
      </div>
    </div>
  )
}

// 요약 뷰 — AI 글감 제안 + 통계 카드
function DiarySummaryView({ entries }: { entries: ReturnType<typeof useDiaryList>['entries'] }) {
  const { prompts, loading: suggestLoading, error: suggestError, suggest } = useWritingSuggestions()
  const [prompted, setPrompted] = useState(false)

  const thisMonth = entries.filter((e) => {
    const d = new Date(e.created_at)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })

  const recentTitles = entries.slice(0, 5).map(e => e.title ?? '').filter(Boolean)

  const handleSuggest = async () => {
    setPrompted(true)
    await suggest(recentTitles)
  }

  return (
    <div className="py-6 space-y-4">
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: '전체 일기', value: entries.length, color: '#0061A5', bg: 'bg-primary-container' },
          { label: '이번 달', value: thisMonth.length, color: '#006B5F', bg: 'bg-[#E8F5F3]' },
          { label: '즐겨찾기', value: entries.filter((e) => e.is_favorite).length, color: '#f59e0b', bg: 'bg-yellow-50' },
          { label: '사진', value: entries.reduce((acc, e) => acc + e.media.filter((m) => m.media_type === 'photo').length, 0), color: '#E91E63', bg: 'bg-pink-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-5 shadow-sm`}>
            <p className="font-headline text-[10px] text-outline uppercase tracking-widest mb-2">{label}</p>
            <p className="text-4xl font-extrabold font-headline leading-none" style={{ color }}>
              {value}
              <span className="text-sm font-medium text-outline-variant ml-1">건</span>
            </p>
          </div>
        ))}
      </div>

      {/* AI 글감 제안 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">AI 글감 제안</p>
              <p className="text-[10px] text-outline">오늘 무엇을 기록할까요?</p>
            </div>
          </div>
          <button
            onClick={handleSuggest}
            disabled={suggestLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
          >
            {suggestLoading
              ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              : <span className="material-symbols-outlined text-sm">refresh</span>
            }
            {prompted ? '다시 제안' : '글감 받기'}
          </button>
        </div>

        {suggestError && <p className="text-xs text-error">{suggestError}</p>}

        {!prompted && !suggestLoading && prompts.length === 0 && (
          <p className="text-sm text-outline text-center py-4">버튼을 눌러 오늘의 글감을 받아보세요.</p>
        )}

        {prompts.length > 0 && (
          <div className="space-y-2">
            {prompts.map((prompt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
                <span className="text-xs font-bold text-primary w-5 h-5 rounded-full bg-primary-container flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-on-surface leading-relaxed flex-1">{prompt}</p>
                <span className="material-symbols-outlined text-[16px] text-outline opacity-0 group-hover:opacity-100 transition-opacity shrink-0">arrow_forward</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
