import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const advisorySchema = z.object({
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(120).optional(),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = advisorySchema.parse(body)

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription || subscription.status !== "ACTIVE") {
      return NextResponse.json({ error: "Active subscription required" }, { status: 403 })
    }

    const completedCalls = await prisma.advisoryCall.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        scheduledAt: { gte: subscription.startDate },
      },
    })

    if (subscription.tier !== "PLATINUM" && subscription.tier !== "GOLD") {
      if (completedCalls >= 1) {
        return NextResponse.json({ error: "Advisory session limit reached for Silver tier" }, { status: 403 })
      }
    } else if (subscription.tier === "GOLD" && completedCalls >= 2) {
      return NextResponse.json({ error: "Advisory session limit reached for Gold tier" }, { status: 403 })
    }

    const call = await prisma.advisoryCall.create({
      data: {
        userId: session.user.id,
        scheduledAt: new Date(validated.scheduledAt),
        duration: validated.duration || 30,
        notes: validated.notes,
      },
    })

    return NextResponse.json(call, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Scheduling failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const calls = await prisma.advisoryCall.findMany({
    where: { userId: session.user.id },
    orderBy: { scheduledAt: "desc" },
  })

  return NextResponse.json(calls)
}
