'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

/* ── Stitch aida-public 이미지 URL ── */
const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoAvpanOPp_2G7L9fiWWbBThpcgenL9CL5-9eyY3jmBEeIyzxeCttJrDKoRy3NM10dM0LzAWRxqKmPUYOdrDn5i_IMtD7F-gej7arIw81D1-QoDILY1P9vqrT0m0vaxggBIkHKV1TjzrNygh5jx82Renkm3LrbD0F8ZFw_63W02mWnJi8veCjJ7yxeZQdRzcPGto8Xq2jKJf-NZ5UP2Rp2Y3djZ0eBxJg9cl8tUlt9Eh_FWcTlqxaRqD3J9jaT9-F8ya5OthAboz2m'

/* ── 서비스 카드 이미지 URL 만료 대비: 각 카드에 테마 그라디언트 fallback 지정 ── */
const SERVICES = [
  {
    num: '01', title: '디지털 아카이브', subtitle: 'ACTIVE PRESERVATION',
    desc: '일기, 사진, 영상 기록을 고해상도로 영구 보관하세요. 당신의 소중한 역사가 소실되지 않도록 철저한 분산 백업이 지원됩니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR1nt5keZVdiPF7lbiX8ru9HH7R_JnJprCc6Us1eGxNyLuUqDXli9uBP2qQXydOAuDeMfEjkfKW5Co2CayogGgoV-neU1vfC7-1c77O2tjsPl-2hxzF-vOFq9FBVXz8n6MuGH6xQJBB8IqpZuBo6-aEy1cfrwMgJa7YHG6kVFNEIOBdnyLpdw8Es_4Oi83DefO7vGaA4zMa9JFVPO0fxaqHwmpQnPMZrQT8ixWqrVKSiCRsQUassQJJR9bIB3O5GVMUAicxHQa1VA0',
    fallback: 'linear-gradient(135deg, #1a0e06 0%, #2d1a0a 50%, #1a1208 100%)',
    href: '/diary',
  },
  {
    num: '02', title: '시크릿 코드', subtitle: 'ULTIMATE SECURITY',
    desc: '암호화된 자산 및 보안 정보 보관. 당신만이 접근할 수 있는 최첨단 디지털 금고 시스템을 제공합니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9aP94Z7nqAIk859im7r3mKIqu2xNaU8z1YjdpPdlv0bCywlQtYVilOoR4qysPDzhXOizFYf8fvXZo2OSJI59TFGhLjqT0isA9nmN9w2P6X5Ih8hMfGvYokNHSfIwFnaXyOTgGH8N-b370t4R0AX2Y5vxlKg_ypW81jyRP5ChZ_DMxwuOmQXabI2xy2UdELD1xHuho6pmlkt_Yu92EKH7xfuos6CkrnuBfq7YBRJGlzche4EKEzpW-e_9cfHGFAdcKIXiA3MUs4Rak',
    fallback: 'linear-gradient(135deg, #020a18 0%, #031528 50%, #041e38 100%)',
    href: '/secret',
  },
  {
    num: '03', title: 'Dear My Son', subtitle: 'ETERNAL MESSAGE',
    desc: '가족에게 남기는 특별한 메시지. 시간이 흘러도 변치 않는 진심을 예약된 시점에 안전하게 전송하세요.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFCaqSlDiH-dQWAaD7GnvKYZNpkCF0X2hMPJ4iqabthzLDGCoJBOZ2Pf8-WVx94q-GaPIL5ZDrhO5AnYROJlf6omQ5HOhF5ZSC3NuuEc8F0ci2y-ECccNRJT95I94mnw3gIG2nfjAZfCv5ww3GBoYcmwTrAEi_lIi83SSzZT1IEeBubHVh54PZZf2IG_oG6eAIC5OlivoKluY4Pt9gJmUyXTAVaOWl7-qP6cU7MGjJDQKmWv5HlH81QClzIA0cDAWTvOkVO6DTylUk',
    fallback: 'linear-gradient(135deg, #120820 0%, #1c1030 50%, #120820 100%)',
    href: '/dear',
  },
  {
    num: '04', title: '종이책 출판', subtitle: 'PHYSICAL LEGACY',
    desc: '디지털 기록을 품격 있는 실물 책으로 소장하세요. 프리미엄 디자인이 당신의 기록에 특별한 가치를 부여합니다.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB32qyhXBXBvIzh7urIh6vRieEDIWVePvocgXiJZImOotu1y9RCp36zpLm2-HDgFrcK4OxBraOB3KqhHkN9FTpW2wQevBkxz5HKTs8WLIneJrrb0GNQaYGl3K_bvq-m2rVP4WSu2eCgiYqDY6Jafh9EAwtqRcxlNkTI3n-1m5I-le0ZFWY24cj9wrEH81__ZRjURuxkQcVXkNmmYhKG_a4ze5KqvPY2x_UERd4fnxuhaCCtywYwMTiDB_dQR75KFzdRX2okoFZAhgpo',
    fallback: 'linear-gradient(135deg, #060f06 0%, #0d1f10 50%, #0a1a0c 100%)',
    href: '/publish',
  },
  {
    num: '05', title: 'AI 자서전', subtitle: 'YOUR LIFE STORY',
    desc: 'AI와 대화하며 당신의 삶을 한 편의 자서전으로 완성하세요. 13개 주제 × 67개 질문이 당신이 미처 기억 못한 소중한 기억을 되살려 드립니다.',
    img: '',
    fallback: 'linear-gradient(135deg, #0a0f1a 0%, #0d1a2e 40%, #0a1520 100%)',
    href: '/mystory',
  },
]

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
          position: relative; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .btn-modern:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(0,0,0,0.15); }
        .btn-modern::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          width: 300%; height: 300%; background: rgba(255,255,255,0.1);
          transition: all 0.6s; transform: translate(-50%, -50%) scale(0); border-radius: 50%;
        }
        .btn-modern:hover::after { transform: translate(-50%, -50%) scale(1); }
        .service-card { overflow: hidden; }
        .service-card-img { transition: transform 1.2s cubic-bezier(0.2, 0, 0.2, 1); }
        .service-card:hover .service-card-img { transform: scale(1.08); }
        .soft-shadow { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); }
      `}</style>

      <div className="min-h-screen bg-[#F9F9F9]" style={{ fontFamily: 'Pretendard, sans-serif', letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>

        {/* ── 헤더 ── */}
        <header className="sticky top-0 z-50 glass-card border-b border-white/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-headline text-xl font-extrabold text-on-surface tracking-tight">Storige</Link>
            <nav className="hidden md:flex items-center gap-8">
              {[['아카이브','/diary'],['서신','/dear'],['출판','/publish'],['유산','/diary']].map(([label, href]) => (
                <Link key={label} href={href} className="text-sm font-semibold text-[#747878] hover:text-on-surface transition-colors">{label}</Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:block text-sm font-bold text-on-surface hover:text-primary transition-colors">로그인</Link>
              <Link href="/signup" className="btn-modern px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-[0.625rem]">무료 시작</Link>
            </div>
          </div>
        </header>

        {/* ── 히어로 ── */}
        <section className="hero-gradient">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6 font-headline">Digital Heritage Platform</p>
                <h1 className="font-headline text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold text-[#1A1C1C] tracking-tight leading-[1.1] mb-6">
                  소중한 기억을 보존하는<br /><span className="text-primary">가장 완벽한</span><br />아카이브
                </h1>
                <p className="text-base text-[#747878] leading-relaxed mb-10 max-w-md">
                  당신의 모든 기록, 자산, 그리고 진심을<br className="hidden md:block" />시대를 초월해 안전하게 지킵니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup" className="btn-modern px-7 py-4 bg-primary text-white font-bold rounded-[0.625rem] text-sm text-center shadow-lg">무료로 시작하기</Link>
                  <Link href="/login" className="btn-modern px-7 py-4 bg-white text-[#1A1C1C] font-bold rounded-[0.625rem] text-sm text-center soft-shadow border border-[#C4C7C7]/40">서비스 둘러보기</Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden soft-shadow">
                  <img src={HERO_IMG} alt="한국인 가족" className="w-full h-full object-cover" />
                </div>
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
              {[['1.2M+','Archived Moments'],['99.9%','Uptime Guarantee'],['50+','Years Guaranteed']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight">{num}</p>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 서비스 카드 2×2 — 이미지 위 텍스트 오버레이 (Stitch 기준) ── */}
        <section className="py-20 md:py-28 bg-[#F9F9F9]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 font-headline">Core Services</p>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-[#1A1C1C] tracking-tight">
                당신의 기록을 위한<br />가장 우아한 5가지 방식
              </h2>
            </div>

            {/* 2×2+1 그리드 — 5번째 카드는 전체 너비 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SERVICES.map(({ num, title, subtitle, desc, img, fallback, href }) => (
                <Link
                  key={num}
                  href={href}
                  className={`service-card group relative rounded-2xl overflow-hidden block${num === '05' ? ' sm:col-span-2' : ''}`}
                  style={{ aspectRatio: num === '05' ? '16/5' : '4/3', background: fallback }}
                >
                  {/* 풀블리드 이미지 — 로드 실패 시 fallback 그라디언트 노출 */}
                  <img
                    src={img}
                    alt={title}
                    className="service-card-img absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  {/* 다크 그라디언트 오버레이 */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)' }} />

                  {/* 상단: 번호 + 서브타이틀 */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="font-headline text-2xl font-extrabold text-white/80 tracking-tight">{num}</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">{subtitle}</span>
                  </div>

                  {/* 하단: 제목 + 설명 + EXPLORE MORE */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-headline text-2xl font-extrabold text-white tracking-tight mb-2">{title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed mb-5">{desc}</p>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-[0.15em] flex items-center gap-2 group-hover:gap-3 transition-all">
                      Explore More
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust & Technology — 왼쪽 기능 리스트 + 오른쪽 헤드라인+인용구 (Stitch 기준) ── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

              {/* 왼쪽: 기능 리스트 */}
              <div className="space-y-10">
                {[
                  {
                    icon: 'lock',
                    title: 'E2EE 종단간 보안',
                    desc: '모든 데이터는 서버 저장 전 기기에서 직접 암호화됩니다. 당사조차 당신의 데이터를 절대 열람할 수 없습니다.',
                  },
                  {
                    icon: 'schedule_send',
                    title: '유고 시 전달 예약',
                    desc: '지정된 확인 신호가 중단될 경우, 미리 설정한 수신자에게 중요 자산과 메시지를 안전하게 자동 전달합니다.',
                  },
                  {
                    icon: 'psychology',
                    title: 'AI 지능형 요약',
                    desc: '방대한 기록 속에서 가장 빛나는 순간들을 AI가 분석하여 테마별 스토리북과 개인화된 보고서를 생성합니다.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#1A1C1C' }}
                    >
                      <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-[#1A1C1C] text-base mb-1">{title}</h4>
                      <p className="text-sm text-[#747878] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 오른쪽: 헤드라인 + 설명 + 인용구 */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-5 font-headline">Trust &amp; Technology</p>
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-[#1A1C1C] tracking-tight leading-[1.15] mb-6">
                  가장 현대적인 기술로<br />영원한 가치를 지킵니다.
                </h2>
                <p className="text-sm text-[#747878] leading-relaxed mb-8">
                  기술은 수단일 뿐입니다. Storige의 목적은 인간의 삶과 기억이 기술적 결함이나 시간의 흐름에 의해 사라지지 않도록 보호하는 것에 있습니다.
                </p>
                {/* 인용구 — 파란 왼쪽 보더 */}
                <blockquote
                  className="pl-5 py-1"
                  style={{ borderLeft: '3px solid #0061A5' }}
                >
                  <p className="text-sm text-[#1A1C1C] leading-relaxed font-medium">
                    <span aria-hidden="true">&ldquo;</span>
                    기록되지 않은 삶은 잊혀지지만, Storige와 함께라면
                    <br className="hidden md:block" />
                    당신의 서사는 영원히 흐릅니다.
                    <span aria-hidden="true">&rdquo;</span>
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ── 철학 CTA ── */}
        <section className="bg-[#1A1C1C] py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <p className="font-headline text-3xl md:text-[2.5rem] font-extrabold text-white leading-snug tracking-tight mb-6">
              <span aria-hidden="true">&ldquo;</span>
              기억은 우리가 남기는
              <br />
              <span className="text-[#D2E4FF]">가장 소중한 유산</span>
              입니다
              <span aria-hidden="true">&rdquo;</span>
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
              Storige는 단순한 저장 공간이 아닙니다. 당신의 삶, 생각, 사랑을 다음 세대에게 온전히 전달하는 디지털 헤리티지 플랫폼입니다.
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1">
                <p className="font-headline text-lg font-extrabold text-[#1A1C1C] tracking-tight mb-3">Storige</p>
                <p className="text-xs text-[#747878] leading-relaxed">기억을 저장하고,<br />내일을 준비하는<br />디지털 헤리티지 플랫폼</p>
              </div>
              {[
                { title: 'Service', items: ['일기장','서신','비밀 코드','출판'] },
                { title: 'Company', items: ['소개','블로그','채용','문의'] },
                { title: 'Connect', items: ['개인정보처리방침','이용약관','고객센터'] },
              ].map(({ title, items }) => (
                <div key={title}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#747878] mb-4">{title}</p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item}><span className="text-sm text-[#747878] hover:text-[#1A1C1C] cursor-pointer transition-colors">{item}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
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
