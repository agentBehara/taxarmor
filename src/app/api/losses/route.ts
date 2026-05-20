import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { LOSS_RULES, calculateSetOff } from "@/lib/loss-rules"
import { z } from "zod"

const lossSchema = z.object({
  type: z.enum(["STCL", "LTCL", "BUSINESS_NON_SPECULATIVE", "BUSINESS_SPECULATIVE", "HOUSE_PROPERTY"]),
  amount: z.number().positive(),
  financialYear: z.string().regex(/^\d{4}-\d{2}$/),
  description: z.string().optional(),
  assetType: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  saleDate: z.string().datetime().optional(),
  purchasePrice: z.number().optional(),
  salePrice: z.number().optional(),
  carriedForwardFrom: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = lossSchema.parse(body)

    const rule = LOSS_RULES[validated.type]
    const carryForwardYears = validated.carriedForwardFrom ? rule.carryForwardYears - 1 : rule.carryForwardYears

    const record = await prisma.lossRecord.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        amount: validated.amount,
        financialYear: validated.financialYear,
        description: validated.description,
        assetType: validated.assetType,
        purchaseDate: validated.purchaseDate ? new Date(validated.purchaseDate) : undefined,
        saleDate: validated.saleDate ? new Date(validated.saleDate) : undefined,
        purchasePrice: validated.purchasePrice,
        salePrice: validated.salePrice,
        carriedForwardFrom: validated.carriedForwardFrom,
        carryForwardYear: validated.carriedForwardFrom ? 1 : 0,
        remainingCarryYears: carryForwardYears,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "FILING_CREATE",
      entity: "LossRecord",
      entityId: record.id,
      details: `Added ${validated.type} loss: Rs.${validated.amount}`,
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to add loss record" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const financialYear = searchParams.get("financialYear")
  const type = searchParams.get("type")

  const where: any = { userId: session.user.id }
  if (financialYear) where.financialYear = financialYear
  if (type) where.type = type

  const records = await prisma.lossRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  const summary = await prisma.lossRecord.groupBy({
    by: ["type"],
    where,
    _sum: { amount: true, adjustedAmount: true },
    _count: true,
  })

  const totalLoss = await prisma.lossRecord.aggregate({
    where,
    _sum: { amount: true },
  })

  const totalAdjusted = await prisma.lossRecord.aggregate({
    where,
    _sum: { adjustedAmount: true },
  })

  const totalUnadjusted = (totalLoss._sum.amount || 0) - (totalAdjusted._sum.adjustedAmount || 0)

  return NextResponse.json({
    records,
    summary,
    totalLoss: totalLoss._sum.amount || 0,
    totalAdjusted: totalAdjusted._sum.adjustedAmount || 0,
    totalUnadjusted,
  })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id, adjustedAmount, status } = body

  if (!id) {
    return NextResponse.json({ error: "Loss record ID required" }, { status: 400 })
  }

  const record = await prisma.lossRecord.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!record) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  }

  const updated = await prisma.lossRecord.update({
    where: { id },
    data: {
      adjustedAmount: adjustedAmount !== undefined ? adjustedAmount : record.adjustedAmount,
      status: status || record.status,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Record ID required" }, { status: 400 })
  }

  await prisma.lossRecord.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
