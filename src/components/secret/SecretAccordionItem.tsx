'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { SecretCode } from '@/types/database'
import type { DecryptedSecretCode } from '@/hooks/useSecretCodes'
import { SecretCredentialTable } from './SecretCredentialTable'

interface SecretAccordionItemProps {
  code: SecretCode
  index: number           // 목록 순번 (01, 02…) — 프로토타입 기준
  isOpen: boolean
  onToggle: () => void
  onDelete: () => void
  onDecryptRequest: (code: SecretCode) => void
  decrypted?: DecryptedSecretCode
}

// 중요도 뱃지 — 프로토타입 badge-important / badge-reference
const IMPORTANCE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  important: { bg: '#FFF0F3', color: '#FF6B9D', label: '중요' },
  reference: { bg: '#F0F4FF', color: '#4A90D9', label: '참고' },
}

// 시크릿 코드 아코디언 아이템 — 왼쪽 보더 pink, 순번 숫자 표시
export function SecretAccordionItem({
  code,
  index,
  isOpen,
  onToggle,
  onDelete,
  onDecryptRequest,
  decrypted,
}: SecretAccordionItemProps) {
  const router = useRouter()
  const badge = IMPORTANCE_STYLE[code.importance] ?? IMPORTANCE_STYLE.reference
  const num = String(index + 1).padStart(2, '0') // 01, 02, 03…

  return (
    <div
      className={`bg-white border-b border-[#f5f5f5] transition-all ${
        isOpen ? 'border-l-[3px] border-l-[#FF6B9D]' : ''
      }`}
      id={`secret-${code.id}`}
    >
      {/* 아코디언 헤더 — 프로토타입: num + badge + title */}
      <div
        className="flex items-start gap-3 px-4 py-4 cursor-pointer active:bg-[#fafafa]"
        onClick={onToggle}
      >
        {/* 순번 숫자 */}
        <div className="flex-shrink-0 w-8 text-center pt-0.5">
          <span className="text-lg font-bold leading-none" style={{ color: '#FF6B9D' }}>
            {num}
          </span>
        </div>

        {/* 뱃지 + 제목 + 미리보기 */}
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-1"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
          <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug">{code.title}</h3>
          {!isOpen && (
            <p className="text-xs text-[#888] mt-0.5 truncate">
              {decrypted ? decrypted.decryptedContent ?? '•••' : '암호화된 내용'}
            </p>
          )}
        </div>

        {/* 잠금 + 쉐브론 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-sm text-[#B0B0B0]">{decrypted ? '🔓' : '🔒'}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#B0B0B0]"
          >
            ∨
          </motion.span>
        </div>
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
            <div className="px-4 pb-4 pl-[3.25rem]">
              {decrypted ? (
                <>
                  {decrypted.decryptedContent && (
                    <div className="mb-3">
                      <p className="text-xs text-[#888] mb-1">내용</p>
                      <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-mono">
                        {decrypted.decryptedContent}
                      </p>
                    </div>
                  )}
                  {decrypted.decryptedCredentials && decrypted.decryptedCredentials.length > 0 && (
                    <SecretCredentialTable credentials={decrypted.decryptedCredentials} />
                  )}
                </>
              ) : (
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
