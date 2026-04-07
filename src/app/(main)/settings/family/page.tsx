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
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.2em] font-bold text-[#747878] uppercase mb-1">계정 관리</p>
          <h1 className="text-2xl font-extrabold text-[#1a1c1c] font-headline">가족 구성원</h1>
          <p className="text-xs text-[#747878] mt-0.5">열람 권한과 SSS 키를 관리합니다</p>
        </div>
        {formMode === 'closed' && (
          <button
            onClick={() => setFormMode('add')}
            className="w-9 h-9 rounded-full bg-[#0061A5] text-white flex items-center justify-center hover:bg-[#004c82] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        )}
      </div>

      {/* 추가/편집 폼 */}
      {formMode !== 'closed' && (
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 mb-4">
          <h3 className="text-sm font-semibold text-[#1a1c1c] mb-3 font-headline">
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
          <div className="w-6 h-6 border-2 border-[#0061A5] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-[#747878] block mb-3" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>group</span>
          <p className="text-sm text-[#747878]">등록된 가족 구성원이 없습니다</p>
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
