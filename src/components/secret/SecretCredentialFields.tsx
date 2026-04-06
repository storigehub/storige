'use client'

import type { CredentialEntry } from '@/hooks/useSecretCodes'

interface SecretCredentialFieldsProps {
  credentials: CredentialEntry[]
  onAdd: () => void
  onUpdate: (idx: number, field: keyof CredentialEntry, value: string) => void
  onRemove: (idx: number) => void
}

// 계정 정보 입력 필드 목록 — 추가/수정/삭제
export function SecretCredentialFields({
  credentials,
  onAdd,
  onUpdate,
  onRemove,
}: SecretCredentialFieldsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-[#888]">계정 정보 (선택)</p>
        <button onClick={onAdd} className="text-xs text-[#FF6B9D] font-medium">
          + 추가
        </button>
      </div>

      {credentials.map((cred, idx) => (
        <div key={idx} className="bg-[#fafafa] rounded-xl p-3 mb-2 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#1A1A1A]">계정 {idx + 1}</p>
            <button onClick={() => onRemove(idx)} className="text-xs text-[#FF4757]">
              삭제
            </button>
          </div>
          {(['service', 'username', 'password', 'memo'] as const).map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : 'text'}
              value={cred[field] ?? ''}
              onChange={(e) => onUpdate(idx, field, e.target.value)}
              placeholder={
                field === 'service' ? '서비스명' :
                field === 'username' ? '아이디' :
                field === 'password' ? '비밀번호' : '메모 (선택)'
              }
              className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm outline-none focus:border-[#FF6B9D] font-mono bg-white"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
