'use client'

import { getBadgeColor, getRoleLabel } from '@/hooks/useFamilyMembers'
import type { FamilyMember } from '@/types/database'

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: () => void
  onDelete: () => void
}

// 가족 구성원 원형 뱃지 카드 — 프로토타입 .family-circle 기준
export function FamilyMemberCard({ member, onEdit, onDelete }: FamilyMemberCardProps) {
  const color = getBadgeColor(member.role)

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* 원형 아바타 (48px) */}
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
          style={{ backgroundColor: color }}
        >
          {member.name.charAt(0)}
        </div>
        {member.is_verified && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#2ED573] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
            ✓
          </span>
        )}
      </div>

      {/* 이름 */}
      <p className="text-xs font-semibold text-[#1A1A1A] text-center leading-tight max-w-[60px] truncate">
        {member.name}
      </p>

      {/* 역할 뱃지 */}
      <span
        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white leading-none"
        style={{ backgroundColor: color }}
      >
        {getRoleLabel(member.role)}
      </span>

      {/* 편집/삭제 */}
      <div className="flex gap-1 mt-0.5">
        <button
          onClick={onEdit}
          className="text-[10px] text-[#888] border border-[#e0e0e0] rounded-full px-2 py-0.5 hover:bg-[#f5f5f5]"
        >
          편집
        </button>
        <button
          onClick={onDelete}
          className="text-[10px] text-[#FF4757] border border-[#FF4757] rounded-full px-2 py-0.5 hover:bg-[#ffeef0]"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
