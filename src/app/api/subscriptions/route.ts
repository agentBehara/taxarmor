import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { calculatePrice, PRICING_TIERS, type TierId } from "@/lib/pricing"
import { createAuditLog } from "@/lib/audit"
import { razorpay, verifyPaymentSignature } from "@/lib/razorpay"
import { z } from "zod"

const createOrderSchema = z.object({
  tierId: z.enum(["silver", "gold", "platinum"]),
  commitmentYears: z.number().min(1).max(5),
})

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  subscriptionId: z.string(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { action } = body

  if (action === "create-order") {
    return handleCreateOrder(session.user.id, body)
  }

  if (action === "verify-payment") {
    return handleVerifyPayment(session.user.id, body)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

async function handleCreateOrder(userId: string, body: any) {
  try {
    const validated = createOrderSchema.parse(body)

    const existing = await prisma.subscription.findUnique({
      where: { userId },
    })
    if (existing && existing.status === "ACTIVE") {
      return NextResponse.json({ error: "Already have an active subscription" }, { status: 400 })
    }

    const pricing = calculatePrice(validated.tierId, validated.commitmentYears)
    const tier = PRICING_TIERS.find((t) => t.id === validated.tierId)!

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        tier: tier.name.toUpperCase() as any,
        status: "PENDING",
        startDate: new Date(),
        endDate: new Date(Date.now() + validated.commitmentYears * 365 * 24 * 60 * 60 * 1000),
        amount: pricing.total,
        commitmentYears: validated.commitmentYears,
      },
    })

    const order = await razorpay.subscriptions.create({
      plan_id: getPlanId(validated.tierId),
      customer_notify: 1,
      quantity: 1,
      total_count: validated.commitmentYears,
      notes: {
        userId,
        subscriptionId: subscription.id,
        tier: validated.tierId,
        commitmentYears: validated.commitmentYears.toString(),
      },
    })

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { razorpaySubId: order.id },
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      razorpayOrderId: order.id,
      amount: pricing.total,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Razorpay order creation failed:", error)
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 })
  }
}

async function handleVerifyPayment(userId: string, body: any) {
  try {
    const validated = verifyPaymentSchema.parse(body)

    const valid = verifyPaymentSignature(
      validated.razorpayOrderId,
      validated.razorpayPaymentId,
      validated.razorpaySignature
    )

    if (!valid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: validated.subscriptionId,
        userId,
        razorpaySubId: validated.razorpayOrderId,
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        startDate: new Date(),
      },
    })

    await createAuditLog({
      userId,
      action: "SUBSCRIPTION_CREATE",
      entity: "Subscription",
      entityId: updated.id,
      details: `Payment verified. ${updated.tier} plan activated.`,
    })

    return NextResponse.json({
      success: true,
      subscription: updated,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Payment verification failed:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(subscription)
}

function getPlanId(tierId: TierId): string {
  const planIds: Record<TierId, string> = {
    silver: process.env.RAZORPAY_PLAN_SILVER || "plan_silver_placeholder",
    gold: process.env.RAZORPAY_PLAN_GOLD || "plan_gold_placeholder",
    platinum: process.env.RAZORPAY_PLAN_PLATINUM || "plan_platinum_placeholder",
  }
  return planIds[tierId]
}
