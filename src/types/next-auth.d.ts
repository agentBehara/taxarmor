import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    mfaEnabled: boolean
    mfaRequired?: boolean
    subscriptionTier?: string
    subscriptionStatus?: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      mfaEnabled: boolean
      subscriptionTier?: string
      subscriptionStatus?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    mfaEnabled: boolean
    subscriptionTier?: string
    subscriptionStatus?: string
  }
}
