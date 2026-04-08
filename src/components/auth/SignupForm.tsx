'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 회원가입 폼 — Midnight Archive 디자인
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

  if (success) {
    return (
      <div className="w-full max-w-sm text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-primary block" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>mark_email_read</span>
        <h2 className="text-xl font-bold text-on-surface font-headline">이메일을 확인해주세요</h2>
        <p className="text-sm text-outline">
          <span className="font-medium text-on-surface">{email}</span>으로
          인증 링크를 보냈습니다.
          <br />
          이메일을 확인하고 가입을 완료해주세요.
        </p>
        <Button
          variant="outline"
          className="w-full rounded-xl h-11 border-surface-container hover:bg-surface-container-low"
          onClick={() => router.push('/login')}
        >
          로그인 화면으로
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">Storige</h1>
        <p className="text-[10px] tracking-[0.2em] font-bold text-outline uppercase">소중한 기억을 함께 기록하세요</p>
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
            className="bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20"
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
            className="bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20"
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
            className="bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20"
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
            className="bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20"
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
  )
}
