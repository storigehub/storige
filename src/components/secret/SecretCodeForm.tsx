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
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#f0f0f0]">
        <button onClick={() => router.back()} className="text-[#888] text-sm">취소</button>
        <h2 className="text-sm font-semibold text-[#1A1A1A]">시크릿 코드 등록</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-[#E91E63] font-semibold text-sm disabled:opacity-40"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {error && (
          <div className="bg-[#ffeef0] border border-[#FF4757] rounded-xl p-3">
            <p className="text-xs text-[#FF4757]">{error}</p>
          </div>
        )}

        {/* 카테고리 */}
        <div>
          <p className="text-xs text-[#888] mb-2">카테고리</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-colors ${
                  category === cat.value
                    ? 'border-[#E91E63] bg-[#fff0f5] text-[#E91E63]'
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
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#E91E63]"
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
                      ? 'border-[#E91E63] bg-[#fff0f5] text-[#E91E63]'
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
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#E91E63] resize-none font-mono"
          />
        </div>

        <SecretCredentialFields
          credentials={credentials}
          onAdd={() => setCredentials((prev) => [...prev, { service: '', username: '', password: '', memo: '' }])}
          onUpdate={(idx, field, value) =>
            setCredentials((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))
          }
          onRemove={(idx) => setCredentials((prev) => prev.filter((_, i) => i !== idx))}
        />

        <SecretPassphraseSection
          passphrase={passphrase}
          passphraseConfirm={passphraseConfirm}
          showPass={showPass}
          onPassphraseChange={setPassphrase}
          onPassphraseConfirmChange={setPassphraseConfirm}
          onShowPassToggle={() => setShowPass((v) => !v)}
        />

        <div className="h-4" />
      </div>
    </div>
  )
}
