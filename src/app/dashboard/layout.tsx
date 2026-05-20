import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { prisma } from "@/lib/db"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {session.user.name}
              </h1>
              {subscription && (
                <p className="text-sm text-gray-500">
                  {subscription.tier} Plan &middot; Expires{" "}
                  {new Date(subscription.endDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {session.user.role}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  )
}
