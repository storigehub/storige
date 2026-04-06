'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 로그인 폼 컴포넌트
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">스토리지</h1>
        <p className="text-sm text-[#888]">기억을 저장하고, 내일을 준비하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm text-[#FF4757]">{error}</p>
        )}

        <Button type="submit" className="w-full bg-[#4A90D9] hover:bg-[#3a7bc8]" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#e8e8e8]" />
        </div>
        <div className="relative flex justify-center text-xs text-[#888]">
          <span className="bg-white px-2">또는</span>
        </div>
      </div>

      {/* 소셜 로그인 */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={signInWithGoogle}
        >
          Google로 계속하기
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-[#FEE500] border-[#FEE500] hover:bg-[#f0d800] text-[#3C1E1E]"
          onClick={signInWithKakao}
        >
          카카오로 계속하기
        </Button>
      </div>

      <p className="text-center text-sm text-[#888]">
        계정이 없으신가요?{' '}
        <a href="/signup" className="text-[#4A90D9] hover:underline font-medium">
          회원가입
        </a>
      </p>
    </div>
  )
}
