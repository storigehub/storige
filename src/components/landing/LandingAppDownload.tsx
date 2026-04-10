'use client'

/**
 * 랜딩 앱 다운로드 CTA 섹션
 * Capacitor 앱 출시 전: "준비 중" 배지 표시, 링크는 비활성
 */
export function LandingAppDownload() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="rounded-2xl bg-[#1A1C1C] px-8 md:px-16 py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* 좌측 텍스트 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D2E4FF] mb-4 font-headline">Mobile App</p>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              언제 어디서나,<br />당신의 기억과 함께
            </h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              iOS · Android 네이티브 앱으로 카메라, 위치, 생체인증을 완벽하게 활용하세요.
            </p>
          </div>

          {/* 우측 다운로드 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            {/* App Store */}
            <div className="relative">
              <button
                disabled
                className="flex items-center gap-3 px-5 py-3.5 bg-white/10 rounded-[0.625rem] border border-white/20 opacity-70 cursor-not-allowed"
                aria-label="App Store — 출시 준비 중"
              >
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
                <div className="text-left">
                  <p className="text-[9px] text-white/50 uppercase tracking-wider">Download on the</p>
                  <p className="text-sm font-bold text-white font-headline">App Store</p>
                </div>
              </button>
              <span className="absolute -top-2.5 -right-2 text-[9px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">준비중</span>
            </div>

            {/* Google Play */}
            <div className="relative">
              <button
                disabled
                className="flex items-center gap-3 px-5 py-3.5 bg-white/10 rounded-[0.625rem] border border-white/20 opacity-70 cursor-not-allowed"
                aria-label="Google Play — 출시 준비 중"
              >
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>android</span>
                <div className="text-left">
                  <p className="text-[9px] text-white/50 uppercase tracking-wider">Get it on</p>
                  <p className="text-sm font-bold text-white font-headline">Google Play</p>
                </div>
              </button>
              <span className="absolute -top-2.5 -right-2 text-[9px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">준비중</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
