import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getTopicById } from '@/lib/mystory/questions'
import type { MystoryMessage } from '@/types/database'

// 답변 깊이 분류
type AnswerDepth = 'short' | 'normal' | 'rich' | 'emotional'

// 감정적 키워드 — 배려 톤 전환 트리거
const EMOTIONAL_KEYWORDS = [
  '힘들', '슬펐', '울었', '눈물', '후회', '그리워', '보고싶', '떠나', '돌아가셨',
  '잃었', '아팠', '고통', '상처', '외로', '무서웠', '괴로', '힘겨', '포기',
]

function classifyAnswer(text: string): AnswerDepth {
  const trimmed = text.trim()
  const len = trimmed.length

  const isEmotional = EMOTIONAL_KEYWORDS.some(kw => trimmed.includes(kw))
  if (isEmotional) return 'emotional'
  if (len < 30) return 'short'
  if (len >= 200) return 'rich'
  return 'normal'
}

// 깊이별 추가 지침 생성
function buildDepthGuidance(depth: AnswerDepth): string {
  switch (depth) {
    case 'short':
      return '※ 답변이 매우 짧습니다. 다음 질문으로 넘어가기 전에 "조금 더 구체적으로 말씀해 주시겠어요?" 또는 "그때 어떤 느낌이셨나요?" 처럼 한 번 더 부드럽게 탐색하세요. 단, 탐색 질문은 1개만.'
    case 'rich':
      return '※ 답변이 매우 풍부합니다. 추가 탐색 없이 감사와 공감을 표현한 뒤 바로 다음 주제로 자연스럽게 넘어가세요.'
    case 'emotional':
      return '※ 감정적으로 어려운 이야기를 나눠주셨습니다. "말씀하시기 쉽지 않으셨을 텐데 이야기해 주셔서 감사합니다" 처럼 먼저 충분히 공감하고, 부드럽고 천천히 다음으로 넘어가세요. 절대 서두르지 마세요.'
    case 'normal':
    default:
      return ''
  }
}

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
  const lastUserMsg = userMsgs[userMsgs.length - 1]
  const currentQIdx = userMsgs.length - 1
  const nextQIdx = Math.min(userMsgs.length, topic.questions.length - 1)
  const isLastQuestion = userMsgs.length >= topic.questions.length

  // 답변 깊이 분류
  const answerDepth = lastUserMsg ? classifyAnswer(lastUserMsg.content) : 'normal'
  const depthGuidance = buildDepthGuidance(answerDepth)

  // 다음 질문 방향 (참고용 가이드) — 단답인 경우 동일 주제 탐색 유도이므로 1단계 앞 가이드만 제공
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

  const systemPrompt = `당신은 '가족의 역사와 개인의 삶'을 깊이 있게 기록하는 전문 전기 작가이자 인터뷰어입니다.
당신의 목표는 사용자가 단순히 사실을 나열하는 것을 넘어, 당시의 감정과 감각, 그리고 삶의 지혜가 담긴 '풍성한 이야기'를 들려주도록 유도하는 것입니다.

현재 주제: "${topic.title}" (${topic.category})
${profileContext ? `\n[인터뷰 대상자의 배경 정보]\n${profileContext}\n이 정보를 대화 흐름에 자연스럽게 녹여내어 "나를 잘 이해하고 있구나"라는 신뢰감을 주십시오.\n` : ''}

[전문 인터뷰어의 대화 전략]
1. **공감과 인정**: 사용자의 답변에 담긴 감정을 먼저 읽어주십시오. (예: "그때의 설렘이 저에게도 전달되는 것 같네요.")
2. **감각적 묘사 유도**: 기억을 생생하게 되살리기 위해 오감(냄새, 소리, 풍경, 촉감)에 대해 질문하십시오. (예: "그 방에 들어섰을 때 어떤 냄새가 났었나요?")
3. **구체적 에피소드 추출**: 추상적인 답변에는 구체적인 '어느 하루'의 기억을 요청하십시오. (예: "가장 기억에 남는 특별한 하루를 꼽는다면 언제인가요?")
4. **시대적/사회적 연결**: 개인의 삶이 당시의 시대상과 어떻게 연결되었는지 질문하십시오. (예: "당시 세상 분위기는 어땠고, 그것이 선생님의 삶에는 어떤 영향을 주었나요?")
5. **가치와 유산**: 그 경험이 현재의 사용자에게 어떤 의미인지, 후손들에게 어떤 메시지로 남길 원하는지 탐색하십시오.

[운영 지침]
- 한 번에 하나의 질문만 하십시오. 질문이 너무 많으면 대화가 끊깁니다.
- 질문은 짧고 명료하게 하되, 대답을 이끌어내는 마법 같은 단어들을 사용하십시오.
- 이미 다룬 내용은 절대 반복하지 마십시오.
- 응답 형식: 따뜻한 공감(1~2문장) + 깊이 있는 후속 질문(1문장). 한국어로만 답변하십시오.

${isLastQuestion ? '[마무리 지침]\n이것이 해당 주제의 마지막 질문입니다. 오늘 들려주신 소중한 이야기에 깊이 감사하며, "원고 생성하기" 버튼을 통해 이 이야기들을 아름다운 자서전 문장으로 정리해볼 것을 제안하며 따뜻하게 마무리하십시오.' : ''}
${depthGuidance ? `\n[실시간 답변 분석 및 대응]\n${depthGuidance}` : ''}
${upcomingGuide ? `\n[예정된 질문 방향 (참고용)]\n${upcomingGuide}` : ''}
${coveredTopics ? `\n[기록된 내용 (반복 금지)]\n${coveredTopics}` : ''}`

  const apiMessages = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    .slice(-10)

  const result = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: systemPrompt,
    messages: apiMessages.length > 0 ? apiMessages : [{ role: 'user', content: '시작해주세요.' }],
  })

  const reply = result.content[0].type === 'text' ? result.content[0].text : ''
  return NextResponse.json({ reply })
}
