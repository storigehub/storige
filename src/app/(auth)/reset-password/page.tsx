'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 비밀번호 재설정 페이지 — /auth/callback?next=/reset-password 으로 진입
export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

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
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다.')
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
    // 3초 후 자동으로 일기 페이지로 이동
    setTimeout(() => router.push('/diary'), 3000)
  }

  // 완료 화면
  if (done) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-5">
          <span
            className="material-symbols-outlined text-5xl text-primary block"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
          >
            check_circle
          </span>
          <h2 className="text-2xl font-bold text-on-surface font-headline">비밀번호가 변경되었습니다</h2>
          <p className="text-sm text-outline">잠시 후 자동으로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── 브랜드 패널 ── */}
      <div className="bg-[#1A1C1C] md:w-1/2 flex flex-col items-center justify-center px-10 py-14 md:py-0 relative overflow-hidden">
        <div aria-hidden className="absolute top-1/4 -left-24 w-80 h-80 rounded-full bg-[#0061A5] opacity-[0.07]" />
        <div aria-hidden className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-[#0061A5] opacity-[0.07]" />

        <div className="relative z-10 w-full max-w-sm space-y-8">
          <div>
            <Image src="/logo.png" alt="Storige" width={160} height={48} className="h-12 w-auto brightness-0 invert" priority />
            <p className="mt-2 text-[10px] tracking-[0.22em] font-semibold text-white/35 uppercase">Stories + Storage</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white/90 leading-snug">
              새 비밀번호를<br />설정합니다.
            </p>
            <p className="mt-3 text-sm text-white/45 leading-relaxed">
              8자 이상의 새 비밀번호를 입력해주세요.
            </p>
          </div>
        </div>
      </div>

      {/* ── 폼 패널 ── */}
      <div className="bg-[#F9F9F9] md:w-1/2 flex items-center justify-center px-6 py-12 md:px-14">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-surface font-headline">새 비밀번호 설정</h2>
            <p className="text-sm text-outline">사용할 새 비밀번호를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-outline uppercase tracking-wider">새 비밀번호</Label>
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
              {loading ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
