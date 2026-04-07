'use client'

import { useState } from 'react'
import { useDiaryList } from '@/hooks/useDiaryList'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { DearAccordionItem } from './DearAccordionItem'
import { formatMonth } from '@/lib/utils/date'
import type { FamilyMember } from '@/types/database'

// Dear My Son 편지 목록 뷰 — 월별 그룹 + 아코디언
export function DearListView() {
  const { entries, loading, error, deleteEntry } = useDiaryList({ journalType: 'dear' })
  const { members } = useFamilyMembers()
  const [openId, setOpenId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
    if (openId !== id) {
      setTimeout(() => {
        document.getElementById(`dear-${id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 50)
    }
  }

  // recipient_id로 가족 구성원 찾기
  const getMember = (recipientId: string | null): FamilyMember | undefined =>
    members.find((m) => m.id === recipientId)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#006B5F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-sm text-[#888]">{error}</div>
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4">
        <span className="material-symbols-outlined text-5xl text-[#006B5F]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>mail</span>
        <h2 className="text-lg font-semibold text-[#1a1c1c] font-headline">첫 번째 편지를 써보세요</h2>
        <p className="text-sm text-[#747878]">소중한 사람에게 마음을 전해보세요</p>
      </div>
    )
  }

  // 월별 그룹핑
  const grouped = groupByMonth(entries)

  return (
    <div>
      {grouped.map(({ month, entries: monthEntries }) => (
        <div key={month}>
          <div className="flex items-center justify-between py-4 border-b border-[#c4c7c7]/30 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-8 bg-[#006B5F] rounded-full" />
              <h3 className="font-headline text-lg font-bold text-[#1a1c1c]">{month}</h3>
            </div>
          </div>
          <div className="px-4 pb-2 space-y-2 pt-2">
            {monthEntries.map((entry) => (
              <DearAccordionItem
                key={entry.id}
                entry={entry}
                isOpen={openId === entry.id}
                onToggle={() => handleToggle(entry.id)}
                onDelete={() => deleteEntry(entry.id)}
                recipient={getMember(entry.recipient_id)}
              />
            ))}
          </div>
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
