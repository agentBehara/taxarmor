"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Loader2, CheckCircle, AlertCircle, AlertTriangle, FileText, Briefcase, User } from "lucide-react"
import { BUSINESS_DEDUCTIBLE, SALARIED_ALLOWED, SALARIED_BLOCKED } from "@/lib/exemption-rules"

const financialYears = ["2025-26", "2024-25", "2023-24"]

export default function ExemptionsPage() {
  const [exemptions, setExemptions] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [totalDeductions, setTotalDeductions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [userType, setUserType] = useState<"SALARIED" | "BUSINESS">("SALARIED")
  const [selectedFY, setSelectedFY] = useState("2024-25")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    purpose: "",
    businessUsePercent: 100,
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchExemptions()
  }, [selectedFY])

  async function fetchExemptions() {
    try {
      const res = await fetch(`/api/exemptions?financialYear=${selectedFY}`)
      if (res.ok) {
        const data = await res.json()
        setExemptions(data.exemptions)
        setSummary(data.summary)
        setTotalDeductions(data.totalDeductions)
        if (data.exemptions.length > 0 && data.exemptions[0].user) {
          setUserType(data.exemptions[0].user.userType)
        }
      }
    } catch {
      console.error("Failed to fetch exemptions")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/exemptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: new Date(formData.date).toISOString(),
          description: formData.description,
          purpose: formData.purpose,
          businessUsePercent: formData.businessUsePercent,
          financialYear: selectedFY,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: "error", text: typeof data.error === "string" ? data.error : "Failed to add exemption" })
        return
      }

      setMessage({ type: "success", text: "Expense added successfully" })
      setShowForm(false)
      setFormData({ category: "", amount: "", date: new Date().toISOString().split("T")[0], description: "", purpose: "", businessUsePercent: 100 })
      fetchExemptions()
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/exemptions?id=${id}`, { method: "DELETE" })
      if (res.ok) fetchExemptions()
    } catch {
      console.error("Delete failed")
    }
  }

  const availableCategories = userType === "BUSINESS" ? BUSINESS_DEDUCTIBLE : SALARIED_ALLOWED
  const blockedCategories = userType === "SALARIED" ? SALARIED_BLOCKED : []

  function getCategoryLabel(category: string) {
    const found = [...BUSINESS_DEDUCTIBLE, ...SALARIED_ALLOWED].find((c) => c.category === category)
    return found?.label || category
  }

  function formatAmount(amount: number) {
    return amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tax Exemptions & Deductions</h2>
          <p className="text-sm text-gray-500">
            {userType === "BUSINESS"
              ? "Track business expenses for tax deduction"
              : "Track eligible tax exemptions for salaried individuals"}
          </p>
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
            Add Expense
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
          <p className="text-sm font-medium text-gray-500">Total Deductions</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{formatAmount(totalDeductions)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Flagged Items</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {exemptions.filter((e) => e.flagged).length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">User Type</p>
          <div className="mt-2 flex items-center gap-2">
            {userType === "BUSINESS" ? (
              <Briefcase className="h-5 w-5 text-blue-600" />
            ) : (
              <User className="h-5 w-5 text-gray-600" />
            )}
            <span className="text-lg font-semibold text-gray-900">
              {userType === "BUSINESS" ? "Business / Freelancer" : "Salaried"}
            </span>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.label}
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
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {userType === "BUSINESS" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Purpose / Description</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Client meeting at..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Use % ({formData.businessUsePercent}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.businessUsePercent}
                  onChange={(e) => setFormData({ ...formData, businessUsePercent: parseInt(e.target.value) })}
                  className="mt-2 w-full"
                />
              </div>
            </div>
          )}

          {formData.category && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              {availableCategories.find((c) => c.category === formData.category)?.description}
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
                "Add Expense"
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

      {userType === "SALARIED" && blockedCategories.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <h4 className="font-medium text-amber-900">Non-deductible for Salaried Individuals</h4>
              <p className="mt-1 text-sm text-amber-700">
                The following categories are blocked: {blockedCategories.join(", ")}. These are flagged automatically if entered.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : exemptions.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No expenses recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Purpose
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
                {exemptions.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {getCategoryLabel(exp.category)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {formatAmount(exp.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {new Date(exp.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                      {exp.purpose || exp.description || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {exp.flagged ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          Flagged
                        </span>
                      ) : exp.status === "APPROVED" ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Approved
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => handleDelete(exp.id)}
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

      {summary.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Category Summary</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.map((s) => (
              <div key={s.category} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">{getCategoryLabel(s.category)}</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{formatAmount(s._sum.amount || 0)}</p>
                <p className="text-xs text-gray-500">{s._count} entries</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
