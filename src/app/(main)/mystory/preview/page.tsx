'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMystorySessions, useMystoryShare } from '@/hooks/useMystory'
import { getTopicById } from '@/lib/mystory/questions'
import type { MystorySession } from '@/types/database'
import type { TopicQuestion } from '@/lib/mystory/questions'

export default function MystoryPreviewPage() {
  const router = useRouter()
  const { sessions, loading, refetch } = useMystorySessions()
  const { sharing, createShareLink, revokeShareLink } = useMystoryShare()
  const [view, setView] = useState<'scroll' | 'accordion'>('scroll')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const completedSessions = sessions.filter(s => s.status === 'completed' && s.generated_text)
  // 이미 공유 토큰이 있는 경우 기존 URL 표시
  const existingToken = completedSessions.find(s => s.share_token)?.share_token ?? null

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (existingToken) {
      // 이미 공유 중 → URL 표시
      setShareUrl(`${window.location.origin}/mystory/share/${existingToken}`)
      return
    }
    const ids = completedSessions.map(s => s.id)
    const token = await createShareLink(ids)
    if (token) {
      const url = `${window.location.origin}/mystory/share/${token}`
      setShareUrl(url)
      await refetch()
    }
  }

  const handleRevokeShare = async () => {
    const ids = completedSessions.map(s => s.id)
    await revokeShareLink(ids)
    setShareUrl(null)
    await refetch()
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="material-symbols-outlined animate-spin text-[#0061A5]">progress_activity</span>
      </div>
    )
  }

  return (
    <>
      {/* 인쇄용 CSS */}
      <style>{`
        @media print {
          body > *:not(#mystory-print-area) { display: none !important; }
          #mystory-print-area {
            display: block !important;
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            background: white;
            z-index: 9999;
            padding: 20mm;
            font-family: 'Pretendard Variable', serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #1A1C1C;
          }
          #mystory-print-area h1 {
            font-size: 24pt;
            font-weight: 800;
            margin-bottom: 8mm;
          }
          #mystory-print-area h2 {
            font-size: 16pt;
            font-weight: 700;
            margin-top: 12mm;
            margin-bottom: 4mm;
            page-break-after: avoid;
          }
          #mystory-print-area p {
            margin-bottom: 4mm;
          }
          #mystory-print-area .chapter {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* 인쇄 전용 숨김 영역 */}
      <div id="mystory-print-area" className="hidden">
        <h1>나의 자서전</h1>
        {completedSessions.map(session => {
          const topic = getTopicById(session.topic_id)
          return (
            <div key={session.id} className="chapter">
              <h2>{topic?.title ?? session.topic_id}</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{session.generated_text}</p>
            </div>
          )
        })}
      </div>

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
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium">나의 자서전</p>
              <h1 className="text-lg font-bold text-[#1A1C1C]">완성된 원고</h1>
            </div>
            {/* 뷰 전환 + PDF 버튼 */}
            <div className="flex items-center gap-2">
              <div className="flex bg-[#F3F3F3] rounded-xl p-1">
                <button
                  onClick={() => setView('scroll')}
                  title="스크롤 뷰"
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    view === 'scroll' ? 'bg-white shadow-sm' : 'hover:bg-[#E8E8E8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#444748] text-base">view_agenda</span>
                </button>
                <button
                  onClick={() => setView('accordion')}
                  title="목록 뷰"
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    view === 'accordion' ? 'bg-white shadow-sm' : 'hover:bg-[#E8E8E8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#444748] text-base">format_list_bulleted</span>
                </button>
              </div>
              {completedSessions.length > 0 && (
                <>
                  <button
                    onClick={handleShare}
                    disabled={sharing}
                    title="공유 링크 생성"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#F3F3F3] hover:bg-[#E8E8E8] text-[#444748] rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    공유
                  </button>
                  <button
                    onClick={handlePrint}
                    title="PDF로 저장 / 인쇄"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#0061A5] text-white rounded-xl text-xs font-semibold hover:bg-[#004c82] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                    PDF
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 공유 링크 패널 */}
        {shareUrl && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4">
            <div className="bg-[#F0F7FF] border border-[#0061A5]/20 rounded-[1.25rem] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="material-symbols-outlined text-[#0061A5] shrink-0">link</span>
              <p className="flex-1 text-[#1A1C1C] text-sm font-mono break-all">{shareUrl}</p>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0061A5] text-white rounded-lg text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? '복사됨' : '복사'}
                </button>
                <button
                  onClick={handleRevokeShare}
                  disabled={sharing}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#F3F3F3] text-[#747878] rounded-lg text-xs font-semibold hover:bg-[#E8E8E8]"
                >
                  <span className="material-symbols-outlined text-sm">link_off</span>
                  해제
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={printRef} className="max-w-4xl mx-auto">
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
          ) : view === 'scroll' ? (
            /* 스크롤 북 리더 뷰 */
            <div className="px-4 md:px-8 py-8 space-y-12">
              {/* 표지 */}
              <div className="text-center py-12 border-b border-[#C4C7C7]/20">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-medium mb-4">나의 자서전</p>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1A1C1C] tracking-tight">
                  나의 이야기
                </h2>
                <p className="text-[#747878] text-sm mt-3">{completedSessions.length}개 챕터 완성</p>
              </div>

              {/* 출판 CTA */}
              {completedSessions.length >= 3 && (
                <div className="bg-gradient-to-br from-[#0061A5] to-[#004c82] rounded-[1.5rem] p-6 md:p-8 text-white text-center shadow-lg">
                  <span className="material-symbols-outlined text-4xl mb-3 block opacity-90">menu_book</span>
                  <h3 className="font-headline text-xl font-bold mb-2">종이책으로 출판하기</h3>
                  <p className="text-white/80 text-sm mb-4 max-w-sm mx-auto">
                    완성된 자서전을 실제 종이책으로 만들어보세요.<br />
                    가족에게 드리는 세상에 하나뿐인 선물입니다.
                  </p>
                  <button
                    onClick={() => router.push('/publish')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0061A5] rounded-xl font-bold text-sm hover:bg-[#F0F7FF] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    출판 신청하기 — 39,000원~
                  </button>
                </div>
              )}

              {/* 챕터별 본문 */}
              {completedSessions.map((session, idx) => {
                const topic = getTopicById(session.topic_id)
                return (
                  <article key={session.id} className="bg-white rounded-[1.5rem] shadow-sm p-6 md:p-10">
                    {/* 챕터 헤더 */}
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#C4C7C7]/20">
                      <span className="font-headline text-5xl font-extrabold text-[#0061A5]/15 leading-none select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-medium mb-1">
                          {topic?.category ?? session.topic_category}
                        </p>
                        <h3 className="font-headline text-xl font-bold text-[#1A1C1C]">
                          {topic?.title ?? session.topic_id}
                        </h3>
                        <p className="text-[#747878] text-xs mt-1">{session.word_count.toLocaleString()}자</p>
                      </div>
                    </div>

                    {/* 본문 */}
                    <div className="prose prose-sm max-w-none text-[#1A1C1C] leading-[1.9] text-[15px]">
                      {session.generated_text?.split('\n').map((para, i) =>
                        para.trim() ? (
                          <p key={i} className="mb-4">{para}</p>
                        ) : null
                      )}
                    </div>

                    {/* 이어쓰기 링크 */}
                    <button
                      onClick={() => router.push(`/mystory/${session.topic_id}`)}
                      className="mt-6 text-[#0061A5] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      인터뷰 이어하기
                    </button>
                  </article>
                )
              })}
            </div>
          ) : (
            /* 아코디언 목록 뷰 */
            <div className="px-4 py-4 space-y-3">
              {completedSessions.map(session => {
                const topic = getTopicById(session.topic_id)
                return (
                  <AccordionChapter
                    key={session.id}
                    session={session}
                    topic={topic}
                    onEdit={() => router.push(`/mystory/${session.topic_id}`)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// 아코디언 챕터 컴포넌트
function AccordionChapter({
  session,
  topic,
  onEdit,
}: {
  session: MystorySession
  topic: TopicQuestion | undefined
  onEdit: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-[1.25rem] shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-[#F0F7FF] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#0061A5] text-lg">auto_stories</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium">
              {topic?.category ?? session.topic_category}
            </p>
            <p className="text-[#1A1C1C] font-semibold">{topic?.title ?? session.topic_id}</p>
            <p className="text-[#747878] text-xs mt-0.5">{session.word_count.toLocaleString()}자</p>
          </div>
        </div>
        <span className={`material-symbols-outlined text-[#747878] transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="h-px bg-[#C4C7C7]/30 mb-4" />
          <div className="text-[#1A1C1C] text-sm leading-relaxed">
            {session.generated_text?.split('\n').map((para, i) =>
              para.trim() ? <p key={i} className="mb-3">{para}</p> : null
            )}
          </div>
          <button
            onClick={onEdit}
            className="mt-4 text-[#0061A5] text-sm font-medium flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            인터뷰 이어하기
          </button>
        </div>
      )}
    </div>
  )
}
