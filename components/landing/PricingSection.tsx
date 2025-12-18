'use client';

import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for testing the waters',
    badge: null,
    features: [
      '3 audits per month',
      'Basic health score',
      'Top 3 issues shown',
      'Public URL audits only',
      'Community support',
      'Email report',
    ],
    cta: 'Start Free',
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Starter',
    price: '29',
    period: 'month',
    description: 'For serious store owners',
    badge: 'Most Popular',
    features: [
      'Weekly scans (4/month)',
      'All 15 features unlocked',
      'Full issue breakdown',
      'Email alerts on changes',
      '30-day history',
      'Priority email support',
      'PDF export',
      'Revenue calculator',
    ],
    cta: 'Upgrade to Starter',
    variant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Professional',
    price: '79',
    period: 'month',
    description: 'For growing businesses',
    badge: 'Best Value',
    features: [
      'Daily scans (30/month)',
      'All Starter features',
      'Competitor tracking (3 stores)',
      'API access',
      'Custom alerts',
      'Priority support',
      'White-label reports',
      'Dedicated account manager',
    ],
    cta: 'Upgrade to Pro',
    variant: 'secondary' as const,
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Card
                className={`h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary shadow-glow-primary' : ''
                  }`}
                padding="lg"
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="info" size="md">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 transition-all duration-200 ${plan.popular
                      ? 'bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-glow-primary'
                      : plan.variant === 'secondary'
                        ? 'bg-secondary hover:bg-secondary-light text-white'
                        : 'border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary'
                    }`}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-4 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                Can I cancel my subscription anytime?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                Yes! You can cancel your subscription at any time from your dashboard. No questions asked, no hidden fees.
              </p>
            </details>

            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                Do you offer refunds?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                We offer a 30-day money-back guarantee. If you're not satisfied with RevenueRescue, we'll refund your payment—no questions asked.
              </p>
            </details>

            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                What payment methods do you accept?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                We accept all major credit cards, debit cards, UPI, and net banking through our secure payment partner Razorpay.
              </p>
            </details>

            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                Can I upgrade or downgrade my plan?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
