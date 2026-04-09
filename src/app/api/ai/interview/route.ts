import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getTopicById } from '@/lib/mystory/questions'
import type { MystoryMessage } from '@/types/database'

// POST /api/ai/interview
// Body: { topicId, messages: MystoryMessage[] }
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

  const { topicId, messages } = await req.json() as { topicId: string; messages: MystoryMessage[] }
  const topic = getTopicById(topicId)

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // 마지막 사용자 답변 기준으로 몇 번째 질문인지 계산
  const userMsgs = messages.filter(m => m.role === 'user')
  const nextQIdx = Math.min(userMsgs.length, (topic?.questions.length ?? 1) - 1)
  const nextQuestion = topic?.questions[nextQIdx]

  const systemPrompt = `당신은 따뜻하고 공감적인 자서전 인터뷰어입니다.
주제: "${topic?.title ?? ''}" (${topic?.category ?? ''})
현재 인터뷰에서 사용자의 이야기를 경청하고, 짧게 공감의 말을 건네면서 다음 질문으로 자연스럽게 넘어가세요.
${nextQuestion ? `다음 질문: "${nextQuestion}"` : '인터뷰가 거의 완성됐습니다. 감사 인사와 함께 원고 생성을 권유하세요.'}
답변은 2~4문장으로 간결하게, 따뜻한 어조로 한국어로만 응답하세요.`

  const apiMessages = messages
    .filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0)
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    .slice(-8) // 최근 8개만

  const result = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: systemPrompt,
    messages: apiMessages.length > 0 ? apiMessages : [{ role: 'user', content: '시작해주세요.' }],
  })

  const reply = result.content[0].type === 'text' ? result.content[0].text : ''
  return NextResponse.json({ reply })
}
