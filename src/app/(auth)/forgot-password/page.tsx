'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 비밀번호 찾기 페이지
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError('이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  // 이메일 전송 완료 화면
  if (sent) {
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
            비밀번호 재설정 링크를 보냈습니다.
          </p>
          <Button
            variant="outline"
            className="w-full rounded-xl h-12 border-[#E2E2E2] hover:bg-[#F3F3F3] text-on-surface font-medium"
            onClick={() => window.location.href = '/login'}
          >
            로그인 화면으로
          </Button>
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
              비밀번호를<br />재설정합니다.
            </p>
            <p className="mt-3 text-sm text-white/45 leading-relaxed">
              가입한 이메일 주소를 입력하면<br />
              재설정 링크를 보내드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 폼 패널 ── */}
      <div className="bg-[#F9F9F9] md:w-1/2 flex items-center justify-center px-6 py-12 md:px-14">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-surface font-headline">비밀번호 찾기</h2>
            <p className="text-sm text-outline">가입 시 사용한 이메일을 입력해주세요.</p>
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

            {error && (
              <p className="text-sm text-error bg-[#fff0f0] rounded-lg px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-[#004c82] text-white rounded-xl h-12 font-semibold"
              disabled={loading}
            >
              {loading ? '전송 중...' : '재설정 링크 보내기'}
            </Button>
          </form>

          <p className="text-center text-sm text-outline">
            <a href="/login" className="text-primary hover:underline font-semibold">
              ← 로그인으로 돌아가기
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
