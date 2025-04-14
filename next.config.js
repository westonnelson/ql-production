/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['quotelinker.com', 'www.quotelinker.com', 'ql-production-4fk90gsvw-yield.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quotelinker.com',
      },
      {
        protocol: 'https',
        hostname: 'www.quotelinker.com',
      },
      {
        protocol: 'https',
        hostname: 'ql-production-4fk90gsvw-yield.vercel.app',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://www.quotelinker.com'
      : 'http://localhost:3000',
  },
  // Handle redirects and API routes
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'quotelinker.com',
          },
        ],
        destination: 'https://www.quotelinker.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 