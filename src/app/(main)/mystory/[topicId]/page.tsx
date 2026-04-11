'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { getTopicById } from '@/lib/mystory/questions'
import InterviewChat from '@/components/mystory/InterviewChat'

interface Props {
  params: Promise<{ topicId: string }>
}

export default function MystoryInterviewPage({ params }: Props) {
  const { topicId } = use(params)
  const router = useRouter()
  const topic = getTopicById(topicId)

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[#747878]">존재하지 않는 토픽입니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#F9F9F9]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-[#C4C7C7]/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F3F3F3]"
        >
          <span className="material-symbols-outlined text-[#1A1C1C]">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0061A5] text-[18px]">{topic.categoryIcon}</span>
            <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium">
              {topic.category}
            </p>
          </div>
          <h1 className="text-base font-bold text-[#1A1C1C] truncate">{topic.title}</h1>
        </div>
        </div>
      </header>

      {/* 인터뷰 챗 */}
      <div className="flex-1 overflow-hidden max-w-3xl mx-auto w-full">
        <InterviewChat topic={topic} />
      </div>
    </div>
  )
}
