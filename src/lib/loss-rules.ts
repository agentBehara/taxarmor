export const LOSS_RULES = {
  STCL: {
    label: "Short-Term Capital Loss",
    canSetOffAgainst: ["STCG", "LTCG"],
    carryForwardYears: 8,
    carryForwardAgainst: ["STCG", "LTCG"],
    description: "Loss from sale of assets held for less than the specified holding period",
    canSetOffAgainstSalary: false,
    canSetOffAgainstBusiness: false,
  },
  LTCL: {
    label: "Long-Term Capital Loss",
    canSetOffAgainst: ["LTCG"],
    carryForwardYears: 8,
    carryForwardAgainst: ["LTCG"],
    description: "Loss from sale of assets held for more than the specified holding period",
    canSetOffAgainstSalary: false,
    canSetOffAgainstBusiness: false,
  },
  BUSINESS_NON_SPECULATIVE: {
    label: "Non-Speculative Business Loss",
    canSetOffAgainst: ["BUSINESS_INCOME", "HOUSE_PROPERTY", "OTHER_SOURCES", "CAPITAL_GAINS"],
    carryForwardYears: 8,
    carryForwardAgainst: ["BUSINESS_INCOME"],
    description: "Loss from legitimate business operations (not speculative trading)",
    canSetOffAgainstSalary: false,
    canSetOffAgainstBusiness: true,
  },
  BUSINESS_SPECULATIVE: {
    label: "Speculative Business Loss",
    canSetOffAgainst: ["SPECULATIVE_INCOME"],
    carryForwardYears: 4,
    carryForwardAgainst: ["SPECULATIVE_INCOME"],
    description: "Loss from speculative trading (intraday, F&O without delivery)",
    canSetOffAgainstSalary: false,
    canSetOffAgainstBusiness: false,
  },
  HOUSE_PROPERTY: {
    label: "House Property Loss",
    canSetOffAgainst: ["SALARY", "BUSINESS_INCOME", "OTHER_SOURCES", "CAPITAL_GAINS"],
    carryForwardYears: 8,
    carryForwardAgainst: ["HOUSE_PROPERTY"],
    description: "Loss when home loan interest exceeds rental income",
    canSetOffAgainstSalary: true,
    canSetOffAgainstBusiness: true,
    oldRegimeCap: 200000,
    newRegimeCap: 0,
  },
}

export function calculateSetOff(
  lossType: string,
  lossAmount: number,
  availableIncome: Record<string, number>,
  taxRegime: "OLD" | "NEW" = "OLD"
): { adjusted: number; unadjusted: number; breakdown: Record<string, number> } {
  const rule = LOSS_RULES[lossType as keyof typeof LOSS_RULES]
  if (!rule) return { adjusted: 0, unadjusted: lossAmount, breakdown: {} }

  let remaining = lossAmount
  const breakdown: Record<string, number> = {}

  for (const incomeHead of rule.canSetOffAgainst) {
    const available = availableIncome[incomeHead] || 0
    if (available <= 0 || remaining <= 0) continue

    let adjustable = Math.min(remaining, available)

    if (lossType === "HOUSE_PROPERTY" && "oldRegimeCap" in rule) {
      const cap = taxRegime === "OLD" ? rule.oldRegimeCap : (rule as any).newRegimeCap
      if (cap > 0) {
        const alreadyAdjusted = Object.values(breakdown).reduce((a, b) => a + b, 0)
        const remainingCap = cap - alreadyAdjusted
        if (remainingCap <= 0) break
        adjustable = Math.min(adjustable, remainingCap)
      }
    }

    if (adjustable > 0) {
      breakdown[incomeHead] = adjustable
      remaining -= adjustable
    }
  }

  return {
    adjusted: lossAmount - remaining,
    unadjusted: remaining,
    breakdown,
  }
}

export function getCarryForwardEligibility(lossType: string, financialYear: string): { eligible: boolean; years: number; against: string[] } {
  const rule = LOSS_RULES[lossType as keyof typeof LOSS_RULES]
  if (!rule) return { eligible: false, years: 0, against: [] }

  const fy = parseInt(financialYear.split("-")[0])
  const currentYear = new Date().getFullYear()
  const assessmentYear = currentYear > 6 ? currentYear + 1 : currentYear

  return {
    eligible: true,
    years: rule.carryForwardYears,
    against: rule.carryForwardAgainst,
  }
}
