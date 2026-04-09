import type { NextConfig } from 'next'

// CAPACITOR_BUILD=1 환경변수가 있으면 static export (모바일 빌드)
const isCapacitorBuild = process.env.CAPACITOR_BUILD === '1'

const nextConfig: NextConfig = {
  ...(isCapacitorBuild && {
    output: 'export',
    images: { unoptimized: true },
  }),
  ...(!isCapacitorBuild && {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'uobbgxwuukwptqtywxxj.supabase.co',
          pathname: '/storage/v1/object/public/**',
        },
      ],
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 86400, // 24시간
    },
  }),
  // 번들 최적화
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@tiptap/react'],
  },
  // 보안 헤더
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
  ],
}

export default nextConfig
