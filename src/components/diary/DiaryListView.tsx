'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDiaryList } from '@/hooks/useDiaryList'
import { DiaryAccordionItem } from './DiaryAccordionItem'
import { formatMonth } from '@/lib/utils/date'
import { createClient } from '@/lib/supabase/client'

interface DiaryListViewProps {
  searchQuery?: string
  viewMode?: 'list' | 'grid'
}

// 일기 목록 뷰 — 월별 그룹 + 아코디언(list) 또는 그리드(grid)
export function DiaryListView({ searchQuery, viewMode = 'list' }: DiaryListViewProps) {
  const { entries, loading, error, toggleFavorite, deleteEntry } = useDiaryList({ searchQuery })
  const [openId, setOpenId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
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
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-sm text-[#888]">{error}</div>
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4">
        <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>book_2</span>
        <h2 className="text-lg font-semibold text-on-surface font-headline">
          {searchQuery ? '검색 결과가 없습니다' : '첫 번째 일기를 작성해보세요'}
        </h2>
        <p className="text-sm text-outline">
          {searchQuery ? '다른 검색어를 시도해보세요' : '우측 하단 + 버튼을 눌러 시작하세요'}
        </p>
      </div>
    )
  }

  const grouped = groupByMonth(entries)

  // 그리드 뷰
  if (viewMode === 'grid') {
    return <DiaryGridView entries={entries} grouped={grouped} />
  }

  // 리스트 뷰 (기본)
  return (
    <div>
      {grouped.map(({ month, entries: monthEntries }) => (
        <div key={month}>
          <div className="flex items-center gap-3 py-4 mb-1">
            <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
            <h3 className="font-headline text-[11px] font-bold text-outline uppercase tracking-[0.2em]">{month}</h3>
          </div>
          <div className="pb-4 space-y-2 pt-1">
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
        </div>
      ))}
    </div>
  )
}

/**
 * 그리드 뷰 — 오너 결정 반영:
 * PC(md+): _5 기준 — 2열 텍스트 카드 (날짜+제목+미리보기)
 * Mobile: _7 기준 — 이미지 풀블리드 카드 (사진 없으면 텍스트 폴백)
 */
function DiaryGridView({
  entries,
  grouped,
}: {
  entries: ReturnType<typeof useDiaryList>['entries']
  grouped: { month: string; entries: typeof entries }[]
}) {
  const router = useRouter()
  const supabase = createClient()
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

  return (
    <div>
      {grouped.map(({ month, entries: monthEntries }) => (
        <div key={month}>
          <div className="flex items-center gap-3 py-4 mb-1">
            <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
            <h3 className="font-headline text-[11px] font-bold text-outline uppercase tracking-[0.2em]">{month}</h3>
          </div>

          {/* Mobile: _7 이미지 카드 그리드 */}
          <div className="md:hidden grid grid-cols-1 gap-4 pb-4">
            {monthEntries.map((entry) => {
              const date = new Date(entry.created_at)
              const day = date.getDate()
              const mon = monthNames[date.getMonth()]
              const photoMedia = entry.media.filter((m) => m.media_type === 'photo')
              const photoUrl = photoMedia.length > 0
                ? supabase.storage.from('media').getPublicUrl(photoMedia[0].storage_path).data.publicUrl
                : null

              return (
                <article
                  key={entry.id}
                  className="relative rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 cursor-pointer"
                  style={{ minHeight: '200px' }}
                  onClick={() => router.push(`/diary/${entry.id}/edit`)}
                >
                  {photoUrl ? (
                    <>
                      {/* 이미지 풀블리드 + 그라디언트 오버레이 (_7) */}
                      <Image
                        src={photoUrl}
                        alt={entry.title ?? ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-surface-container-low" />
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    {/* 날짜 pill */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${photoUrl ? 'bg-primary text-white' : 'bg-white/80 text-primary'}`}>
                        {day} {mon}
                      </div>
                      {entry.location_name && (
                        <div className={`flex items-center gap-1 text-xs ${photoUrl ? 'text-white/80' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          <span>{entry.location_name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className={`font-headline font-bold text-lg leading-tight mb-1 ${photoUrl ? 'text-white' : 'text-on-surface'}`}>
                      {entry.title || '제목 없음'}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${photoUrl ? 'text-white/70' : 'text-outline'}`}>
                      {entry.content_text}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Desktop(md+): _5 기준 2열 텍스트 카드 */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {monthEntries.map((entry) => {
              const date = new Date(entry.created_at)
              const day = date.getDate()
              const mon = monthNames[date.getMonth()]

              return (
                <div
                  key={entry.id}
                  className="bg-surface-container-low hover:bg-white hover:shadow-sm border border-transparent hover:border-outline-variant/30 rounded-xl p-5 cursor-pointer transition-all group"
                  onClick={() => router.push(`/diary/${entry.id}/edit`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-headline text-3xl font-extrabold text-primary leading-none">{day}</span>
                      <span className="font-headline text-[9px] uppercase tracking-widest text-outline block mt-0.5">{mon}</span>
                    </div>
                    {entry.weather && (
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                        {entry.weather.includes('맑') ? 'wb_sunny' : 'cloud'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline font-bold text-base text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {entry.title || '제목 없음'}
                  </h3>
                  <p className="text-sm text-outline line-clamp-2 leading-relaxed">{entry.content_text}</p>
                  {entry.location_name && (
                    <div className="flex items-center gap-1 mt-3 text-[10px] text-outline">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      <span>{entry.location_name}</span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 새 일기 CTA (_5 dashed 스타일) */}
            <div
              className="border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center p-6 text-outline hover:text-primary hover:border-primary transition-all cursor-pointer group"
              onClick={() => router.push('/diary/new')}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-2xl group-hover:scale-125 transition-transform">add_notes</span>
              </div>
              <p className="font-headline font-bold text-sm">새로운 순간 기록하기</p>
              <p className="text-[10px] uppercase tracking-widest mt-1">Write your legacy</p>
            </div>
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
