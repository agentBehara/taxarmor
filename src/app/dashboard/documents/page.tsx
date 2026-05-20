"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, Loader2, CheckCircle, AlertCircle, FileText } from "lucide-react"

const documentTypes = [
  { value: "PAN", label: "PAN Card" },
  { value: "AADHAAR", label: "Aadhaar Card" },
  { value: "ITR", label: "ITR Document" },
  { value: "GST", label: "GST Certificate" },
  { value: "BANK_STATEMENT", label: "Bank Statement" },
  { value: "INCOME_STATEMENT", label: "Income Statement" },
  { value: "PROPERTY_DOC", label: "Property Document" },
  { value: "LOAN_DOC", label: "Loan Document" },
  { value: "OTHER", label: "Other" },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    type: "PAN",
    fileName: "",
    content: "",
    tags: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const res = await fetch("/api/documents")
      if (res.ok) {
        const data = await res.json()
        setDocuments(data)
      }
    } catch {
      console.error("Failed to fetch documents")
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        content: content.split(",")[1] || content,
      }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: "error", text: typeof data.error === "string" ? data.error : "Upload failed" })
        return
      }

      setMessage({ type: "success", text: "Document uploaded and encrypted successfully" })
      setShowUpload(false)
      setFormData({ type: "PAN", fileName: "", content: "", tags: "" })
      fetchDocuments()
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchDocuments()
      }
    } catch {
      console.error("Delete failed")
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-500">Secure encrypted document storage</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
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

      {showUpload && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Document Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., FY2024, ITR"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition">
                <Upload className="h-4 w-4" />
                {formData.fileName || "Choose file"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.csv"
                />
              </label>
              {formData.fileName && (
                <span className="text-xs text-gray-400">{formData.fileName}</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading || !formData.content}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Encrypting & Uploading...
                </span>
              ) : (
                "Upload & Encrypt"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowUpload(false)}
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
        ) : documents.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No documents uploaded yet.</p>
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
                    File Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {doc.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {doc.fileName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {doc.tags || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => handleDelete(doc.id)}
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
    </div>
  )
}
