import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import * as speakeasy from "speakeasy"

async function getPrisma() {
  const { prisma } = await import("@/lib/db")
  return prisma
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" },
      },
      authorize: async (credentials) => {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
            mfaCode: z.string().optional(),
          })
          .safeParse(credentials)

        if (!parsed.success) return null

        const { email, password, mfaCode } = parsed.data

        const prisma = await getPrisma()

        const user = await prisma.user.findUnique({
          where: { email },
          include: { subscription: true },
        })

        if (!user) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        if (user.mfaEnabled && !mfaCode) {
          return { id: user.id, email: user.email, name: user.name, mfaRequired: true, role: user.role } as any
        }

        if (user.mfaEnabled && mfaCode) {
          const verified = speakeasy.totp.verify({
            secret: user.mfaSecret!,
            encoding: "base32",
            token: mfaCode,
            window: 1,
          })
          if (!verified) return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mfaEnabled: user.mfaEnabled,
          subscriptionTier: user.subscription?.tier,
          subscriptionStatus: user.subscription?.status,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.mfaEnabled = user.mfaEnabled
        token.subscriptionTier = user.subscriptionTier
        token.subscriptionStatus = user.subscriptionStatus
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.mfaEnabled = token.mfaEnabled as boolean
      session.user.subscriptionTier = token.subscriptionTier as string
      session.user.subscriptionStatus = token.subscriptionStatus as string
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
})
