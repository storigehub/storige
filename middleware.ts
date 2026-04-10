import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 세션 갱신 + 경로 보호 미들웨어
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|manifest.json|sw.js|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
