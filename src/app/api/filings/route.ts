import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { z } from "zod"

const filingSchema = z.object({
  type: z.string().min(1),
  financialYear: z.string().regex(/^\d{4}-\d{2}$/),
  data: z.record(z.string(), z.any()),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = filingSchema.parse(body)

    const filing = await prisma.filing.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        financialYear: validated.financialYear,
        data: JSON.stringify(validated.data),
        notes: validated.notes,
        status: "DRAFT",
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "FILING_CREATE",
      entity: "Filing",
      entityId: filing.id,
      details: `Created ${validated.type} for ${validated.financialYear}`,
    })

    return NextResponse.json(filing, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Filing creation failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const filings = await prisma.filing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(filings)
}
