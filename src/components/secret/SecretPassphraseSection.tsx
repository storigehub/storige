'use client'

interface SecretPassphraseSectionProps {
  passphrase: string
  passphraseConfirm: string
  showPass: boolean
  onPassphraseChange: (v: string) => void
  onPassphraseConfirmChange: (v: string) => void
  onShowPassToggle: () => void
}

// 패스프레이즈 입력 섹션 — 표시/숨김 토글 포함
export function SecretPassphraseSection({
  passphrase,
  passphraseConfirm,
  showPass,
  onPassphraseChange,
  onPassphraseConfirmChange,
  onShowPassToggle,
}: SecretPassphraseSectionProps) {
  return (
    <div className="bg-[#fff0f5] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔐</span>
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">패스프레이즈 설정</p>
          <p className="text-[10px] text-[#888]">이 패스프레이즈로 내용이 암호화됩니다. 절대 잊지 마세요.</p>
        </div>
      </div>

      <div className="relative mb-2">
        <input
          type={showPass ? 'text' : 'password'}
          value={passphrase}
          onChange={(e) => onPassphraseChange(e.target.value)}
          placeholder="패스프레이즈 (8자 이상)"
          className="w-full px-4 py-3 pr-16 border border-[#ffc0d4] rounded-xl text-sm font-mono outline-none focus:border-[#FF6B9D] bg-white"
        />
        <button
          type="button"
          onClick={onShowPassToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-xs"
        >
          {showPass ? '숨기기' : '보기'}
        </button>
      </div>

      <input
        type={showPass ? 'text' : 'password'}
        value={passphraseConfirm}
        onChange={(e) => onPassphraseConfirmChange(e.target.value)}
        placeholder="패스프레이즈 확인"
        className="w-full px-4 py-3 border border-[#ffc0d4] rounded-xl text-sm font-mono outline-none focus:border-[#FF6B9D] bg-white"
      />
    </div>
  )
}
