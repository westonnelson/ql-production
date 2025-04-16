/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://quotelinker.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/agent', '/admin'],
      },
    ],
  },
  exclude: ['/agent/*', '/admin/*'],
  generateIndexSitemap: true,
  outDir: 'public',
} 