export type TierId = "silver" | "gold" | "platinum"

export interface PricingTier {
  id: TierId
  name: string
  description: string
  annualPrice: number
  features: string[]
  gstIncluded: boolean
  advisorySessions: number
  auditSupport: "guidance" | "document" | "dedicated"
  loanSupport: "basic" | "financial" | "full"
  priority: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "silver",
    name: "Silver",
    description: "For salaried individuals",
    annualPrice: 1999,
    features: [
      "ITR Filing Included",
      "Annual Tax Summary",
      "1 Advisory Session/year",
      "Basic Loan Documentation",
      "Encrypted Document Vault",
      "Email Support",
    ],
    gstIncluded: false,
    advisorySessions: 1,
    auditSupport: "guidance",
    loanSupport: "basic",
    priority: false,
  },
  {
    id: "gold",
    name: "Gold",
    description: "For freelancers & MSMEs",
    annualPrice: 7999,
    features: [
      "Everything in Silver",
      "GST Filing (up to 12/year)",
      "2 Advisory Sessions/year",
      "Financial Statement Preparation",
      "Document Submission for Audits",
      "Priority Email Support",
    ],
    gstIncluded: true,
    advisorySessions: 2,
    auditSupport: "document",
    loanSupport: "financial",
    priority: false,
  },
  {
    id: "platinum",
    name: "Platinum",
    description: "For business owners & HNIs",
    annualPrice: 24999,
    features: [
      "Everything in Gold",
      "Unlimited GST Filing",
      "Unlimited Advisory Sessions",
      "Dedicated Audit Representation",
      "Full Loan & Credit Advisory",
      "3-5 Year Tax Projection",
      "Priority Document Storage",
      "Life-Time Audit Shield (5-yr plan)",
    ],
    gstIncluded: true,
    advisorySessions: -1,
    auditSupport: "dedicated",
    loanSupport: "full",
    priority: true,
  },
]

export function getCommitmentDiscount(years: number): number {
  if (years >= 5) return 0.25
  if (years >= 3) return 0.15
  return 0
}

export function calculatePrice(tierId: TierId, years: number): { total: number; perYear: number; discount: number } {
  const tier = PRICING_TIERS.find((t) => t.id === tierId)
  if (!tier) throw new Error("Invalid tier")
  const discount = getCommitmentDiscount(years)
  const total = tier.annualPrice * years * (1 - discount)
  return {
    total: Math.round(total),
    perYear: Math.round(total / years),
    discount,
  }
}
