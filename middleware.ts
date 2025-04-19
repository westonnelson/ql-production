import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log environment variables and request path for debugging
  console.log('Middleware Debug:', {
    path: request.nextUrl.pathname,
    SKIP_AUTH: process.env.SKIP_AUTH,
    VERCEL_ENV: process.env.VERCEL_ENV,
    IS_PRODUCTION: process.env.SKIP_AUTH === 'true' || process.env.VERCEL_ENV === 'production'
  })

  // Always allow API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('Allowing API route:', request.nextUrl.pathname)
    return NextResponse.next()
  }

  // Skip authentication if SKIP_AUTH is true or in production
  if (process.env.SKIP_AUTH === 'true' || process.env.VERCEL_ENV === 'production') {
    console.log('Skipping authentication in production')
    return NextResponse.next()
  }

  // Exclude public routes from authentication
  const publicRoutes = [
    '/',
    '/quote',
    '/quote/auto',
    '/quote/life',
    '/quote/disability',
    '/quote/health',
    '/quote/supplemental-health',
    '/quote/success',
    '/about',
    '/faq',
    '/privacy',
    '/terms',
    '/benefits',
    '/education',
  ]

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    console.log('Allowing public route:', request.nextUrl.pathname)
    return NextResponse.next()
  }

  // Require authentication for admin and agent routes
  if (request.nextUrl.pathname.startsWith('/admin/') || request.nextUrl.pathname.startsWith('/agent/')) {
    const vercelToken = request.cookies.get('vercel-token')
    if (!vercelToken) {
      console.log('Redirecting to login for protected route:', request.nextUrl.pathname)
      return NextResponse.redirect(new URL('/agent/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 