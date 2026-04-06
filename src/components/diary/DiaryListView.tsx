'use client'

import { useState } from 'react'
import { useDiaryList } from '@/hooks/useDiaryList'
import { DiaryAccordionItem } from './DiaryAccordionItem'
import { formatMonth } from '@/lib/utils/date'

interface DiaryListViewProps {
  searchQuery?: string
}

// 일기 목록 뷰 — 월별 그룹 + 아코디언
export function DiaryListView({ searchQuery }: DiaryListViewProps) {
  const { entries, loading, error, toggleFavorite, deleteEntry } = useDiaryList({ searchQuery })
  const [openId, setOpenId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
    // 열린 항목으로 부드럽게 스크롤
    if (openId !== id) {
      setTimeout(() => {
        document.getElementById(`entry-${id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 50)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#4A90D9] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-sm text-[#888]">{error}</div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4">
        <div className="text-5xl">📓</div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          {searchQuery ? '검색 결과가 없습니다' : '첫 번째 일기를 작성해보세요'}
        </h2>
        <p className="text-sm text-[#888]">
          {searchQuery ? '다른 검색어를 시도해보세요' : '우측 하단 + 버튼을 눌러 시작하세요'}
        </p>
      </div>
    )
  }

  // 월별 그룹핑
  const grouped = groupByMonth(entries)

  return (
    <div>
      {grouped.map(({ month, entries: monthEntries }) => (
        <div key={month}>
          <div className="px-4 py-2 text-sm font-medium text-[#888] bg-[#FAFAFA]">
            {month}
          </div>
          {monthEntries.map((entry) => (
            <DiaryAccordionItem
              key={entry.id}
              entry={entry}
              isOpen={openId === entry.id}
              onToggle={() => handleToggle(entry.id)}
              onFavoriteToggle={() => toggleFavorite(entry.id, entry.is_favorite)}
              onDelete={() => deleteEntry(entry.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function groupByMonth(entries: ReturnType<typeof useDiaryList>['entries']) {
  const map = new Map<string, typeof entries>()

  entries.forEach((entry) => {
    const month = formatMonth(new Date(entry.created_at))
    if (!map.has(month)) map.set(month, [])
    map.get(month)!.push(entry)
  })

  return Array.from(map.entries()).map(([month, entries]) => ({ month, entries }))
}
