import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const caseStudies = [
  {
    id: 1,
    company: 'Fashion Empire',
    industry: 'Apparel',
    logo: 'FE',
    description: 'Mid-sized fashion retailer struggling with cart abandonment',
    challenge: 'Cart abandonment rate was 78%, costing over $50K monthly in lost revenue',
    solution: 'Used RevenueRescue to identify checkout friction, slow load times, and trust issues',
    results: [
      { metric: 'Cart Abandonment', before: '78%', after: '42%', change: '-46%' },
      { metric: 'Conversion Rate', before: '1.2%', after: '3.1%', change: '+158%' },
      { metric: 'Revenue Recovered', before: '$0', after: '$42K/mo', change: '+$42K' },
      { metric: 'Health Score', before: 'D (42%)', after: 'A (91%)', change: '+49pts' },
    ],
    testimonial: 'RevenueRescue helped us identify and fix issues we didn\'t even know existed. The ROI was immediate and substantial.',
    author: 'Sarah Johnson',
    role: 'CEO, Fashion Empire',
    duration: '3 months',
    investment: '$79/month',
    roi: '53x ROI',
  },
  {
    id: 2,
    company: 'TechGadgets Pro',
    industry: 'Electronics',
    logo: 'TG',
    description: 'Electronics store with declining conversion rates',
    challenge: 'Conversion rate dropped from 2.8% to 1.1% over 6 months, unclear why',
    solution: 'Implemented RevenueRescue audits to track performance trends and identify issues',
    results: [
      { metric: 'Conversion Rate', before: '1.1%', after: '3.4%', change: '+209%' },
      { metric: 'Page Load Time', before: '4.2s', after: '1.8s', change: '-57%' },
      { metric: 'Mobile Revenue', before: '22%', after: '48%', change: '+118%' },
      { metric: 'Health Score', before: 'F (38%)', after: 'B (87%)', change: '+49pts' },
    ],
    testimonial: 'The trend analysis feature showed us exactly when and where we started losing customers. Fixed it in weeks.',
    author: 'Michael Chen',
    role: 'Director of E-commerce',
    duration: '2 months',
    investment: '$29/month',
    roi: '127x ROI',
  },
  {
    id: 3,
    company: 'Organic Beauty Co',
    industry: 'Beauty & Cosmetics',
    logo: 'OB',
    description: 'Growing beauty brand optimizing for scale',
    challenge: 'Rapid growth caused performance issues and declining customer satisfaction',
    solution: 'Used Pro plan for automated weekly audits and predictive insights',
    results: [
      { metric: 'Customer Satisfaction', before: '72%', after: '94%', change: '+22%' },
      { metric: 'Repeat Purchase Rate', before: '18%', after: '41%', change: '+128%' },
      { metric: 'Average Order Value', before: '$47', after: '$68', change: '+45%' },
      { metric: 'Health Score', before: 'C (68%)', after: 'A (96%)', change: '+28pts' },
    ],
    testimonial: 'The automated audits catch issues before they impact revenue. It\'s like having a dedicated analyst on staff.',
    author: 'Emily Rodriguez',
    role: 'Founder & CMO',
    duration: '6 months',
    investment: '$79/month',
    roi: '89x ROI',
  },
];

const stats = [
  { label: 'Average Revenue Increase', value: '+215%' },
  { label: 'Average Health Score Improvement', value: '+42 points' },
  { label: 'Average ROI', value: '89x' },
  { label: 'Time to First Results', value: '< 2 weeks' },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="success" size="lg" className="mb-6">
                Case Studies
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Real Stores, Real Results
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                See how Shopify store owners used RevenueRescue to identify and fix revenue leaks,
                dramatically improving their bottom line.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-20">
              {caseStudies.map((study, idx) => (
                <Card key={study.id} className="overflow-hidden">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
                        {study.logo}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {study.company}
                        </h2>
                        <Badge variant="neutral">{study.industry}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">ROI</div>
                      <div className="text-2xl font-bold text-green-400">{study.roi}</div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8">{study.description}</p>

                  {/* Challenge */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-red-400">⚠</span> The Challenge
                    </h3>
                    <p className="text-gray-400 pl-7">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400">💡</span> The Solution
                    </h3>
                    <p className="text-gray-400 pl-7">{study.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-green-400">📈</span> The Results
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-7">
                      {study.results.map((result, idx) => (
                        <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-xs text-gray-500 mb-2">{result.metric}</div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm text-gray-400">{result.before}</span>
                            <span className="text-gray-600">→</span>
                            <span className="text-lg font-bold text-white">{result.after}</span>
                          </div>
                          <Badge
                            variant={result.change.startsWith('+') ? 'success' : 'info'}
                            size="sm"
                          >
                            {result.change}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20">
                    <div className="text-4xl text-primary mb-3">"</div>
                    <p className="text-gray-300 text-lg mb-4 italic">{study.testimonial}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {study.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{study.author}</div>
                        <div className="text-sm text-gray-400">{study.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
                    <div>
                      <span className="text-gray-500">Duration:</span> {study.duration}
                    </div>
                    <div>
                      <span className="text-gray-500">Investment:</span> {study.investment}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join hundreds of Shopify store owners who've recovered millions in lost revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
                >
                  Start Your Free Audit
                </a>
                <a
                  href="/pricing"
                  className="px-8 py-4 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
