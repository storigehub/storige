import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

// useSearchParams() 사용으로 Suspense 경계 필수
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
