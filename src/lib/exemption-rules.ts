export const SALARIED_BLOCKED = [
  "CHILDCARE",
  "PERSONAL_TRAVEL",
  "FOOD_PERSONAL",
  "TAXI_PERSONAL",
  "MOBILE_PERSONAL",
]

export const BUSINESS_DEDUCTIBLE = [
  {
    category: "TRAVEL_BUSINESS",
    label: "Travel - Business",
    description: "Must be for business meetings/sites. Include date/purpose.",
    requiresReceipt: true,
    requiresPurpose: true,
  },
  {
    category: "CONVEYANCE",
    label: "Conveyance",
    description: "Must exclude commute from home to office.",
    requiresReceipt: true,
    requiresPurpose: true,
  },
  {
    category: "BUSINESS_STAY",
    label: "Business Stay",
    description: "Only when traveling for business outside city of residence.",
    requiresReceipt: true,
    requiresPurpose: true,
  },
  {
    category: "CLIENT_MEETINGS",
    label: "Client Meetings",
    description: "Coffee/Lunch with clients. Limit: Reasonable amounts only.",
    requiresReceipt: true,
    requiresPurpose: true,
    maxReasonableAmount: 5000,
  },
  {
    category: "TELECOM",
    label: "Telecom",
    description: "Allow slider to select % of Business Usage.",
    requiresReceipt: false,
    requiresPurpose: false,
    hasBusinessPercent: true,
  },
  {
    category: "RENTAL_EXPENSE",
    label: "Rental Expense",
    description: "Requires Rent Agreement/Receipt upload.",
    requiresReceipt: true,
    requiresPurpose: false,
  },
  {
    category: "OFFICE_SUPPLIES",
    label: "Stationery/Hardware",
    description: "Items used exclusively for business operations.",
    requiresReceipt: true,
    requiresPurpose: false,
  },
  {
    category: "PROPERTY_TAX_BUSINESS",
    label: "Property Tax (Business)",
    description: "Property tax on commercial/office property. Must be paid by owner and used wholly/exclusively for business. Keep receipt as proof.",
    requiresReceipt: true,
    requiresPurpose: false,
  },
]

export const SALARIED_ALLOWED = [
  {
    category: "80C",
    label: "Section 80C",
    description: "PPF, ELSS, LIC, NSC, Tuition Fees, etc.",
    maxAmount: 150000,
  },
  {
    category: "80D",
    label: "Section 80D",
    description: "Health Insurance Premium",
    maxAmount: 25000,
  },
  {
    category: "80TTA",
    label: "Section 80TTA",
    description: "Savings Account Interest",
    maxAmount: 10000,
  },
  {
    category: "HRA",
    label: "HRA Exemption",
    description: "House Rent Allowance",
    requiresReceipt: true,
  },
  {
    category: "LTA",
    label: "LTA",
    description: "Leave Travel Allowance",
    requiresReceipt: true,
  },
  {
    category: "NPS_80CCD",
    label: "NPS (80CCD)",
    description: "National Pension System",
    maxAmount: 50000,
  },
]
