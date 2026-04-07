'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

/**
 * 설정 허브 — Midnight Archive / _6 템플릿 기준
 * BottomNav "/settings" 404 해소 + 주요 섹션 진입 카드
 */
export default function SettingsPage() {
  const router = useRouter()
  const { profile, signOut } = useAuth()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-32 space-y-8">
      {/* 페이지 타이틀 */}
      <section className="py-2">
        <p className="text-[10px] tracking-[0.2em] text-[#747878] uppercase mb-2 font-bold">Account &amp; Storage</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1c1c] leading-tight font-headline">내 스토리지 관리</h2>
      </section>

      {/* 프로필 브리프 */}
      <button
        onClick={() => router.push('/settings/profile')}
        className="w-full bg-white p-5 flex items-center justify-between shadow-sm border-l-4 border-[#0061A5] rounded-r text-left active:bg-[#f3f3f3] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#e8e8e8] overflow-hidden flex items-center justify-center text-lg font-bold text-[#747878]">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
              : (profile?.full_name?.[0]?.toUpperCase() ?? '?')}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#1a1c1c]">{profile?.full_name ?? '사용자'}</h3>
            <p className="text-sm text-[#747878]">{profile?.email}</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#747878]">chevron_right</span>
      </button>

      {/* 가족 설정 섹션 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold tracking-widest text-[#747878] uppercase">가족 설정</h4>
          <button
            onClick={() => router.push('/settings/family')}
            className="text-xs text-[#0061A5] font-bold"
          >
            관리하기
          </button>
        </div>
        <div className="bg-white p-5 shadow-sm space-y-4 rounded">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-bold text-base text-[#1a1c1c]">가족 구성원 관리</p>
              <p className="text-sm text-[#444748]">열람 권한 및 SSS 복구 키 관리</p>
            </div>
            <span className="material-symbols-outlined text-[#0061A5] text-2xl">group</span>
          </div>
          <button
            onClick={() => router.push('/settings/family')}
            className="w-full py-3 bg-[#f3f3f3] text-[#1a1c1c] text-sm font-bold flex items-center justify-center gap-2 rounded transition-colors active:bg-[#eeeeee]"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            구성원 추가 / 편집
          </button>
        </div>
      </section>

      {/* 보안 설정 섹션 */}
      <section className="space-y-4">
        <h4 className="text-xs font-bold tracking-widest text-[#747878] uppercase">보안 설정</h4>
        <div className="bg-white shadow-sm divide-y divide-[#eeeeee] rounded overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#d2e4ff] text-[#0061A5] rounded">
                <span className="material-symbols-outlined">fingerprint</span>
              </div>
              <div>
                <p className="font-bold text-sm text-[#1a1c1c]">생체 인식 잠금</p>
                <p className="text-xs text-[#747878]">Face ID / 지문 사용</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-[#0061A5] rounded-full relative p-1 flex items-center justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button
            onClick={() => router.push('/secret')}
            className="w-full p-5 flex items-center justify-between active:bg-[#f3f3f3] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#d2e4ff] text-[#0061A5] rounded">
                <span className="material-symbols-outlined">history_edu</span>
              </div>
              <div>
                <p className="font-bold text-sm text-[#1a1c1c]">비밀 코드</p>
                <p className="text-xs text-[#747878]">E2EE 암호화 중요 정보 보관</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#747878]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* 출판 관리 섹션 */}
      <section className="space-y-4">
        <h4 className="text-xs font-bold tracking-widest text-[#747878] uppercase">출판 관리</h4>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/publish')}
            className="bg-white p-5 shadow-sm aspect-square flex flex-col justify-between border-b-2 border-transparent active:border-[#0061A5] rounded transition-all text-left"
          >
            <span className="material-symbols-outlined text-3xl text-[#0061A5]">menu_book</span>
            <div>
              <p className="font-bold text-sm text-[#1a1c1c]">기록물 인쇄</p>
              <p className="text-[11px] text-[#747878] mt-1 leading-tight">디지털 기록을 한 권의 책으로 소장하세요.</p>
            </div>
          </button>
          <button
            onClick={() => router.push('/publish')}
            className="bg-white p-5 shadow-sm aspect-square flex flex-col justify-between border-b-2 border-transparent active:border-[#0061A5] rounded transition-all text-left"
          >
            <span className="material-symbols-outlined text-3xl text-[#0061A5]">auto_stories</span>
            <div>
              <p className="font-bold text-sm text-[#1a1c1c]">출판 이력</p>
              <p className="text-[11px] text-[#747878] mt-1 leading-tight">지금까지 제작된 기록 책자 리스트</p>
            </div>
          </button>
        </div>
      </section>

      {/* 기타 옵션 */}
      <section className="pt-2 pb-4">
        <ul className="space-y-2">
          <li>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded shadow-sm active:bg-[#f3f3f3] transition-colors">
              <span className="text-sm font-bold text-[#1a1c1c]">데이터 백업 및 복원</span>
              <span className="material-symbols-outlined text-[#747878] text-lg">cloud_sync</span>
            </button>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 bg-white rounded shadow-sm active:bg-[#f3f3f3] transition-colors"
            >
              <span className="text-sm font-bold text-[#1a1c1c]">로그아웃</span>
              <span className="material-symbols-outlined text-[#747878] text-lg">logout</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded shadow-sm active:bg-[#ffdad6]/30 transition-colors">
              <span className="text-sm font-bold text-[#ba1a1a]">계정 탈퇴</span>
              <span className="material-symbols-outlined text-[#ba1a1a] text-lg">delete_forever</span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  )
}
