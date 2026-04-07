'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { DiaryListView } from '@/components/diary/DiaryListView'
import { DiaryCalendarView } from '@/components/diary/DiaryCalendarView'
import { DiaryMediaView } from '@/components/diary/DiaryMediaView'
import { DiaryMapView } from '@/components/diary/DiaryMapView'
import { DiarySearchBar } from '@/components/diary/DiarySearchBar'
import { useDiaryList } from '@/hooks/useDiaryList'

const TABS = ['요약', '목록', '캘린더', '미디어', '지도'] as const
type Tab = typeof TABS[number]

// 일기 메인 페이지 — 5개 탭 뷰
export default function DiaryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('목록')
  const [searchQuery, setSearchQuery] = useState('')
  const { entries } = useDiaryList()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div>
      {/* 탭 네비게이션 — Midnight Archive */}
      <div className="flex bg-white/80 backdrop-blur-sm overflow-x-auto border-b border-[#eeeeee] px-4 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#0061A5] text-[#0061A5] font-bold'
                : 'border-transparent text-[#747878]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 검색 바 — 목록 탭에서만 표시 */}
      {activeTab === '목록' && (
        <DiarySearchBar onSearch={setSearchQuery} />
      )}

      {/* 탭 콘텐츠 */}
      {activeTab === '요약' && (
        <DiarySummaryView entries={entries} />
      )}
      {activeTab === '목록' && (
        <DiaryListView searchQuery={searchQuery} />
      )}
      {activeTab === '캘린더' && (
        <DiaryCalendarView entries={entries} />
      )}
      {activeTab === '미디어' && (
        <DiaryMediaView entries={entries} />
      )}
      {activeTab === '지도' && (
        <DiaryMapView entries={entries} />
      )}
    </div>
  )
}

// 요약 뷰 (Phase 5 AI 기능 — 현재는 통계만)
function DiarySummaryView({ entries }: { entries: ReturnType<typeof useDiaryList>['entries'] }) {
  const thisMonth = entries.filter((e) => {
    const d = new Date(e.created_at)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#747878] uppercase tracking-wider font-medium">전체 일기</p>
          <p className="text-3xl font-bold font-headline text-[#0061A5] mt-1">{entries.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#747878] uppercase tracking-wider font-medium">이번 달</p>
          <p className="text-3xl font-bold font-headline text-[#006B5F] mt-1">{thisMonth.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#747878] uppercase tracking-wider font-medium">즐겨찾기</p>
          <p className="text-3xl font-bold font-headline text-[#f59e0b] mt-1">
            {entries.filter((e) => e.is_favorite).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#747878] uppercase tracking-wider font-medium">사진</p>
          <p className="text-3xl font-bold font-headline text-[#E91E63] mt-1">
            {entries.reduce((acc, e) => acc + e.media.filter((m) => m.media_type === 'photo').length, 0)}
          </p>
        </div>
      </div>

      <div className="bg-[#d2e4ff] rounded-2xl p-4 text-sm text-[#004375]">
        <span className="material-symbols-outlined text-[16px] align-middle mr-1">tips_and_updates</span>
        AI 요약 기능은 Phase 5에서 추가됩니다
      </div>
    </div>
  )
}
