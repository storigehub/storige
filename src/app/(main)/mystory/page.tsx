'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMystorySessions } from '@/hooks/useMystory'
import { TOPIC_QUESTIONS, CATEGORY_GROUPS } from '@/lib/mystory/questions'
import TopicCard from '@/components/mystory/TopicCard'

// AI 자서전 메인 페이지 — Midnight Archive / PC 사이드바 + 토픽 그리드
export default function MystoryPage() {
  const router = useRouter()
  const { sessions, loading } = useMystorySessions()
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const completedCount = sessions.filter(s => s.status === 'completed').length
  const progressPct = Math.round((completedCount / TOPIC_QUESTIONS.length) * 100)

  const visibleGroups = activeGroup
    ? CATEGORY_GROUPS.filter(g => g.label === activeGroup)
    : CATEGORY_GROUPS

  return (
    <div className="max-w-6xl mx-auto">
      {/* 히어로 헤더 — Midnight Archive 스타일 */}
      <section className="px-6 pt-10 pb-6 md:pt-14 md:pb-8">
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-primary" />
          <p className="font-headline text-primary uppercase tracking-[0.25em] text-[10px] font-bold">AI Autobiography</p>
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-2">
          나의 이야기
        </h2>
        <p className="text-sm text-outline leading-relaxed max-w-md">
          AI 인터뷰어와 대화하며 당신만의 소중한 자서전을 완성하세요.
        </p>

        {/* 진행도 */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-outline uppercase tracking-wider">챕터 진행도</span>
              <span className="text-xs font-bold text-primary">{completedCount} / {TOPIC_QUESTIONS.length}</span>
            </div>
            <div className="h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          {completedCount > 0 && (
            <button
              onClick={() => router.push('/mystory/preview')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-[#004c82] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              자서전 보기
            </button>
          )}
        </div>
      </section>

      {/* PC: 2-col 레이아웃 / 모바일: 단일 컬럼 */}
      <div className="px-6 pb-32 flex gap-8">
        {/* 사이드바 — PC 카테고리 필터 */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20 space-y-1">
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-3 font-headline">카테고리</p>
            <button
              onClick={() => setActiveGroup(null)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeGroup === null
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-outline hover:text-on-surface hover:bg-[#F3F3F3]'
              }`}
            >
              전체
            </button>
            {CATEGORY_GROUPS.map(group => {
              const total = TOPIC_QUESTIONS.filter(t => group.ids.includes(t.id)).length
              const done = sessions.filter(s =>
                group.ids.includes(s.topic_id) && s.status === 'completed'
              ).length
              return (
                <button
                  key={group.label}
                  onClick={() => setActiveGroup(group.label)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    activeGroup === group.label
                      ? 'bg-primary-container text-primary font-bold'
                      : 'text-outline hover:text-on-surface hover:bg-[#F3F3F3]'
                  }`}
                >
                  <span>{group.label}</span>
                  {done > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      {done}/{total}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 모바일 카테고리 칩 */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveGroup(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeGroup === null ? 'bg-primary text-white' : 'bg-[#F3F3F3] text-outline'
              }`}
            >
              전체
            </button>
            {CATEGORY_GROUPS.map(group => (
              <button
                key={group.label}
                onClick={() => setActiveGroup(group.label)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeGroup === group.label ? 'bg-primary text-white' : 'bg-[#F3F3F3] text-outline'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* 토픽 목록 */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              {visibleGroups.map(group => {
                const topics = TOPIC_QUESTIONS.filter(t => group.ids.includes(t.id))
                return (
                  <div key={group.label}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-1.5 h-5 bg-primary rounded-full shrink-0" />
                      <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] font-headline">
                        {group.label}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {topics.map(topic => {
                        const session = sessions.find(s => s.topic_id === topic.id) ?? null
                        return <TopicCard key={topic.id} topic={topic} session={session} />
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
