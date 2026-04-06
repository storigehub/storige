'use client'

import { useState, useCallback } from 'react'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { FamilyMemberCard } from '@/components/family/FamilyMemberCard'
import { FamilyMemberForm } from '@/components/family/FamilyMemberForm'
import { SSSKeySetup } from '@/components/family/SSSKeySetup'
import { createClient } from '@/lib/supabase/client'
import type { FamilyRole } from '@/types/database'

type FormMode = 'closed' | 'add' | 'edit'

// 가족 구성원 관리 페이지
export default function FamilyPage() {
  const { members, loading, refetch } = useFamilyMembers()
  const [formMode, setFormMode] = useState<FormMode>('closed')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const editingMember = members.find((m) => m.id === editingId)

  const handleAdd = useCallback(
    async (data: { name: string; role: FamilyRole; phone: string; email: string }) => {
      setIsSaving(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from('family_members').insert({
        owner_id: user.id,
        name: data.name,
        role: data.role,
        phone: data.phone || null,
        email: data.email || null,
      })

      await refetch()
      setFormMode('closed')
      setIsSaving(false)
    },
    [refetch]
  )

  const handleEdit = useCallback(
    async (data: { name: string; role: FamilyRole; phone: string; email: string }) => {
      if (!editingId) return
      setIsSaving(true)
      const supabase = createClient()

      await supabase.from('family_members').update({
        name: data.name,
        role: data.role,
        phone: data.phone || null,
        email: data.email || null,
      }).eq('id', editingId)

      await refetch()
      setFormMode('closed')
      setEditingId(null)
      setIsSaving(false)
    },
    [editingId, refetch]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const supabase = createClient()
      await supabase.from('family_members').delete().eq('id', id)
      await refetch()
    },
    [refetch]
  )

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A1A]">가족 구성원</h1>
          <p className="text-xs text-[#888] mt-0.5">열람 권한과 SSS 키를 관리합니다</p>
        </div>
        {formMode === 'closed' && (
          <button
            onClick={() => setFormMode('add')}
            className="text-sm text-[#4A90D9] font-semibold"
          >
            + 추가
          </button>
        )}
      </div>

      {/* 추가/편집 폼 */}
      {formMode !== 'closed' && (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-4 mb-4">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
            {formMode === 'add' ? '새 가족 구성원' : '구성원 편집'}
          </h3>
          <FamilyMemberForm
            initialName={editingMember?.name}
            initialRole={(editingMember?.role as FamilyRole) ?? 'son'}
            initialPhone={editingMember?.phone ?? ''}
            initialEmail={editingMember?.email ?? ''}
            onSubmit={formMode === 'add' ? handleAdd : handleEdit}
            onCancel={() => { setFormMode('closed'); setEditingId(null) }}
            isLoading={isSaving}
          />
        </div>
      )}

      {/* 구성원 목록 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#4A90D9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
          <p className="text-sm text-[#888]">등록된 가족 구성원이 없습니다</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 py-2">
            {members.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onEdit={() => {
                  setEditingId(member.id)
                  setFormMode('edit')
                }}
                onDelete={() => handleDelete(member.id)}
              />
            ))}
          </div>
          <SSSKeySetup members={members} onDistributed={refetch} />
        </>
      )}
    </div>
  )
}
