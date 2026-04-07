'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { SecretListView } from '@/components/secret/SecretListView'

// _1 템플릿 기준 카테고리 정의
const CATEGORIES = [
  { key: 'all',    label: '전체',    icon: 'apps' },
  { key: '금융',   label: '금융',    icon: 'account_balance' },
  { key: '부동산', label: '부동산',  icon: 'domain' },
  { key: '법률',   label: '법률',    icon: 'gavel' },
  { key: '암호화폐', label: '암호화폐', icon: 'currency_bitcoin' },
  { key: '기타',   label: '기타',    icon: 'category' },
] as const

/**
 * 시크릿 코드 메인 페이지 — _1 템플릿 공식 기준
 * 모바일: 다크 그라디언트 히어로 + 가로 스크롤 카테고리 칩 + 목록
 * 데스크탑(md+): 12-col grid — 사이드바(4) + 목록(8)
 */
export default function SecretPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) redirect('/login')
    })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-5 pb-32">
      {/* 히어로 — 다크 그라디언트 배너 (_1 + _4 합성) */}
      <div
        className="rounded-2xl overflow-hidden mt-8 mb-8"
        style={{ background: 'linear-gradient(135deg, #0061A5 0%, #00201C 100%)' }}
      >
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#E91E63]/20 p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[#E91E63] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <span className="text-[#E91E63] font-mono text-xs tracking-[0.2em] uppercase font-bold">Secure Access Only</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            Secret Code
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-lg">
            제로 지식 아키텍처로 보호되는 가장 민감한 디지털 자산입니다.
            모든 데이터는 <span className="text-white/80 font-semibold">클라이언트 측에서 암호화</span>됩니다.
          </p>
          {/* 보안 상태 */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <span className="material-symbols-outlined text-2xl text-white/30" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>fingerprint</span>
            <div>
              <p className="text-xs font-bold text-white/70">AES-256-GCM 암호화 활성</p>
              <p className="text-[10px] text-white/30">패스프레이즈 + 시스템 암호화로 이중 보호</p>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 모바일: 가로 스크롤 카테고리 칩 (md 미만) */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#E91E63] text-white shadow-sm'
                : 'bg-[#f3f3f3] text-[#747878] hover:bg-[#eeeeee]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* 데스크탑: 12-col 그리드 레이아웃 */}
      <div className="hidden md:grid md:grid-cols-12 gap-8">
        {/* 사이드바 (col-span-4) */}
        <aside className="md:col-span-4 space-y-5">
          {/* 카테고리 네비 */}
          <div className="p-6 rounded-2xl bg-[#f3f3f3] border border-[#e8e8e8]">
            <h3 className="font-headline font-bold text-[10px] uppercase tracking-[0.15em] text-[#747878] mb-5">자산 카테고리</h3>
            <nav className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                    selectedCategory === cat.key
                      ? 'bg-white shadow-sm border-l-4 border-[#E91E63]'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <span className={`flex items-center gap-3 font-semibold text-sm ${
                    selectedCategory === cat.key ? 'text-[#1a1c1c]' : 'text-[#747878]'
                  }`}>
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ color: selectedCategory === cat.key ? '#E91E63' : '#747878' }}
                    >
                      {cat.icon}
                    </span>
                    {cat.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* 금고 쉴드 카드 — _1 bg-on-surface + pink-glow */}
          <div
            className="p-6 rounded-2xl text-white"
            style={{
              backgroundColor: '#1a1c1c',
              boxShadow: '0 0 24px rgba(233, 30, 99, 0.12)',
            }}
          >
            <div className="bg-[#E91E63] w-12 h-12 flex items-center justify-center rounded-2xl mb-5">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <h4 className="font-headline font-bold text-xl mb-2">금고 쉴드</h4>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              256비트 AES 암호화 레이어가 활성화되었습니다. 마스킹된 데이터를 확인하려면 패스프레이즈가 필요합니다.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              <span className="material-symbols-outlined text-[12px]">verified_user</span>
              <span>Eterna System V4.0</span>
            </div>
          </div>
        </aside>

        {/* 목록 (col-span-8) */}
        <section className="md:col-span-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1.5 h-5 bg-[#E91E63] rounded-full" />
            <p className="text-[10px] tracking-[0.2em] font-bold text-[#747878] uppercase font-headline">
              Encrypted Records
            </p>
          </div>
          <SecretListView selectedCategory={selectedCategory} />
        </section>
      </div>

      {/* 모바일 목록 (md 미만) */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-5 bg-[#E91E63] rounded-full" />
          <p className="text-[10px] tracking-[0.2em] font-bold text-[#747878] uppercase font-headline">
            Encrypted Records
          </p>
        </div>
        <SecretListView selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}
