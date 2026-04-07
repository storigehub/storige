'use client'

import { useState } from 'react'
import { useSecretCodes } from '@/hooks/useSecretCodes'
import { SecretAccordionItem } from './SecretAccordionItem'
import { PassphraseModal } from './PassphraseModal'
import type { SecretCode } from '@/types/database'
import type { DecryptedSecretCode } from '@/hooks/useSecretCodes'

// 시크릿 코드 목록 뷰 — 아코디언 + 복호화 모달
export function SecretListView() {
  const { codes, loading, error, decryptCode, deleteCode } = useSecretCodes()
  const [openId, setOpenId] = useState<string | null>(null)
  const [decryptedMap, setDecryptedMap] = useState<Record<string, DecryptedSecretCode>>({})
  const [pendingCode, setPendingCode] = useState<SecretCode | null>(null)
  const [decryptError, setDecryptError] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
    if (openId !== id) {
      setTimeout(() => {
        document.getElementById(`secret-${id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 50)
    }
  }

  // 복호화 요청 — 패스프레이즈 모달 표시
  const handleDecryptRequest = (code: SecretCode) => {
    setDecryptError(null)
    setPendingCode(code)
  }

  // 패스프레이즈 입력 후 복호화 시도
  const handlePassphraseSubmit = async (passphrase: string) => {
    if (!pendingCode) return

    const result = await decryptCode(pendingCode, passphrase)
    if (!result) {
      setDecryptError('패스프레이즈가 올바르지 않습니다')
      return
    }

    setDecryptedMap((prev) => ({ ...prev, [pendingCode.id]: result }))
    setPendingCode(null)
    setDecryptError(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-sm text-[#888]">{error}</div>
  }

  if (codes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4">
        <span className="material-symbols-outlined text-5xl text-[#E91E63]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>lock</span>
        <h2 className="text-lg font-semibold text-[#1a1c1c] font-headline">중요한 정보를 안전하게 보관하세요</h2>
        <p className="text-sm text-[#747878]">은행 계좌, 부동산, 법률 정보를 암호화하여 저장합니다</p>
      </div>
    )
  }

  return (
    <>
      <div className="px-5 pb-4 space-y-4">
        {codes.map((code, index) => (
          <SecretAccordionItem
            key={code.id}
            code={code}
            index={index}
            isOpen={openId === code.id}
            onToggle={() => handleToggle(code.id)}
            onDelete={() => deleteCode(code.id)}
            onDecryptRequest={handleDecryptRequest}
            decrypted={decryptedMap[code.id]}
          />
        ))}
      </div>

      {/* 패스프레이즈 입력 모달 */}
      {pendingCode && (
        <PassphraseModal
          title={`"${pendingCode.title}" 열람`}
          error={decryptError}
          onSubmit={handlePassphraseSubmit}
          onCancel={() => { setPendingCode(null); setDecryptError(null) }}
        />
      )}
    </>
  )
}
