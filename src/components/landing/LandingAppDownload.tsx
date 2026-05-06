'use client'

/**
 * 랜딩 앱 다운로드 CTA 섹션 — Midnight Archive / Bright Theme
 */
export function LandingAppDownload() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="rounded-[3rem] bg-surface-container-low/50 px-8 md:px-20 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12 border border-surface-container-highest/30">

          {/* 좌측 텍스트 */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 font-headline">
              Mobile App
            </div>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
              언제 어디서나,<br className="hidden md:block" />당신의 기억과 함께
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              iOS와 Android 전용 앱을 통해 카메라, 위치 정보, 그리고 생체 인증 기술을 완벽하게 활용하십시오. 당신의 서사는 이제 주머니 속에서 영원히 숨 쉽니다.
            </p>
          </div>

          {/* 우측 다운로드 버튼 */}
          <div className="flex flex-col sm:flex-row gap-6 flex-shrink-0">
            {/* App Store */}
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-4 px-8 py-5 bg-white rounded-2xl border border-surface-container-highest shadow-xl shadow-surface-dim/10 opacity-70 cursor-not-allowed transition-all"
                aria-label="App Store — 출시 준비 중"
              >
                <div className="w-12 h-12 rounded-xl bg-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Download on the</p>
                  <p className="text-xl font-extrabold text-on-surface font-headline leading-none mt-1">App Store</p>
                </div>
              </button>
              <span className="absolute -top-3 -right-3 text-[10px] font-extrabold bg-primary text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">준비중</span>
            </div>

            {/* Google Play */}
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-4 px-8 py-5 bg-white rounded-2xl border border-surface-container-highest shadow-xl shadow-surface-dim/10 opacity-70 cursor-not-allowed transition-all"
                aria-label="Google Play — 출시 준비 중"
              >
                <div className="w-12 h-12 rounded-xl bg-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>android</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Get it on</p>
                  <p className="text-xl font-extrabold text-on-surface font-headline leading-none mt-1">Google Play</p>
                </div>
              </button>
              <span className="absolute -top-3 -right-3 text-[10px] font-extrabold bg-primary text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">준비중</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
