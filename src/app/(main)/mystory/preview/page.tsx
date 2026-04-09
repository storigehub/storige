'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMystorySessions } from '@/hooks/useMystory'
import { getTopicById } from '@/lib/mystory/questions'

export default function MystoryPreviewPage() {
  const router = useRouter()
  const { sessions, loading } = useMystorySessions()
  const [activeId, setActiveId] = useState<string | null>(null)

  const completedSessions = sessions.filter(s => s.status === 'completed' && s.generated_text)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="material-symbols-outlined animate-spin text-[#0061A5]">progress_activity</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-[#C4C7C7]/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F3F3F3]"
        >
          <span className="material-symbols-outlined text-[#1A1C1C]">arrow_back</span>
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium">나의 자서전</p>
          <h1 className="text-lg font-bold text-[#1A1C1C]">완성된 원고</h1>
        </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
      {completedSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 px-8 text-center">
          <span className="material-symbols-outlined text-[#C4C7C7] text-5xl mb-4">menu_book</span>
          <p className="text-[#444748] font-medium">아직 완성된 원고가 없습니다</p>
          <p className="text-[#747878] text-sm mt-1">인터뷰를 완료하고 원고를 생성해보세요</p>
          <button
            onClick={() => router.push('/mystory')}
            className="mt-4 px-5 py-2.5 bg-[#0061A5] text-white rounded-[0.625rem] text-sm font-semibold"
          >
            인터뷰 시작하기
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {completedSessions.map(session => {
            const topic = getTopicById(session.topic_id)
            const isActive = activeId === session.id
            return (
              <div
                key={session.id}
                className="bg-[#FFFFFF] rounded-[1.25rem] shadow-sm overflow-hidden"
              >
                {/* 챕터 헤더 */}
                <button
                  onClick={() => setActiveId(isActive ? null : session.id)}
                  className="w-full p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl">{topic?.categoryEmoji ?? '📖'}</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium">
                        {topic?.category ?? session.topic_category}
                      </p>
                      <p className="text-[#1A1C1C] font-semibold">{topic?.title ?? session.topic_id}</p>
                      <p className="text-[#747878] text-xs mt-0.5">{session.word_count}자</p>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[#747878] transition-transform ${isActive ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {/* 원고 본문 */}
                {isActive && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-[#C4C7C7]/30 mb-4" />
                    <p className="text-[#1A1C1C] text-sm leading-relaxed whitespace-pre-wrap">
                      {session.generated_text}
                    </p>
                    <button
                      onClick={() => router.push(`/mystory/${session.topic_id}`)}
                      className="mt-4 text-[#0061A5] text-sm font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      인터뷰 이어하기
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}
