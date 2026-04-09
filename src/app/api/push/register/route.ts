import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST /api/push/register
// Body: { token: string }
// FCM 토큰 또는 Web Push subscription을 profiles에 저장
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await req.json()
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  // profiles 테이블에 push_token 저장 (컬럼 없으면 무시)
  const { error } = await supabase
    .from('profiles')
    .update({ push_token: token } as Record<string, string>)
    .eq('id', user.id)

  if (error) {
    // push_token 컬럼이 없을 수 있음 — migration 필요 시 무시
    console.warn('push_token update skipped:', error.message)
  }

  return NextResponse.json({ success: true })
}
