/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu'],
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Temporarily ignore TypeScript errors during build (for deployment)
  typescript: {
    ignoreBuildErrors: process.env.IGNORE_TS_ERRORS === 'true',
  },
  
  // Ignore ESLint errors during build (for deployment)
  eslint: {
    ignoreDuringBuilds: process.env.IGNORE_ESLINT_ERRORS === 'true',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Bundle analyzer (commented out for production)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
}

module.exports = nextConfig