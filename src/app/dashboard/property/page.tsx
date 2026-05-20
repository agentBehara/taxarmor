"use client"

import { useState } from "react"
import { Building2, Calculator, Home, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function PropertyPage() {
  const [propertyValue, setPropertyValue] = useState("")
  const [purchaseValue, setPurchaseValue] = useState("")
  const [purchaseYear, setPurchaseYear] = useState("")
  const [saleYear, setSaleYear] = useState("")
  const [houseTaxResult, setHouseTaxResult] = useState<number | null>(null)
  const [capitalGainsResult, setCapitalGainsResult] = useState<number | null>(null)

  const [propertyType, setPropertyType] = useState<"RENTAL" | "SELF_OCCUPIED" | "BUSINESS">("RENTAL")
  const [annualRent, setAnnualRent] = useState("")
  const [propertyTaxPaid, setPropertyTaxPaid] = useState("")
  const [homeLoanInterest, setHomeLoanInterest] = useState("")
  const [municipalTaxes, setMunicipalTaxes] = useState("")
  const [rentalCalc, setRentalCalc] = useState<any>(null)

  function calculateHouseTax() {
    const value = parseFloat(propertyValue)
    if (!value) return
    const annualValue = value * 0.06
    const standardDeduction = annualValue * 0.3
    const taxableValue = annualValue - standardDeduction
    const taxRate = 0.1
    setHouseTaxResult(Math.round(taxableValue * taxRate))
  }

  function calculateCapitalGains() {
    const saleVal = parseFloat(propertyValue)
    const purchaseVal = parseFloat(purchaseValue)
    if (!saleVal || !purchaseVal) return
    const gains = saleVal - purchaseVal
    const years = parseInt(saleYear) - parseInt(purchaseYear)
    const taxRate = years >= 3 ? 0.2 : 0.3
    setCapitalGainsResult(Math.round(gains * taxRate))
  }

  function calculateRentalIncome() {
    const rent = parseFloat(annualRent) || 0
    const propTax = parseFloat(propertyTaxPaid) || 0
    const municipal = parseFloat(municipalTaxes) || 0
    const loanInterest = parseFloat(homeLoanInterest) || 0

    const totalMunicipal = propTax + municipal
    const netAnnualValue = Math.max(0, rent - totalMunicipal)
    const standardDeduction = netAnnualValue * 0.3
    const incomeBeforeInterest = netAnnualValue - standardDeduction
    const taxableIncome = incomeBeforeInterest - loanInterest

    let propertyTaxDeductible = false
    let propertyTaxReason = ""

    if (propertyType === "RENTAL") {
      propertyTaxDeductible = true
      propertyTaxReason = "Property tax is deductible from Gross Annual Value (GAV) to arrive at Net Annual Value (NAV). Must be paid by owner during FY."
    } else if (propertyType === "BUSINESS") {
      propertyTaxDeductible = true
      propertyTaxReason = "Property tax is deductible as a business expense (P&L) if used wholly and exclusively for business. Keep receipt as proof."
    } else {
      propertyTaxDeductible = false
      propertyTaxReason = "Self-occupied property has Nil Annual Value. No income to report, so no deductions allowed against it."
    }

    const housePropertyLoss = taxableIncome < 0 ? Math.abs(taxableIncome) : 0
    const oldRegimeSetOffCap = 200000
    const setOffAmount = Math.min(housePropertyLoss, oldRegimeSetOffCap)
    const carryForwardAmount = housePropertyLoss - setOffAmount

    setRentalCalc({
      grossAnnualValue: rent,
      municipalTaxes: totalMunicipal,
      netAnnualValue,
      standardDeduction,
      incomeBeforeInterest,
      homeLoanInterest: loanInterest,
      taxableIncome: Math.max(0, taxableIncome),
      housePropertyLoss,
      propertyTaxDeductible,
      propertyTaxReason,
      oldRegimeSetOff: setOffAmount,
      carryForward: carryForwardAmount,
    })
  }

  function formatAmount(amount: number) {
    return amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Property & Asset Management</h2>
        <p className="text-sm text-gray-500">House tax, rental income, property tax deductions, and capital gains</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Municipal House Tax</h3>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Value (Rs.)</label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="5000000"
              />
            </div>
            <button
              onClick={calculateHouseTax}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <Calculator className="mr-2 inline h-4 w-4" />
              Estimate Municipal Tax
            </button>
            {houseTaxResult !== null && (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-700">Estimated Annual Municipal Tax</p>
                <p className="text-2xl font-bold text-green-900">{formatAmount(houseTaxResult)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Capital Gains Estimator</h3>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sale Value (Rs.)</label>
                <input
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="8000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Value (Rs.)</label>
                <input
                  type="number"
                  value={purchaseValue}
                  onChange={(e) => setPurchaseValue(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="3000000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Year</label>
                <input
                  type="number"
                  value={purchaseYear}
                  onChange={(e) => setPurchaseYear(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sale Year</label>
                <input
                  type="number"
                  value={saleYear}
                  onChange={(e) => setSaleYear(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="2025"
                />
              </div>
            </div>
            <button
              onClick={calculateCapitalGains}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
            >
              <Calculator className="mr-2 inline h-4 w-4" />
              Estimate Gains Tax
            </button>
            {capitalGainsResult !== null && (
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-purple-700">Estimated Capital Gains Tax</p>
                <p className="text-2xl font-bold text-purple-900">{formatAmount(capitalGainsResult)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Rental Income & Property Tax Deduction</h3>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[
                { value: "RENTAL", label: "Rental / Let-out", icon: Home },
                { value: "SELF_OCCUPIED", label: "Self-Occupied", icon: Home },
                { value: "BUSINESS", label: "Business / Office", icon: Building2 },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPropertyType(type.value as any)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    propertyType === type.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {propertyType !== "SELF_OCCUPIED" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Rent Received (Rs.)</label>
                <input
                  type="number"
                  value={annualRent}
                  onChange={(e) => setAnnualRent(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="240000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Tax Paid (Rs.)</label>
                <input
                  type="number"
                  value={propertyTaxPaid}
                  onChange={(e) => setPropertyTaxPaid(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Municipal Taxes (Rs.)</label>
                <input
                  type="number"
                  value={municipalTaxes}
                  onChange={(e) => setMunicipalTaxes(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Home Loan Interest (Rs.)</label>
                <input
                  type="number"
                  value={homeLoanInterest}
                  onChange={(e) => setHomeLoanInterest(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="300000"
                />
              </div>
            </div>
          )}

          <button
            onClick={calculateRentalIncome}
            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            <Calculator className="mr-2 inline h-4 w-4" />
            Calculate Rental Income Tax
          </button>
        </div>

        {rentalCalc && (
          <div className="mt-6 space-y-4">
            <div className={`rounded-lg p-4 ${rentalCalc.propertyTaxDeductible ? "bg-green-50" : "bg-red-50"}`}>
              <div className="flex items-start gap-2">
                {rentalCalc.propertyTaxDeductible ? (
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className={`font-medium ${rentalCalc.propertyTaxDeductible ? "text-green-900" : "text-red-900"}`}>
                    Property Tax Deduction: {rentalCalc.propertyTaxDeductible ? "Allowed" : "Not Allowed"}
                  </p>
                  <p className={`mt-1 text-sm ${rentalCalc.propertyTaxDeductible ? "text-green-700" : "text-red-700"}`}>
                    {rentalCalc.propertyTaxReason}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="font-medium text-gray-900">Calculation Breakdown</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gross Annual Value (Rent)</span>
                  <span className="font-medium text-gray-900">{formatAmount(rentalCalc.grossAnnualValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Less: Municipal Taxes Paid</span>
                  <span className="font-medium text-red-600">- {formatAmount(rentalCalc.municipalTaxes)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                  <span className="text-gray-700">Net Annual Value (NAV)</span>
                  <span className="text-gray-900">{formatAmount(rentalCalc.netAnnualValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Less: Standard Deduction (30% of NAV)</span>
                  <span className="font-medium text-red-600">- {formatAmount(rentalCalc.standardDeduction)}</span>
                </div>
                {rentalCalc.homeLoanInterest > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Less: Home Loan Interest (Sec 24b)</span>
                    <span className="font-medium text-red-600">- {formatAmount(rentalCalc.homeLoanInterest)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                  <span className="text-gray-900">
                    {rentalCalc.taxableIncome > 0 ? "Taxable Rental Income" : "House Property Loss"}
                  </span>
                  <span className={rentalCalc.taxableIncome > 0 ? "text-green-600" : "text-red-600"}>
                    {rentalCalc.taxableIncome > 0
                      ? formatAmount(rentalCalc.taxableIncome)
                      : `- ${formatAmount(rentalCalc.housePropertyLoss)}`}
                  </span>
                </div>
              </div>
            </div>

            {rentalCalc.housePropertyLoss > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">House Property Loss Set-Off</p>
                    <div className="mt-2 space-y-1 text-sm text-amber-700">
                      <p>Set-off against other income (Old Regime): <strong>{formatAmount(rentalCalc.oldRegimeSetOff)}</strong> (capped at Rs. 2,00,000)</p>
                      <p>Carried forward to next 8 years: <strong>{formatAmount(rentalCalc.calc?.carryForward ?? rentalCalc.housePropertyLoss - rentalCalc.oldRegimeSetOff)}</strong></p>
                      <p className="mt-2 text-xs">Carried-forward losses can only be set off against &quot;Income from House Property&quot; in future years.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Property Tax Deduction Summary</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Property Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Property Tax Deductible?</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">How It Is Claimed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">Rental / Let-out</td>
                <td className="px-4 py-3"><span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Yes</span></td>
                <td className="px-4 py-3 text-gray-500">Deduct from Rental Income (GAV) to arrive at NAV</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">Self-Occupied</td>
                <td className="px-4 py-3"><span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">No</span></td>
                <td className="px-4 py-3 text-gray-500">Annual Value is Nil. No income to report, no deductions allowed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">Business / Office</td>
                <td className="px-4 py-3"><span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Yes</span></td>
                <td className="px-4 py-3 text-gray-500">Deduct as Business Expense (P&L) - must be for business purpose</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <h4 className="font-medium text-amber-900">Need detailed property tax filing?</h4>
            <p className="mt-1 text-sm text-amber-700">
              Our Gold and Platinum plans include property tax calculation and filing assistance.
              Schedule an advisory call to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
