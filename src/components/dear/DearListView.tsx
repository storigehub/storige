'use client'

import { useState, useMemo } from 'react'
import { useDiaryList } from '@/hooks/useDiaryList'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { DearAccordionItem } from './DearAccordionItem'
import { formatMonth } from '@/lib/utils/date'
import type { FamilyMember } from '@/types/database'

/**
 * Dear My Son 편지 목록 뷰 — dear_my_son_2 공식 기준
 * 수신자 필터 탭 (전체 / 구성원별) + 월별 그룹 + 아코디언
 */
export function DearListView() {
  const { entries, loading, error, deleteEntry } = useDiaryList({ journalType: 'dear' })
  const { members } = useFamilyMembers()
  const [openId, setOpenId] = useState<string | null>(null)
  const [filterRecipientId, setFilterRecipientId] = useState<string | null>(null)

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

  const getMember = (recipientId: string | null): FamilyMember | undefined =>
    members.find((m) => m.id === recipientId)

  // 필터 적용
  const filteredEntries = useMemo(() => {
    if (!filterRecipientId) return entries
    return entries.filter((e) => e.recipient_id === filterRecipientId)
  }, [entries, filterRecipientId])

  // 수신자별 편지 수 집계
  const recipientCounts = useMemo(() => {
    const map: Record<string, number> = {}
    entries.forEach((e) => {
      if (e.recipient_id) {
        map[e.recipient_id] = (map[e.recipient_id] ?? 0) + 1
      }
    })
    return map
  }, [entries])

  // 편지가 있는 수신자만 필터 탭에 표시
  const recipientsWithLetters = useMemo(
    () => members.filter((m) => (recipientCounts[m.id] ?? 0) > 0),
    [members, recipientCounts]
  )

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-dear border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-sm text-[#888]">{error}</div>
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4">
        <span className="material-symbols-outlined text-5xl text-dear" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>mail</span>
        <h2 className="text-lg font-semibold text-on-surface font-headline">첫 번째 편지를 써보세요</h2>
        <p className="text-sm text-outline">소중한 사람에게 마음을 전해보세요</p>
      </div>
    )
  }

  const grouped = groupByMonth(filteredEntries)

  return (
    <div>
      {/* 수신자 필터 탭 — dear_my_son_2 기준 */}
      {recipientsWithLetters.length > 0 && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setFilterRecipientId(null)}
            className={`flex-shrink-0 px-5 py-2 text-sm font-bold transition-all ${
              filterRecipientId === null
                ? 'text-dear border-b-2 border-dear'
                : 'text-outline border-b-2 border-transparent hover:text-on-surface'
            }`}
          >
            전체 <span className="ml-1 text-[11px] text-outline-variant">({entries.length})</span>
          </button>
          {recipientsWithLetters.map((member) => (
            <button
              key={member.id}
              onClick={() => setFilterRecipientId(member.id)}
              className={`flex-shrink-0 px-5 py-2 text-sm font-bold transition-all ${
                filterRecipientId === member.id
                  ? 'text-dear border-b-2 border-dear'
                  : 'text-outline border-b-2 border-transparent hover:text-on-surface'
              }`}
            >
              {member.name ?? member.role}에게
              <span className="ml-1 text-[11px] text-outline-variant">({recipientCounts[member.id] ?? 0})</span>
            </button>
          ))}
        </div>
      )}

      {/* 필터 결과 없음 */}
      {filteredEntries.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center gap-3 px-4">
          <span className="material-symbols-outlined text-4xl text-outline-variant">mail_off</span>
          <p className="text-sm text-outline">이 수신자에게 작성된 편지가 없습니다</p>
        </div>
      )}

      {/* 월별 그룹핑 */}
      {grouped.map(({ month, entries: monthEntries }) => (
        <div key={month}>
          <div className="flex items-center gap-3 py-4 mb-1">
            <span className="w-1.5 h-6 bg-dear rounded-full shrink-0" />
            <h3 className="font-headline text-[11px] font-bold text-outline uppercase tracking-[0.2em]">{month}</h3>
          </div>
          <div className="pb-4 space-y-2 pt-1">
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
