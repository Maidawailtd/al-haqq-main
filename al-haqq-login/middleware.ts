import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          // This is used for setting cookies in the response
          // We don't need to do anything here in middleware
        },
        remove(name: string, options) {
          // This is used for removing cookies in the response
          // We don't need to do anything here in middleware
        },
      },
    },
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/investments/invest", "/profile", "/account"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Routes that require KYC verification
  const kycRequiredRoutes = ["/investments/invest"]

  // Check if the current path requires KYC verification
  const isKycRequiredRoute = kycRequiredRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing a KYC-required route, check KYC status
  if (isKycRequiredRoute && session) {
    // Get user's KYC status
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("kyc_status")
      .eq("user_id", session.user.id)
      .single()

    // If KYC is not verified, redirect to KYC verification page
    if (!profileData || profileData.kyc_status !== "verified") {
      return NextResponse.redirect(new URL("/dashboard/kyc", request.url))
    }
  }

  // If accessing login/register with a session, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register") && session) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard"
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // Add CSRF protection headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co https://api.ipify.org;",
  )

  return response
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/investments/invest/:path*",
    "/profile/:path*",
    "/account/:path*",
    "/login",
    "/register",
    "/reset-password",
    "/auth/callback",
  ],
}
