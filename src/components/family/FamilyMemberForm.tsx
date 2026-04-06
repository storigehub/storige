'use client'

import { useState } from 'react'
import { getBadgeColor, getRoleLabel } from '@/hooks/useFamilyMembers'
import type { FamilyRole } from '@/types/database'

const ROLES: FamilyRole[] = ['spouse', 'son', 'daughter', 'parent', 'lawyer', 'other']

interface FamilyMemberFormProps {
  initialName?: string
  initialRole?: FamilyRole
  initialPhone?: string
  initialEmail?: string
  onSubmit: (data: { name: string; role: FamilyRole; phone: string; email: string }) => void
  onCancel: () => void
  isLoading?: boolean
}

// 가족 구성원 추가/편집 폼
export function FamilyMemberForm({
  initialName = '',
  initialRole = 'son',
  initialPhone = '',
  initialEmail = '',
  onSubmit,
  onCancel,
  isLoading,
}: FamilyMemberFormProps) {
  const [name, setName] = useState(initialName)
  const [role, setRole] = useState<FamilyRole>(initialRole)
  const [phone, setPhone] = useState(initialPhone)
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('이름을 입력하세요'); return }
    setError(null)
    onSubmit({ name: name.trim(), role, phone: phone.trim(), email: email.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-xs text-[#FF4757]">{error}</p>
      )}

      {/* 역할 선택 */}
      <div>
        <p className="text-xs text-[#888] mb-2">역할</p>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((r) => {
            const color = getBadgeColor(r)
            const selected = role === r
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="py-2 rounded-xl border text-xs font-medium transition-all"
                style={
                  selected
                    ? { borderColor: color, backgroundColor: `${color}15`, color }
                    : { borderColor: '#f0f0f0', color: '#555' }
                }
              >
                {getRoleLabel(r)}
              </button>
            )
          })}
        </div>
      </div>

      {/* 이름 */}
      <div>
        <p className="text-xs text-[#888] mb-1.5">이름 <span className="text-[#FF4757]">*</span></p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#4A90D9]"
        />
      </div>

      {/* 연락처 */}
      <div>
        <p className="text-xs text-[#888] mb-1.5">휴대전화</p>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#4A90D9]"
        />
      </div>

      {/* 이메일 */}
      <div>
        <p className="text-xs text-[#888] mb-1.5">이메일</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#4A90D9]"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#555]"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-semibold disabled:opacity-40"
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
