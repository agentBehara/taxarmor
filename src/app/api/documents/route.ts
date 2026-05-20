import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { encrypt, decrypt } from "@/lib/encryption"
import { createAuditLog } from "@/lib/audit"
import { z } from "zod"

const uploadSchema = z.object({
  type: z.enum(["PAN", "AADHAAR", "ITR", "GST", "BANK_STATEMENT", "INCOME_STATEMENT", "PROPERTY_DOC", "LOAN_DOC", "OTHER"]),
  fileName: z.string().min(1),
  content: z.string().min(1),
  tags: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = uploadSchema.parse(body)

    const { encrypted, iv, authTag } = encrypt(validated.content)

    const doc = await prisma.document.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        fileName: validated.fileName,
        encryptedData: encrypted,
        iv,
        authTag,
        fileSize: Buffer.byteLength(validated.content),
        uploadedBy: session.user.id,
        tags: validated.tags,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "DOCUMENT_UPLOAD",
      entity: "Document",
      entityId: doc.id,
      details: `Uploaded ${validated.type}: ${validated.fileName}`,
    })

    return NextResponse.json({ id: doc.id, fileName: doc.fileName, type: doc.type }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")

  const where: any = { userId: session.user.id, deletedAt: null }
  if (type) where.type = type

  const docs = await prisma.document.findMany({
    where,
    select: {
      id: true,
      type: true,
      fileName: true,
      fileSize: true,
      uploadedAt: true,
      tags: true,
    },
    orderBy: { uploadedAt: "desc" },
  })

  return NextResponse.json(docs)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const docId = searchParams.get("id")

  if (!docId) {
    return NextResponse.json({ error: "Document ID required" }, { status: 400 })
  }

  const doc = await prisma.document.findFirst({
    where: { id: docId, userId: session.user.id },
  })

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  await prisma.document.update({
    where: { id: docId },
    data: { deletedAt: new Date() },
  })

  await createAuditLog({
    userId: session.user.id,
    action: "DOCUMENT_DELETE",
    entity: "Document",
    entityId: docId,
    details: `Soft deleted: ${doc.fileName}`,
  })

  return NextResponse.json({ success: true })
}
