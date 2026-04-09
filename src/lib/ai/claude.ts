/**
 * Claude API 래퍼 — 서버 사이드 전용
 * 클라이언트에서 직접 호출 금지. /api/ai/* 라우트를 통해서만 사용.
 */

export interface SummaryResult {
  summary: string
  mood: string
  keywords: string[]
}

export interface SuggestionResult {
  prompts: string[]
}

// 일기 내용 요약 + 감정/키워드 추출
export async function summarizeDiary(content: string): Promise<SummaryResult> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `다음 일기 내용을 분석해주세요. JSON 형식으로만 응답하세요.

일기 내용:
"""
${content.slice(0, 2000)}
"""

다음 JSON 구조로 응답:
{
  "summary": "2~3문장 핵심 요약 (한국어)",
  "mood": "감정 한 단어 (예: 행복, 차분, 그리움, 설렘, 감사, 피곤)",
  "keywords": ["키워드1", "키워드2", "키워드3"]
}

JSON 외 다른 텍스트 없이 JSON만 출력하세요.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(text.trim())
  return {
    summary: parsed.summary ?? '',
    mood: parsed.mood ?? '',
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
  }
}

// 글감/작성 프롬프트 제안
export async function suggestWritingPrompts(
  recentTitles: string[],
  mood?: string
): Promise<SuggestionResult> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const context = recentTitles.length > 0
    ? `최근 기록 주제: ${recentTitles.slice(0, 5).join(', ')}`
    : '최근 기록 없음'

  const moodContext = mood ? `현재 감정: ${mood}` : ''

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `일기 작성을 위한 글감 3개를 제안해주세요.

${context}
${moodContext}

JSON 형식으로만 응답하세요:
{
  "prompts": [
    "글감 질문 1",
    "글감 질문 2",
    "글감 질문 3"
  ]
}

각 글감은 자기성찰을 유도하는 구체적인 질문 형태로 작성하세요. 한국어로만 답하세요.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(text.trim())
  return {
    prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [],
  }
}
