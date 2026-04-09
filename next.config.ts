import type { NextConfig } from 'next'

// CAPACITOR_BUILD=1 환경변수가 있으면 static export (모바일 빌드)
const isCapacitorBuild = process.env.CAPACITOR_BUILD === '1'

const nextConfig: NextConfig = {
  ...(isCapacitorBuild && {
    output: 'export',
    // static export에서 Image Optimization 비활성화
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
    },
  }),
}

export default nextConfig
