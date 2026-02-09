import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Public routes (no auth needed)
  const publicRoutes = ['/', '/login', '/register', '/rules']
  
  // Auth routes (redirect to dashboard if logged in)
  const authRoutes = ['/login', '/register']

  // Protected routes (redirect to login if not logged in)
  const protectedRoutes = [
    '/dashboard', 
    '/challenges', 
    '/scoreboard', 
    '/users', 
    '/activity', 
    '/notifications', 
    '/settings', 
    '/profile',
    '/admin'
  ]

  // 1. If user is logged in and tries to access auth routes, redirect to dashboard
  if (user && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. If user is NOT logged in and tries to access protected routes, redirect to login
  // Check if path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Admin Check (Optional, but good for security)
  if (user && path.startsWith('/admin')) {
    // We can't easily check role here without a DB call which might be expensive in middleware
    // Usually we rely on RLS and page-level checks, but we can do a quick check if we stored role in metadata
    // For now, let page-level handle detailed role check, middleware just ensures authentication
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
