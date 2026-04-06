'use client'

import { useRouter, usePathname } from 'next/navigation'

// 경로별 FAB 액션 매핑
const FAB_ACTIONS: Record<string, { href: string; label: string }> = {
  '/diary': { href: '/diary/new', label: '새 일기 작성' },
  '/dear': { href: '/dear/new', label: '새 편지 작성' },
  '/secret': { href: '/secret/new', label: '새 시크릿 코드' },
  '/album': { href: '/album/new', label: '사진 추가' },
}

// 플로팅 액션 버튼 (화면 우하단 + 버튼)
export function FAB() {
  const router = useRouter()
  const pathname = usePathname()

  // 현재 경로에 맞는 FAB 액션 찾기
  const action = Object.entries(FAB_ACTIONS).find(([key]) =>
    pathname.startsWith(key)
  )?.[1]

  if (!action) return null

  return (
    <button
      onClick={() => router.push(action.href)}
      aria-label={action.label}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-[#4A90D9] hover:bg-[#3a7bc8] text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform active:scale-95"
    >
      +
    </button>
  )
}
