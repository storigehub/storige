'use client'

import { getBadgeColor, getRoleLabel } from '@/hooks/useFamilyMembers'
import type { FamilyMember } from '@/types/database'

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: () => void
  onDelete: () => void
}

// 가족 구성원 카드 — _3 기준 원형 아바타 + 역할 컬러 링 + 인증 뱃지
export function FamilyMemberCard({ member, onEdit, onDelete }: FamilyMemberCardProps) {
  const ringColor = getBadgeColor(member.role)
  const roleLabel = getRoleLabel(member.role)

  return (
    <div className="p-6 rounded-xl bg-white flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
      {/* 원형 아바타 + 역할 컬러 링 */}
      <div className="relative mb-3">
        <div
          className="w-16 h-16 rounded-full p-[3px] flex items-center justify-center"
          style={{ border: `2.5px solid ${ringColor}` }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white text-xl font-extrabold font-headline"
            style={{ backgroundColor: ringColor }}
          >
            {member.name.charAt(0)}
          </div>
        </div>

        {/* 인증/미인증 뱃지 */}
        <div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: member.is_verified ? '#2ED573' : '#C4C7C7' }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1, 'wght' 600" }}
          >
            {member.is_verified ? 'verified' : 'schedule'}
          </span>
        </div>
      </div>

      {/* 이름 */}
      <p className="font-bold text-on-surface text-sm font-headline leading-tight">
        {member.name}
      </p>

      {/* 역할 */}
      <p className="text-[0.6875rem] font-medium mt-1" style={{ color: ringColor }}>
        {roleLabel}
      </p>

      {/* 편집/삭제 */}
      <div className="flex gap-1.5 mt-4">
        <button
          onClick={onEdit}
          className="text-[11px] font-semibold text-outline border border-outline-variant/40 rounded-lg px-3 py-1.5 hover:bg-surface-container-low transition-colors"
        >
          편집
        </button>
        <button
          onClick={onDelete}
          className="text-[11px] font-semibold text-error border border-error/20 rounded-lg px-3 py-1.5 hover:bg-error-container/30 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
