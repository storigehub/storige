/**
 * Storige Service Worker
 * - 정적 자산 캐시 (Cache-First)
 * - API 요청 Network-First
 * - 문서 네비게이션 Network-First (구버전 HTML 캐시로 인한 청크 불일치 방지)
 * - 오프라인 fallback
 */

const CACHE_NAME = 'storige-v3'
const OFFLINE_URL = '/offline'

/** Next.js App Router RSC/프리패치 요청은 캐시하면 HTML과 섞여 네비게이션이 완료되지 않음 */
function isNextAppRouterDataRequest(request) {
  const h = request.headers
  if (h.get('rsc')) return true
  if (h.get('next-router-state-tree')) return true
  if (h.get('next-router-prefetch')) return true
  if (h.get('next-router-segment-prefetch')) return true
  if (h.get('next-hmr-refresh')) return true
  return false
}

// 사전 캐시할 자산
const PRECACHE_URLS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

function isNavigationDocumentRequest(request) {
  const accept = request.headers.get('accept') ?? ''
  return (
    request.method === 'GET' &&
    (request.mode === 'navigate' ||
      request.destination === 'document' ||
      accept.includes('text/html'))
  )
}

// 설치 — 사전 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// 클라이언트에서 "즉시 활성화" 메시지를 보낼 수 있게 함
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

// 활성화 — 구버전 캐시 제거
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — 전략별 처리
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API 요청: Network-First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: '오프라인 상태입니다.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )
    return
  }

  // Supabase 요청: Network-Only (캐시하지 않음)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(request))
    return
  }

  // Next 빌드 산출물 — 배포마다 해시가 바뀌므로 캐시하면 청크 불일치
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(fetch(request))
    return
  }

  // RSC Flight / 라우터 프리패치 — HTML 캐시와 동일 URL로 충돌하지 않음
  if (isNextAppRouterDataRequest(request) || url.searchParams.has('_rsc')) {
    event.respondWith(fetch(request))
    return
  }

  // 문서 네비게이션(HTML)은 Network-First로 처리: 캐시된 구버전 HTML이 청크 404를 유발할 수 있음
  if (isNavigationDocumentRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached
            if (request.destination === 'document') {
              return caches.match(OFFLINE_URL) ?? new Response('오프라인', { status: 503 })
            }
            return new Response('', { status: 503 })
          }),
        )
    )
    return
  }

  // 정적 자산: Cache-First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok && request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      }).catch(() => {
        // 오프라인 + 캐시 없음: 오프라인 페이지 반환
        if (request.destination === 'document') {
          return caches.match(OFFLINE_URL) ?? new Response('오프라인', { status: 503 })
        }
        return new Response('', { status: 503 })
      })
    })
  )
})

// 푸시 알림 수신 (Web Push)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? '스토리지', {
      body: data.body ?? '새 알림이 있습니다.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url ?? '/diary' },
    })
  )
})

// 알림 클릭 — 해당 URL 열기
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/diary'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const client = clientList.find((c) => c.url.includes(url))
      if (client) return client.focus()
      return clients.openWindow(url)
    })
  )
})
