'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { SecretCode } from '@/types/database'
import type { DecryptedSecretCode } from '@/hooks/useSecretCodes'
import { SecretCredentialTable } from './SecretCredentialTable'

interface SecretAccordionItemProps {
  code: SecretCode
  index: number
  isOpen: boolean
  onToggle: () => void
  onDelete: () => void
  onDecryptRequest: (code: SecretCode) => void
  decrypted?: DecryptedSecretCode
}

// 중요도 뱃지 스타일 — Midnight Archive (_4 템플릿)
const IMPORTANCE_STYLE: Record<string, { bg: string; color: string; label: string; icon: string }> = {
  important: { bg: '#fce4ec', color: '#E91E63', label: '중요', icon: 'priority_high' },
  reference: { bg: '#d2e4ff', color: '#0061A5', label: '참고', icon: 'info' },
}

// 시크릿 코드 아코디언 아이템 — Midnight Archive / _4 템플릿 디자인
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
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'bg-white shadow-sm border-[1.5px] border-[#E91E63]/40'
          : 'bg-[#f3f3f3]'
      }`}
      id={`secret-${code.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className="flex items-center gap-3 px-4 py-4 cursor-pointer active:opacity-80"
        onClick={onToggle}
      >
        {/* 보안 아이콘 + 순번 */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: isOpen ? '#fce4ec' : '#eeeeee' }}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{
              color: isOpen ? '#E91E63' : '#747878',
              fontVariationSettings: isOpen ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {decrypted ? 'lock_open' : 'security'}
          </span>
        </div>

        {/* 제목 + 미리보기 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {badge.label}
            </span>
            <span className="text-[10px] text-[#747878] font-mono">{num}</span>
          </div>
          <h3 className="text-sm font-semibold text-[#1a1c1c]">{code.title}</h3>
          {!isOpen && (
            <p className="text-xs text-[#747878] mt-0.5 font-mono truncate">
              {decrypted ? (decrypted.decryptedContent ?? '•••') : '****-****-****'}
            </p>
          )}
        </div>

        {/* 잠금 상태 + 쉐브론 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{
              color: decrypted ? '#006B5F' : '#747878',
              fontVariationSettings: decrypted ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {decrypted ? 'lock_open' : 'lock'}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[20px] text-[#747878]"
          >
            keyboard_arrow_down
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
            <div className="px-4 pb-4 border-t border-[#f3f3f3]">
              {decrypted ? (
                <div className="pt-3 space-y-3">
                  {/* 알고리즘 + 접근 키 — _4 템플릿 스타일 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#747878]">Algorithm</span>
                    <span className="font-mono text-[#0061A5] font-medium">AES-256-GCM</span>
                  </div>
                  {decrypted.decryptedContent && (
                    <div className="mt-1">
                      <p className="text-xs text-[#747878] mb-1">내용</p>
                      <p className="text-sm text-[#1a1c1c] leading-relaxed whitespace-pre-wrap font-mono bg-[#f3f3f3] rounded-lg p-3">
                        {decrypted.decryptedContent}
                      </p>
                    </div>
                  )}
                  {decrypted.decryptedCredentials && decrypted.decryptedCredentials.length > 0 && (
                    <SecretCredentialTable credentials={decrypted.decryptedCredentials} />
                  )}
                </div>
              ) : (
                <div className="pt-3 flex items-center gap-2">
                  <p className="text-sm text-[#747878] flex-1">암호화된 내용입니다</p>
                  <button
                    onClick={() => onDecryptRequest(code)}
                    className="flex items-center gap-1 text-xs rounded-full px-4 py-2 font-bold transition-colors bg-[#0061A5] text-white hover:bg-[#004c82] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    열람하기
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => router.push(`/secret/${code.id}/edit`)}
                  className="flex items-center gap-1 text-xs bg-[#f3f3f3] rounded-full px-3 py-1.5 text-[#444748] hover:bg-[#eeeeee] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  편집
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 text-xs bg-[#fff0f0] rounded-full px-3 py-1.5 text-[#ba1a1a] hover:bg-[#ffe0e0] transition-colors ml-auto"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  삭제
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
