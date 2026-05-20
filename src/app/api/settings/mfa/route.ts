import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import * as speakeasy from "speakeasy"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  if (body.action === "generate") {
    const secret = speakeasy.generateSecret({
      name: `TaxArmor (${session.user.email})`,
      length: 20,
    })

    return NextResponse.json({
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    })
  }

  if (body.action === "verify") {
    const verified = speakeasy.totp.verify({
      secret: body.secret,
      encoding: "base32",
      token: body.token,
      window: 1,
    })

    if (!verified) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        mfaEnabled: true,
        mfaSecret: body.secret,
      },
    })

    return NextResponse.json({ success: true })
  }

  if (body.action === "disable") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
      },
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
