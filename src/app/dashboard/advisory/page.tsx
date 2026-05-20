"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function AdvisoryPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    scheduledAt: "",
    duration: 30,
    notes: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchCalls()
  }, [])

  async function fetchCalls() {
    try {
      const res = await fetch("/api/advisory")
      if (res.ok) {
        const data = await res.json()
        setCalls(data)
      }
    } catch {
      console.error("Failed to fetch advisory calls")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: new Date(formData.scheduledAt).toISOString(),
          duration: formData.duration,
          notes: formData.notes,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Scheduling failed" })
        return
      }

      setMessage({ type: "success", text: "Advisory session scheduled" })
      setShowForm(false)
      setFormData({ scheduledAt: "", duration: 30, notes: "" })
      fetchCalls()
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  const upcoming = calls.filter((c) => c.status === "SCHEDULED" && new Date(c.scheduledAt) > new Date())
  const past = calls.filter((c) => c.status !== "SCHEDULED" || new Date(c.scheduledAt) <= new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Advisory Sessions</h2>
          <p className="text-sm text-gray-500">Schedule calls with your CA</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <Calendar className="h-4 w-4" />
          Schedule Call
        </button>
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

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agenda</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="What would you like to discuss?"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </span>
              ) : (
                "Schedule"
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming sessions.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((call) => (
              <div key={call.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(call.scheduledAt).toLocaleDateString("en-IN", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {new Date(call.scheduledAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        &middot; {call.duration} min
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Scheduled
                  </span>
                </div>
                {call.notes && <p className="mt-2 text-sm text-gray-500">{call.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Past Sessions</h3>
        {past.length === 0 ? (
          <p className="text-sm text-gray-500">No past sessions.</p>
        ) : (
          <div className="space-y-3">
            {past.map((call) => (
              <div key={call.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(call.scheduledAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">{call.duration} min</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      call.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : call.status === "CANCELLED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {call.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
