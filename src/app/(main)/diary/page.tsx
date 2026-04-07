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
          <span className="w-5 h-px bg-[#0061A5]" />
          <p className="font-headline text-[#0061A5] uppercase tracking-[0.25em] text-[10px] font-bold">오늘의 성찰</p>
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1a1c1c] tracking-tight leading-[1.1] mb-1">
          나의 살아있는 유산
        </h2>
        <p className="text-sm text-[#747878] mt-2 leading-relaxed">기억을 기록하고, 이야기를 이어가세요.</p>
      </section>

      {/* 탭 + 뷰 전환 — _5 tab-active 스타일 */}
      <div className="flex items-center justify-between border-b border-[#c4c7c7]/30 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-headline text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-[#0061A5] font-bold border-b-2 border-[#0061A5]'
                  : 'text-[#747878] font-semibold hover:text-[#1a1c1c]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* 뷰 전환 버튼 — 목록 탭에서만, 모바일+데스크탑 모두 */}
        {activeTab === '목록' && (
          <div className="flex items-center bg-[#f3f3f3] rounded-lg p-1 ml-4 self-center mb-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-white text-[#0061A5] shadow-sm' : 'text-[#747878] hover:text-[#1a1c1c]'}`}
              aria-label="목록 보기"
            >
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-white text-[#0061A5] shadow-sm' : 'text-[#747878] hover:text-[#1a1c1c]'}`}
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

// 요약 뷰 — Phase 5 AI 기능 대비 통계 카드
function DiarySummaryView({ entries }: { entries: ReturnType<typeof useDiaryList>['entries'] }) {
  const thisMonth = entries.filter((e) => {
    const d = new Date(e.created_at)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })

  return (
    <div className="py-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: '전체 일기', value: entries.length, color: '#0061A5', border: '#0061A5' },
          { label: '이번 달', value: thisMonth.length, color: '#006B5F', border: '#006B5F' },
          { label: '즐겨찾기', value: entries.filter((e) => e.is_favorite).length, color: '#f59e0b', border: '#f59e0b' },
          { label: '사진', value: entries.reduce((acc, e) => acc + e.media.filter((m) => m.media_type === 'photo').length, 0), color: '#E91E63', border: '#E91E63' },
        ].map(({ label, value, color, border }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm" style={{ borderLeft: `3px solid ${border}` }}>
            <p className="font-headline text-[10px] text-[#747878] uppercase tracking-widest mb-2">{label}</p>
            <p className="text-4xl font-extrabold font-headline leading-none" style={{ color }}>
              {value}
              <span className="text-sm font-medium text-[#c4c7c7] ml-1">건</span>
            </p>
          </div>
        ))}
      </div>
      {/* AI 플레이스홀더 카드 — _5 dashed CTA 스타일 */}
      <div className="border-2 border-dashed border-[#c4c7c7]/40 rounded-xl flex flex-col items-center justify-center p-8 text-[#747878] hover:text-[#0061A5] hover:border-[#0061A5] transition-all cursor-pointer group bg-white/50">
        <div className="w-16 h-16 rounded-full bg-[#eeeeee] flex items-center justify-center mb-4 group-hover:bg-[#d2e4ff] transition-colors">
          <span className="material-symbols-outlined text-3xl group-hover:scale-125 transition-transform">tips_and_updates</span>
        </div>
        <p className="font-headline font-bold">AI 자서전 요약</p>
        <p className="text-[10px] uppercase tracking-widest mt-1">Phase 5에서 추가 예정</p>
      </div>
    </div>
  )
}
