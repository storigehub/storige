'use client'

import { useRouter } from 'next/navigation'
import { useMystorySessions } from '@/hooks/useMystory'
import { TOPIC_QUESTIONS, CATEGORY_GROUPS } from '@/lib/mystory/questions'
import TopicCard from '@/components/mystory/TopicCard'

export default function MystoryPage() {
  const router = useRouter()
  const { sessions, loading } = useMystorySessions()

  const completedCount = sessions.filter(s => s.status === 'completed').length

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 히어로 */}
      <section className="bg-[#0061A5] text-white px-6 pt-12 pb-8">
        <p className="text-[10px] uppercase tracking-widest text-white/60 font-medium mb-2">AI 자서전</p>
        <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-2">
          나의 이야기
        </h1>
        <p className="text-white/80 text-sm leading-relaxed">
          AI 인터뷰어와 대화하며 당신만의<br />소중한 이야기를 기록하세요
        </p>

        {/* 완성 현황 */}
        <div className="mt-5 bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">완성된 챕터</span>
            <span className="text-sm font-bold">{completedCount} / {TOPIC_QUESTIONS.length}</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.round((completedCount / TOPIC_QUESTIONS.length) * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* 완성 원고 보기 버튼 */}
      {completedCount > 0 && (
        <div className="px-4 pt-4">
          <button
            onClick={() => router.push('/mystory/preview')}
            className="w-full bg-[#FFFFFF] rounded-[1.25rem] p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D2E4FF] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0061A5] text-xl">menu_book</span>
              </div>
              <div className="text-left">
                <p className="text-[#1A1C1C] font-semibold text-sm">완성된 자서전 보기</p>
                <p className="text-[#747878] text-xs">{completedCount}개 챕터 완성</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#747878]">chevron_right</span>
          </button>
        </div>
      )}

      {/* 카테고리별 토픽 목록 */}
      <div className="px-4 py-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <span className="material-symbols-outlined animate-spin text-[#0061A5]">progress_activity</span>
          </div>
        ) : (
          CATEGORY_GROUPS.map(group => {
            const topics = TOPIC_QUESTIONS.filter(t => group.ids.includes(t.id))
            return (
              <div key={group.label}>
                <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium mb-3 px-1">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {topics.map(topic => {
                    const session = sessions.find(s => s.topic_id === topic.id) ?? null
                    return <TopicCard key={topic.id} topic={topic} session={session} />
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
