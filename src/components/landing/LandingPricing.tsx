'use client'

import Link from 'next/link'

const PLANS = [
  {
    id: 'free',
    name: 'FREE',
    label: '무료',
    price: '0',
    unit: '',
    desc: '시작은 가볍게',
    features: ['일기 30일 보관', '편지 월 3편', '사진 100MB', '기본 보안 잠금'],
    cta: '무료 시작',
    href: '/signup',
    highlight: false,
  },
  {
    id: 'monthly',
    name: 'BASIC',
    label: '월 구독',
    price: '9,900',
    unit: '/ 월',
    desc: '일상을 기록하는 모든 것',
    features: ['무제한 일기 + 사진 5GB', '편지 월 10편 + 예약 발송', '시크릿 코드 20개', 'AI 요약 + 글감 제안', '가족 3인 연결'],
    cta: '시작하기',
    href: '/signup',
    highlight: true,
    badge: '인기',
  },
  {
    id: 'annual',
    name: 'ANNUAL',
    label: '연 구독',
    price: '99,000',
    unit: '/ 년',
    desc: '2개월 무료 + 모든 기능',
    features: ['BASIC 전체 기능', 'AI 자서전 무제한', '출판 10% 할인', '포토앨범 50GB', '가족 10인 연결', '유고 시 전달 자동화'],
    cta: '연간 플랜으로',
    href: '/signup',
    highlight: false,
    badge: '2개월 무료',
  },
]

export function LandingPricing() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4 font-headline">
            Pricing
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            당신의 기억에 맞는<br />플랜을 선택하세요
          </h2>
          <p className="mt-6 text-base text-on-surface-variant max-w-xl mx-auto">언제든 변경하거나 취소할 수 있습니다. 당신의 소중한 역사를 위해 가장 합리적인 방식을 선택해 보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2.5rem] p-10 flex flex-col gap-8 transition-all duration-500 hover:scale-[1.02] ${
                plan.highlight
                  ? 'bg-primary text-white shadow-2xl shadow-primary/30'
                  : 'bg-white text-on-surface border border-surface-container-highest/50 shadow-xl shadow-surface-dim/20'
              }`}
            >
              {/* 배지 */}
              {plan.badge && (
                <span className={`absolute -top-4 left-10 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg ${
                  plan.highlight ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {plan.badge}
                </span>
              )}

              {/* 플랜명 */}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 font-headline ${
                  plan.highlight ? 'text-white/60' : 'text-outline'
                }`}>{plan.name}</p>
                <p className={`text-base font-semibold ${plan.highlight ? 'text-white/80' : 'text-on-surface-variant'}`}>{plan.desc}</p>
              </div>

              {/* 가격 */}
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-5xl font-extrabold tracking-tight">
                  {plan.price === '0' ? '무료' : `₩${plan.price}`}
                </span>
                {plan.unit && (
                  <span className={`text-sm font-bold ${plan.highlight ? 'text-white/60' : 'text-outline'}`}>{plan.unit}</span>
                )}
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-4 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-[15px]">
                    <span className={`material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5 ${
                      plan.highlight ? 'text-white/70' : 'text-primary'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className={plan.highlight ? 'text-white/90 font-medium' : 'text-on-surface-variant font-medium'}>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`mt-4 block text-center py-4.5 rounded-2xl text-base font-bold transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-white text-primary hover:bg-surface-container-lowest'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* 출판 단건 결제 안내 */}
        <div className="mt-12 rounded-[2.5rem] bg-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-surface-container-highest/50 shadow-lg shadow-surface-dim/10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/10">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
            </div>
            <div>
              <p className="font-headline font-extrabold text-on-surface text-lg">종이책 출판 — 단건 결제 가능</p>
              <p className="text-sm text-on-surface-variant mt-1">구독 없이도 필요한 순간에만 소중한 기록을 실물 책으로 소장할 수 있습니다.</p>
            </div>
          </div>
          <Link href="/publish" className="px-8 py-3.5 bg-surface-container-low text-on-surface text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-surface-container hover:gap-3 transition-all flex-shrink-0">
            출판 서비스 알아보기
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
