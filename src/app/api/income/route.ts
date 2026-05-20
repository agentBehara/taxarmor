import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { z } from "zod"

const incomeSchema = z.object({
  type: z.enum(["STOCKS_CAPITAL_GAINS", "STOCKS_DIVIDENDS", "FIXED_DEPOSIT", "RENTAL_INCOME", "MUTUAL_FUNDS", "BONDS_DEBENTURES", "SAVINGS_INTEREST", "OTHER_INVESTMENT"]),
  amount: z.number().positive(),
  financialYear: z.string().regex(/^\d{4}-\d{2}$/),
  description: z.string().optional(),
  taxDeducted: z.number().min(0).default(0),
  hasForm26AS: z.boolean().default(false),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = incomeSchema.parse(body)

    const record = await prisma.incomeRecord.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        amount: validated.amount,
        financialYear: validated.financialYear,
        description: validated.description,
        taxDeducted: validated.taxDeducted,
        hasForm26AS: validated.hasForm26AS,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "FILING_CREATE",
      entity: "IncomeRecord",
      entityId: record.id,
      details: `Added ${validated.type} income: Rs.${validated.amount}`,
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to add income record" }, { status: 500 })
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

  const records = await prisma.incomeRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  const summary = await prisma.incomeRecord.groupBy({
    by: ["type"],
    where,
    _sum: { amount: true },
    _count: true,
  })

  const totalIncome = await prisma.incomeRecord.aggregate({
    where,
    _sum: { amount: true },
  })

  const totalTDS = await prisma.incomeRecord.aggregate({
    where,
    _sum: { taxDeducted: true },
  })

  return NextResponse.json({
    records,
    summary,
    totalIncome: totalIncome._sum.amount || 0,
    totalTDS: totalTDS._sum.taxDeducted || 0,
  })
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

  await prisma.incomeRecord.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
