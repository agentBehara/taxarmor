import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { SALARIED_BLOCKED, BUSINESS_DEDUCTIBLE } from "@/lib/exemption-rules"
import { z } from "zod"

const exemptionSchema = z.object({
  category: z.string(),
  amount: z.number().positive(),
  date: z.string().datetime(),
  description: z.string().optional(),
  purpose: z.string().optional(),
  businessUsePercent: z.number().min(0).max(100).optional(),
  financialYear: z.string().regex(/^\d{4}-\d{2}$/),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = exemptionSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let flagged = false
    let flagReason = ""

    if (user.userType === "SALARIED") {
      if (SALARIED_BLOCKED.includes(validated.category)) {
        flagged = true
        flagReason = `Category "${validated.category}" is not deductible for salaried individuals`
      }
    }

    if (user.userType === "BUSINESS") {
      const businessRule = BUSINESS_DEDUCTIBLE.find((r) => r.category === validated.category)
      if (!businessRule) {
        flagged = true
        flagReason = `Category "${validated.category}" is not a recognized business expense`
      } else if (businessRule.maxReasonableAmount && validated.amount > businessRule.maxReasonableAmount) {
        flagged = true
        flagReason = `Amount exceeds reasonable limit of Rs.${businessRule.maxReasonableAmount.toLocaleString("en-IN")} for ${businessRule.label}`
      } else if (businessRule.requiresPurpose && !validated.purpose) {
        flagged = true
        flagReason = `Purpose is required for ${businessRule.label}`
      }
    }

    const exemption = await prisma.taxExemption.create({
      data: {
        userId: session.user.id,
        category: validated.category as any,
        amount: validated.amount,
        date: new Date(validated.date),
        description: validated.description,
        purpose: validated.purpose,
        businessUsePercent: validated.businessUsePercent ?? (user.userType === "BUSINESS" ? 100 : null),
        financialYear: validated.financialYear,
        flagged,
        flagReason: flagReason || undefined,
        status: flagged ? "FLAGGED" : "PENDING",
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "FILING_CREATE",
      entity: "TaxExemption",
      entityId: exemption.id,
      details: `Added ${validated.category} expense: Rs.${validated.amount}`,
    })

    return NextResponse.json(exemption, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to add exemption" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const financialYear = searchParams.get("financialYear")
  const category = searchParams.get("category")
  const status = searchParams.get("status")

  const where: any = { userId: session.user.id }
  if (financialYear) where.financialYear = financialYear
  if (category) where.category = category
  if (status) where.status = status

  const exemptions = await prisma.taxExemption.findMany({
    where,
    orderBy: { date: "desc" },
  })

  const summary = await prisma.taxExemption.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    _count: true,
  })

  const totalDeductions = await prisma.taxExemption.aggregate({
    where: { ...where, flagged: false },
    _sum: { amount: true },
  })

  return NextResponse.json({
    exemptions,
    summary,
    totalDeductions: totalDeductions._sum.amount || 0,
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
    return NextResponse.json({ error: "Exemption ID required" }, { status: 400 })
  }

  await prisma.taxExemption.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
