'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 회원가입 폼 — PC: 2분할(브랜드 패널 + 폼), 모바일: 전체화면
export function SignupForm() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, fullName)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('이미 사용 중인 이메일입니다.')
      } else {
        setError('회원가입 중 오류가 발생했습니다.')
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  // 이메일 인증 안내 화면
  if (success) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-5">
          <span
            className="material-symbols-outlined text-5xl text-primary block"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
          >
            mark_email_read
          </span>
          <h2 className="text-2xl font-bold text-on-surface font-headline">이메일을 확인해주세요</h2>
          <p className="text-sm text-outline leading-relaxed">
            <span className="font-medium text-on-surface">{email}</span>으로<br />
            인증 링크를 보냈습니다. 이메일을 확인하고<br />
            가입을 완료해주세요.
          </p>
          <Button
            variant="outline"
            className="w-full rounded-xl h-12 border-[#E2E2E2] hover:bg-[#F3F3F3] text-on-surface font-medium"
            onClick={() => router.push('/login')}
          >
            로그인 화면으로
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── 브랜드 패널 (PC 왼쪽 50% / 모바일 상단) ── */}
      <div className="bg-[#1A1C1C] md:w-1/2 flex flex-col items-center justify-center px-10 py-14 md:py-0 relative overflow-hidden">
        <div aria-hidden className="absolute top-1/4 -left-24 w-80 h-80 rounded-full bg-[#0061A5] opacity-[0.07]" />
        <div aria-hidden className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-[#0061A5] opacity-[0.07]" />

        <div className="relative z-10 w-full max-w-sm space-y-10">
          <div>
            <Image src="/logo.png" alt="Storige" width={160} height={48} className="h-12 w-auto brightness-0 invert" priority />
            <p className="mt-2 text-[10px] tracking-[0.22em] font-semibold text-white/35 uppercase">Stories + Storage</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white/90 leading-snug">
              소중한 기억을<br />지금 시작하세요.
            </p>
            <p className="mt-3 text-sm text-white/45 leading-relaxed">
              무료로 가입하고 일기, 편지, 시크릿 코드,<br />
              AI 자서전까지 모두 경험해보세요.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              { icon: 'check_circle', label: '무료로 시작, 언제든 업그레이드' },
              { icon: 'shield', label: 'AES-256 군사급 암호화' },
              { icon: 'family_restroom', label: '가족과 기억 공유' },
              { icon: 'book', label: '종이책으로 출판' },
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
          <div className="hidden md:block space-y-1">
            <h2 className="text-2xl font-bold text-on-surface font-headline">회원가입</h2>
            <p className="text-sm text-outline">무료 계정으로 시작하세요.</p>
          </div>

          <div className="md:hidden text-center space-y-1 pb-2">
            <p className="text-[10px] tracking-[0.22em] font-semibold text-outline uppercase">새 계정 만들기</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-medium text-outline uppercase tracking-wider">이름</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="홍길동"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white border-0 rounded-xl h-12 shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

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
              <Label htmlFor="password" className="text-xs font-medium text-outline uppercase tracking-wider">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-white border-0 rounded-xl h-12 shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="passwordConfirm" className="text-xs font-medium text-outline uppercase tracking-wider">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호 재입력"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                autoComplete="new-password"
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
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <p className="text-center text-sm text-outline">
            이미 계정이 있으신가요?{' '}
            <a href="/login" className="text-primary hover:underline font-semibold">
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
