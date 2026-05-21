import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const protectedRoutes = ["/dashboard"]
const adminRoutes = ["/api/admin", "/dashboard/admin"]
const caRoutes = ["/dashboard/ca"]
const authRoutes = ["/login", "/register"]

export async function middleware(request: any) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // DEMO MODE: Bypass auth entirely
  if (process.env.DEMO_MODE === "true") {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (authRoutes.includes(pathname) && token) {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!token) {
      url.pathname = "/login"
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    if (adminRoutes.some((r) => pathname.startsWith(r)) && token.role !== "ADMIN") {
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    if (caRoutes.some((r) => pathname.startsWith(r)) && token.role !== "CA" && token.role !== "ADMIN") {
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)"],
}
