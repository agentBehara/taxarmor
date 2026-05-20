import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const existingPan = await prisma.user.findUnique({
      where: { pan: validated.pan },
    })
    if (existingPan) {
      return NextResponse.json({ error: "PAN already registered" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12)

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash: hashedPassword,
        phone: validated.phone,
        pan: validated.pan,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
