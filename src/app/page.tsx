'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

/* ─────────────────────────────────────────────
   Stitch 랜딩 HTML 기준 이미지 (lh3.googleusercontent.com aida-public)
───────────────────────────────────────────── */
const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAoAvpanOPp_2G7L9fiWWbBThpcgenL9CL5-9eyY3jmBEeIyzxeCttJrDKoRy3NM10dM0LzAWRxqKmPUYOdrDn5i_IMtD7F-gej7arIw81D1-QoDILY1P9vqrT0m0vaxggBIkHKV1TjzrNygh5jx82Renkm3LrbD0F8ZFw_63W02mWnJi8veCjJ7yxeZQdRzcPGto8Xq2jKJf-NZ5UP2Rp2Y3djZ0eBxJg9cl8tUlt9Eh_FWcTlqxaRqD3J9jaT9-F8ya5OthAboz2m'

const SERVICES = [
  {
    num: '01',
    title: '디지털 아카이브',
    subtitle: 'Active Preservation',
    desc: '일기, 사진, 영상을 고해상도 영구 보관. 분산 백업으로 세대를 초월해 지킵니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR1nt5keZVdiPF7lbiX8ru9HH7R_JnJprCc6Us1eGxNyLuUqDXli9uBP2qQXydOAuDeMfEjkfKW5Co2CayogGgoV-neU1vfC7-1c77O2tjsPl-2hxzF-vOFq9FBVXz8n6MuGH6xQJBB8IqpZuBo6-aEy1cfrwMgJa7YHG6kVFNEIOBdnyLpdw8Es_4Oi83DefO7vGaA4zMa9JFVPO0fxaqHwmpQnPMZrQT8ixWqrVKSiCRsQUassQJJR9bIB3O5GVMUAicxHQa1VA0',
    href: '/diary',
    accent: '#0061A5',
  },
  {
    num: '02',
    title: '시크릿 코드',
    subtitle: 'Ultimate Security',
    desc: '금융·부동산·법률 자산을 AES-256 디지털 금고에 완전 암호화해 보관합니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9aP94Z7nqAIk859im7r3mKIqu2xNaU8z1YjdpPdlv0bCywlQtYVilOoR4qysPDzhXOizFYf8fvXZo2OSJI59TFGhLjqT0isA9nmN9w2P6X5Ih8hMfGvYokNHSfIwFnaXyOTgGH8N-b370t4R0AX2Y5vxlKg_ypW81jyRP5ChZ_DMxwuOmQXabI2xy2UdELD1xHuho6pmlkt_Yu92EKH7xfuos6CkrnuBfq7YBRJGlzche4EKEzpW-e_9cfHGFAdcKIXiA3MUs4Rak',
    href: '/secret',
    accent: '#E91E63',
  },
  {
    num: '03',
    title: 'Dear My Son',
    subtitle: 'Eternal Message',
    desc: '사랑하는 가족에게 전하고 싶은 편지를 기록하고, 지정한 순간에 자동으로 전달합니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFCaqSlDiH-dQWAaD7GnvKYZNpkCF0X2hMPJ4iqabthzLDGCoJBOZ2Pf8-WVx94q-GaPIL5ZDrhO5AnYROJlf6omQ5HOhF5ZSC3NuuEc8F0ci2y-ECccNRJT95I94mnw3gIG2nfjAZfCv5ww3GBoYcmwTrAEi_lIi83SSzZT1IEeBubHVh54PZZf2IG_oG6eAIC5OlivoKluY4Pt9gJmUyXTAVaOWl7-qP6cU7MGjJDQKmWv5HlH81QClzIA0cDAWTvOkVO6DTylUk',
    href: '/dear',
    accent: '#006B5F',
  },
  {
    num: '04',
    title: '종이책 출판',
    subtitle: 'Physical Legacy',
    desc: '소중한 기록을 고품질 프리미엄 종이책으로 제작해 가족의 손에 직접 남깁니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB32qyhXBXBvIzh7urIh6vRieEDIWVePvocgXiJZImOotu1y9RCp36zpLm2-HDgYqDY6Jafh9EAwtqRcxlNkTI3n-1m5I-le0ZFWY24cj9wrEH81__ZRjURuxkQcVXkNmmYhKG_a4ze5KqvPY2x_UERd4fnxuhaCCtywYwMTiDB_dQR75KFzdRX2okoFZAhgpo',
    href: '/publish',
    accent: '#0061A5',
  },
]

