'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

/**
 * Storige 메인 랜딩 페이지 — Stitch 기준 (반응형)
 * 비로그인: 랜딩 노출 / 로그인 상태: /diary 리다이렉트
 */
export default function LandingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace('/diary')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin" style={{ fontVariationSettings: "'FILL' 0" }}>progress_activity</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-body">

      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-outline-variant/20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-extrabold text-on-surface tracking-tight">
            Storige
          </Link>
          {/* 데스크탑 네비 */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: '일기장', href: '/diary' },
              { label: '서신',   href: '/dear' },
              { label: '출판',   href: '/publish' },
              { label: '유산',   href: '/diary' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-sm font-semibold text-outline hover:text-on-surface transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-on-surface hover:text-primary transition-colors hidden md:block">
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-[0.625rem] hover:bg-primary/90 active:bg-primary/80 transition-colors"
            >
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* ── 히어로 ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 mb-6">
              <span className="w-5 h-px bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary font-headline">Digital Heritage Platform</p>
            </span>
            <h1 className="font-headline text-4xl md:text-5xl xl:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.08] mb-6">
              소중한 기억을 보존하는<br />
              <span className="text-primary">가장 완벽한</span><br />
              아카이브
            </h1>
            <p className="text-base text-outline leading-relaxed mb-8 max-w-md">
              일기, 편지, 보안 정보를 하나의 공간에 안전하게 보관하고,
              소중한 가족에게 당신의 이야기를 영원히 전달하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-primary text-white font-bold rounded-[0.625rem] text-sm text-center hover:bg-primary/90 transition-colors shadow-md"
              >
                무료로 시작하기
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 bg-white text-on-surface font-bold rounded-[0.625rem] text-sm text-center border border-outline-variant/40 hover:bg-surface-container-low transition-colors"
              >
                서비스 둘러보기
              </Link>
            </div>
          </div>

          {/* 히어로 이미지 자리 — 한국인 가족 이미지 (Phase 4에서 실 이미지 교체) */}
          <div className="relative hidden md:block">
            <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary-container to-surface-container-high overflow-hidden flex items-center justify-center shadow-xl">
              <div className="text-center p-8">
                <span className="material-symbols-outlined text-8xl text-primary/30 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                <p className="text-sm text-outline font-headline">한국인 가족 이미지<br />(Stitch assets/acc13a3b)</p>
              </div>
            </div>
            {/* 떠있는 통계 뱃지 */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">AES-256-GCM</p>
                <p className="text-sm font-bold text-on-surface">엔드투엔드 암호화</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 핵심 서비스 4종 ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="w-5 h-px bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary font-headline">Core Services</p>
              <span className="w-5 h-px bg-primary" />
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              당신의 이야기를 완전하게
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: 'book_4',
                iconColor: 'text-primary',
                bg: 'bg-primary-container',
                title: '일기장',
                desc: '매일의 성찰을 기록하고, 위치·날씨·미디어와 함께 보관합니다.',
                href: '/diary',
              },
              {
                icon: 'mail',
                iconColor: 'text-dear',
                bg: 'bg-dear/10',
                title: '서신',
                desc: '사랑하는 가족에게 전하고 싶은 편지를 미래로 전달합니다.',
                href: '/dear',
              },
              {
                icon: 'lock',
                iconColor: 'text-pink-accent',
                bg: 'bg-pink-accent/10',
                title: '비밀 코드',
                desc: '금융·부동산·법률 정보를 E2EE 암호화로 안전하게 보관합니다.',
                href: '/secret',
              },
              {
                icon: 'menu_book',
                iconColor: 'text-primary',
                bg: 'bg-primary-container',
                title: '출판',
                desc: '소중한 기록을 고품질 종이책으로 제작해 가족에게 남깁니다.',
                href: '/publish',
              },
            ].map(({ icon, iconColor, bg, title, desc, href }) => (
              <Link
                key={title}
                href={href}
                className="group bg-[#F9F9F9] hover:bg-white p-6 rounded-2xl transition-all hover:shadow-md flex flex-col gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-2xl ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface text-lg mb-1">{title}</h3>
                  <p className="text-sm text-outline leading-relaxed">{desc}</p>
                </div>
                <span className={`text-xs font-bold ${iconColor} flex items-center gap-1 mt-auto group-hover:gap-2 transition-all`}>
                  시작하기
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 신뢰 & 기술 ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 mb-4">
                <span className="w-5 h-px bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary font-headline">Trust &amp; Technology</p>
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-6">
                군사급 암호화로<br />당신의 유산을 보호합니다
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: 'shield_lock', text: 'AES-256-GCM 클라이언트 사이드 암호화' },
                  { icon: 'key',         text: 'Shamir의 비밀 공유 알고리즘 (SSS) 적용' },
                  { icon: 'fingerprint', text: 'Face ID / 지문 생체 인증 지원' },
                  { icon: 'family_restroom', text: '신뢰할 수 있는 가족에게만 선택적 공개' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    </div>
                    <p className="text-sm text-on-surface font-medium leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* 보안 카드 */}
            <div
              className="rounded-2xl p-8 text-white"
              style={{ background: 'linear-gradient(135deg, #0061A5 0%, #00201C 100%)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-accent/20 p-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-pink-accent text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <span className="text-pink-accent font-mono text-xs tracking-[0.2em] uppercase font-bold">Secure Vault</span>
              </div>
              <h3 className="font-headline text-2xl font-extrabold mb-3">제로 지식 아키텍처</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Storige는 당신의 데이터를 볼 수 없습니다. 모든 암호화는
                <span className="text-white/90 font-semibold"> 당신의 기기에서만</span> 이루어집니다.
              </p>
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/50">256비트 AES 암호화 레이어 활성</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Storige 철학 ── */}
      <section className="bg-on-surface py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <p className="font-headline text-3xl md:text-4xl font-extrabold text-white leading-snug tracking-tight mb-6">
            "기억은 우리가 남기는 <span className="text-primary-container">가장 소중한 유산</span>입니다"
          </p>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
            Storige는 단순한 저장 공간이 아닙니다. 당신의 삶, 생각, 사랑을
            다음 세대에게 온전히 전달하는 디지털 헤리티지 플랫폼입니다.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-[0.625rem] text-sm hover:bg-primary/90 transition-colors shadow-lg"
          >
            지금 시작하기
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="bg-white border-t border-outline-variant/20 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-headline text-lg font-extrabold text-on-surface tracking-tight">Storige</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {['개인정보처리방침', '이용약관', '고객센터'].map((item) => (
                <span key={item} className="text-xs text-outline hover:text-on-surface transition-colors cursor-pointer">{item}</span>
              ))}
            </div>
            <p className="text-xs text-outline">© 2026 Storige. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
