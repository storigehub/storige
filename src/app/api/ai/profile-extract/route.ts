import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getTopicById } from '@/lib/mystory/questions'
import type { MystoryMessage } from '@/types/database'

// POST /api/ai/profile-extract
// Body: { topicId, messages: MystoryMessage[] }
// 역할: 완료된 인터뷰 세션에서 전기적 사실을 추출하여 mystory_profile에 upsert
// Returns: { ok: boolean, facts: Record<string, unknown> }
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
    return NextResponse.json({ ok: true, facts: {} })
  }

  const { topicId, messages } = await req.json() as {
    topicId: string
    messages: MystoryMessage[]
  }

  // 이미 추출된 토픽이면 스킵
  const { data: existing } = await supabase
    .from('mystory_profile')
    .select('completed_topics, facts')
    .eq('user_id', user.id)
    .single()

  if (existing?.completed_topics?.includes(topicId)) {
    return NextResponse.json({ ok: true, facts: existing.facts })
  }

  const topic = getTopicById(topicId)
  const userAnswers = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n---\n')

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `아래는 "${topic?.title ?? topicId}" 주제의 자서전 인터뷰 답변입니다.
답변에서 다른 인터뷰 주제에 활용할 수 있는 전기적 사실을 추출하여 JSON으로 반환하세요.

[추출 원칙]
- 구체적 고유명사(장소, 이름, 직업, 시기)만 추출
- 불확실한 내용은 포함하지 마세요
- 빈 필드는 생략하세요
- 결과는 반드시 유효한 JSON만 출력 (설명 없이)

[출력 형식 예시]
{
  "birthplace": "부산 영도",
  "birth_decade": "1950년대",
  "hometown_features": ["바다", "어항"],
  "family_father": "어부",
  "family_siblings": "2명",
  "career": "공무원",
  "career_duration": "30년",
  "spouse_met": "직장 동료 소개",
  "hobbies": ["낚시", "독서"],
  "values": ["성실함", "가족 우선"]
}

[인터뷰 답변]
${userAnswers}`

  const result = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  let newFacts: Record<string, unknown> = {}
  try {
    const raw = result.content[0].type === 'text' ? result.content[0].text.trim() : '{}'
    // JSON 블록 파싱 (```json ... ``` 형태도 허용)
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) newFacts = JSON.parse(jsonMatch[0])
  } catch {
    // 파싱 실패 시 빈 객체로 진행 (프로필 업데이트는 계속)
  }

  // 기존 facts와 병합
  const mergedFacts = { ...(existing?.facts ?? {}), ...newFacts }
  const completedTopics = [...(existing?.completed_topics ?? []), topicId]

  // upsert (사용자당 1개 보장)
  await supabase.from('mystory_profile').upsert(
    {
      user_id: user.id,
      facts: mergedFacts,
      completed_topics: completedTopics,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  return NextResponse.json({ ok: true, facts: newFacts })
}
