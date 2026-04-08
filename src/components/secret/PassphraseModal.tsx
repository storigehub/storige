'use client'

import { useState, useRef, useEffect } from 'react'

interface PassphraseModalProps {
  title: string
  error: string | null
  onSubmit: (passphrase: string) => void
  onCancel: () => void
}

// 패스프레이즈 입력 모달 — 시크릿 코드 열람 시 사용
export function PassphraseModal({ title, error, onSubmit, onCancel }: PassphraseModalProps) {
  const [passphrase, setPassphrase] = useState('')
  const [showPass, setShowPass] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 모달 열리면 입력 필드 포커스
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passphrase.trim()) return
    onSubmit(passphrase)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔓</span>
          <div>
            <h3 className="text-base font-semibold text-[#1A1A1A]">패스프레이즈 입력</h3>
            <p className="text-xs text-[#888] mt-0.5">{title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 입력 필드 */}
          <div className="relative mb-1">
            <input
              ref={inputRef}
              type={showPass ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="패스프레이즈를 입력하세요"
              className="w-full px-4 py-3 pr-12 border border-[#e0e0e0] rounded-xl text-sm font-mono outline-none focus:border-pink-accent bg-[#fafafa]"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm"
            >
              {showPass ? '숨기기' : '보기'}
            </button>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <p className="text-xs text-[#FF4757] mt-1 mb-3">{error}</p>
          )}

          {/* 안내 문구 */}
          {!error && (
            <p className="text-xs text-[#B0B0B0] mt-1 mb-3">
              시크릿 코드 등록 시 사용한 패스프레이즈를 입력하세요
            </p>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 border border-[#e0e0e0] rounded-xl text-sm text-[#555]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!passphrase.trim()}
              className="flex-1 py-2.5 bg-pink-accent text-white rounded-xl text-sm font-semibold disabled:opacity-40"
            >
              열람
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
