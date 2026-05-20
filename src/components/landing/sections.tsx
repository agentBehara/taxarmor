import Link from "next/link"
import { Shield, Lock, TrendingUp, Users, CheckCircle, ArrowRight, FileText, Building2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            Trusted by 500+ professionals across India
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Financial Life,
            <br />
            <span className="text-blue-200">Perfectly Balanced.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Stop worrying about tax notices. Start focusing on your business growth.
            Get a CA in your pocket for less than the cost of one dinner.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-500/20 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-blue-500/30 transition"
            >
              View Pricing
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              AES-256 Encrypted
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              DPDP Compliant
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              CA-Verified
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Automated ITR & GST Filing",
      description: "Never miss a deadline. Our system prepares and files your returns automatically.",
    },
    {
      icon: TrendingUp,
      title: "Tax-Saving Advisory",
      description: "Get personalized recommendations to maximize your tax savings legally.",
    },
    {
      icon: Shield,
      title: "Audit Support Shield",
      description: "Notices? We handle them. Document preparation and submission included.",
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "AES-256 encryption at rest, TLS 1.3 in transit. Your data stays in India.",
    },
    {
      icon: Building2,
      title: "Property & Asset Management",
      description: "House tax calculation, capital gains tracking, and wealth management.",
    },
    {
      icon: Users,
      title: "Dedicated CA Support",
      description: "A real Chartered Accountant oversees your account. Always.",
    },
  ]

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            All-inclusive subscription. No surprise fees. Ever.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8 transition hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingSection() {
  const tiers = [
    {
      name: "Silver",
      audience: "Salaried Individuals",
      price: "₹1,999",
      period: "/year",
      features: [
        "ITR Filing Included",
        "Annual Tax Summary",
        "1 Advisory Session/year",
        "Basic Loan Documentation",
        "Encrypted Document Vault",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Gold",
      audience: "Freelancers & MSMEs",
      price: "₹7,999",
      period: "/year",
      features: [
        "Everything in Silver",
        "GST Filing (up to 12/year)",
        "2 Advisory Sessions/year",
        "Financial Statement Prep",
        "Audit Document Submission",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Platinum",
      audience: "Business Owners & HNIs",
      price: "₹24,999",
      period: "/year",
      features: [
        "Everything in Gold",
        "Unlimited GST Filing",
        "Unlimited Advisory Sessions",
        "Dedicated Audit Rep",
        "3-5 Year Tax Projection",
        "Life-Time Audit Shield",
      ],
      cta: "Get Started",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Save 15% on 3-year plans, 25% on 5-year plans.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border ${
                tier.popular
                  ? "border-blue-200 bg-white shadow-xl ring-1 ring-blue-200"
                  : "border-gray-200 bg-white"
              } p-8`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{tier.audience}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                <span className="text-gray-500">{tier.period}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                  tier.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            A typical audit response costs ₹5,000+ per instance. Our Gold plan covers all this for ₹7,999/year.
          </p>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Filing my taxes used to take all weekend. Now it takes 10 minutes. Worth every rupee.",
      name: "Priya Sharma",
      role: "Freelance Designer",
    },
    {
      quote: "The audit support saved me when I got a notice. My CA handled everything while I focused on my business.",
      name: "Rajesh Kumar",
      role: "Business Owner",
    },
    {
      quote: "Finally, a CA service that doesn&apos;t charge surprise fees. The subscription model is a game-changer.",
      name: "Anita Patel",
      role: "Salaried Professional",
    },
  ]

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Trusted by professionals across India
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <p className="text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
