"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Loader2, CheckCircle, AlertCircle, AlertTriangle, FileText, ArrowRight, Calculator } from "lucide-react"
import { LOSS_RULES, calculateSetOff } from "@/lib/loss-rules"

const lossTypes = [
  {
    value: "STCL",
    label: "Short-Term Capital Loss",
    description: "Loss from assets held < holding period (stocks: <1yr, property: <2yr)",
    canSetOffAgainst: "STCG and LTCG",
    carryForward: "8 years",
    color: "amber",
  },
  {
    value: "LTCL",
    label: "Long-Term Capital Loss",
    description: "Loss from assets held > holding period (stocks: >1yr, property: >2yr)",
    canSetOffAgainst: "LTCG only",
    carryForward: "8 years",
    color: "red",
  },
  {
    value: "BUSINESS_NON_SPECULATIVE",
    label: "Non-Speculative Business Loss",
    description: "Loss from legitimate business operations (not speculative trading)",
    canSetOffAgainst: "Any income except Salary",
    carryForward: "8 years (against business income only)",
    color: "blue",
  },
  {
    value: "BUSINESS_SPECULATIVE",
    label: "Speculative Business Loss",
    description: "Loss from intraday trading, F&O without delivery",
    canSetOffAgainst: "Speculative income only",
    carryForward: "4 years",
    color: "purple",
  },
  {
    value: "HOUSE_PROPERTY",
    label: "House Property Loss",
    description: "When home loan interest exceeds rental income",
    canSetOffAgainst: "Any income (capped at Rs.2L in Old Regime)",
    carryForward: "8 years (against house property only)",
    color: "emerald",
  },
]

const financialYears = ["2025-26", "2024-25", "2023-24", "2022-23"]

