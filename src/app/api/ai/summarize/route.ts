import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { summarizeDiary } from '@/lib/ai/claude'

// POST /api/ai/summarize
// Body: { content: string }
// Returns: { summary, mood, keywords }
export async function POST(req: NextRequest) {
  // 인증 확인
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content } = await req.json()
  if (!content || typeof content !== 'string' || content.trim().length < 20) {
    return NextResponse.json({ error: '내용이 너무 짧습니다.' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI 기능이 설정되지 않았습니다.' }, { status: 503 })
  }

  try {
    const result = await summarizeDiary(content)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'AI 요약 생성에 실패했습니다.' }, { status: 500 })
  }
}
