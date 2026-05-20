export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Data We Collect</h2>
          <p className="mt-2 text-gray-600">
            We collect personal information you provide directly, including name, email, phone number, PAN, Aadhaar
            (masked), and financial documents necessary for tax compliance and advisory services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Data</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
            <li>Processing and filing tax returns (ITR, GST)</li>
            <li>Providing tax advisory and financial planning</li>
            <li>Preparing loan documentation and financial statements</li>
            <li>Responding to tax notices and audit support</li>
            <li>Improving our services and security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Data Security</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
            <li>AES-256 encryption for all data stored on our servers</li>
            <li>TLS 1.3 encryption for all data transmitted between the app and server</li>
            <li>Role-Based Access Control (RBAC) - only your assigned CA can view sensitive documents</li>
            <li>Mandatory Multi-Factor Authentication (MFA) for all accounts</li>
            <li>Immutable audit logs tracking all document access</li>
            <li>Data hosted on Indian servers per DPDP Act requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Data Sharing</h2>
          <p className="mt-2 text-gray-600">
            Your data is never sold to third parties. We share data only with your assigned Chartered Accountant and
            only as required for filing with government tax authorities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Data Retention & Deletion</h2>
          <p className="mt-2 text-gray-600">
            Per Indian tax law, financial records are retained for 7-8 years. After this period, or upon your explicit
            request, your data will be permanently deleted. You may request deletion at any time via Settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
            <li>Access your personal data at any time</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (Right to be Forgotten)</li>
            <li>Withdraw consent for data processing</li>
            <li>Download a copy of all your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">7. Compliance</h2>
          <p className="mt-2 text-gray-600">
            TaxArmor complies with the Digital Personal Data Protection Act (DPDPA) of India and follows ICAI
            guidelines for client data handling.
          </p>
        </section>
      </div>
    </div>
  )
}
