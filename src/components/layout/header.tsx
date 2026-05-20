import Link from "next/link"
import { auth } from "@/auth"
import { Shield, LayoutDashboard, LogOut } from "lucide-react"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TaxArmor</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/terms" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Terms
          </Link>
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
