'use client'

import type { CredentialEntry } from '@/hooks/useSecretCodes'

interface SecretCredentialFieldsProps {
  credentials: CredentialEntry[]
  onAdd: () => void
  onUpdate: (idx: number, field: keyof CredentialEntry, value: string) => void
  onRemove: (idx: number) => void
}

const FIELD_META: { key: keyof CredentialEntry; label: string; placeholder: string; mono: boolean }[] = [
  { key: 'service',  label: '서비스',  placeholder: '예: 신한은행 인터넷뱅킹',  mono: false },
  { key: 'username', label: '아이디',  placeholder: '로그인 아이디 또는 이메일', mono: true  },
  { key: 'password', label: '비밀번호', placeholder: '••••••••',               mono: true  },
  { key: 'memo',     label: '메모',    placeholder: '추가 정보 (선택)',          mono: false },
]

// 계정 정보 입력 필드 목록 — tonal card + ghost input 스타일
export function SecretCredentialFields({
  credentials,
  onAdd,
  onUpdate,
  onRemove,
}: SecretCredentialFieldsProps) {
  return (
    <div>
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-[#747878] uppercase tracking-[0.2em] font-bold">계정 정보</p>
          <p className="text-[11px] text-[#747878] mt-0.5">아이디/비밀번호 쌍을 구조화하여 저장 (선택)</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-[#E91E63] text-xs font-semibold hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
            add
          </span>
          계정 추가
        </button>
      </div>

      {credentials.length === 0 && (
        <button
          onClick={onAdd}
          className="w-full py-4 border border-dashed border-[#C4C7C7]/60 rounded-[1.25rem] flex items-center justify-center gap-2 text-[#747878] text-sm hover:border-[#E91E63]/40 hover:text-[#E91E63] transition-colors"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
            add_circle
          </span>
          계정 정보 추가
        </button>
      )}

      <div className="space-y-3">
        {credentials.map((cred, idx) => (
          <div key={idx} className="bg-[#F3F3F3] rounded-[1.25rem] overflow-hidden">
            {/* 카드 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C4C7C7]/20">
              <p className="text-[10px] text-[#747878] uppercase tracking-[0.2em] font-bold">계정 {idx + 1}</p>
              <button
                onClick={() => onRemove(idx)}
                className="flex items-center gap-1 text-[#747878] text-[11px] hover:text-[#BA1A1A] transition-colors"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                  delete
                </span>
                삭제
              </button>
            </div>

            {/* 필드 목록 */}
            <div className="px-4 pb-2">
              {FIELD_META.map((meta) => (
                <div key={meta.key} className="py-3 border-b border-[#C4C7C7]/20 last:border-0">
                  <p className="text-[10px] text-[#747878] uppercase tracking-[0.15em] font-bold mb-1.5">{meta.label}</p>
                  <input
                    type={meta.key === 'password' ? 'password' : 'text'}
                    value={cred[meta.key] ?? ''}
                    onChange={(e) => onUpdate(idx, meta.key, e.target.value)}
                    placeholder={meta.placeholder}
                    className={`w-full bg-transparent text-sm text-[#1A1C1C] placeholder:text-[#C4C7C7] outline-none ${meta.mono ? 'font-mono' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
