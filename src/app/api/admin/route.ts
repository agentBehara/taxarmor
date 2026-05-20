import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")

  if (action === "stats") {
    const [userCount, activeSubscriptions, totalRevenue, filingsCount] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.aggregate({
        where: { status: "ACTIVE" },
        _sum: { amount: true },
      }),
      prisma.filing.count(),
    ])

    const tierBreakdown = await prisma.subscription.groupBy({
      by: ["tier"],
      where: { status: "ACTIVE" },
      _count: true,
    })

    return NextResponse.json({
      userCount,
      activeSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      filingsCount,
      tierBreakdown,
    })
  }

  if (action === "users") {
    const users = await prisma.user.findMany({
      include: {
        subscription: true,
        _count: {
          select: { documents: true, filings: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(users)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
