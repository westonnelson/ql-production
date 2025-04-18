import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Exclude API routes from authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
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
    return NextResponse.next()
  }

  // Require authentication for admin and agent routes
  if (request.nextUrl.pathname.startsWith('/admin/') || request.nextUrl.pathname.startsWith('/agent/')) {
    const vercelToken = request.cookies.get('vercel-token')
    if (!vercelToken) {
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 