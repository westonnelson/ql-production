/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['quotelinker.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quotelinker.com',
      },
    ],
  },
  trailingSlash: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://quotelinker.com',
  },
  // Ensure proper handling of API routes
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 