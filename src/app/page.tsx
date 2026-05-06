'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingAppDownload } from '@/components/landing/LandingAppDownload'

/* ── 로컬 이미지 경로 (public/img) ── */
const HERO_IMG = '/img/happy-chinese-family-relaxing-on-meadow-2026-03-27-00-33-40-utc.jpg'

const SERVICES = [
  {
    num: '01', title: '디지털 아카이브', subtitle: 'ACTIVE PRESERVATION',
    desc: '일기, 사진, 영상 기록을 고해상도로 영구 보관하세요. 당신의 소중한 역사가 소실되지 않도록 철저한 분산 백업이 지원됩니다.',
    img: '/img/1508255.jpg',
    fallback: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    href: '/diary',
  },
  {
    num: '02', title: '시크릿 코드', subtitle: 'ULTIMATE SECURITY',
    desc: '암호화된 자산 및 보안 정보 보관. 당신만이 접근할 수 있는 최첨단 디지털 금고 시스템을 제공합니다.',
    img: '/img/1058712.jpg',
    fallback: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    href: '/secret',
  },
  {
    num: '03', title: 'Dear My Son', subtitle: 'ETERNAL MESSAGE',
    desc: '가족에게 남기는 특별한 메시지. 시간이 흘러도 변치 않는 진심을 예약된 시점에 안전하게 전송하세요.',
    img: '/img/1177251.jpg',
    fallback: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
    href: '/dear',
  },
  {
    num: '04', title: '종이책 출판', subtitle: 'PHYSICAL LEGACY',
    desc: '디지털 기록을 품격 있는 실물 책으로 소장하세요. 프리미엄 디자인이 당신의 기록에 특별한 가치를 부여합니다.',
    img: '/img/17124120.jpg',
    fallback: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    href: '/publish',
  },
  {
    num: '05', title: 'AI 자서전', subtitle: 'YOUR LIFE STORY',
    desc: 'AI와 대화하며 당신의 삶을 한 편의 자서전으로 완성하세요. 20개 주제의 질문이 소중한 기억을 되살려 드립니다.',
    img: '/img/15756167.jpg',
    fallback: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
    href: '/mystory',
  },
  {
    num: '06', title: '디지털 추모관', subtitle: 'ETERNAL MEMORY',
    desc: 'QR 코드 하나로 언제 어디서나 추모할 수 있는 아름다운 공간. 고인의 삶을 사진과 글로 영원히 기억합니다.',
    img: '/img/997180.jpg',
    fallback: 'linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 100%)',
    href: '/memorial',
  },
]

const NAV_ITEMS = [
  { label: '읽기', href: '/diary', icon: 'auto_stories' },
  { label: '편지', href: '/dear', icon: 'mail' },
  { label: '비밀', href: '/secret', icon: 'lock' },
  { label: '출판', href: '/publish', icon: 'menu_book' },
  { label: '관리', href: '/settings', icon: 'manage_accounts' },
]

const MORE_ITEMS = [
  { label: '포토앨범', href: '/album', icon: 'photo_library' },
  { label: 'AI 자서전', href: '/mystory', icon: 'history_edu' },
]

