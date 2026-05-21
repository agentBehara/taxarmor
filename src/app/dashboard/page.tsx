import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { FileText, Calendar, FolderOpen, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

const demoFilings = [
  { id: "1", type: "ITR-1", financialYear: "2024-25", status: "COMPLETED", createdAt: "2024-07-15" },
  { id: "2", type: "GSTR-3B", financialYear: "2024-25", status: "SUBMITTED", createdAt: "2024-08-01" },
  { id: "3", type: "ITR-2", financialYear: "2023-24", status: "DRAFT", createdAt: "2024-09-10" },
]

const demoAdvisory = [
  { id: "1", scheduledAt: "2025-06-15T10:00:00Z", duration: 30, status: "SCHEDULED" },
  { id: "2", scheduledAt: "2025-07-01T14:00:00Z", duration: 45, status: "SCHEDULED" },
]

export default async function DashboardPage() {
  const session = await auth()
  const isDemo = process.env.DEMO_MODE === "true"

  let filings: any[] = []
  let documents = 0
  let advisoryCalls: any[] = []
  let subscription: any = null

  if (!isDemo && session) {
    const [f, d, a, s] = await Promise.all([
      prisma.filing.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.document.count({ where: { userId: session.user.id, deletedAt: null } }),
      prisma.advisoryCall.findMany({ where: { userId: session.user.id, status: "SCHEDULED" }, orderBy: { scheduledAt: "asc" }, take: 3 }),
      prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    ])
    filings = f
    documents = d
    advisoryCalls = a
    subscription = s
  } else if (isDemo) {
    filings = demoFilings
    documents = 12
    advisoryCalls = demoAdvisory
    subscription = { tier: "PLATINUM", endDate: new Date("2027-12-31") }
  }

  const stats = [
    { name: "Active Filings", value: filings.filter((f: any) => f.status === "DRAFT" || f.status === "SUBMITTED").length, icon: FileText, color: "bg-blue-100 text-blue-600", href: "/dashboard/tax" },
    { name: "Documents Stored", value: documents, icon: FolderOpen, color: "bg-green-100 text-green-600", href: "/dashboard/documents" },
    { name: "Upcoming Advisory", value: advisoryCalls.length, icon: Calendar, color: "bg-purple-100 text-purple-600", href: "/dashboard/advisory" },
    { name: "Completed Filings", value: filings.filter((f: any) => f.status === "COMPLETED").length, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600", href: "/dashboard/tax" },
  ]

  return (
    <div className="space-y-8">
      {isDemo && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Demo Mode</h3>
              <p className="mt-1 text-sm text-blue-700">
                Showing sample data. Authentication is temporarily disabled for demonstration.
              </p>
            </div>
          </div>
        </div>
      )}

      {!subscription && !isDemo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <h3 className="font-medium text-amber-900">No active subscription</h3>
              <p className="mt-1 text-sm text-amber-700">Choose a plan to start filing your taxes.</p>
              <Link href="/pricing" className="mt-2 inline-flex text-sm font-medium text-amber-800 underline hover:text-amber-900">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Filings</h3>
          {filings.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No filings yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {filings.map((filing: any) => (
                <li key={filing.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{filing.type}</p>
                    <p className="text-xs text-gray-500">FY {filing.financialYear}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    filing.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    filing.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" :
                    filing.status === "REJECTED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {filing.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Advisory Calls</h3>
          {advisoryCalls.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No upcoming calls scheduled.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {advisoryCalls.map((call: any) => (
                <li key={call.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(call.scheduledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(call.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} &middot; {call.duration} min
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
