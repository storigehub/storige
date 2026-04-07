/**
 * 포토앨범 페이지 — Phase 4 구현 예정
 * 현재: 플레이스홀더 (빈 페이지)
 * Phase 4에서 Capacitor camera 플러그인 연동과 함께 구현
 */
export default function AlbumPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-6">
      <span
        className="material-symbols-outlined text-5xl text-[#747878]"
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        photo_library
      </span>
      <h2 className="text-xl font-extrabold text-[#1a1c1c] font-headline">포토앨범</h2>
      <p className="text-sm text-[#747878] max-w-xs leading-relaxed">
        가족 포토앨범 기능은 <span className="font-semibold text-[#0061A5]">Phase 4</span>에서
        Capacitor 카메라 연동과 함께 구현될 예정입니다.
      </p>
      <div className="mt-2 px-4 py-2 bg-[#d2e4ff] rounded-full text-xs font-bold text-[#004375] uppercase tracking-wider">
        Coming in Phase 4
      </div>
    </div>
  )
}
