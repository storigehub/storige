import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { suggestWritingPrompts } from '@/lib/ai/claude'

// POST /api/ai/suggest
// Body: { recentTitles?: string[], mood?: string }
// Returns: { prompts: string[] }
export async function POST(req: NextRequest) {
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI 기능이 설정되지 않았습니다.' }, { status: 503 })
  }

  const { recentTitles = [], mood } = await req.json()

  try {
    const result = await suggestWritingPrompts(recentTitles, mood)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: '글감 제안 생성에 실패했습니다.' }, { status: 500 })
  }
}
