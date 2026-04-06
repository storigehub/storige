'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EntryWithMedia } from '@/hooks/useDiaryList'
import { formatMonth } from '@/lib/utils/date'

interface DiaryCalendarViewProps {
  entries: EntryWithMedia[]
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

// 캘린더 뷰 — 월별 달력에 일기 유무 표시
export function DiaryCalendarView({ entries }: DiaryCalendarViewProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  // 현재 달에 일기가 있는 날짜 Set
  const entriesSet = new Set(
    entries
      .filter((e) => {
        const d = new Date(e.created_at)
        return (
          d.getFullYear() === currentDate.getFullYear() &&
          d.getMonth() === currentDate.getMonth()
        )
      })
      .map((e) => new Date(e.created_at).getDate())
  )

  // 달력 날짜 배열 생성
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startPad = firstDay.getDay() // 첫 번째 날의 요일 (빈 칸 수)
  const totalDays = lastDay.getDate()

  const calDays: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()

  const handleDayClick = (day: number) => {
    const entry = entries.find((e) => {
      const d = new Date(e.created_at)
      return (
        d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getDate() === day
      )
    })
    if (entry) router.push(`/diary/${entry.id}`)
  }

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  return (
    <div className="px-4 py-3">
      {/* 월 이동 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-[#888]">
          ‹
        </button>
        <span className="text-base font-semibold text-[#1A1A1A]">
          {formatMonth(currentDate)}
        </span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-[#888]">
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${d === '일' ? 'text-[#FF4757]' : d === '토' ? 'text-[#4A90D9]' : 'text-[#888]'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {calDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center py-1">
            {day ? (
              <button
                onClick={() => entriesSet.has(day) && handleDayClick(day)}
                className={`w-8 h-8 rounded-full flex flex-col items-center justify-center relative transition-colors
                  ${isToday(day) ? 'bg-[#4A90D9] text-white' : 'text-[#1A1A1A]'}
                  ${entriesSet.has(day) && !isToday(day) ? 'font-semibold' : ''}
                `}
              >
                <span className="text-xs">{day}</span>
                {/* 일기 있음 표시 점 */}
                {entriesSet.has(day) && (
                  <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isToday(day) ? 'bg-white' : 'bg-[#4A90D9]'}`} />
                )}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
