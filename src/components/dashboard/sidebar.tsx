"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Building2,
  TrendingUp,
  Calendar,
  FolderOpen,
  Settings,
  Shield,
  Receipt,
  BarChart3,
  AlertTriangle,
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tax Compliance", href: "/dashboard/tax", icon: FileText },
  { name: "Exemptions", href: "/dashboard/exemptions", icon: Receipt },
  { name: "Investments & Income", href: "/dashboard/investments", icon: BarChart3 },
  { name: "Losses & Set-Off", href: "/dashboard/losses", icon: AlertTriangle },
  { name: "Property & Asset", href: "/dashboard/property", icon: Building2 },
  { name: "Financial Health", href: "/dashboard/financial", icon: TrendingUp },
  { name: "Advisory", href: "/dashboard/advisory", icon: Calendar },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <Shield className="h-7 w-7 text-blue-600" />
          <span className="ml-2 text-lg font-bold text-gray-900">TaxArmor</span>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
