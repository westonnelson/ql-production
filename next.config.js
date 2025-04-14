/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['quotelinker.com'],
  },
  trailingSlash: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://quotelinker.com',
  },
}

module.exports = nextConfig 