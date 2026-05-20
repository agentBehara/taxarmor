import { PricingSection } from "@/components/landing/sections"

export default function PricingPage() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Choose a plan that fits your needs. Save 15% on 3-year plans, 25% on 5-year plans.
          </p>
        </div>
      </div>
      <PricingSection />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                q: "What happens if I get a tax notice?",
                a: "All plans include guidance. Gold includes document submission. Platinum includes dedicated representation for compliance notices.",
              },
              {
                q: "Can I switch plans later?",
                a: "Yes, you can upgrade or downgrade at any time. Changes take effect at your next billing cycle.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use AES-256 encryption at rest, TLS 1.3 in transit, and host on Indian servers per DPDP Act requirements.",
              },
              {
                q: "What if I want to cancel?",
                a: "Cancel anytime 30 days before your renewal. Refunds are provided only if services have not commenced.",
              },
              {
                q: "Do I get the same CA throughout?",
                a: "Yes, we assign a dedicated CA to your account for continuity and better understanding of your financial situation.",
              },
              {
                q: "What does 'All-Inclusive' mean?",
                a: "No surprise fees. Your subscription covers all filings, advisory sessions, and audit support within your plan limits.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-medium text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
