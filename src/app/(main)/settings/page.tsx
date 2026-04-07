'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

/**
 * 설정 허브 — Midnight Archive / _2 + _3 bento grid 기준
 * 프로필 카드 + 3열 보안 섹션 + 가족 섹션 + 출판 그리드
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
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-32">
      {/* 페이지 헤더 */}
      <section className="py-4 mb-6">
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-[#0061A5]" />
          <p className="text-[10px] tracking-[0.25em] text-[#0061A5] uppercase font-bold font-headline">Account &amp; Storage</p>
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1c1c] leading-tight font-headline">내 스토리지 관리</h2>
        <p className="text-sm text-[#747878] mt-1">기록의 보관과 상속, 가족과의 공유를 관리하세요.</p>
      </section>

      {/* 프로필 카드 */}
      <button
        onClick={() => router.push('/settings/profile')}
        className="w-full bg-white p-5 flex items-center justify-between shadow-sm rounded-2xl text-left active:bg-[#f3f3f3] transition-colors mb-6 border border-[#e8e8e8]"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-[#e8e8e8] overflow-hidden flex items-center justify-center text-lg font-bold text-[#747878] border-2 border-[#0061A5]/20">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
                : (profile?.full_name?.[0]?.toUpperCase() ?? '?')}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0061A5] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1a1c1c] font-headline">{profile?.full_name ?? '사용자'}</h3>
            <p className="text-xs text-[#747878]">{profile?.email}</p>
            <span className="text-[10px] font-bold text-[#0061A5] uppercase tracking-wider">프리미엄 플랜</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#c4c7c7]">chevron_right</span>
      </button>

      {/* 보안 설정 — 3열 border-l-4 카드 */}
      <section className="mb-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#747878] uppercase mb-3 font-headline">보안 &amp; 인증</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#0061A5]">
            <span className="material-symbols-outlined text-[#0061A5] mb-2 block">fingerprint</span>
            <p className="text-[10px] font-bold text-[#747878] uppercase tracking-wider mb-1">생체 인식</p>
            <p className="font-bold text-sm text-[#1a1c1c]">Face ID / 지문</p>
            <p className="text-[11px] text-[#0061A5] mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              활성화됨
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#c4c7c7]/50">
            <span className="material-symbols-outlined text-[#747878] mb-2 block">pin</span>
            <p className="text-[10px] font-bold text-[#747878] uppercase tracking-wider mb-1">보안 코드</p>
            <p className="font-bold text-sm text-[#1a1c1c]">6자리 해시</p>
            <p className="text-[11px] text-[#747878] mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">info</span>
              업데이트 필요
            </p>
          </div>
          <button
            onClick={() => router.push('/secret')}
            className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#E91E63] text-left active:bg-[#f3f3f3] transition-colors"
          >
            <span className="material-symbols-outlined text-[#E91E63] mb-2 block">lock</span>
            <p className="text-[10px] font-bold text-[#747878] uppercase tracking-wider mb-1">비밀 코드</p>
            <p className="font-bold text-sm text-[#1a1c1c]">E2EE 암호화</p>
            <p className="text-[11px] text-[#E91E63] mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              보호 중
            </p>
          </button>
        </div>
      </section>

      {/* 가족 구성원 섹션 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#747878] uppercase font-headline">가족 구성원</h4>
          <button
            onClick={() => router.push('/settings/family')}
            className="text-xs text-[#0061A5] font-bold"
          >
            관리하기
          </button>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e8e8e8]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-[#1a1c1c]">가족 구성원 관리</p>
            <span className="material-symbols-outlined text-[#0061A5] text-xl">group</span>
          </div>
          <p className="text-xs text-[#747878] mb-4">열람 권한 및 SSS 복구 키를 가족과 공유합니다.</p>
          <button
            onClick={() => router.push('/settings/family')}
            className="w-full py-2.5 bg-[#f3f3f3] hover:bg-[#eeeeee] text-[#1a1c1c] text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            구성원 추가 / 편집
          </button>
        </div>
      </section>

      {/* 출판 관리 — 2열 그리드 */}
      <section className="mb-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#747878] uppercase mb-3 font-headline">출판 관리</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/publish')}
            className="bg-white p-5 rounded-2xl shadow-sm flex flex-col gap-3 text-left active:bg-[#f3f3f3] transition-all hover:shadow-md border border-[#e8e8e8]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d2e4ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[#0061A5]">menu_book</span>
            </div>
            <div>
              <p className="font-bold text-sm text-[#1a1c1c] font-headline">기록물 인쇄</p>
              <p className="text-[11px] text-[#747878] mt-0.5 leading-tight">디지털 기록을 한 권의 책으로</p>
            </div>
          </button>
          <button
            onClick={() => router.push('/publish')}
            className="bg-white p-5 rounded-2xl shadow-sm flex flex-col gap-3 text-left active:bg-[#f3f3f3] transition-all hover:shadow-md border border-[#e8e8e8]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d2e4ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[#0061A5]">auto_stories</span>
            </div>
            <div>
              <p className="font-bold text-sm text-[#1a1c1c] font-headline">출판 이력</p>
              <p className="text-[11px] text-[#747878] mt-0.5 leading-tight">지금까지 제작된 기록 책자 리스트</p>
            </div>
          </button>
        </div>
      </section>

      {/* 기타 옵션 */}
      <section>
        <ul className="space-y-2">
          <li>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-[#f3f3f3] active:bg-[#eeeeee] transition-colors border border-[#e8e8e8]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#747878] text-lg">cloud_sync</span>
                <span className="text-sm font-bold text-[#1a1c1c]">데이터 백업 및 복원</span>
              </div>
              <span className="material-symbols-outlined text-[#c4c7c7] text-lg">chevron_right</span>
            </button>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-[#f3f3f3] active:bg-[#eeeeee] transition-colors border border-[#e8e8e8]"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#747878] text-lg">logout</span>
                <span className="text-sm font-bold text-[#1a1c1c]">로그아웃</span>
              </div>
              <span className="material-symbols-outlined text-[#c4c7c7] text-lg">chevron_right</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-[#ffdad6]/30 active:bg-[#ffdad6]/40 transition-colors border border-[#e8e8e8]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ba1a1a] text-lg">delete_forever</span>
                <span className="text-sm font-bold text-[#ba1a1a]">계정 탈퇴</span>
              </div>
              <span className="material-symbols-outlined text-[#ba1a1a]/40 text-lg">chevron_right</span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  )
}
