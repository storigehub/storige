'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

/**
 * 프로필 편집 페이지 — Midnight Archive 스타일
 * 이름, 아바타 URL 수정
 */
export default function ProfileEditPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), avatar_url: avatarUrl.trim() || null })
        .eq('id', user.id)

      if (updateError) throw updateError
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 pt-6 pb-32">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
          aria-label="뒤로"
        >
          <span className="material-symbols-outlined text-outline">arrow_back</span>
        </button>
        <h1 className="text-xl font-extrabold text-on-surface font-headline">프로필 편집</h1>
      </div>

      {/* 아바타 미리보기 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center text-2xl font-bold text-outline border-2 border-primary/20 mb-3">
          {avatarUrl
            ? <img src={avatarUrl} alt="프로필" className="w-full h-full object-cover" />
            : (fullName?.[0]?.toUpperCase() ?? '?')}
        </div>
        <span className="text-xs text-outline">프로필 사진</span>
      </div>

      {/* 폼 */}
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 font-headline">
            이름
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="홍길동"
            className="w-full bg-white border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface placeholder-outline-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 font-headline">
            프로필 사진 URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full bg-white border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface placeholder-outline-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <p className="text-[11px] text-outline mt-1.5">이미지 URL을 직접 입력하세요</p>
        </div>

        {/* 이메일 (수정 불가) */}
        <div>
          <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 font-headline">
            이메일
          </label>
          <div className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 text-sm text-outline">
            {profile?.email ?? '—'}
          </div>
          <p className="text-[11px] text-outline-variant mt-1.5">이메일은 변경할 수 없습니다</p>
        </div>

        {error && (
          <p className="text-sm text-error bg-error-container/30 px-4 py-2.5 rounded-xl">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !fullName.trim()}
          className="w-full py-3.5 bg-primary text-white font-bold rounded-[0.625rem] text-sm hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              저장됨
            </>
          ) : '저장하기'}
        </button>
      </div>
    </div>
  )
}
