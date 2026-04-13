import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getTopicById } from '@/lib/mystory/questions'
import type { MystoryMessage } from '@/types/database'

// POST /api/ai/interview
// Body: { topicId, messages: MystoryMessage[], profileContext?: string }
// Returns: { reply: string }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ reply: '이야기를 잘 들었습니다. 더 하고 싶으신 말씀이 있으시면 계속해 주세요.' })
  }

  const { topicId, messages, profileContext } = await req.json() as {
    topicId: string
    messages: MystoryMessage[]
    profileContext?: string
  }
  const topic = getTopicById(topicId)
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const userMsgs = messages.filter(m => m.role === 'user')
  const currentQIdx = userMsgs.length - 1 // 방금 답한 질문 인덱스
  const nextQIdx = Math.min(userMsgs.length, topic.questions.length - 1)
  const isLastQuestion = userMsgs.length >= topic.questions.length

  // 다음 질문 방향 (참고용 가이드)
  const upcomingGuide = isLastQuestion
    ? null
    : topic.questions
        .slice(nextQIdx, nextQIdx + 2)
        .map((q, i) => `${i === 0 ? '▶ 다음 방향' : '  그 다음'}: ${q}`)
        .join('\n')

  // 이미 다룬 질문 목록 (재질문 방지)
  const coveredTopics = topic.questions
    .slice(0, Math.max(0, currentQIdx))
    .map((q, i) => `${i + 1}. ${q}`)
    .join('\n')

  const systemPrompt = `당신은 따뜻하고 공감적인 자서전 인터뷰어입니다.
지금 "${topic.title}" (${topic.category}) 주제로 인터뷰 중입니다.
${profileContext ? `\n[이 분에 대해 알려진 정보]\n${profileContext}\n이 정보를 자연스럽게 활용하여 더 개인화된 질문을 만드세요.\n` : ''}
[인터뷰 지침]
1. 사용자의 마지막 답변에서 구체적인 단어·이름·장소·감정을 찾아 그것을 반영한 후속 질문을 만드세요.
2. 아래 "다음 방향"은 참고 가이드입니다. 사용자 답변 맥락에 맞게 자연스럽게 재구성하세요.
3. 이미 다룬 내용은 반복하지 마세요.
4. 답변이 50자 미만이거나 단답형이면 "조금 더 자세히" 부드럽게 탐색하세요.
5. 답변이 풍부하면 공감 후 바로 다음 주제로 넘어가세요.
6. 응답 형식: 공감 1~2문장 + 후속 질문 1문장. 총 2~3문장, 한국어로만.
${isLastQuestion ? '7. 이것이 마지막 답변입니다. 따뜻하게 마무리하고, "원고 생성하기" 버튼을 눌러 자서전을 완성하라고 안내하세요.' : ''}
${upcomingGuide ? `\n[다음 질문 방향 가이드]\n${upcomingGuide}` : ''}
${coveredTopics ? `\n[이미 다룬 내용 — 반복 금지]\n${coveredTopics}` : ''}`

  const apiMessages = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    .slice(-10) // 최근 10개 (컨텍스트 충분히 유지)

  const result = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: systemPrompt,
    messages: apiMessages.length > 0 ? apiMessages : [{ role: 'user', content: '시작해주세요.' }],
  })

  const reply = result.content[0].type === 'text' ? result.content[0].text : ''
  return NextResponse.json({ reply })
}
