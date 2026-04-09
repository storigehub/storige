'use client'

import { useRouter } from 'next/navigation'
import type { TopicQuestion } from '@/lib/mystory/questions'
import type { MystorySession } from '@/types/database'

interface TopicCardProps {
  topic: TopicQuestion
  session?: MystorySession | null
}

export default function TopicCard({ topic, session }: TopicCardProps) {
  const router = useRouter()

  const statusLabel = session?.status === 'completed'
    ? '완성'
    : session?.status === 'in_progress'
    ? '진행중'
    : null

  const statusColor = session?.status === 'completed'
    ? 'bg-[#D2E4FF] text-[#0061A5]'
    : 'bg-[#FFF3CD] text-[#856404]'

  return (
    <button
      onClick={() => router.push(`/mystory/${topic.id}`)}
      className="w-full text-left bg-[#FFFFFF] rounded-[1.25rem] p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{topic.categoryEmoji}</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#747878]">
              {topic.category}
            </span>
          </div>
          <p className="text-[#1A1C1C] font-semibold text-base leading-snug">{topic.title}</p>
          <p className="text-[#444748] text-sm mt-1">{topic.questions.length}개 질문</p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {statusLabel && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          )}
          {session?.word_count ? (
            <span className="text-[11px] text-[#747878]">{session.word_count}자</span>
          ) : null}
        </div>
      </div>

      {/* 진행 바 */}
      {session?.status === 'in_progress' && (
        <div className="mt-3 h-1 bg-[#E2E2E2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0061A5] rounded-full transition-all"
            style={{
              width: `${Math.min(100, Math.round(
                (session.messages.filter(m => m.role === 'user').length / topic.questions.length) * 100
              ))}%`
            }}
          />
        </div>
      )}

      {session?.status === 'completed' && (
        <div className="mt-3 h-1 bg-[#D2E4FF] rounded-full overflow-hidden">
          <div className="h-full w-full bg-[#0061A5] rounded-full" />
        </div>
      )}
    </button>
  )
}
