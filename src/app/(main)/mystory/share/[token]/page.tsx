import { createClient } from '@/lib/supabase/server'
import { getTopicById } from '@/lib/mystory/questions'
import { notFound } from 'next/navigation'
import type { MystorySession, MystoryMessage } from '@/types/database'

interface Props {
  params: Promise<{ token: string }>
}

// 공유 토큰으로 자서전 공개 열람 — 인증 불필요
export default async function MystorySharePage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  // 같은 share_token을 가진 completed 세션 전체 조회
  const { data: rows } = await supabase
    .from('mystory_sessions')
    .select('*')
    .eq('share_token', token)
    .eq('status', 'completed')
    .order('created_at', { ascending: true })

  if (!rows || rows.length === 0) notFound()

  const sessions = rows.map(row => ({
    ...row,
    messages: Array.isArray(row.messages)
      ? (row.messages as unknown as MystoryMessage[])
      : [],
    status: row.status as MystorySession['status'],
  })) as MystorySession[]

  const totalWords = sessions.reduce((acc, s) => acc + s.word_count, 0)

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-[#C4C7C7]/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0061A5]">auto_stories</span>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#747878] font-medium">나의 자서전</p>
              <h1 className="text-base font-bold text-[#1A1C1C]">공유된 이야기</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#747878]">
            <span className="material-symbols-outlined text-sm">lock_open</span>
            <span className="text-xs">공개 열람</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-12">
        {/* 표지 */}
        <div className="text-center py-12 border-b border-[#C4C7C7]/20">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-[#0061A5]" />
            <p className="font-headline text-[#0061A5] uppercase tracking-[0.25em] text-[10px] font-bold">AI Autobiography</p>
            <span className="w-5 h-px bg-[#0061A5]" />
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1A1C1C] tracking-tight mb-3">
            나의 이야기
          </h2>
          <p className="text-[#747878] text-sm">
            {sessions.length}개 챕터 · {totalWords.toLocaleString()}자
          </p>
        </div>

        {/* 챕터별 본문 */}
        {sessions.map((session, idx) => {
          const topic = getTopicById(session.topic_id)
          return (
            <article key={session.id} className="bg-white rounded-[1.5rem] shadow-sm p-6 md:p-10">
              {/* 챕터 헤더 */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#C4C7C7]/20">
                <span className="font-headline text-5xl font-extrabold text-[#0061A5]/15 leading-none select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {topic && (
                      <span className="material-symbols-outlined text-[#0061A5] text-[16px]">
                        {topic.categoryIcon}
                      </span>
                    )}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-medium">
                      {topic?.category ?? session.topic_category}
                    </p>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-[#1A1C1C]">
                    {topic?.title ?? session.topic_id}
                  </h3>
                  <p className="text-[#747878] text-xs mt-1">{session.word_count.toLocaleString()}자</p>
                </div>
              </div>

              {/* 본문 */}
              <div className="text-[#1A1C1C] leading-[1.9] text-[15px] space-y-4">
                {session.generated_text?.split('\n').map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : null
                )}
              </div>
            </article>
          )
        })}

        {/* 푸터 */}
        <div className="text-center py-8 text-[#747878] text-xs space-y-2">
          <p>이 자서전은 Storige AI 자서전 서비스로 작성되었습니다</p>
          <a
            href="/mystory"
            className="inline-flex items-center gap-1 text-[#0061A5] font-medium hover:underline"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            나도 자서전 쓰기
          </a>
        </div>
      </div>
    </div>
  )
}
