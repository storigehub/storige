'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { SecretCode } from '@/types/database'
import type { DecryptedSecretCode, CredentialEntry } from '@/hooks/useSecretCodes'

interface SecretAccordionItemProps {
  code: SecretCode
  isOpen: boolean
  onToggle: () => void
  onDelete: () => void
  onDecryptRequest: (code: SecretCode) => void
  decrypted?: DecryptedSecretCode
}

// 카테고리 한글 라벨
const CATEGORY_LABEL: Record<string, string> = {
  finance: '금융',
  real_estate: '부동산',
  legal: '법률',
  crypto: '가상자산',
  business: '사업',
  other: '기타',
}

// 중요도 색상
const IMPORTANCE_COLOR: Record<string, string> = {
  important: '#FF6B9D',
  reference: '#B0B0B0',
}

// 시크릿 코드 아코디언 아이템 — 왼쪽 보더 pink
export function SecretAccordionItem({
  code,
  isOpen,
  onToggle,
  onDelete,
  onDecryptRequest,
  decrypted,
}: SecretAccordionItemProps) {
  const router = useRouter()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    })
  }

  const importanceColor = IMPORTANCE_COLOR[code.importance] ?? '#B0B0B0'

  return (
    <div
      className={`bg-white border-b border-[#f5f5f5] transition-all ${
        isOpen ? 'border-l-4 border-l-[#FF6B9D]' : ''
      }`}
      id={`secret-${code.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-[#fafafa]"
        onClick={onToggle}
      >
        {/* 카테고리 아이콘 */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#fff0f5] flex items-center justify-center text-lg">
          {getCategoryIcon(code.category)}
        </div>

        {/* 제목 + 카테고리 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-[#888]">{CATEGORY_LABEL[code.category] ?? code.category}</span>
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${importanceColor}20`, color: importanceColor }}
            >
              {code.importance === 'important' ? '중요' : '참고'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">{code.title}</h3>
        </div>

        {/* 잠금 아이콘 */}
        <span className="text-[#B0B0B0] flex-shrink-0 mr-1 text-sm">
          {decrypted ? '🔓' : '🔒'}
        </span>

        {/* 쉐브론 */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#B0B0B0] flex-shrink-0"
        >
          ∨
        </motion.span>
      </div>

      {/* 아코디언 콘텐츠 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-[3.75rem]">
              {decrypted ? (
                // 복호화된 내용 표시
                <>
                  {decrypted.decryptedContent && (
                    <div className="mb-3">
                      <p className="text-xs text-[#888] mb-1">내용</p>
                      <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-mono">
                        {decrypted.decryptedContent}
                      </p>
                    </div>
                  )}

                  {/* ID/PW 테이블 */}
                  {decrypted.decryptedCredentials && decrypted.decryptedCredentials.length > 0 && (
                    <CredentialTable
                      credentials={decrypted.decryptedCredentials}
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  )}
                </>
              ) : (
                // 잠김 상태
                <div className="flex items-center gap-2 py-2 mb-3">
                  <span className="text-sm text-[#888]">암호화된 내용입니다</span>
                  <button
                    onClick={() => onDecryptRequest(code)}
                    className="text-xs border border-[#FF6B9D] rounded-full px-3 py-1 text-[#FF6B9D] hover:bg-[#fff0f5]"
                  >
                    🔓 열람하기
                  </button>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => router.push(`/secret/${code.id}/edit`)}
                  className="text-xs border border-[#e0e0e0] rounded-full px-3 py-1 text-[#555] hover:bg-[#f5f5f5]"
                >
                  ✎ 편집
                </button>
                <button
                  onClick={onDelete}
                  className="text-xs border border-[#FF4757] rounded-full px-3 py-1 text-[#FF4757] hover:bg-[#ffeef0] ml-auto"
                >
                  ✕ 삭제
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ID/PW 테이블 — 복사 버튼 포함
function CredentialTable({
  credentials,
  copiedField,
  onCopy,
}: {
  credentials: CredentialEntry[]
  copiedField: string | null
  onCopy: (text: string, field: string) => void
}) {
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
                onClick={() => onCopy(cred.username, `${i}-user`)}
                className="text-[#4A90D9] pl-2"
              >
                {copiedField === `${i}-user` ? '✓' : '복사'}
              </button>

              <span className="text-[#888]">비밀번호</span>
              <span className="font-mono text-[#1A1A1A] truncate">{cred.password}</span>
              <button
                onClick={() => onCopy(cred.password, `${i}-pass`)}
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

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    finance: '💳',
    real_estate: '🏠',
    legal: '⚖️',
    crypto: '₿',
    business: '💼',
    other: '🔐',
  }
  return icons[category] ?? '🔐'
}
