"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Loader2, CheckCircle, AlertCircle, TrendingUp, Building2, PiggyBank, Home, FileText } from "lucide-react"

const incomeTypes = [
  {
    value: "STOCKS_CAPITAL_GAINS",
    label: "Stocks - Capital Gains",
    icon: TrendingUp,
    description: "Short-term or long-term gains from stock sales",
    taxHint: "STCG: 20% | LTCG (>1yr): 12.5% above Rs.1.25L",
  },
  {
    value: "STOCKS_DIVIDENDS",
    label: "Stocks - Dividends",
    icon: TrendingUp,
    description: "Dividend income from stocks and mutual funds",
    taxHint: "Taxed at slab rate. TDS if > Rs.5,000",
  },
  {
    value: "FIXED_DEPOSIT",
    label: "Fixed Deposit Interest",
    icon: PiggyBank,
    description: "Interest earned from bank/post office FDs",
    taxHint: "Taxed at slab rate. TDS if > Rs.40,000 (Rs.50,000 for seniors)",
  },
  {
    value: "RENTAL_INCOME",
    label: "Rental Income",
    icon: Home,
    description: "Income from house/property rental",
    taxHint: "30% standard deduction + municipal taxes deductible",
  },
  {
    value: "MUTUAL_FUNDS",
    label: "Mutual Funds",
    icon: TrendingUp,
    description: "Capital gains from mutual fund redemptions",
    taxHint: "Equity: STCG 20%, LTCG 12.5% | Debt: slab rate",
  },
  {
    value: "BONDS_DEBENTURES",
    label: "Bonds & Debentures",
    icon: PiggyBank,
    description: "Interest income from bonds, debentures, NCDs",
    taxHint: "Taxed at slab rate. TDS applicable",
  },
  {
    value: "SAVINGS_INTEREST",
    label: "Savings Account Interest",
    icon: PiggyBank,
    description: "Interest from savings bank accounts",
    taxHint: "Exempt up to Rs.10,000 under 80TTA (Rs.50,000 for seniors 80TTB)",
  },
  {
    value: "OTHER_INVESTMENT",
    label: "Other Investment Income",
    icon: FileText,
    description: "Any other investment income not listed above",
    taxHint: "Tax treatment varies by instrument",
  },
]

const financialYears = ["2025-26", "2024-25", "2023-24"]

export default function InvestmentsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalTDS, setTotalTDS] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedFY, setSelectedFY] = useState("2024-25")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "STOCKS_CAPITAL_GAINS",
    amount: "",
    description: "",
    taxDeducted: "",
    hasForm26AS: false,
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchRecords()
  }, [selectedFY])

  async function fetchRecords() {
    try {
      const res = await fetch(`/api/income?financialYear=${selectedFY}`)
      if (res.ok) {
        const data = await res.json()
        setRecords(data.records)
        setSummary(data.summary)
        setTotalIncome(data.totalIncome)
        setTotalTDS(data.totalTDS)
      }
    } catch {
      console.error("Failed to fetch income records")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          financialYear: selectedFY,
          description: formData.description,
          taxDeducted: parseFloat(formData.taxDeducted) || 0,
          hasForm26AS: formData.hasForm26AS,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: "error", text: typeof data.error === "string" ? data.error : "Failed to add record" })
        return
      }

      setMessage({ type: "success", text: "Income record added successfully" })
      setShowForm(false)
      setFormData({ type: "STOCKS_CAPITAL_GAINS", amount: "", description: "", taxDeducted: "", hasForm26AS: false })
      fetchRecords()
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/income?id=${id}`, { method: "DELETE" })
      if (res.ok) fetchRecords()
    } catch {
      console.error("Delete failed")
    }
  }

  function getTypeLabel(type: string) {
    return incomeTypes.find((t) => t.value === type)?.label || type
  }

  function getTypeIcon(type: string) {
    return incomeTypes.find((t) => t.value === type)?.icon || FileText
  }

  function formatAmount(amount: number) {
    return amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
  }

  const selectedType = incomeTypes.find((t) => t.value === formData.type)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Investments & Income</h2>
          <p className="text-sm text-gray-500">Track stocks, FDs, rental income, and other investment earnings</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {financialYears.map((fy) => (
              <option key={fy} value={fy}>
                FY {fy}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Income
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="mr-2 inline h-4 w-4" />
          ) : (
            <AlertCircle className="mr-2 inline h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Total Investment Income</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{formatAmount(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Total TDS Deducted</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{formatAmount(totalTDS)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Net Taxable Income</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatAmount(totalIncome - totalTDS)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Income Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {incomeTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="0"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">TDS Deducted (Rs.)</label>
              <input
                type="number"
                value={formData.taxDeducted}
                onChange={(e) => setFormData({ ...formData, taxDeducted: e.target.value })}
                min="0"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., HDFC Bank FD, Reliance shares sale"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="form26as"
                checked={formData.hasForm26AS}
                onChange={(e) => setFormData({ ...formData, hasForm26AS: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="form26as" className="text-sm text-gray-700">
                Reflected in Form 26AS
              </label>
            </div>
          </div>

          {selectedType && (
            <div className="space-y-2">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                {selectedType.description}
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                <strong>Tax Hint:</strong> {selectedType.taxHint}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add Income Record"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No income records yet. Add your investment income above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Income
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    TDS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    26AS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => {
                  const Icon = getTypeIcon(record.type)
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {getTypeLabel(record.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {record.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {formatAmount(record.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-green-600">
                        {record.taxDeducted > 0 ? formatAmount(record.taxDeducted) : "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {record.hasForm26AS ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            record.status === "FILED"
                              ? "bg-green-100 text-green-700"
                              : record.status === "REPORTED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {summary.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Income by Category</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((s) => {
              const Icon = getTypeIcon(s.type)
              return (
                <div key={s.type} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{getTypeLabel(s.type)}</p>
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-900">{formatAmount(s._sum.amount || 0)}</p>
                  <p className="text-xs text-gray-500">{s._count} entries</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-900">Upload Supporting Documents</h4>
            <p className="mt-1 text-sm text-blue-700">
              Upload Form 26AS, capital gains statements, FD interest certificates, and rent agreements at{" "}
              <strong>Dashboard &gt; Documents</strong>. Use tags like &quot;FY2024&quot; and &quot;Capital Gains&quot; to organize.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
