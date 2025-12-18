import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const featureCategories = [
  {
    category: 'Performance & Speed',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    description: 'Identify and fix performance bottlenecks that slow down your store and hurt conversions.',
    features: [
      {
        name: 'Overall Store Health Score',
        description: 'Get an instant A-F grade with detailed breakdown of all performance metrics across your entire store.',
        impact: 'High',
        savings: '$500-2000/month',
      },
      {
        name: 'Page Load Speed Analysis',
        description: 'Desktop and mobile speed metrics with specific recommendations for improving load times.',
        impact: 'Critical',
        savings: '$1000-3000/month',
      },
      {
        name: 'Core Web Vitals (LCP)',
        description: 'Real user experience metrics that directly impact your Google rankings and organic traffic.',
        impact: 'High',
        savings: '$800-2500/month',
      },
      {
        name: 'Image Optimization Scanner',
        description: 'Find oversized images with compression savings calculator. Reduce bandwidth and load times.',
        impact: 'Medium',
        savings: '$300-1000/month',
      },
      {
        name: 'Unused App Detector',
        description: 'Identify apps slowing your store with performance impact scores. Remove bloat and speed up.',
        impact: 'Medium',
        savings: '$400-1500/month',
      },
    ],
  },
  {
    category: 'Conversion Killers',
    icon: '🛒',
    color: 'from-blue-500 to-cyan-500',
    description: 'Discover hidden issues preventing visitors from becoming customers.',
    features: [
      {
        name: 'Missing Trust Signals',
        description: 'Check for SSL badges, customer reviews, return policy visibility, and security indicators.',
        impact: 'Critical',
        savings: '$1500-4000/month',
      },
      {
        name: 'Checkout Speed Analysis',
        description: 'Time to complete checkout vs industry average benchmarks. Every second counts.',
        impact: 'High',
        savings: '$1000-3000/month',
      },
      {
        name: 'Mobile Usability Score',
        description: 'Touch targets, form fields, and mobile readability analysis for 70%+ of your traffic.',
        impact: 'Critical',
        savings: '$2000-5000/month',
      },
      {
        name: 'Broken Link Detector',
        description: 'Find all internal and external broken links hurting your SEO and user experience.',
        impact: 'Medium',
        savings: '$500-1500/month',
      },
      {
        name: 'Product Page Completeness',
        description: 'Missing descriptions, images, prices, and required elements that prevent purchases.',
        impact: 'High',
        savings: '$1200-3500/month',
      },
    ],
  },
  {
    category: 'Revenue Impact',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    description: 'Calculate exactly how much money you\'re losing and how to recover it.',
    features: [
      {
        name: 'Revenue Recovery Calculator',
        description: 'See exactly how much money you\'re losing from each issue with monthly impact estimates.',
        impact: 'Critical',
        savings: '$3000-10000/month',
      },
      {
        name: 'Cart Abandonment Detector',
        description: 'Identify reasons: high shipping costs, slow load speed, or missing trust indicators.',
        impact: 'Critical',
        savings: '$2000-6000/month',
      },
      {
        name: 'Conversion Rate Benchmark',
        description: 'Compare your conversion rate against industry averages and top performers in your niche.',
        impact: 'High',
        savings: '$1500-4000/month',
      },
    ],
  },
  {
    category: 'Actionable Insights',
    icon: '🎯',
    color: 'from-purple-500 to-pink-500',
    description: 'Get clear, prioritized recommendations you can implement immediately.',
    features: [
      {
        name: 'Priority Fix List',
        description: 'Ranked by revenue impact with effort estimates. Know exactly what to fix first.',
        impact: 'High',
        savings: 'Varies',
      },
      {
        name: 'Instant Wins Section',
        description: 'Quick fixes you can implement in under 5 minutes for immediate revenue impact.',
        impact: 'Medium',
        savings: '$500-2000/month',
      },
      {
        name: 'One-Click PDF Export',
        description: 'Professional report with all findings, ready to share with your team or developers.',
        impact: 'Low',
        savings: 'Time-saving',
      },
      {
        name: 'Competitor Benchmarking',
        description: 'Compare your store against 3 similar stores to see where you stand.',
        impact: 'Medium',
        savings: 'Strategic advantage',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="info" size="lg" className="mb-6">
                15 Powerful Features
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Everything You Need to
                <span className="gradient-text"> Maximize Revenue</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Our comprehensive audit engine analyzes every aspect of your Shopify store
                to identify hidden revenue opportunities and conversion blockers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <span className="text-gray-300">5 Performance Checks</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-2xl">🛒</span>
                  <span className="text-gray-300">5 Conversion Audits</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-2xl">💰</span>
                  <span className="text-gray-300">3 Revenue Calculators</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-300">4 Action Tools</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        {featureCategories.map((category, idx) => (
          <section key={idx} className="py-16">
            <div className="container mx-auto px-4">
              {/* Category Header */}
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} text-4xl mb-6`}>
                  {category.icon}
                </div>
                <h2 className="text-4xl font-bold mb-4">{category.category}</h2>
                <p className="text-xl text-gray-400">{category.description}</p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {category.features.map((feature, featureIdx) => (
                  <Card key={featureIdx} hover className="h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex-1">
                        {feature.name}
                      </h3>
                      <Badge
                        variant={
                          feature.impact === 'Critical'
                            ? 'error'
                            : feature.impact === 'High'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {feature.impact}
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Potential Savings</span>
                        <span className="text-green-400 font-semibold">{feature.savings}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Unlock Hidden Revenue?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Start your free audit now and discover exactly what's costing you money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signup">
                  <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-glow-primary text-lg">
                    Start Free Audit →
                  </button>
                </a>
                <a href="/pricing">
                  <button className="px-8 py-4 border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary font-bold rounded-lg transition-all text-lg">
                    View Pricing
                  </button>
                </a>
              </div>
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
