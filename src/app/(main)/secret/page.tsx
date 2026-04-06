'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { SecretListView } from '@/components/secret/SecretListView'

// 시크릿 코드 메인 페이지
export default function SecretPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="px-4 py-4 bg-white border-b border-[#f0f0f0]">
        <h1 className="text-lg font-bold text-[#1A1A1A]">시크릿 코드</h1>
        <p className="text-xs text-[#888] mt-0.5">중요한 정보를 암호화하여 안전하게 보관합니다</p>
      </div>

      <SecretListView />
    </div>
  )
}
