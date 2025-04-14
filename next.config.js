/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['quotelinker.vercel.app'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig 