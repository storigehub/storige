'use client'

import { useState } from 'react'
import { useSecretCodes } from '@/hooks/useSecretCodes'
import { SecretAccordionItem } from './SecretAccordionItem'
import { PassphraseModal } from './PassphraseModal'
import type { SecretCode } from '@/types/database'
import type { DecryptedSecretCode } from '@/hooks/useSecretCodes'

interface SecretListViewProps {
  selectedCategory?: string
}

/**
 * 시크릿 코드 목록 뷰 — _1 기준
 * selectedCategory: 'all' 또는 카테고리 문자열로 필터
 */
export function SecretListView({ selectedCategory = 'all' }: SecretListViewProps) {
  const { codes, loading, error, decryptCode, deleteCode } = useSecretCodes()
  const [openId, setOpenId] = useState<string | null>(null)
  const [decryptedMap, setDecryptedMap] = useState<Record<string, DecryptedSecretCode>>({})
  const [pendingCode, setPendingCode] = useState<SecretCode | null>(null)
  const [decryptError, setDecryptError] = useState<string | null>(null)

  // 카테고리 필터 적용
  const filteredCodes = selectedCategory === 'all'
    ? codes
    : codes.filter((c) => c.category === selectedCategory)

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

  const handleDecryptRequest = (code: SecretCode) => {
    setDecryptError(null)
    setPendingCode(code)
  }

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
        <div className="w-6 h-6 border-2 border-pink-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-sm text-[#888]">{error}</div>
  }

  if (codes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4 px-4">
        <span className="material-symbols-outlined text-5xl text-pink-accent" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>lock</span>
        <h2 className="text-lg font-semibold text-on-surface font-headline">중요한 정보를 안전하게 보관하세요</h2>
        <p className="text-sm text-outline">은행 계좌, 부동산, 법률 정보를 암호화하여 저장합니다</p>
      </div>
    )
  }

  if (filteredCodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] text-center gap-3 px-4">
        <span className="material-symbols-outlined text-4xl text-outline-variant">search_off</span>
        <p className="text-sm text-outline">이 카테고리에 저장된 항목이 없습니다</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {filteredCodes.map((code, index) => (
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