/**
 * Storige 메인 랜딩 — Stitch HTML 기준 정확 반영
 * 비로그인 → 랜딩 / 로그인 → /diary
 */
export default function LandingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/diary')
      else setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* ── 인라인 CSS: Stitch 기준 커스텀 클래스 ── */}
      <style>{`
        .hero-gradient {
          background: radial-gradient(circle at top right, rgba(0,97,165,0.05), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(0,0,0,0.02), transparent 40%);
        }
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }
        .btn-modern {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(0,0,0,0.15);
        }
        .btn-modern::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 300%; height: 300%;
          background: rgba(255,255,255,0.1);
          transition: all 0.6s;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
        }
        .btn-modern:hover::after {
          transform: translate(-50%, -50%) scale(1);
        }
        .service-card { overflow: hidden; }
        .service-card-image {
          transition: transform 1.2s cubic-bezier(0.2, 0, 0.2, 1);
        }
        .service-card:hover .service-card-image {
          transform: scale(1.08);
        }
        .soft-shadow {
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }
      `}</style>

      <div className="min-h-screen bg-[#F9F9F9]" style={{ fontFamily: 'Pretendard, sans-serif', letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>

        {/* ── 헤더 ── */}
        <header className="sticky top-0 z-50 glass-card border-b border-white/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-headline text-xl font-extrabold text-on-surface tracking-tight">
              Storige
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: '아카이브', href: '/diary' },
                { label: '서신',     href: '/dear' },
                { label: '출판',     href: '/publish' },
                { label: '유산',     href: '/diary' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-sm font-semibold text-[#747878] hover:text-on-surface transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:block text-sm font-bold text-on-surface hover:text-primary transition-colors">
                로그인
              </Link>
              <Link href="/signup" className="btn-modern px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-[0.625rem]">
                무료 시작
              </Link>
            </div>
          </div>
        </header>

        {/* ── 히어로 ── */}
        <section className="hero-gradient">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              {/* 텍스트 */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6 font-headline">
                  Digital Heritage Platform
                </p>
                <h1 className="font-headline text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold text-[#1A1C1C] tracking-tight leading-[1.1] mb-6">
                  소중한 기억을 보존하는<br />
                  <span className="text-primary">가장 완벽한</span><br />
                  아카이브
                </h1>
                <p className="text-base text-[#747878] leading-relaxed mb-10 max-w-md">
                  당신의 모든 기록, 자산, 그리고 진심을<br className="hidden md:block" />
                  시대를 초월해 안전하게 지킵니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup" className="btn-modern px-7 py-4 bg-primary text-white font-bold rounded-[0.625rem] text-sm text-center shadow-lg">
                    무료로 시작하기
                  </Link>
                  <Link href="/login" className="btn-modern px-7 py-4 bg-white text-[#1A1C1C] font-bold rounded-[0.625rem] text-sm text-center soft-shadow border border-[#C4C7C7]/40">
                    서비스 둘러보기
                  </Link>
                </div>
              </div>

              {/* 히어로 이미지 — Stitch 한국인 가족 사진 */}
              <div className="relative hidden md:block">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden soft-shadow">
                  <img
                    src={HERO_IMG}
                    alt="한국인 가족"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 플로팅 보안 뱃지 */}
                <div className="glass-card absolute -bottom-5 -left-5 rounded-2xl px-5 py-4 flex items-center gap-3 soft-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#747878] uppercase tracking-wider">AES-256-GCM</p>
                    <p className="text-sm font-bold text-[#1A1C1C]">엔드투엔드 암호화</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 통계 배너 ── */}
        <section className="bg-[#1A1C1C] py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { num: '1.2M+', label: 'Archived Moments' },
                { num: '99.9%', label: 'Uptime Guarantee' },
                { num: '50+',   label: 'Years Guaranteed' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight">{num}</p>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 서비스 4종 카드 ── */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 font-headline">Core Services</p>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-[#1A1C1C] tracking-tight">
                당신의 기록을 위한<br />가장 우아한 4가지 방식
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {SERVICES.map(({ num, title, subtitle, desc, img, href, accent }) => (
                <Link key={num} href={href} className="service-card group bg-white rounded-2xl soft-shadow block">
                  {/* 카드 이미지 */}
                  <div className="overflow-hidden rounded-t-2xl h-48">
                    <img
                      src={img}
                      alt={title}
                      className="service-card-image w-full h-full object-cover"
                    />
                  </div>
                  {/* 카드 텍스트 */}
                  <div className="p-6">
                    <p className="font-headline text-4xl font-extrabold tracking-tight mb-3" style={{ color: accent, opacity: 0.15 }}>
                      {num}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#747878] mb-1">{subtitle}</p>
                    <h3 className="font-headline font-bold text-[#1A1C1C] text-lg mb-2">{title}</h3>
                    <p className="text-sm text-[#747878] leading-relaxed">{desc}</p>
                    <p className="mt-4 text-xs font-bold flex items-center gap-1 transition-all group-hover:gap-2" style={{ color: accent }}>
                      자세히 보기
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 신뢰 & 기술 ── */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 font-headline">Trust &amp; Technology</p>
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-[#1A1C1C] tracking-tight mb-8">
                  군사급 암호화로<br />당신의 유산을 보호합니다
                </h2>
                <ul className="space-y-5">
                  {[
                    { icon: 'encrypted',         text: 'AES-256-GCM 종단간 암호화' },
                    { icon: 'schedule_send',      text: '유고 시 자동 전달 예약 시스템' },
                    { icon: 'psychology',         text: 'AI 기반 지능형 기억 요약' },
                    { icon: 'family_restroom',    text: '가족에게만 선택적 열람 권한 부여' },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                      </div>
                      <p className="text-sm text-[#1A1C1C] font-medium leading-relaxed pt-2">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secure Vault 다크 카드 */}
              <div
                className="rounded-2xl p-8 text-white"
                style={{ background: 'linear-gradient(135deg, #0061A5 0%, #00201C 100%)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#E91E63]/20 p-2.5 rounded-xl">
                    <span className="material-symbols-outlined text-[#E91E63] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  </div>
                  <span className="text-[#E91E63] font-mono text-xs tracking-[0.2em] uppercase font-bold">Secure Vault</span>
                </div>
                <h3 className="font-headline text-2xl font-extrabold mb-3">제로 지식 아키텍처</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Storige는 당신의 데이터를 볼 수 없습니다. 모든 암호화는
                  <span className="text-white/90 font-semibold"> 당신의 기기에서만</span> 이루어집니다.
                </p>
                <div className="space-y-3 pt-5 border-t border-white/10">
                  {[
                    { icon: 'shield_lock', label: '256비트 AES 암호화 레이어 활성' },
                    { icon: 'key',         label: 'Shamir 비밀 공유 키 분산 보관' },
                    { icon: 'fingerprint', label: '생체 인증 2단계 보호' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white/40 text-base">{icon}</span>
                      <span className="text-xs text-white/50">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/40">실시간 암호화 보호 중</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 철학 CTA ── */}
        <section className="bg-[#1A1C1C] py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <p className="font-headline text-3xl md:text-[2.5rem] font-extrabold text-white leading-snug tracking-tight mb-6">
              "기억은 우리가 남기는<br />
              <span className="text-[#D2E4FF]">가장 소중한 유산</span>입니다"
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
              Storige는 단순한 저장 공간이 아닙니다. 당신의 삶, 생각, 사랑을
              다음 세대에게 온전히 전달하는 디지털 헤리티지 플랫폼입니다.
            </p>
            <Link href="/signup" className="btn-modern inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-[0.625rem] text-sm shadow-xl">
              지금 무료로 시작하기
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer className="bg-white border-t border-[#C4C7C7]/20 py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div>
                <p className="font-headline text-lg font-extrabold text-[#1A1C1C] tracking-tight mb-3">Storige</p>
                <p className="text-xs text-[#747878] leading-relaxed">기억을 저장하고,<br />내일을 준비하는<br />디지털 헤리티지 플랫폼</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#747878] mb-4">Service</p>
                <ul className="space-y-2">
                  {['일기장', '서신', '비밀 코드', '출판'].map((item) => (
                    <li key={item}><span className="text-sm text-[#747878] hover:text-[#1A1C1C] cursor-pointer transition-colors">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#747878] mb-4">Company</p>
                <ul className="space-y-2">
                  {['소개', '블로그', '채용', '문의'].map((item) => (
                    <li key={item}><span className="text-sm text-[#747878] hover:text-[#1A1C1C] cursor-pointer transition-colors">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#747878] mb-4">Connect</p>
                <ul className="space-y-2">
                  {['개인정보처리방침', '이용약관', '고객센터'].map((item) => (
                    <li key={item}><span className="text-sm text-[#747878] hover:text-[#1A1C1C] cursor-pointer transition-colors">{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-[#C4C7C7]/20 pt-6">
              <p className="text-xs text-[#747878]">© 2026 Storige Archive. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
