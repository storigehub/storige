'use client'

import { getBadgeColor, getRoleLabel } from '@/hooks/useFamilyMembers'
import type { FamilyMember } from '@/types/database'

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: () => void
  onDelete: () => void
}

// 가족 구성원 카드 — 역할별 색상 뱃지
export function FamilyMemberCard({ member, onEdit, onDelete }: FamilyMemberCardProps) {
  const color = getBadgeColor(member.role)

  return (
    <div className="bg-white rounded-2xl border border-[#f0f0f0] p-4 flex items-center gap-3">
      {/* 아바타 */}
      <div
        className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg font-bold"
        style={{ backgroundColor: color }}
      >
        {member.name.charAt(0)}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">{member.name}</h3>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {getRoleLabel(member.role)}
          </span>
          {member.is_verified && (
            <span className="text-[10px] text-[#2ED573]">✓ 인증</span>
          )}
        </div>
        {member.phone && (
          <p className="text-xs text-[#888] mt-0.5">{member.phone}</p>
        )}
        {member.email && (
          <p className="text-xs text-[#888]">{member.email}</p>
        )}
      </div>

      {/* 액션 */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={onEdit}
          className="text-xs border border-[#e0e0e0] rounded-full px-3 py-1 text-[#555] hover:bg-[#f5f5f5]"
        >
          편집
        </button>
        <button
          onClick={onDelete}
          className="text-xs border border-[#FF4757] rounded-full px-3 py-1 text-[#FF4757] hover:bg-[#ffeef0]"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
