import { redirect } from 'next/navigation'

// 루트 경로 → 일기 목록으로 리다이렉트
export default function Home() {
  redirect('/diary')
}
