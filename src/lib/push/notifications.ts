'use client'

/**
 * 푸시 알림 등록 유틸 — Capacitor Push / Web Push fallback
 * FCM 토큰 취득 후 Supabase profiles.push_token 에 저장
 */

import { isCapacitor } from '@/lib/utils/camera'

// Capacitor 환경에서 FCM 토큰 취득
export async function registerPushNotifications(): Promise<string | null> {
  if (!isCapacitor()) {
    // 웹 브라우저 — Web Push API
    return registerWebPush()
  }

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')

    // 권한 요청
    const result = await PushNotifications.requestPermissions()
    if (result.receive !== 'granted') return null

    await PushNotifications.register()

    // 토큰 수신 (Promise 래핑)
    return new Promise((resolve) => {
      PushNotifications.addListener('registration', (token) => {
        resolve(token.value)
      })
      PushNotifications.addListener('registrationError', () => {
        resolve(null)
      })
      // 5초 타임아웃
      setTimeout(() => resolve(null), 5000)
    })
  } catch {
    return null
  }
}

// 웹 브라우저 Web Push API
async function registerWebPush(): Promise<string | null> {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })
    // Web Push subscription을 JSON 문자열로 반환 (FCM 토큰 대신)
    return JSON.stringify(subscription.toJSON())
  } catch {
    return null
  }
}

// 수신된 알림 핸들러 설정 (Capacitor)
export async function setupPushListeners(
  onNotification: (title: string, body: string) => void
): Promise<void> {
  if (!isCapacitor()) return

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      onNotification(
        notification.title ?? '스토리지',
        notification.body ?? '새 알림이 있습니다.'
      )
    })
  } catch {
    // 무시
  }
}
