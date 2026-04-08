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

// 중요도 뱃지 — _1 템플릿 기준
const IMPORTANCE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  important: { bg: '#fce4ec', color: '#E91E63', label: '중요' },
  reference: { bg: '#d2e4ff', color: '#0061A5', label: '참고' },
}

// 카테고리별 아이콘
const CATEGORY_ICON: Record<string, string> = {
  '금융': 'account_balance',
  '부동산': 'domain',
  '법률': 'gavel',
  '암호화폐': 'currency_bitcoin',
}

/**
 * 시크릿 코드 아코디언 아이템 — _1 템플릿 공식 기준
 * 닫힘: w-16 h-16 아이콘 박스 + 2xl 제목 + 중요도 뱃지 + hover translate-y-[-2px]
 * 열림: 그라디언트 테두리 + JetBrains Mono 값 테이블 + "정보 공개" 버튼
 */
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
  const categoryIcon = CATEGORY_ICON[code.category] ?? 'security'

  const cardContent = (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'bg-white border border-outline-variant/30 shadow-[0_12px_40px_rgba(233,30,99,0.08)]'
          : 'bg-white border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] cursor-pointer'
      }`}
      id={`secret-${code.id}`}
    >
      {/* 아코디언 헤더 */}
      <div
        className={`flex items-center justify-between gap-5 transition-colors ${
          isOpen ? 'p-6 md:p-8' : 'p-5 md:p-6 hover:bg-[#fafafa]'
        } cursor-pointer`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-5 min-w-0">
          {/* 대형 아이콘 박스 */}
          <div
            className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] flex items-center justify-center transition-colors"
            style={{ backgroundColor: isOpen ? '#fce4ec' : '#f3f3f3' }}
          >
            <span
              className="material-symbols-outlined text-2xl md:text-3xl transition-colors"
              style={{
                color: isOpen ? '#E91E63' : '#747878',
                fontVariationSettings: isOpen ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {decrypted ? 'lock_open' : categoryIcon}
            </span>
          </div>

          {/* 제목 + 뱃지 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md"
                style={{ backgroundColor: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
              {decrypted && (
                <span className="text-[10px] font-bold text-dear flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                  열람됨
                </span>
              )}
            </div>
            <h3 className="font-headline font-extrabold text-lg md:text-2xl text-on-surface leading-tight truncate">
              {code.title}
            </h3>
            {!isOpen && (
              <p className="text-sm text-outline mt-0.5 font-mono truncate">
                {decrypted ? (decrypted.decryptedContent?.slice(0, 30) ?? '•••') : '****-****-****'}
              </p>
            )}
          </div>
        </div>

        {/* 잠금 상태 + 쉐브론 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{
                color: decrypted ? '#006B5F' : '#c4c7c7',
                fontVariationSettings: decrypted ? "'FILL' 1" : "'FILL' 1",
              }}
            >
              {decrypted ? 'lock_open' : 'lock'}
            </span>
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[22px] text-outline"
          >
            expand_more
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
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-8 pb-6 md:pb-8 border-t border-surface-container-low">
              {decrypted ? (
                <div className="pt-5 space-y-1">
                  {/* 알고리즘 정보 행 */}
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                    <span className="text-outline text-sm font-semibold">암호화 방식</span>
                    <span className="font-mono text-primary font-bold text-sm">AES-256-GCM</span>
                  </div>

                  {/* 복호화된 내용 */}
                  {decrypted.decryptedContent && (
                    <div className="py-4 border-b border-outline-variant/20">
                      <p className="text-[10px] text-outline font-bold uppercase tracking-widest mb-3">내용</p>
                      <p className="font-mono text-on-surface font-bold text-sm leading-relaxed whitespace-pre-wrap bg-[#f9f9f9] rounded-xl p-4">
                        {decrypted.decryptedContent}
                      </p>
                    </div>
                  )}

                  {/* 계정 자격증명 테이블 */}
                  {decrypted.decryptedCredentials && decrypted.decryptedCredentials.length > 0 && (
                    <div className="pt-2">
                      <SecretCredentialTable credentials={decrypted.decryptedCredentials} />
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => router.push(`/secret/${code.id}/edit`)}
                      className="flex-1 py-3 border border-outline-variant/50 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={onDelete}
                      className="px-5 py-3 rounded-xl text-sm font-bold text-error hover:bg-error-container/40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] align-middle">delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-5 space-y-4">
                  <p className="text-sm text-outline leading-relaxed">
                    이 항목은 AES-256-GCM으로 암호화되어 있습니다.<br />
                    패스프레이즈를 입력해 내용을 열람하세요.
                  </p>
                  <button
                    onClick={() => onDecryptRequest(code)}
                    className="w-full py-4 bg-on-surface text-white rounded-xl text-sm font-bold hover:bg-[#2f3131] transition-all active:scale-[0.98]"
                  >
                    정보 공개
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/secret/${code.id}/edit`)}
                      className="flex-1 py-3 border border-outline-variant/50 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={onDelete}
                      className="px-5 py-3 rounded-xl text-sm font-bold text-error hover:bg-error-container/40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] align-middle">delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // 열린 상태: 그라디언트 테두리 래퍼 적용 (_1 crypto card 스타일)
  if (isOpen) {
    return (
      <div className="relative p-[1.5px] rounded-xl bg-gradient-to-br from-pink-accent/20 via-primary/20 to-pink-accent/20">
        {cardContent}
      </div>
    )
  }

  return cardContent
}
