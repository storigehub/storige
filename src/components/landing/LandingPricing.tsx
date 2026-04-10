'use client'

import Link from 'next/link'

/**
 * 랜딩 가격/플랜 섹션 — Midnight Archive 디자인 시스템
 * 결제 연동 전: CTA는 /signup 연결, 결제 버튼 비활성
 */
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
    <section className="py-20 md:py-28 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 font-headline">Pricing</p>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-[#1A1C1C] tracking-tight">
            당신의 기억에 맞는<br />플랜을 선택하세요
          </h2>
          <p className="mt-4 text-sm text-[#747878]">언제든 변경하거나 취소할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 flex flex-col gap-5 transition-shadow ${
                plan.highlight
                  ? 'bg-primary text-white shadow-2xl'
                  : 'bg-white text-[#1A1C1C] shadow-sm hover:shadow-md'
              }`}
            >
              {/* 배지 */}
              {plan.badge && (
                <span className={`absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  plan.highlight ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {plan.badge}
                </span>
              )}

              {/* 플랜명 */}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-1 ${
                  plan.highlight ? 'text-white/60' : 'text-[#747878]'
                }`}>{plan.name}</p>
                <p className={`text-sm font-medium ${plan.highlight ? 'text-white/80' : 'text-[#747878]'}`}>{plan.desc}</p>
              </div>

              {/* 가격 */}
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-4xl font-extrabold tracking-tight">
                  {plan.price === '0' ? '무료' : `₩${plan.price}`}
                </span>
                {plan.unit && (
                  <span className={`text-sm font-medium ${plan.highlight ? 'text-white/60' : 'text-[#747878]'}`}>{plan.unit}</span>
                )}
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm">
                    <span className={`material-symbols-outlined text-[16px] flex-shrink-0 ${
                      plan.highlight ? 'text-white/70' : 'text-primary'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className={plan.highlight ? 'text-white/90' : 'text-[#444748]'}>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`mt-2 block text-center py-3.5 rounded-[0.625rem] text-sm font-bold transition-all ${
                  plan.highlight
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* 출판 단건 결제 안내 */}
        <div className="mt-8 rounded-2xl bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#1A1C1C] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
            </div>
            <div>
              <p className="font-headline font-bold text-[#1A1C1C] text-sm">종이책 출판 — 단건 결제</p>
              <p className="text-xs text-[#747878] mt-0.5">기록을 실물 책으로. 200페이지 기준 39,000원~</p>
            </div>
          </div>
          <Link href="/publish" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all flex-shrink-0">
            출판 알아보기
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
