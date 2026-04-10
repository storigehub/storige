'use client'

interface SecretPassphraseSectionProps {
  passphrase: string
  passphraseConfirm: string
  showPass: boolean
  onPassphraseChange: (v: string) => void
  onPassphraseConfirmChange: (v: string) => void
  onShowPassToggle: () => void
}

// 패스프레이즈 입력 섹션 — 다크 금고 패널 스타일
export function SecretPassphraseSection({
  passphrase,
  passphraseConfirm,
  showPass,
  onPassphraseChange,
  onPassphraseConfirmChange,
  onShowPassToggle,
}: SecretPassphraseSectionProps) {
  return (
    <div className="bg-[#1A1C1C] rounded-[1.25rem] p-6" style={{ boxShadow: '0 0 24px rgba(233,30,99,0.08)' }}>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-[#E91E63] rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            security
          </span>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mb-0.5">AES-256 ENCRYPTION</p>
          <p className="text-white font-semibold text-sm leading-tight">패스프레이즈 설정</p>
        </div>
      </div>

      <p className="text-white/50 text-xs leading-relaxed mb-5">
        이 키로 내용이 암호화됩니다. Storige 서버에는 저장되지 않으며, 분실 시 복구가 불가능합니다.
      </p>

      {/* 패스프레이즈 입력 */}
      <div className="relative mb-3">
        <input
          type={showPass ? 'text' : 'password'}
          value={passphrase}
          onChange={(e) => onPassphraseChange(e.target.value)}
          placeholder="패스프레이즈 (8자 이상)"
          className="w-full px-4 py-3 pr-14 bg-white/10 border border-white/20 rounded-xl text-sm font-mono text-white placeholder:text-white/30 outline-none focus:border-[#E91E63]/60 focus:bg-white/15 transition-colors"
        />
        <button
          type="button"
          onClick={onShowPassToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          aria-label={showPass ? '숨기기' : '보기'}
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
            {showPass ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {/* 확인 입력 */}
      <input
        type={showPass ? 'text' : 'password'}
        value={passphraseConfirm}
        onChange={(e) => onPassphraseConfirmChange(e.target.value)}
        placeholder="패스프레이즈 확인"
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-mono text-white placeholder:text-white/30 outline-none focus:border-[#E91E63]/60 focus:bg-white/15 transition-colors"
      />

      {/* 일치 여부 인디케이터 */}
      {passphraseConfirm.length > 0 && (
        <p className={`mt-2 text-[11px] flex items-center gap-1.5 ${passphrase === passphraseConfirm ? 'text-emerald-400' : 'text-[#E91E63]'}`}>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            {passphrase === passphraseConfirm ? 'check_circle' : 'cancel'}
          </span>
          {passphrase === passphraseConfirm ? '패스프레이즈가 일치합니다' : '패스프레이즈가 일치하지 않습니다'}
        </p>
      )}
    </div>
  )
}
