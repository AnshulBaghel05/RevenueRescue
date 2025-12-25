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
      { name: '3 audits per month', included: true },
      { name: 'Basic health score (A-F)', included: true },
      { name: 'Performance & conversion analysis', included: true },
      { name: 'Revenue impact calculator', included: true },
      { name: 'Basic recommendations', included: true },
      { name: 'Community support', included: true },
      { name: 'Trend analysis', included: false },
      { name: 'PDF export', included: false },
      { name: 'Priority support', included: false },
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
      { name: '16 audits per month', included: true },
      { name: 'All Free features', included: true },
      { name: 'Trend analysis & insights', included: true },
      { name: 'Compare audits', included: true },
      { name: 'Priority recommendations', included: true },
      { name: 'PDF export reports', included: true },
      { name: 'Email support', included: true },
      { name: 'Automated weekly audits', included: false },
      { name: 'Custom branding', included: false },
    ],
    cta: 'Upgrade to Starter',
    variant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Pro',
    price: '79',
    period: 'month',
    description: 'For growing businesses',
    badge: 'Best Value',
    features: [
      { name: '30 audits per month', included: true },
      { name: 'All Starter features', included: true },
      { name: 'Advanced Analytics Dashboard', included: true },
      { name: 'Predictive score forecasting', included: true },
      { name: 'AI-powered insights', included: true },
      { name: 'PDF export with custom branding', included: true },
      { name: 'Data export (CSV/JSON)', included: true },
      { name: 'Priority support', included: true },
      { name: 'Weekly automated audits (Coming Soon)', included: true },
      { name: 'Email alerts (Coming Soon)', included: true },
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
            Start free, upgrade when you're ready. Cancel anytime, no questions asked.
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
                className={`h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary shadow-glow-primary scale-105' : ''
                  }`}
                padding="lg"
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="success" size="md">
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
                    <span className="text-gray-400 mr-1">$</span>
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-grow mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <span
                        className={`text-xl flex-shrink-0 ${
                          feature.included ? 'text-green-400' : 'text-gray-600'
                        }`}
                      >
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span
                        className={
                          feature.included ? 'text-gray-300' : 'text-gray-600'
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href={plan.price === '0' ? '/signup' : '/pricing'}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-center transition-all duration-200 block ${plan.popular
                      ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white shadow-lg hover:shadow-glow-primary'
                      : plan.variant === 'secondary'
                        ? 'bg-secondary hover:bg-secondary-light text-white'
                        : 'border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary'
                    }`}
                >
                  {plan.cta}
                </a>
              </Card>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            All plans include secure payments, instant access, and email support
          </p>
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
                Yes! You can cancel your subscription at any time from your dashboard settings. Your subscription will remain active until the end of your current billing period.
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
                We accept all major credit cards, debit cards, UPI, and net banking through our secure payment partner Razorpay. All transactions are encrypted and secure.
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
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and we'll prorate the difference.
              </p>
            </details>

            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                How do audit credits work?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                Each plan comes with a monthly allocation of audits. Free tier gets 3/month, Starter gets 16/month, and Pro gets 30/month. Credits reset at the start of each billing cycle.
              </p>
            </details>

            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                Do you offer a free trial?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                Yes! All new users start with 3 free audits. You can test the platform before committing to a paid plan.
              </p>
            </details>

            <details className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                What happens if I run out of audits?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-400">
                You can upgrade your plan at any time to get more audits. Your new limit will be available immediately.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
