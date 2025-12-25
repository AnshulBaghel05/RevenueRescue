import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for testing the waters',
    badge: null,
    popular: false,
    features: [
      { name: '3 audits per month', included: true },
      { name: 'Basic health score (A-F)', included: true },
      { name: 'Top 3 issues shown', included: true },
      { name: 'Public URL audits only', included: true },
      { name: 'Community support', included: true },
      { name: 'Email report', included: true },
      { name: 'Full issue breakdown', included: false },
      { name: 'Revenue calculator', included: false },
      { name: 'Priority support', included: false },
      { name: 'PDF export', included: false },
      { name: 'Competitor tracking', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Start Free',
    ctaLink: '/signup',
  },
  {
    name: 'Starter',
    price: '29',
    period: 'month',
    description: 'For serious store owners',
    badge: 'Most Popular',
    popular: true,
    features: [
      { name: 'Weekly scans (4/month)', included: true },
      { name: 'All 15 features unlocked', included: true },
      { name: 'Full issue breakdown', included: true },
      { name: 'Email alerts on changes', included: true },
      { name: '30-day history', included: true },
      { name: 'Priority email support', included: true },
      { name: 'PDF export', included: true },
      { name: 'Revenue calculator', included: true },
      { name: 'Instant wins section', included: true },
      { name: 'Benchmarking vs industry', included: true },
      { name: 'Competitor tracking', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Start 7-Day Trial',
    ctaLink: '/signup',
  },
  {
    name: 'Professional',
    price: '79',
    period: 'month',
    description: 'For growing businesses',
    badge: 'Best Value',
    popular: false,
    features: [
      { name: 'Daily scans (30/month)', included: true },
      { name: 'All Starter features', included: true },
      { name: 'Competitor tracking (3 stores)', included: true },
      { name: 'API access', included: true },
      { name: 'Custom alerts', included: true },
      { name: 'Priority support', included: true },
      { name: 'White-label reports', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Onboarding call', included: true },
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/signup',
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your subscription at any time from your dashboard. No questions asked, no hidden fees. Your subscription will remain active until the end of your current billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied with RevenueRescue within the first 30 days, we\'ll refund your payment—no questions asked.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI, and net banking through our secure payment partner Razorpay. All transactions are encrypted and secure.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately, and we\'ll prorate the difference in your next billing cycle.',
  },
  {
    question: 'How do audit credits work?',
    answer: 'Each plan comes with a monthly allocation of audits. Free tier gets 3/month, Starter gets 4/week (16-20/month), and Pro gets daily scans (30/month). Unused credits don\'t roll over, but you can always upgrade for more.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Save 20% when you switch to annual billing. Annual plans also come with priority support and extended history. Contact us at support@revenuerescue.com for annual pricing.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your audit history remains accessible for 30 days after cancellation. After 30 days, we permanently delete your data in compliance with privacy regulations. You can export all your reports before canceling.',
  },
  {
    question: 'Can I use RevenueRescue for multiple stores?',
    answer: 'The Free and Starter plans are limited to one store. The Professional plan includes competitor tracking for 3 additional stores. For agencies managing multiple clients, contact us for custom enterprise pricing.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Simple, Transparent
                <span className="gradient-text"> Pricing</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Start free, upgrade when you're ready. Cancel anytime, no questions asked.
              </p>
              <div className="inline-flex items-center gap-3 bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-semibold">30-day money-back guarantee on all paid plans</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, idx) => (
                <div key={idx} className="relative">
                  <Card
                    className={`h-full flex flex-col ${
                      plan.popular ? 'ring-2 ring-primary shadow-glow-primary scale-105' : ''
                    }`}
                    padding="lg"
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge variant="info" size="md">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 mb-6">{plan.description}</p>

                      <div className="mb-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-white">${plan.price}</span>
                          <span className="text-gray-400 ml-2">/{plan.period}</span>
                        </div>
                      </div>

                      <a href={plan.ctaLink}>
                        <button
                          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                            plan.popular
                              ? 'bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-glow-primary'
                              : 'border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary'
                          }`}
                        >
                          {plan.cta}
                        </button>
                      </a>
                    </div>

                    <ul className="space-y-4 flex-grow">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start">
                          {feature.included ? (
                            <svg className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={feature.included ? 'text-gray-300' : 'text-gray-600 line-through'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Detailed Comparison</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Feature</th>
                      <th className="text-center py-4 px-4 text-white font-semibold">Free</th>
                      <th className="text-center py-4 px-4 text-white font-semibold">Starter</th>
                      <th className="text-center py-4 px-4 text-white font-semibold">Professional</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-700/50">
                      <td className="py-4 px-4">Audits per month</td>
                      <td className="text-center py-4 px-4">3</td>
                      <td className="text-center py-4 px-4">Weekly (4)</td>
                      <td className="text-center py-4 px-4">Daily (30)</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-4 px-4">Features unlocked</td>
                      <td className="text-center py-4 px-4">5 of 15</td>
                      <td className="text-center py-4 px-4">All 15</td>
                      <td className="text-center py-4 px-4">All 15</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-4 px-4">History retention</td>
                      <td className="text-center py-4 px-4">7 days</td>
                      <td className="text-center py-4 px-4">30 days</td>
                      <td className="text-center py-4 px-4">90 days</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-4 px-4">Support</td>
                      <td className="text-center py-4 px-4">Community</td>
                      <td className="text-center py-4 px-4">Email</td>
                      <td className="text-center py-4 px-4">Priority + Slack</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-4 px-4">API access</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-4 px-4">Competitor tracking</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">3 stores</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-6 group">
                    <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                      {faq.question}
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-4 text-gray-400 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Recovering Lost Revenue?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join 10,000+ Shopify store owners who've recovered over $2.5M in lost revenue.
              </p>
              <a href="/signup">
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-glow-primary text-lg">
                  Start Free Audit Now →
                </button>
              </a>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
