'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 로그인 폼 — Midnight Archive 디자인
export function LoginForm() {
  const router = useRouter()
  const { signIn, signInWithGoogle, signInWithKakao } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    <div className="w-full max-w-sm space-y-6">
      {/* 로고 + 타이틀 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#1a1c1c] font-headline tracking-tight">Storige</h1>
        <p className="text-[10px] tracking-[0.2em] font-bold text-[#747878] uppercase">기억을 저장하고, 내일을 준비하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-[#747878] uppercase tracking-wider">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-[#f3f3f3] border-0 rounded-xl focus:ring-2 focus:ring-[#0061A5]/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-[#747878] uppercase tracking-wider">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-[#f3f3f3] border-0 rounded-xl focus:ring-2 focus:ring-[#0061A5]/20"
          />
        </div>

        {error && (
          <p className="text-sm text-[#ba1a1a] bg-[#fff0f0] rounded-lg px-3 py-2">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-[#0061A5] hover:bg-[#004c82] text-white rounded-xl h-12 font-semibold"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#eeeeee]" />
        </div>
        <div className="relative flex justify-center text-xs text-[#747878]">
          <span className="bg-[#f9f9f9] px-3">또는</span>
        </div>
      </div>

      {/* 소셜 로그인 */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl h-11 border-[#eeeeee] bg-white hover:bg-[#f3f3f3] text-[#1a1c1c] font-medium"
          onClick={signInWithGoogle}
        >
          Google로 계속하기
        </Button>
        <Button
          type="button"
          className="w-full rounded-xl h-11 bg-[#FEE500] border-0 hover:bg-[#f0d800] text-[#3C1E1E] font-medium"
          onClick={signInWithKakao}
        >
          카카오로 계속하기
        </Button>
      </div>

      <p className="text-center text-sm text-[#747878]">
        계정이 없으신가요?{' '}
        <a href="/signup" className="text-[#0061A5] hover:underline font-semibold">
          회원가입
        </a>
      </p>
    </div>
  )
}
