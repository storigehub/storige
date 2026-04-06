'use client'

import dynamic from 'next/dynamic'

// Tiptap은 SSR 미지원 — dynamic import로 클라이언트에서만 로드
const DearEditor = dynamic(
  () => import('@/components/dear/DearEditor').then((m) => m.DearEditor),
  { ssr: false, loading: () => <div className="flex-1 animate-pulse bg-[#f5f5f5]" /> }
)

// 새 편지 작성 페이지
export default function NewDearPage() {
  return <DearEditor />
}