export default function LandingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // router.replace('/diary') 
        setChecking(false)
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <style>{`
        .hero-gradient {
          background: radial-gradient(circle at top right, rgba(0,97,165,0.08), transparent 50%),
                      radial-gradient(circle at bottom left, rgba(0,107,95,0.05), transparent 50%);
        }
        .glass-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
        }
        .btn-modern {
          position: relative; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .btn-modern:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(0,97,165,0.3); }
        .service-card { overflow: hidden; transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
        .service-card:hover { transform: translateY(-8px); }
        .service-card-img { transition: transform 1.5s cubic-bezier(0.2, 0, 0.2, 1); }
        .service-card:hover .service-card-img { transform: scale(1.1); }
        .soft-shadow { box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06); }
        .text-balance { text-wrap: balance; }
      `}</style>

      <div className="min-h-screen bg-surface-container-lowest" style={{ fontFamily: 'var(--font-body)', letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>

        {/* ── 헤더 ── */}
        <header className="sticky top-0 z-50 glass-card border-b border-surface-container-highest/20">
          <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low active:opacity-70 transition-colors"
                  aria-label="메뉴 열기"
                >
                  <span className="material-symbols-outlined text-[22px] text-on-surface">menu</span>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-[#f9f9f9]">
                  <div className="p-6 bg-white border-b border-surface-container">
                    <Image src="/logo.png" alt="Storige" width={120} height={36} className="h-14 w-auto object-contain" />
                    <p className="mt-2 text-xs text-[#747878]">기억을 저장하고, 내일을 준비하세요.</p>
                  </div>
                  <nav className="py-2">
                    {NAV_ITEMS.map(({ label, href, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-outline">{icon}</span>
                        <span>{label}</span>
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t border-surface-container py-2">
                    {MORE_ITEMS.map(({ label, href, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-outline">{icon}</span>
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-surface-container p-4">
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-[0.625rem] bg-primary px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      로그인 / 시작하기
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="Storige" width={110} height={32} className="h-14 w-auto object-contain" priority />
              </Link>
            </div>
            <nav className="hidden lg:flex items-center gap-10">
              {[['아카이브','/diary'],['서신','/dear'],['AI 자서전','/mystory'],['출판','/publish']].map(([label, href]) => (
                <Link key={label} href={href} className="text-sm font-bold text-outline hover:text-primary transition-colors">{label}</Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm font-bold text-on-surface hover:text-primary transition-colors">로그인</Link>
              <Link href="/signup" className="btn-modern px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full">무료 시작</Link>
            </div>
          </div>
        </header>

        {/* ── 히어로 ── */}
        <section className="hero-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-24 md:pt-32 md:pb-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 font-headline">
                  Digital Heritage Platform
                </div>
                <h1 className="font-headline text-5xl md:text-6xl xl:text-[4.5rem] font-extrabold text-on-surface tracking-tight leading-[1.05] mb-8 text-balance">
                  가장 소중한 기억,<br />가족에게 남기는<br /><span className="text-primary">영원한 서사</span>
                </h1>
                <p className="text-lg text-on-surface-variant leading-relaxed mb-12 max-w-lg">
                  일기, 사진, 그리고 당신의 목소리까지.<br />시대를 초월해 가장 안전하고 아름답게 보관합니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup" className="btn-modern px-8 py-4.5 bg-primary text-white font-bold rounded-2xl text-base text-center shadow-xl shadow-primary/20">지금 시작하기</Link>
                  <Link href="/login" className="btn-modern px-8 py-4.5 bg-white text-on-surface font-bold rounded-2xl text-base text-center soft-shadow border border-surface-container-highest">서비스 둘러보기</Link>
                </div>
              </div>
              <div className="lg:col-span-6 relative">
                <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden soft-shadow border-8 border-white">
                  <Image 
                    src={HERO_IMG} 
                    alt="가족과 함께하는 행복한 시간" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* 플로팅 배지 */}
                <div className="glass-card absolute -bottom-8 -right-4 md:-right-8 rounded-[2rem] px-6 py-5 flex items-center gap-4 soft-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Family Oriented</p>
                    <p className="text-base font-bold text-on-surface">대를 잇는 기록</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 통계 배너 ── */}
        <section className="bg-primary/5 py-14 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 text-center">
              {[
                ['1,248,500+', '기록된 순간들', 'Every memory matters'],
                ['99.9%', '서비스 가용성', 'Safe and Reliable'],
                ['100 Years', '보존 보장', 'Beyond Generation']
              ].map(([num, label, sub]) => (
                <div key={label} className="flex flex-col items-center">
                  <p className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">{num}</p>
                  <p className="text-sm font-bold text-on-surface mb-1">{label}</p>
                  <p className="text-[10px] text-outline uppercase tracking-widest">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 서비스 카드 그리드 ── */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <div className="inline-block px-3 py-1 rounded-full bg-dear-container text-dear text-[10px] font-bold uppercase tracking-[0.2em] mb-4 font-headline">
                  Our Contents
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                  당신의 서사를 위한<br />가장 따뜻한 기록 방식
                </h2>
              </div>
              <p className="text-on-surface-variant text-lg max-w-sm">
                일기부터 자서전까지, 당신의 삶을 입체적으로 기록하고 소중한 사람들에게 전달합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map(({ num, title, subtitle, desc, img, fallback, href }) => (
                <Link
                  key={num}
                  href={href}
                  className="service-card group bg-white rounded-[2rem] p-4 soft-shadow hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-6" style={{ background: fallback }}>
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="service-card-img object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-on-surface">
                        {num}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 pb-4">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 font-headline">{subtitle}</p>
                    <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-3 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust & Tech ── */}
        <section className="py-24 md:py-32 bg-surface-container-low/30">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: 'lock', title: '강력한 보안', color: 'bg-blue-50', text: 'text-blue-600', desc: '군사 등급 암호화로 오직 당신만이 기록을 열람할 수 있습니다.' },
                    { icon: 'history', title: '영구 보전', color: 'bg-teal-50', text: 'text-teal-600', desc: '분산 저장 기술을 통해 100년 후에도 데이터 유실 없이 보관합니다.' },
                    { icon: 'auto_awesome', title: 'AI 어시스턴트', color: 'bg-purple-50', text: 'text-purple-600', desc: 'AI가 당신의 기록을 분석하여 더 풍성한 서사를 제안합니다.' },
                    { icon: 'volunteer_activism', title: '가족 연결', color: 'bg-rose-50', text: 'text-rose-600', desc: '유고 시 지정된 가족에게 기록을 안전하게 전달하는 프로세스.' },
                  ].map(({ icon, title, color, text, desc }) => (
                    <div key={title} className="bg-white p-6 rounded-[2rem] soft-shadow">
                      <div className={`w-12 h-12 ${color} ${text} rounded-2xl flex items-center justify-center mb-4`}>
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                      <h4 className="font-headline font-extrabold text-on-surface text-base mb-2">{title}</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 font-headline">
                  Trust & Technology
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-8">
                  가장 따뜻한 시선으로<br />첨단 기술을 담았습니다.
                </h2>
                <p className="text-lg text-on-surface-variant leading-relaxed mb-10">
                  기술은 단순히 보관을 위한 도구일 뿐입니다.<br />Storige는 그 도구를 통해 당신의 사랑과 삶의 지혜가 다음 세대에게 온전히 전달되도록 돕습니다.
                </p>
                <blockquote className="relative pl-8 border-l-4 border-primary/30 py-2">
                  <p className="text-xl font-bold text-on-surface italic leading-relaxed">
                    "우리가 남기는 것은 물건이 아니라, 우리가 어떻게 살았는지에 대한 기억입니다."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ── 가격/플랜 ── */}
        <LandingPricing />

        {/* ── 앱 다운로드 ── */}
        <LandingAppDownload />

        {/* ── 가치 CTA ── */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-20">
             <Image src={HERO_IMG} alt="배경" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-primary/90" />
          <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white leading-tight mb-8">
              지금, 당신의 이야기를<br />영원한 유산으로 남기세요.
            </h2>
            <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
              미루지 마세요. 오늘 기록한 한 줄의 진심이 미래의 가족에게는 무엇보다 소중한 보물이 됩니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-modern px-10 py-5 bg-white text-primary font-bold rounded-2xl text-lg shadow-2xl">
                무료로 시작하기
              </Link>
            </div>
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer className="bg-surface-container-lowest border-t border-surface-container-highest/30 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2">
                <Image src="/logo.png" alt="Storige" width={110} height={32} className="h-14 w-auto object-contain mb-6" />
                <p className="text-sm text-outline leading-relaxed max-w-xs">
                  기억을 저장하고, 내일을 준비하는 디지털 헤리티지 플랫폼.<br />당신의 서사가 끊기지 않도록 영구히 보존합니다.
                </p>
              </div>
              {[
                { title: 'Service', items: ['일기장','서신','비밀 코드','AI 자서전','추모관','출판'] },
                { title: 'Company', items: ['소개','블로그','채용','문의'] },
                { title: 'Legal', items: ['개인정보처리방침','이용약관','고객센터'] },
              ].map(({ title, items }) => (
                <div key={title}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface mb-6">{title}</p>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item}><span className="text-sm text-outline hover:text-primary cursor-pointer transition-colors">{item}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-surface-container-highest/50">
              <p className="text-xs text-outline">© 2026 Storige Archive. All rights reserved.</p>
              <div className="flex gap-6">
                {['facebook', 'instagram', 'youtube'].map(social => (
                  <div key={social} className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-lg">{social}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
