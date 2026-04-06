'use client'

import { useState } from 'react'
import type { CredentialEntry } from '@/hooks/useSecretCodes'

interface SecretCredentialTableProps {
  credentials: CredentialEntry[]
}

// 복호화된 계정 정보 테이블 — 복사 버튼 포함
export function SecretCredentialTable({ credentials }: SecretCredentialTableProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    })
  }

  return (
    <div className="mb-3">
      <p className="text-xs text-[#888] mb-2">계정 정보</p>
      <div className="rounded-xl border border-[#f0f0f0] overflow-hidden">
        {credentials.map((cred, i) => (
          <div key={i} className={`p-3 ${i > 0 ? 'border-t border-[#f5f5f5]' : ''}`}>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">{cred.service}</p>
            <div className="grid grid-cols-[60px_1fr_auto] gap-1 text-xs">
              <span className="text-[#888]">아이디</span>
              <span className="font-mono text-[#1A1A1A] truncate">{cred.username}</span>
              <button
                onClick={() => handleCopy(cred.username, `${i}-user`)}
                className="text-[#4A90D9] pl-2"
              >
                {copiedField === `${i}-user` ? '✓' : '복사'}
              </button>

              <span className="text-[#888]">비밀번호</span>
              <span className="font-mono text-[#1A1A1A] truncate">{cred.password}</span>
              <button
                onClick={() => handleCopy(cred.password, `${i}-pass`)}
                className="text-[#4A90D9] pl-2"
              >
                {copiedField === `${i}-pass` ? '✓' : '복사'}
              </button>
            </div>
            {cred.memo && (
              <p className="text-xs text-[#888] mt-1.5">{cred.memo}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
