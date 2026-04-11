'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useMystoryInterview } from '@/hooks/useMystory'
import { useSpeechSTT } from '@/hooks/useSpeechSTT'
import { useMystoryPhoto } from '@/hooks/useMystoryPhoto'
import type { TopicQuestion } from '@/lib/mystory/questions'

interface InterviewChatProps {
  topic: TopicQuestion
}

export default function InterviewChat({ topic }: InterviewChatProps) {
  const { session, loading, sending, generating, sendAnswer, generateManuscript } = useMystoryInterview(topic.id)
  const [input, setInput] = useState('')
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null) // 첨부 대기 사진 URL
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 한글 IME 조합 중 Enter 이중 전송 방지
  const composingRef = useRef(false)

  // 음성 인식 — 전사 결과를 입력창에 append
  const handleTranscribed = useCallback((text: string) => {
    setInput(prev => prev ? `${prev} ${text}` : text)
  }, [])
  const { isRecording, isSupported, toggleRecording } = useSpeechSTT(handleTranscribed)

  // 사진 업로드
  const { uploading, uploadPhoto } = useMystoryPhoto()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  const handleSend = async () => {
    if ((!input.trim() && !pendingPhoto) || sending) return
    const text = input
    const photo = pendingPhoto
    setInput('')
    setPendingPhoto(null)
    await sendAnswer(text, photo ?? undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !composingRef.current) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !session) return
    // 파일 입력 초기화 (같은 파일 재선택 허용)
    e.target.value = ''

    const url = await uploadPhoto(file, session.id)
    if (url) setPendingPhoto(url)
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
              className={`max-w-[78%] rounded-2xl text-sm leading-relaxed overflow-hidden ${
                msg.role === 'user'
                  ? 'bg-[#0061A5] text-white rounded-br-sm'
                  : 'bg-[#FFFFFF] text-[#1A1C1C] shadow-sm rounded-bl-sm'
              }`}
            >
              {/* 첨부 사진 */}
              {msg.photo_url && (
                <div className="relative w-full aspect-video max-w-[240px]">
                  <Image
                    src={msg.photo_url}
                    alt="첨부 사진"
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>
              )}
              {msg.content && (
                <div className="px-4 py-3">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {(sending || uploading) && (
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
              <span className={`material-symbols-outlined text-base ${generating ? 'animate-spin' : ''}`}>
                {generating ? 'progress_activity' : 'auto_stories'}
              </span>
              {generating ? '원고 생성 중...' : '자서전 원고 생성하기'}
            </button>
          )}

          {/* 첨부 사진 미리보기 */}
          {pendingPhoto && (
            <div className="relative mb-2 w-20 h-20 rounded-xl overflow-hidden border border-[#C4C7C7]/30">
              <Image src={pendingPhoto} alt="첨부 사진" fill className="object-cover" sizes="80px" />
              <button
                onClick={() => setPendingPhoto(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-white text-[12px]">close</span>
              </button>
            </div>
          )}

          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => { composingRef.current = true }}
              onCompositionEnd={() => { composingRef.current = false }}
              placeholder={isRecording ? '듣는 중...' : '이야기를 들려주세요...'}
              rows={2}
              className="flex-1 resize-none bg-[#F3F3F3] rounded-[0.625rem] px-4 py-3 text-sm text-[#1A1C1C] placeholder-[#747878] outline-none focus:ring-2 focus:ring-[#0061A5]/20"
            />

            {/* 사진 첨부 버튼 */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="사진 첨부"
              className="w-10 h-10 bg-[#F3F3F3] hover:bg-[#E8E8E8] rounded-full flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[#747878] text-base">
                {uploading ? 'progress_activity' : 'add_photo_alternate'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoSelect}
            />

            {/* 음성 입력 버튼 — Web Speech API 지원 브라우저만 표시 */}
            {isSupported && (
              <button
                onClick={toggleRecording}
                title={isRecording ? '음성 인식 중지' : '음성으로 입력'}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isRecording
                    ? 'bg-[#E91E63] animate-pulse'
                    : 'bg-[#F3F3F3] hover:bg-[#E8E8E8]'
                }`}
              >
                <span className={`material-symbols-outlined text-base ${isRecording ? 'text-white' : 'text-[#747878]'}`}>
                  {isRecording ? 'mic' : 'mic_none'}
                </span>
              </button>
            )}

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !pendingPhoto) || sending || uploading}
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
