import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">TaxArmor</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your Financial Life, Perfectly Balanced.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">ITR Filing</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">GST Filing</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">Tax Advisory</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">Loan Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</Link></li>
              <li><span className="text-sm text-gray-500">ICAI Compliant</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Security</h3>
            <ul className="mt-3 space-y-2">
              <li><span className="text-sm text-gray-500">AES-256 Encryption</span></li>
              <li><span className="text-sm text-gray-500">TLS 1.3 Transit</span></li>
              <li><span className="text-sm text-gray-500">Indian Data Residency</span></li>
              <li><span className="text-sm text-gray-500">DPDP Act Compliant</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TaxArmor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
