import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getTopicById } from '@/lib/mystory/questions'
import type { MystoryMessage } from '@/types/database'

// POST /api/ai/manuscript
// Body: { topicId, topicCategory, messages: MystoryMessage[] }
// Returns: { manuscript: string }
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
    return NextResponse.json({
      manuscript: '원고가 생성되었습니다. 소중한 이야기를 들려주셔서 감사합니다.',
    })
  }

  const { topicId, topicCategory, messages } = await req.json() as {
    topicId: string
    topicCategory: string
    messages: MystoryMessage[]
  }
  const topic = getTopicById(topicId)

  // 사용자 답변만 추출
  const userAnswers = messages
    .filter(m => m.role === 'user')
    .map((m, i) => `[${i + 1}] ${m.content}`)
    .join('\n\n')

  if (!userAnswers) {
    return NextResponse.json({ manuscript: '아직 이야기가 충분하지 않습니다.' })
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const systemPrompt = `당신은 감동적인 자서전을 쓰는 작가입니다.
인터뷰 내용을 바탕으로 아름답고 감동적인 자서전 원고 한 챕터를 작성하세요.

규칙:
- 1인칭 시점으로 작성 ("나는", "나의")
- 인터뷰이의 말을 직접 인용하지 말고, 자연스러운 서술체로 변환
- 감성적이고 문학적인 표현 사용
- 500~800자 분량
- 한국어로만 작성
- 단락을 나눠서 가독성 있게 구성
- 제목 없이 본문만 작성`

  const userPrompt = `주제: "${topic?.title ?? topicCategory}" (${topicCategory} 카테고리)

다음은 인터뷰에서 나온 이야기들입니다:

${userAnswers}

위 내용을 바탕으로 자서전 원고를 작성해주세요.`

  const result = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const manuscript = result.content[0].type === 'text' ? result.content[0].text : ''
  return NextResponse.json({ manuscript })
}