export default function LossesPage() {
  const [records, setRecords] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [totalLoss, setTotalLoss] = useState(0)
  const [totalAdjusted, setTotalAdjusted] = useState(0)
  const [totalUnadjusted, setTotalUnadjusted] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedFY, setSelectedFY] = useState("2024-25")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "STCL",
    amount: "",
    description: "",
    assetType: "",
    purchaseDate: "",
    saleDate: "",
    purchasePrice: "",
    salePrice: "",
    carriedForwardFrom: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showSetOffCalc, setShowSetOffCalc] = useState(false)
  const [setOffIncome, setSetOffIncome] = useState({
    STCG: "",
    LTCG: "",
    SALARY: "",
    BUSINESS_INCOME: "",
    HOUSE_PROPERTY: "",
    OTHER_SOURCES: "",
    SPECULATIVE_INCOME: "",
    CAPITAL_GAINS: "",
  })
  const [setOffResult, setSetOffResult] = useState<any>(null)

  useEffect(() => {
    fetchRecords()
  }, [selectedFY])

  async function fetchRecords() {
    try {
      const res = await fetch(`/api/losses?financialYear=${selectedFY}`)
      if (res.ok) {
        const data = await res.json()
        setRecords(data.records)
        setSummary(data.summary)
        setTotalLoss(data.totalLoss)
        setTotalAdjusted(data.totalAdjusted)
        setTotalUnadjusted(data.totalUnadjusted)
      }
    } catch {
      console.error("Failed to fetch loss records")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/losses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          financialYear: selectedFY,
          description: formData.description,
          assetType: formData.assetType,
          purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : undefined,
          saleDate: formData.saleDate ? new Date(formData.saleDate).toISOString() : undefined,
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
          carriedForwardFrom: formData.carriedForwardFrom || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: "error", text: typeof data.error === "string" ? data.error : "Failed to add loss record" })
        return
      }

      setMessage({ type: "success", text: "Loss record added successfully" })
      setShowForm(false)
      setFormData({ type: "STCL", amount: "", description: "", assetType: "", purchaseDate: "", saleDate: "", purchasePrice: "", salePrice: "", carriedForwardFrom: "" })
      fetchRecords()
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/losses?id=${id}`, { method: "DELETE" })
      if (res.ok) fetchRecords()
    } catch {
      console.error("Delete failed")
    }
  }

  function calculateSetOffDemo() {
    const income: Record<string, number> = {}
    Object.entries(setOffIncome).forEach(([key, val]) => {
      income[key] = parseFloat(val) || 0
    })

    const selectedLoss = records.find((r) => r.type === formData.type)
    const lossAmount = selectedLoss?.amount || parseFloat(formData.amount) || 0

    if (lossAmount <= 0) {
      setMessage({ type: "error", text: "Enter a loss amount or select an existing loss record" })
      return
    }

    const result = calculateSetOff(formData.type, lossAmount, income)
    setSetOffResult(result)
    setShowSetOffCalc(true)
  }

  function getTypeLabel(type: string) {
    return lossTypes.find((t) => t.value === type)?.label || type
  }

  function formatAmount(amount: number) {
    return amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
  }

  const selectedType = lossTypes.find((t) => t.value === formData.type)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Losses & Set-Off</h2>
          <p className="text-sm text-gray-500">Track capital losses, business losses, and set-off calculations</p>
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
            Add Loss
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
          <p className="text-sm font-medium text-gray-500">Total Losses</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{formatAmount(totalLoss)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Adjusted / Set-Off</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{formatAmount(totalAdjusted)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Unadjusted / Carry Forward</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{formatAmount(totalUnadjusted)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loss Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {lossTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Loss Amount (Rs.)</label>
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
              <label className="block text-sm font-medium text-gray-700">Asset Type (optional)</label>
              <input
                type="text"
                value={formData.assetType}
                onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Reliance shares, House property"
              />
            </div>
          </div>

          {(formData.type === "STCL" || formData.type === "LTCL") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                <input
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Carried Forward From FY</label>
                <select
                  value={formData.carriedForwardFrom}
                  onChange={(e) => setFormData({ ...formData, carriedForwardFrom: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">New loss (current year)</option>
                  {financialYears.map((fy) => (
                    <option key={fy} value={fy}>
                      FY {fy}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Loss from sale of HDFC Bank shares"
            />
          </div>

          {selectedType && (
            <div className="space-y-2">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                {selectedType.description}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  <strong>Set-off against:</strong> {selectedType.canSetOffAgainst}
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                  <strong>Carry forward:</strong> {selectedType.carryForward}
                </div>
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
                "Add Loss Record"
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

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Set-Off Calculator</h3>
        <p className="mt-1 text-sm text-gray-500">Calculate how much of your loss can be set off against current income</p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(setOffIncome).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500">{key.replace(/_/g, " ")}</label>
              <input
                type="number"
                value={val}
                onChange={(e) => setSetOffIncome({ ...setOffIncome, [key]: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <button
          onClick={calculateSetOffDemo}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
        >
          <Calculator className="mr-2 inline h-4 w-4" />
          Calculate Set-Off
        </button>

        {setOffResult && showSetOffCalc && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="font-medium text-gray-900">Set-Off Result for {getTypeLabel(formData.type)}</h4>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Loss</span>
                <span className="font-medium text-red-600">{formatAmount(setOffResult.adjusted + setOffResult.unadjusted)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Adjusted / Set-Off</span>
                <span className="font-medium text-green-600">{formatAmount(setOffResult.adjusted)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unadjusted / Carry Forward</span>
                <span className="font-medium text-amber-600">{formatAmount(setOffResult.unadjusted)}</span>
              </div>
              {Object.entries(setOffResult.breakdown).length > 0 && (
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <p className="text-xs font-medium text-gray-500">Breakdown by income head:</p>
                  {Object.entries(setOffResult.breakdown).map(([head, amount]) => (
                    <div key={head} className="flex justify-between text-xs">
                      <span className="text-gray-500">{head.replace(/_/g, " ")}</span>
                      <span className="font-medium text-gray-900">{formatAmount(amount as number)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No loss records yet. Add your losses above.</p>
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
                    Asset
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Loss Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Adjusted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Carry Forward
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
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{getTypeLabel(record.type)}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {record.assetType || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-red-600">
                      {formatAmount(record.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-green-600">
                      {record.adjustedAmount > 0 ? formatAmount(record.adjustedAmount) : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-amber-600">
                      {record.remainingCarryYears} years
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === "FULLY_ADJUSTED"
                            ? "bg-green-100 text-green-700"
                            : record.status === "PARTIALLY_ADJUSTED"
                            ? "bg-blue-100 text-blue-700"
                            : record.status === "CARRIED_FORWARD"
                            ? "bg-amber-100 text-amber-700"
                            : record.status === "EXPIRED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {record.status.replace(/_/g, " ")}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Set-Off & Carry Forward Rules</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Loss Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Can Set-Off Against</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Carry Forward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lossTypes.map((t) => (
                <tr key={t.value}>
                  <td className="px-4 py-3 font-medium text-gray-900">{t.label}</td>
                  <td className="px-4 py-3 text-gray-500">{t.canSetOffAgainst}</td>
                  <td className="px-4 py-3 text-gray-500">{t.carryForward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          <AlertTriangle className="mr-2 inline h-4 w-4" />
          <strong>Important:</strong> Capital losses cannot be set off against Salary or Business income. They can only be set off against capital gains.
        </div>
      </div>
    </div>
  )
}
