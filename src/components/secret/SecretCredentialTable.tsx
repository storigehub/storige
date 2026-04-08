'use client'

import { useState } from 'react'
import type { CredentialEntry } from '@/hooks/useSecretCodes'

interface SecretCredentialTableProps {
  credentials: CredentialEntry[]
}

/**
 * 복호화된 계정 정보 테이블 — _1 JetBrains Mono label/value row 기준
 * label: text-outline text-sm font-semibold
 * value: font-mono font-bold text-base (공개) / text-pink-accent tracking-[0.3em] (마스킹)
 */
export function SecretCredentialTable({ credentials }: SecretCredentialTableProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldKey)
      setTimeout(() => setCopiedField(null), 1500)
    })
  }

  const togglePasswordVisibility = (fieldKey: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev)
      next.has(fieldKey) ? next.delete(fieldKey) : next.add(fieldKey)
      return next
    })
  }

  return (
    <div>
      <p className="text-[10px] text-outline font-bold uppercase tracking-widest mb-3">계정 정보</p>
      {credentials.map((cred, i) => (
        <div key={i} className={i > 0 ? 'mt-4 pt-4 border-t border-surface-container-low' : ''}>
          {/* 서비스명 */}
          <p className="text-sm font-bold text-on-surface mb-2">{cred.service}</p>

          {/* 아이디 행 */}
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
            <span className="text-outline text-sm font-semibold">온라인 ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-on-surface font-bold text-sm">{cred.username}</span>
              <button
                onClick={() => handleCopy(cred.username, `${i}-user`)}
                className="text-[10px] font-bold text-primary hover:text-[#004c82] transition-colors min-w-[2rem] text-right"
              >
                {copiedField === `${i}-user` ? '✓' : '복사'}
              </button>
            </div>
          </div>

          {/* 비밀번호 행 */}
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
            <span className="text-outline text-sm font-semibold">접속 비밀번호</span>
            <div className="flex items-center gap-2">
              <span
                className="font-mono font-bold text-sm"
                style={{
                  color: visiblePasswords.has(`${i}-pass`) ? '#1a1c1c' : '#E91E63',
                  letterSpacing: visiblePasswords.has(`${i}-pass`) ? '0' : '0.3em',
                }}
              >
                {visiblePasswords.has(`${i}-pass`) ? cred.password : '••••••••••'}
              </span>
              <button
                onClick={() => togglePasswordVisibility(`${i}-pass`)}
                className="material-symbols-outlined text-[14px] text-outline hover:text-on-surface transition-colors"
              >
                {visiblePasswords.has(`${i}-pass`) ? 'visibility_off' : 'visibility'}
              </button>
              <button
                onClick={() => handleCopy(cred.password, `${i}-pass`)}
                className="text-[10px] font-bold text-primary hover:text-[#004c82] transition-colors min-w-[2rem] text-right"
              >
                {copiedField === `${i}-pass` ? '✓' : '복사'}
              </button>
            </div>
          </div>

          {/* 메모 */}
          {cred.memo && (
            <div className="flex justify-between items-center py-3">
              <span className="text-outline text-sm font-semibold">메모</span>
              <span className="font-mono text-on-surface text-sm">{cred.memo}</span>
            </div>
          )}
        </div>
      ))}

      {/* 보안 푸터 */}
      <p className="flex items-center gap-1.5 text-[11px] text-outline/60 mt-4 italic">
        <span className="material-symbols-outlined text-[12px]">info</span>
        2단계 인증으로 보호되는 정보입니다
      </p>
    </div>
  )
}
