export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Service Acceptance</h2>
          <p className="mt-2 text-gray-600">
            By subscribing, the User engages TaxArmor to provide professional financial services. TaxArmor acts as an
            intermediary for document processing and tax filing and provides expert advisory by qualified Chartered
            Accountants.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. User Responsibilities</h2>
          <p className="mt-2 text-gray-600">
            The User warrants that all financial data, PAN, Aadhaar, and income statements provided are authentic,
            accurate, and complete. TaxArmor is not liable for penalties or legal consequences arising from inaccurate
            data provided by the User.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Data Privacy & Security</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
            <li>All data is encrypted using AES-256 standards at rest and TLS 1.3 in transit.</li>
            <li>By uploading documents, the User grants TaxArmor a limited license to store and process data solely for the purpose of tax compliance and advisory.</li>
            <li>User data is never sold to third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Subscription & Payments</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
            <li>Subscriptions renew annually unless cancelled 30 days prior to the cycle end.</li>
            <li>Refunds are only provided if services have not yet commenced.</li>
            <li>No refunds once the ITR/GST filing has been initiated.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Limitation of Liability</h2>
          <p className="mt-2 text-gray-600">
            TaxArmor&apos;s total liability for any claim arising from our services is capped at the total subscription
            fees paid by the User in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Audit Support Guardrails</h2>
          <p className="mt-2 text-gray-600">
            &quot;Audit Support&quot; refers to responding to notices and preparing documentation for tax authorities.
            It does not cover legal representation in high-court litigation, criminal defense, or fees charged by
            government authorities (e.g., penalties, interest).
          </p>
        </section>
      </div>
    </div>
  )
}
