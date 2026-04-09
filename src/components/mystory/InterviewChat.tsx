'use client'

import { useState, useRef, useEffect } from 'react'
import { useMystoryInterview } from '@/hooks/useMystory'
import type { TopicQuestion } from '@/lib/mystory/questions'

interface InterviewChatProps {
  topic: TopicQuestion
}

export default function InterviewChat({ topic }: InterviewChatProps) {
  const { session, loading, sending, generating, sendAnswer, generateManuscript } = useMystoryInterview(topic.id)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const text = input
    setInput('')
    await sendAnswer(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const userMsgCount = session?.messages.filter(m => m.role === 'user').length ?? 0
  const isComplete = userMsgCount >= topic.questions.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="material-symbols-outlined animate-spin text-[#0061A5]">progress_activity</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 진행 상태 */}
      <div className="px-4 py-3 bg-[#F3F3F3]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-widest text-[#747878] font-medium">진행도</span>
          <span className="text-[11px] text-[#0061A5] font-semibold">
            {Math.min(userMsgCount, topic.questions.length)} / {topic.questions.length}
          </span>
        </div>
        <div className="h-1 bg-[#E2E2E2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0061A5] rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.round((userMsgCount / topic.questions.length) * 100))}%` }}
          />
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {session?.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#0061A5] flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <span className="material-symbols-outlined text-white text-sm">auto_stories</span>
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0061A5] text-white rounded-br-sm'
                  : 'bg-[#FFFFFF] text-[#1A1C1C] shadow-sm rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[#0061A5] flex items-center justify-center shrink-0 mr-2">
              <span className="material-symbols-outlined text-white text-sm">auto_stories</span>
            </div>
            <div className="bg-[#FFFFFF] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-5">
                <span className="w-1.5 h-1.5 bg-[#747878] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-[#747878] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-[#747878] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      {session?.status !== 'completed' ? (
        <div className="px-4 pb-4 pt-2 border-t border-[#C4C7C7]/30">
          {isComplete && !session?.generated_text && (
            <button
              onClick={generateManuscript}
              disabled={generating}
              className="w-full mb-3 py-3 bg-[#0061A5] text-white rounded-[0.625rem] font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-base">
                {generating ? 'progress_activity' : 'auto_stories'}
              </span>
              {generating ? '원고 생성 중...' : '자서전 원고 생성하기'}
            </button>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="이야기를 들려주세요..."
              rows={2}
              className="flex-1 resize-none bg-[#F3F3F3] rounded-[0.625rem] px-4 py-3 text-sm text-[#1A1C1C] placeholder-[#747878] outline-none focus:ring-2 focus:ring-[#0061A5]/20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-10 h-10 bg-[#0061A5] rounded-full flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <span className="material-symbols-outlined text-white text-base">send</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-2">
          <div className="bg-[#D2E4FF] rounded-[0.625rem] p-4 text-center">
            <span className="material-symbols-outlined text-[#0061A5] text-2xl">check_circle</span>
            <p className="text-[#0061A5] font-semibold mt-1">원고가 완성되었습니다</p>
          </div>
        </div>
      )}
    </div>
  )
}
