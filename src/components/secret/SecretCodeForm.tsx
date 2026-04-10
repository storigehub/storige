'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { encrypt } from '@/lib/encryption/aes'
import { createClient } from '@/lib/supabase/client'
import type { SecretCategory, Importance } from '@/types/database'
import type { CredentialEntry } from '@/hooks/useSecretCodes'
import { SecretCredentialFields } from './SecretCredentialFields'
import { SecretPassphraseSection } from './SecretPassphraseSection'

const CATEGORIES: { value: SecretCategory; label: string; icon: string }[] = [
  { value: 'finance',      label: '금융',   icon: 'account_balance' },
  { value: 'real_estate',  label: '부동산',  icon: 'domain' },
  { value: 'legal',        label: '법률',   icon: 'gavel' },
  { value: 'crypto',       label: '가상자산', icon: 'currency_bitcoin' },
  { value: 'business',     label: '사업',   icon: 'business_center' },
  { value: 'other',        label: '기타',   icon: 'category' },
]

// 시크릿 코드 등록 폼 — Midnight Archive / Secret 디자인 시스템 기준
export function SecretCodeForm() {
  const router = useRouter()
  const [category, setCategory] = useState<SecretCategory>('finance')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [importance, setImportance] = useState<Importance>('important')
  const [passphrase, setPassphrase] = useState('')
  const [passphraseConfirm, setPassphraseConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [credentials, setCredentials] = useState<CredentialEntry[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    if (!title.trim()) { setError('제목을 입력하세요'); return }
    if (!content.trim() && credentials.length === 0) { setError('내용을 입력하세요'); return }
    if (!passphrase.trim()) { setError('패스프레이즈를 설정하세요'); return }
    if (passphrase !== passphraseConfirm) { setError('패스프레이즈가 일치하지 않습니다'); return }
    if (passphrase.length < 8) { setError('패스프레이즈는 8자 이상이어야 합니다'); return }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const encryptedContent = await encrypt(content || ' ', passphrase)
      const encryptedCredentials = credentials.length > 0
        ? await encrypt(JSON.stringify(credentials), passphrase)
        : null

      const { error } = await supabase.from('secret_codes').insert({
        user_id: user.id,
        category,
        title: title.trim(),
        importance,
        encrypted_content: encryptedContent,
        encrypted_credentials: encryptedCredentials,
      })

      if (error) throw error
      router.push('/secret')
    } catch (err) {
      setError('저장 중 오류가 발생했습니다')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }, [title, content, importance, passphrase, passphraseConfirm, credentials, category, router])

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 상단 바 — backdrop blur */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 h-16 bg-white/80 backdrop-blur-xl border-b border-[#C4C7C7]/20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#747878] hover:text-[#1A1C1C] transition-colors"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
            arrow_back
          </span>
          <span className="text-sm">돌아가기</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#E91E63] text-white text-sm font-bold px-5 py-2 rounded-[10px] disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.97]"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin" style={{ fontVariationSettings: "'FILL' 0" }}>
                progress_activity
              </span>
              저장 중
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
              암호화하여 저장
            </>
          )}
        </button>
      </div>

      {/* 다크 히어로 패널 */}
      <div className="bg-[#1A1C1C] px-6 pt-8 pb-7">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#E91E63]/15 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#E91E63] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
            <span className="text-[#E91E63] text-[10px] uppercase tracking-[0.2em] font-bold">Secure Access Only</span>
          </div>
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight leading-tight">
          새 시크릿 등록
        </h1>
        <p className="text-white/40 text-sm mt-2 leading-relaxed">
          저장 전 클라이언트에서 AES-256 암호화됩니다
        </p>
      </div>

      {/* 폼 본문 */}
      <div className="max-w-2xl mx-auto px-5 py-6 space-y-7">

        {/* 에러 메시지 */}
        {error && (
          <div className="flex items-center gap-3 bg-[#FFDAD6] rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-[#BA1A1A] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              error
            </span>
            <p className="text-sm text-[#BA1A1A] font-medium">{error}</p>
          </div>
        )}

        {/* 카테고리 */}
        <div>
          <p className="text-[10px] text-[#747878] uppercase tracking-[0.2em] font-bold mb-3">카테고리</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  category === cat.value
                    ? 'bg-[#1A1C1C] text-white shadow-sm'
                    : 'bg-[#EEEEEE] text-[#444748] hover:bg-[#E2E2E2]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: category === cat.value ? "'FILL' 1" : "'FILL' 0, 'wght' 300" }}
                >
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className="border-b border-[#C4C7C7]/40 pb-4">
          <p className="text-[10px] text-[#747878] uppercase tracking-[0.2em] font-bold mb-3">
            제목 <span className="text-[#E91E63] normal-case tracking-normal">필수</span>
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 신한은행 계좌 정보"
            className="w-full bg-transparent text-xl font-headline font-bold text-[#1A1C1C] placeholder:text-[#C4C7C7] placeholder:font-normal outline-none"
          />
        </div>

        {/* 중요도 */}
        <div>
          <p className="text-[10px] text-[#747878] uppercase tracking-[0.2em] font-bold mb-3">중요도</p>
          <div className="flex gap-2">
            <button
              onClick={() => setImportance('important')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                importance === 'important'
                  ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                  : 'bg-[#EEEEEE] text-[#747878] hover:bg-[#E2E2E2]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: importance === 'important' ? "'FILL' 1" : "'FILL' 0, 'wght' 300" }}
              >
                grade
              </span>
              중요
            </button>
            <button
              onClick={() => setImportance('reference')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                importance === 'reference'
                  ? 'bg-[#E8E8E8] text-[#444748]'
                  : 'bg-[#EEEEEE] text-[#747878] hover:bg-[#E2E2E2]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                bookmark
              </span>
              참고
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="bg-white rounded-[1.25rem] px-5 py-4 shadow-sm">
          <p className="text-[10px] text-[#747878] uppercase tracking-[0.2em] font-bold mb-3">
            내용
            <span className="ml-2 text-[#C4C7C7] normal-case tracking-normal font-normal">암호화됨</span>
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"보관할 정보를 자유롭게 입력하세요\n계좌번호, 주소, 계약 내용 등"}
            rows={5}
            className="w-full bg-transparent text-sm text-[#1A1C1C] placeholder:text-[#C4C7C7] outline-none resize-none font-mono leading-relaxed"
          />
        </div>

        {/* 계정 정보 */}
        <SecretCredentialFields
          credentials={credentials}
          onAdd={() => setCredentials((prev) => [...prev, { service: '', username: '', password: '', memo: '' }])}
          onUpdate={(idx, field, value) =>
            setCredentials((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))
          }
          onRemove={(idx) => setCredentials((prev) => prev.filter((_, i) => i !== idx))}
        />

        {/* 패스프레이즈 */}
        <SecretPassphraseSection
          passphrase={passphrase}
          passphraseConfirm={passphraseConfirm}
          showPass={showPass}
          onPassphraseChange={setPassphrase}
          onPassphraseConfirmChange={setPassphraseConfirm}
          onShowPassToggle={() => setShowPass((v) => !v)}
        />

        <div className="h-8" />
      </div>
    </div>
  )
}
