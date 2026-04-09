'use client'

import { useEffect, useCallback } from 'react'
import { registerPushNotifications, setupPushListeners } from '@/lib/push/notifications'

/**
 * 푸시 알림 등록 훅
 * 앱 마운트 시 FCM 토큰 취득 → /api/push/register에 저장
 */
export function usePushNotifications() {
  const register = useCallback(async () => {
    try {
      const token = await registerPushNotifications()
      if (!token) return

      await fetch('/api/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch {
      // 알림 등록 실패 — 비필수 기능, 무시
    }
  }, [])

  useEffect(() => {
    // 앱 첫 로드 시 등록 시도 (이미 권한이 있으면 바로 토큰 취득)
    register()

    // 수신 핸들러 설정
    setupPushListeners((title, body) => {
      // 인앱 토스트 또는 배너 표시 (sonner 연동 가능)
      console.log('[Push]', title, body)
    })
  }, [register])

  return { register }
}
