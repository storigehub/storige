import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Capacitor를 위한 static export (모바일 빌드 시 활성화)
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uobbgxwuukwptqtywxxj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
