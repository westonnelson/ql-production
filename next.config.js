/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['quotelinker.com'],
  },
  trailingSlash: true,
  assetPrefix: '/',
  basePath: '',
  output: 'standalone',
}

module.exports = nextConfig 