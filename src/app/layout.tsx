import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: '스토리지 — 이야기저장소',
  description: '기억을 저장하고, 내일을 준비하는 디지털 헤리티지 플랫폼',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '스토리지',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0061A5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* 폰트 preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols Outlined — display=block: 로드 전 invisible (텍스트 플래시 방지) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        {/* Plus Jakarta Sans (헤드라인) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap"
        />
        {/* JetBrains Mono (시크릿 코드) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* Pretendard (한글 본문) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full bg-[#f9f9f9]">
        {children}
        <Toaster position="top-center" richColors />
        {/* Service Worker 등록 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker
                    .register('/sw.js')
                    .then(function(reg) {
                      // 대기(waiting) 상태면 즉시 활성화 요청
                      if (reg.waiting) {
                        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                      }

                      // 업데이트 발생 시: 기존 컨트롤이 있으면 1회 재로딩
                      reg.addEventListener('updatefound', function() {
                        const newWorker = reg.installing;
                        if (!newWorker) return;

                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state !== 'installed') return;

                          // controller가 있으면 "업데이트" 케이스
                          if (navigator.serviceWorker.controller) {
                            var key = 'sw_update_reload_at';
                            var last = sessionStorage.getItem(key);
                            var now = Date.now();
                            var lastNum = last ? parseInt(last, 10) : NaN;

                            if (!last || !Number.isFinite(lastNum) || now - lastNum > 10000) {
                              sessionStorage.setItem(key, String(now));
                              try { newWorker.postMessage({ type: 'SKIP_WAITING' }); } catch (e) {}
                              window.location.reload();
                            }
                          }
                        });
                      });

                      // 최신 sw.js 반영을 위해 즉시 갱신 시도
                      reg.update().catch(function() {});
                    })
                    .catch(function() {});
                });
              }
            `,
          }}
        />
        {/* ChunkLoadError 자동 새로고침 — 배포 후 구 청크 참조 실패 시 한 번만 reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function isChunkLoadMessage(msg) {
                return (
                  msg.indexOf('Loading chunk') !== -1 ||
                  msg.indexOf('ChunkLoadError') !== -1 ||
                  msg.indexOf('Failed to fetch dynamically imported module') !== -1 ||
                  msg.indexOf('/_next/static/chunks/') !== -1
                );
              }

              function reloadOnceForChunkFailure() {
                var key = 'chunkReloadAt';
                var last = sessionStorage.getItem(key);
                var now = Date.now();
                var lastNum = last ? parseInt(last, 10) : NaN;

                if (!last || !Number.isFinite(lastNum) || now - lastNum > 10000) {
                  sessionStorage.setItem(key, now.toString());
                  window.location.reload();
                }
              }

              window.addEventListener('error', function(e) {
                var msg = e.message || '';
                var source = e.filename || '';
                if (isChunkLoadMessage(msg) || isChunkLoadMessage(source)) {
                  reloadOnceForChunkFailure();
                }
              }, true);

              window.addEventListener('unhandledrejection', function(e) {
                var reason = e.reason;
                var msg = '';

                if (typeof reason === 'string') {
                  msg = reason;
                } else if (reason) {
                  msg = (reason.message || '') + ' ' + (reason.stack || '');
                }

                if (isChunkLoadMessage(msg)) {
                  reloadOnceForChunkFailure();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
