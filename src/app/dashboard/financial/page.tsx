"use client"

import { useState } from "react"
import { TrendingUp, CreditCard, FileText, AlertCircle } from "lucide-react"

export default function FinancialHealthPage() {
  const [income, setIncome] = useState("")
  const [expenses, setExpenses] = useState("")
  const [loans, setLoans] = useState("")
  const [cibilScore, setCibilScore] = useState("")
  const [result, setResult] = useState<any>(null)

  function analyze() {
    const monthlyIncome = parseFloat(income) || 0
    const monthlyExpenses = parseFloat(expenses) || 0
    const monthlyLoan = parseFloat(loans) || 0
    const score = parseInt(cibilScore) || 0

    const savings = monthlyIncome - monthlyExpenses - monthlyLoan
    const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0
    const dti = monthlyIncome > 0 ? (monthlyLoan / monthlyIncome) * 100 : 0

    let cibilStatus = "Unknown"
    let cibilAdvice = ""
    if (score >= 750) {
      cibilStatus = "Excellent"
      cibilAdvice = "You qualify for the best loan rates. Consider negotiating for lower interest."
    } else if (score >= 700) {
      cibilStatus = "Good"
      cibilAdvice = "Pay bills on time and reduce credit utilization to reach 750+."
    } else if (score >= 650) {
      cibilStatus = "Fair"
      cibilAdvice = "Focus on clearing outstanding dues and maintaining timely payments."
    } else if (score > 0) {
      cibilStatus = "Needs Improvement"
      cibilAdvice = "Consider our loan documentation support to improve your credit profile."
    }

    setResult({
      monthlySavings: savings,
      savingsRate: savingsRate.toFixed(1),
      dti: dti.toFixed(1),
      cibilStatus,
      cibilAdvice,
      annualIncome: monthlyIncome * 12,
      recommendedInvestment: Math.round(savings * 0.3 * 12),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Financial Health</h2>
        <p className="text-sm text-gray-500">Loan documentation, CIBIL analysis, and financial planning</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Financial Analysis</h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Income (Rs.)</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Expenses (Rs.)</label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Loan EMI (Rs.)</label>
            <input
              type="number"
              value={loans}
              onChange={(e) => setLoans(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="20000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CIBIL Score</label>
            <input
              type="number"
              value={cibilScore}
              onChange={(e) => setCibilScore(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="750"
              max={900}
            />
          </div>
        </div>
        <button
          onClick={analyze}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Analyze Financial Health
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Annual Income</span>
                <span className="font-semibold text-gray-900">
                  Rs. {result.annualIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Monthly Savings</span>
                <span className="font-semibold text-green-600">
                  Rs. {result.monthlySavings.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Savings Rate</span>
                <span
                  className={`font-semibold ${
                    parseFloat(result.savingsRate) >= 20 ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {result.savingsRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Debt-to-Income Ratio</span>
                <span
                  className={`font-semibold ${
                    parseFloat(result.dti) <= 40 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.dti}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Recommended Annual Investment</span>
                <span className="font-semibold text-blue-600">
                  Rs. {result.recommendedInvestment.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">CIBIL Analysis</h3>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    result.cibilStatus === "Excellent"
                      ? "bg-green-100 text-green-700"
                      : result.cibilStatus === "Good"
                      ? "bg-blue-100 text-blue-700"
                      : result.cibilStatus === "Fair"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.cibilStatus}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{result.cibilAdvice}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-gray-900">Loan Documentation Support</h4>
            <p className="mt-1 text-sm text-gray-500">
              Need income statements, financial summaries, or CIBIL improvement guidance for a loan application?
              Our Gold and Platinum plans include comprehensive loan documentation support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
