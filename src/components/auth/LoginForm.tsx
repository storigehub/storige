'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// URL 에러 파라미터 → 사용자 메시지 매핑
const URL_ERRORS: Record<string, string> = {
  auth_callback_error: '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
  session_expired: '세션이 만료되었습니다. 다시 로그인해주세요.',
}

// 로그인 폼 — PC: 2분할(브랜드 패널 + 폼), 모바일: 전체화면
export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signInWithGoogle, signInWithKakao } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(
    URL_ERRORS[searchParams.get('error') ?? ''] ?? null
  )
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'kakao' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }
    router.push('/diary')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── 브랜드 패널 (PC 왼쪽 50% / 모바일 상단) ── */}
      <div className="bg-[#1A1C1C] md:w-1/2 flex flex-col items-center justify-center px-10 py-14 md:py-0 relative overflow-hidden">
        {/* 배경 장식 원 */}
        <div aria-hidden className="absolute top-1/4 -left-24 w-80 h-80 rounded-full bg-[#0061A5] opacity-[0.07]" />
        <div aria-hidden className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-[#0061A5] opacity-[0.07]" />

        <div className="relative z-10 w-full max-w-sm space-y-10">
          {/* 로고 */}
          <div>
            <Image src="/logo.png" alt="Storige" width={160} height={48} className="h-12 w-auto brightness-0 invert" priority />
            <p className="mt-2 text-[10px] tracking-[0.22em] font-semibold text-white/35 uppercase">Stories + Storage</p>
          </div>

          {/* 메인 카피 */}
          <div>
            <p className="text-2xl font-bold text-white/90 leading-snug">
              기억을 저장하고,<br />내일을 준비하세요.
            </p>
            <p className="mt-3 text-sm text-white/45 leading-relaxed">
              소중한 순간을 기록하고, 가족과 나누며<br />
              아름다운 유산을 남기는 디지털 헤리티지 플랫폼.
            </p>
          </div>

          {/* 피처 목록 */}
          <ul className="space-y-3">
            {[
              { icon: 'menu_book', label: '일기 & 편지' },
              { icon: 'lock', label: '시크릿 코드 (E2EE 암호화)' },
              { icon: 'auto_stories', label: 'AI 자서전' },
              { icon: 'book', label: '종이책 출판' },
            ].map(({ icon, label }) => (
              <li key={icon} className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[18px] text-[#0061A5]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
                >
                  {icon}
                </span>
                <span className="text-sm font-medium text-white/60">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 폼 패널 (PC 오른쪽 50% / 모바일 하단) ── */}
      <div className="bg-[#F9F9F9] md:w-1/2 flex items-center justify-center px-6 py-12 md:px-14">
        <div className="w-full max-w-sm space-y-6">
          {/* 섹션 헤더 (PC) */}
          <div className="hidden md:block space-y-1">
            <h2 className="text-2xl font-bold text-on-surface font-headline">로그인</h2>
            <p className="text-sm text-outline">계정에 접속해 기억을 이어가세요.</p>
          </div>

          {/* 모바일 전용 미니 로고 */}
          <div className="md:hidden text-center space-y-1 pb-2">
            <p className="text-[10px] tracking-[0.22em] font-semibold text-outline uppercase">계정에 로그인</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-outline uppercase tracking-wider">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white border-0 rounded-xl h-12 shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-outline uppercase tracking-wider">비밀번호</Label>
                <a href="/forgot-password" className="text-xs text-primary hover:underline">비밀번호 찾기</a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-white border-0 rounded-xl h-12 shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {error && (
              <p className="text-sm text-error bg-[#fff0f0] rounded-lg px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-[#004c82] text-white rounded-xl h-12 font-semibold"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E2E2E2]" />
            </div>
            <div className="relative flex justify-center text-xs text-outline">
              <span className="bg-[#F9F9F9] px-3">또는</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl h-11 border-[#E2E2E2] bg-white hover:bg-[#F3F3F3] text-on-surface font-medium"
              disabled={oauthLoading !== null}
              onClick={async () => {
                setError(null)
                setOauthLoading('google')
                const { error } = await signInWithGoogle()
                if (error) {
                  setError('Google 로그인을 사용할 수 없습니다. 관리자에게 문의하세요.')
                  setOauthLoading(null)
                }
              }}
            >
              {oauthLoading === 'google' ? '이동 중...' : 'Google로 계속하기'}
            </Button>
            <Button
              type="button"
              className="w-full rounded-xl h-11 bg-[#FEE500] border-0 hover:bg-[#f0d800] text-[#3C1E1E] font-medium"
              disabled={oauthLoading !== null}
              onClick={async () => {
                setError(null)
                setOauthLoading('kakao')
                const { error } = await signInWithKakao()
                if (error) {
                  setError('카카오 로그인을 사용할 수 없습니다. 관리자에게 문의하세요.')
                  setOauthLoading(null)
                }
              }}
            >
              {oauthLoading === 'kakao' ? '이동 중...' : '카카오로 계속하기'}
            </Button>
          </div>

          <p className="text-center text-sm text-outline">
            계정이 없으신가요?{' '}
            <a href="/signup" className="text-primary hover:underline font-semibold">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
