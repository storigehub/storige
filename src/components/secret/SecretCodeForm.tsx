'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { encrypt } from '@/lib/encryption/aes'
import { createClient } from '@/lib/supabase/client'
import type { SecretCategory, Importance } from '@/types/database'
import type { CredentialEntry } from '@/hooks/useSecretCodes'

const CATEGORIES: { value: SecretCategory; label: string; icon: string }[] = [
  { value: 'finance', label: '금융', icon: '💳' },
  { value: 'real_estate', label: '부동산', icon: '🏠' },
  { value: 'legal', label: '법률', icon: '⚖️' },
  { value: 'crypto', label: '가상자산', icon: '₿' },
  { value: 'business', label: '사업', icon: '💼' },
  { value: 'other', label: '기타', icon: '🔐' },
]

// 시크릿 코드 등록 폼
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

  const addCredential = () => {
    setCredentials((prev) => [...prev, { service: '', username: '', password: '', memo: '' }])
  }

  const updateCredential = (idx: number, field: keyof CredentialEntry, value: string) => {
    setCredentials((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    )
  }

  const removeCredential = (idx: number) => {
    setCredentials((prev) => prev.filter((_, i) => i !== idx))
  }

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

      // 클라이언트 사이드 E2EE 암호화
      const encryptedContent = await encrypt(content || ' ', passphrase)
      let encryptedCredentials = null
      if (credentials.length > 0) {
        encryptedCredentials = await encrypt(JSON.stringify(credentials), passphrase)
      }

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
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#f0f0f0]">
        <button onClick={() => router.back()} className="text-[#888] text-sm">취소</button>
        <h2 className="text-sm font-semibold text-[#1A1A1A]">시크릿 코드 등록</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-[#FF6B9D] font-semibold text-sm disabled:opacity-40"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* 오류 메시지 */}
        {error && (
          <div className="bg-[#ffeef0] border border-[#FF4757] rounded-xl p-3">
            <p className="text-xs text-[#FF4757]">{error}</p>
          </div>
        )}

        {/* 카테고리 선택 */}
        <div>
          <p className="text-xs text-[#888] mb-2">카테고리</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-colors ${
                  category === cat.value
                    ? 'border-[#FF6B9D] bg-[#fff0f5] text-[#FF6B9D]'
                    : 'border-[#f0f0f0] text-[#555]'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <p className="text-xs text-[#888] mb-2">제목 <span className="text-[#FF4757]">*</span></p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 신한은행 계좌 정보"
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#FF6B9D]"
          />
        </div>

        {/* 중요도 */}
        <div>
          <p className="text-xs text-[#888] mb-2">중요도</p>
          <div className="flex gap-2">
            {(['important', 'reference'] as Importance[]).map((imp) => (
              <button
                key={imp}
                onClick={() => setImportance(imp)}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  importance === imp
                    ? imp === 'important'
                      ? 'border-[#FF6B9D] bg-[#fff0f5] text-[#FF6B9D]'
                      : 'border-[#B0B0B0] bg-[#f5f5f5] text-[#555]'
                    : 'border-[#f0f0f0] text-[#888]'
                }`}
              >
                {imp === 'important' ? '★ 중요' : '참고'}
              </button>
            ))}
          </div>
        </div>

        {/* 내용 */}
        <div>
          <p className="text-xs text-[#888] mb-2">내용 (암호화됨)</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="보관할 정보를 입력하세요&#10;예: 계좌번호, 주소, 계약 내용 등"
            rows={4}
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#FF6B9D] resize-none font-mono"
          />
        </div>

        {/* ID/PW 테이블 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#888]">계정 정보 (선택)</p>
            <button
              onClick={addCredential}
              className="text-xs text-[#FF6B9D] font-medium"
            >
              + 추가
            </button>
          </div>

          {credentials.map((cred, idx) => (
            <div key={idx} className="bg-[#fafafa] rounded-xl p-3 mb-2 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#1A1A1A]">계정 {idx + 1}</p>
                <button onClick={() => removeCredential(idx)} className="text-xs text-[#FF4757]">삭제</button>
              </div>
              {(['service', 'username', 'password', 'memo'] as const).map((field) => (
                <input
                  key={field}
                  type={field === 'password' ? 'password' : 'text'}
                  value={cred[field] ?? ''}
                  onChange={(e) => updateCredential(idx, field, e.target.value)}
                  placeholder={
                    field === 'service' ? '서비스명' :
                    field === 'username' ? '아이디' :
                    field === 'password' ? '비밀번호' : '메모 (선택)'
                  }
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm outline-none focus:border-[#FF6B9D] font-mono bg-white"
                />
              ))}
            </div>
          ))}
        </div>

        {/* 패스프레이즈 설정 */}
        <div className="bg-[#fff0f5] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔐</span>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">패스프레이즈 설정</p>
              <p className="text-[10px] text-[#888]">이 패스프레이즈로 내용이 암호화됩니다. 절대 잊지 마세요.</p>
            </div>
          </div>

          <div className="relative mb-2">
            <input
              type={showPass ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="패스프레이즈 (8자 이상)"
              className="w-full px-4 py-3 pr-16 border border-[#ffc0d4] rounded-xl text-sm font-mono outline-none focus:border-[#FF6B9D] bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-xs"
            >
              {showPass ? '숨기기' : '보기'}
            </button>
          </div>

          <input
            type={showPass ? 'text' : 'password'}
            value={passphraseConfirm}
            onChange={(e) => setPassphraseConfirm(e.target.value)}
            placeholder="패스프레이즈 확인"
            className="w-full px-4 py-3 border border-[#ffc0d4] rounded-xl text-sm font-mono outline-none focus:border-[#FF6B9D] bg-white"
          />
        </div>

        <div className="h-4" /> {/* 하단 여백 */}
      </div>
    </div>
  )
}
