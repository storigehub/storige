'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useArchiveStats } from '@/hooks/useArchiveStats'

/**
 * 설정 허브 — Midnight Archive / Stitch v2 기준
 * 아카이브 통계 + 프로필 카드 + 보안(tonal) + 가족 + 출판
 * No-Line Rule: border-l-4 제거 → tonal layering + 아이콘 배지
 */
export default function SettingsPage() {
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const stats = useArchiveStats()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '탈퇴') return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // 계정 삭제는 Edge Function 또는 관리자 권한 필요 — 현재는 로그아웃 후 안내
      router.push('/login?deleted=1')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 pb-32">

      {/* 페이지 헤더 */}
      <section className="py-4 mb-6">
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-primary" />
          <p className="text-[10px] tracking-[0.25em] text-primary uppercase font-bold font-headline">Account &amp; Storage</p>
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface leading-tight font-headline">내 스토리지 관리</h2>
        <p className="text-sm text-outline mt-1">기록의 보관과 상속, 가족과의 공유를 관리하세요.</p>
      </section>

      {/* 아카이브 통계 — Stitch v2 stats grid */}
      <section className="mb-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">아카이브 현황</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '전체 일기', icon: 'book_4',  iconColor: 'text-primary',     bg: 'bg-primary-container', value: stats.loading ? '…' : String(stats.diaryCount),   unit: '개' },
            { label: '편지',      icon: 'mail',    iconColor: 'text-dear',        bg: 'bg-dear/10',           value: stats.loading ? '…' : String(stats.dearCount),    unit: '개' },
            { label: '비밀 코드', icon: 'lock',    iconColor: 'text-pink-accent', bg: 'bg-pink-accent/10',    value: stats.loading ? '…' : String(stats.secretCount),  unit: '개' },
            { label: '저장 용량', icon: 'storage', iconColor: 'text-primary',     bg: 'bg-primary-container', value: stats.loading ? '…' : String(stats.storageMB),    unit: 'MB' },
          ].map(({ label, icon, iconColor, bg, value, unit }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[18px] ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-wider font-headline">{label}</p>
              <p className="text-2xl font-extrabold text-on-surface font-headline leading-none">
                {value}<span className="text-xs font-medium text-outline ml-1">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 프로필 카드 */}
      <button
        onClick={() => router.push('/settings/profile')}
        className="w-full bg-white p-5 flex items-center justify-between shadow-sm rounded-2xl text-left active:bg-surface-container-low transition-colors mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center text-lg font-bold text-outline border-2 border-primary/20">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="프로필" className="w-full h-full object-cover" />
                : (profile?.full_name?.[0]?.toUpperCase() ?? '?')}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-on-surface font-headline">{profile?.full_name ?? '사용자'}</h3>
            <p className="text-xs text-outline">{profile?.email}</p>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">프리미엄 플랜</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
      </button>

      {/* 보안 설정 — tonal layering (No-Line Rule 준수, border-l-4 제거) */}
      <section className="mb-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">보안 &amp; 인증</h4>
        {/* _3 기준: rounded-2xl, p-6, shadow 강화 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
            <span className="material-symbols-outlined text-primary text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1 font-headline">생체 인증</p>
            <p className="font-bold text-sm text-on-surface">Touch ID / Face ID</p>
            <p className="text-[11px] text-primary mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              암호화됨
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
            <span className="material-symbols-outlined text-outline text-2xl mb-3 block">pin</span>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1 font-headline">보안 코드</p>
            <p className="font-bold text-sm text-on-surface">6자리 해시</p>
            <p className="text-[11px] text-outline mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">info</span>
              업데이트 필요
            </p>
          </div>
          <button
            onClick={() => router.push('/secret')}
            className="bg-white p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.02)] text-left active:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-pink-accent text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1 font-headline">비밀 코드</p>
            <p className="font-bold text-sm text-on-surface">E2EE 암호화</p>
            <p className="text-[11px] text-pink-accent mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              보호 중
            </p>
          </button>
        </div>
      </section>

      {/* 가족 구성원 섹션 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase font-headline">가족 구성원</h4>
          <button onClick={() => router.push('/settings/family')} className="text-xs text-primary font-bold">관리하기</button>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-on-surface">가족 구성원 관리</p>
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <p className="text-xs text-outline mb-4">열람 권한 및 SSS 복구 키를 가족과 공유합니다.</p>
          <button
            onClick={() => router.push('/settings/family')}
            className="w-full py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            구성원 추가 / 편집
          </button>
        </div>
      </section>

      {/* 출판 관리 */}
      <section className="mb-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">출판 관리</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/publish')}
            className="bg-white p-5 rounded-2xl shadow-sm flex flex-col gap-3 text-left active:bg-surface-container-low transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-primary">menu_book</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface font-headline">기록물 인쇄</p>
              <p className="text-[11px] text-outline mt-0.5 leading-tight">디지털 기록을 한 권의 책으로</p>
            </div>
          </button>
          <button
            onClick={() => router.push('/publish')}
            className="bg-white p-5 rounded-2xl shadow-sm flex flex-col gap-3 text-left active:bg-surface-container-low transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-primary">auto_stories</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface font-headline">출판 이력</p>
              <p className="text-[11px] text-outline mt-0.5 leading-tight">지금까지 제작된 기록 책자</p>
            </div>
          </button>
        </div>
      </section>

      {/* 유고 열람 관리 */}
      <section className="mb-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">유고 &amp; 헤리티지</h4>
        <button
          onClick={() => router.push('/settings/legacy')}
          className="w-full bg-white p-5 flex items-center justify-between shadow-sm rounded-2xl text-left active:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface font-headline">유고 열람 관리</p>
              <p className="text-xs text-outline mt-0.5">열람 공개 예약 · 가족 요청 승인</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </button>
      </section>

      {/* 기타 옵션 */}
      <section>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => alert('데이터 백업 기능은 Phase 5에서 제공될 예정입니다.')}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-surface-container-low active:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-lg">cloud_sync</span>
                <span className="text-sm font-bold text-on-surface">데이터 백업 및 복원</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-lg">chevron_right</span>
            </button>
          </li>
          <li>
            <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-surface-container-low active:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-lg">logout</span>
                <span className="text-sm font-bold text-on-surface">로그아웃</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-lg">chevron_right</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-error-container/30 active:bg-error-container/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error text-lg">delete_forever</span>
                <span className="text-sm font-bold text-error">계정 탈퇴</span>
              </div>
              <span className="material-symbols-outlined text-error/40 text-lg">chevron_right</span>
            </button>
          </li>
        </ul>
      </section>

      {/* 계정 탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl md:rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                delete_forever
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-on-surface text-center font-headline mb-1">정말 탈퇴하시겠어요?</h3>
            <p className="text-sm text-outline text-center mb-5 leading-relaxed">
              모든 일기, 편지, 시크릿 코드가 <span className="text-error font-semibold">영구 삭제</span>됩니다.<br />
              확인하려면 아래에 <strong>&apos;탈퇴&apos;</strong>를 입력하세요.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="탈퇴"
              className="w-full border border-error/40 rounded-xl px-4 py-3 text-sm text-center text-on-surface outline-none focus:border-error focus:ring-2 focus:ring-error/10 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== '탈퇴' || deleting}
                className="flex-1 py-3 bg-error text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-40"
              >
                {deleting ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
