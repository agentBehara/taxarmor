"use client"

import { useState } from "react"
import { Shield, Trash2, Key, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [mfaSecret, setMfaSecret] = useState("")
  const [mfaQR, setMfaQR] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [showMfaSetup, setShowMfaSetup] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [purgeConfirm, setPurgeConfirm] = useState(false)

  async function setupMFA() {
    setLoading(true)
    try {
      const res = await fetch("/api/settings/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      })
      if (res.ok) {
        const data = await res.json()
        setMfaSecret(data.secret)
        setMfaQR(data.qrCode)
        setShowMfaSetup(true)
      }
    } catch {
      setMessage({ type: "error", text: "Failed to generate MFA setup" })
    } finally {
      setLoading(false)
    }
  }

  async function enableMFA() {
    setLoading(true)
    try {
      const res = await fetch("/api/settings/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", secret: mfaSecret, token: mfaCode }),
      })
      if (res.ok) {
        setMfaEnabled(true)
        setShowMfaSetup(false)
        setMessage({ type: "success", text: "MFA enabled successfully" })
      } else {
        setMessage({ type: "error", text: "Invalid MFA code" })
      }
    } catch {
      setMessage({ type: "error", text: "Failed to enable MFA" })
    } finally {
      setLoading(false)
    }
  }

  async function disableMFA() {
    setLoading(true)
    try {
      const res = await fetch("/api/settings/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable" }),
      })
      if (res.ok) {
        setMfaEnabled(false)
        setMessage({ type: "success", text: "MFA disabled" })
      }
    } catch {
      setMessage({ type: "error", text: "Failed to disable MFA" })
    } finally {
      setLoading(false)
    }
  }

  async function requestPurge() {
    setLoading(true)
    try {
      const res = await fetch("/api/settings/purge", { method: "POST" })
      if (res.ok) {
        setMessage({ type: "success", text: "Data purge request submitted. Your data will be deleted after the legal retention period." })
        setPurgeConfirm(false)
      }
    } catch {
      setMessage({ type: "error", text: "Failed to submit purge request" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Security, privacy, and account management</p>
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

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Multi-Factor Authentication</h3>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Add an extra layer of security to your account.
        </p>
        <div className="mt-4">
          {mfaEnabled ? (
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">MFA is enabled</span>
              </div>
              <button
                onClick={disableMFA}
                disabled={loading}
                className="rounded-lg border border-green-300 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 transition"
              >
                Disable
              </button>
            </div>
          ) : showMfaSetup ? (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Scan QR code in your authenticator app</label>
                <div className="mt-2 rounded-lg bg-gray-100 p-4 text-center">
                  <p className="text-xs text-gray-500">QR Code would be rendered here</p>
                  <p className="mt-1 font-mono text-xs text-gray-400">{mfaSecret}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter 6-digit code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 block w-32 rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="000000"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={enableMFA}
                  disabled={loading || mfaCode.length !== 6}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Enable MFA"
                  )}
                </button>
                <button
                  onClick={() => setShowMfaSetup(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={setupMFA}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <Key className="h-4 w-4" />
              Set up MFA
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Trash2 className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Right to be Forgotten</h3>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Request complete deletion of your account and data. Per Indian tax law, data is retained for 7-8 years
          before permanent deletion.
        </p>
        {!purgeConfirm ? (
          <button
            onClick={() => setPurgeConfirm(true)}
            className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Request Data Deletion
          </button>
        ) : (
          <div className="mt-4 space-y-3 rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">
              Are you sure? This action cannot be undone. Your data will be marked for deletion after the legal retention period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={requestPurge}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading ? "Processing..." : "Confirm Deletion"}
              </button>
              <button
                onClick={() => setPurgeConfirm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
