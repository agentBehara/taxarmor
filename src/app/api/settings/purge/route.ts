import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      pan: null,
      aadhaarMasked: null,
      phone: null,
    },
  })

  await prisma.document.updateMany({
    where: { userId: session.user.id },
    data: { deletedAt: new Date() },
  })

  await createAuditLog({
    userId: session.user.id,
    action: "DATA_PURGE_REQUEST",
    details: "User requested data deletion per Right to be Forgotten",
  })

  return NextResponse.json({ success: true })
}
