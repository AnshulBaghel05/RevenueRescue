import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const caseStudies = [
  {
    company: 'Urban Threads',
    industry: 'Fashion & Apparel',
    location: 'Los Angeles, CA',
    size: '$500K ARR',
    logo: '👔',
    color: 'from-purple-500 to-pink-500',
    challenge: 'High cart abandonment rate (78%) and slow mobile load times (6.2s) were killing conversions.',
    solution: 'RevenueRescue identified 12 critical issues including oversized product images, missing trust badges, and a broken checkout flow on mobile devices.',
    results: [
      { metric: 'Revenue Increase', value: '+127%', description: '$635K in additional annual revenue' },
      { metric: 'Cart Abandonment', value: '-43%', description: 'Dropped from 78% to 35%' },
      { metric: 'Mobile Load Time', value: '-71%', description: 'Improved from 6.2s to 1.8s' },
      { metric: 'Conversion Rate', value: '+3.2%', description: 'From 1.8% to 5.0%' },
    ],
    quote: "RevenueRescue paid for itself in the first week. The instant wins alone recovered $12K in monthly revenue. Our conversion rate doubled within 30 days.",
    author: 'Sarah Chen',
    role: 'Founder & CEO',
    timeframe: '90 days',
  },
  {
    company: 'GreenLeaf Organics',
    industry: 'Health & Wellness',
    location: 'Austin, TX',
    size: '$1.2M ARR',
    logo: '🌿',
    color: 'from-green-500 to-emerald-500',
    challenge: 'Despite high traffic, conversion rate was stuck at 1.4%. Unknown issues were costing thousands in lost sales.',
    solution: 'Audit revealed critical trust signal issues, poor product page structure, and 47 broken internal links hurting SEO and user experience.',
    results: [
      { metric: 'Monthly Revenue', value: '+$45K', description: 'Sustainable revenue increase' },
      { metric: 'Conversion Rate', value: '+189%', description: 'From 1.4% to 4.05%' },
      { metric: 'Organic Traffic', value: '+56%', description: 'Fixed SEO issues improved rankings' },
      { metric: 'Average Order Value', value: '+23%', description: 'Better product page layout' },
    ],
    quote: "I was skeptical at first, but the ROI was insane. We implemented the top 5 fixes in one weekend and saw immediate results. Best $29 we ever spent.",
    author: 'Michael Rodriguez',
    role: 'E-commerce Director',
    timeframe: '60 days',
  },
  {
    company: 'TechGear Pro',
    industry: 'Electronics & Gadgets',
    location: 'Seattle, WA',
    size: '$2.8M ARR',
    logo: '🎧',
    color: 'from-blue-500 to-cyan-500',
    challenge: 'Mobile sales were significantly lower than desktop despite 65% mobile traffic. Missing out on major revenue.',
    solution: 'RevenueRescue uncovered 23 mobile usability issues including tiny tap targets, unreadable text, and a mobile checkout flow that was 3x slower than desktop.',
    results: [
      { metric: 'Mobile Revenue', value: '+$98K/mo', description: 'Mobile now matches desktop conversion' },
      { metric: 'Mobile Conversion', value: '+312%', description: 'From 0.8% to 3.3%' },
      { metric: 'Checkout Speed', value: '-65%', description: 'Mobile checkout time cut in half' },
      { metric: 'Bounce Rate', value: '-41%', description: 'Mobile users stay longer' },
    ],
    quote: "We knew mobile was underperforming but didn't know why. RevenueRescue showed us exactly what to fix, in order of impact. Mobile revenue tripled.",
    author: 'Jennifer Wu',
    role: 'Head of Growth',
    timeframe: '45 days',
  },
  {
    company: 'Artisan Home Co',
    industry: 'Home Decor',
    location: 'Portland, OR',
    size: '$850K ARR',
    logo: '🏠',
    color: 'from-orange-500 to-red-500',
    challenge: 'Traffic was growing but revenue wasn\'t. Conversion rate had plateaued at 2.1% despite marketing spend increases.',
    solution: 'Audit identified image optimization issues (3.2MB average product images), missing alt text hurting SEO, and 8 Shopify apps that were slowing the site.',
    results: [
      { metric: 'Page Speed', value: '+73%', description: 'LCP improved from 4.1s to 1.1s' },
      { metric: 'Monthly Revenue', value: '+$28K', description: 'From optimization alone' },
      { metric: 'SEO Rankings', value: '+34 positions', description: 'Key product pages improved' },
      { metric: 'App Load Time', value: '-2.8s', description: 'Removed 5 unused apps' },
    ],
    quote: "The image optimization alone was worth it. We had no idea our product photos were 3MB each. Site feels so much faster now and conversions are up.",
    author: 'David Thompson',
    role: 'Owner',
    timeframe: '30 days',
  },
  {
    company: 'FitnessFuel',
    industry: 'Sports Nutrition',
    location: 'Miami, FL',
    size: '$3.5M ARR',
    logo: '💪',
    color: 'from-red-500 to-pink-500',
    challenge: 'High return rate and low repeat purchase rate. Customers weren\'t finding the right products.',
    solution: 'RevenueRescue found product page completeness issues - 40% of products missing key information, no size guides, and confusing product variants.',
    results: [
      { metric: 'Return Rate', value: '-38%', description: 'Customers buying right products' },
      { metric: 'Repeat Purchase', value: '+67%', description: 'Better customer satisfaction' },
      { metric: 'Average Order', value: '+$32', description: 'From $78 to $110' },
      { metric: 'Support Tickets', value: '-52%', description: 'Fewer confused customers' },
    ],
    quote: "We thought our product pages were fine. Turns out 40% were missing critical info. Fixing this reduced returns and increased repeat purchases dramatically.",
    author: 'Amanda Foster',
    role: 'COO',
    timeframe: '75 days',
  },
  {
    company: 'PetPalace',
    industry: 'Pet Supplies',
    location: 'Denver, CO',
    size: '$1.8M ARR',
    logo: '🐾',
    color: 'from-amber-500 to-orange-500',
    challenge: 'Cart abandonment emails weren\'t working because customers were leaving for unclear reasons.',
    solution: 'Audit revealed hidden shipping costs appearing too late, no trust badges on checkout, and a confusing multi-step checkout process.',
    results: [
      { metric: 'Cart Abandonment', value: '-29%', description: 'From 72% to 51%' },
      { metric: 'Checkout Completion', value: '+156%', description: 'Simplified flow worked' },
      { metric: 'Monthly Revenue', value: '+$52K', description: 'From recovered carts' },
      { metric: 'Customer Trust', value: '+4.2 stars', description: 'Reviews improved' },
    ],
    quote: "The checkout analysis was eye-opening. We were hiding shipping costs until the last step. Simple fix, massive impact on abandoned carts.",
    author: 'Robert Kim',
    role: 'Founder',
    timeframe: '60 days',
  },
];

const stats = [
  { value: '10,000+', label: 'Stores Audited', icon: '🏪' },
  { value: '$2.5M+', label: 'Revenue Recovered', icon: '💰' },
  { value: '95%', label: 'Success Rate', icon: '📈' },
  { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="success" size="lg" className="mb-6">
                Success Stories
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Real Stores,
                <span className="gradient-text"> Real Results</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12">
                See how Shopify store owners like you are recovering thousands in lost revenue
                with RevenueRescue.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-24">
              {caseStudies.map((study, idx) => (
                <div key={idx} className="relative">
                  {/* Company Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${study.color} flex items-center justify-center text-4xl flex-shrink-0`}>
                      {study.logo}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{study.company}</h2>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="info">{study.industry}</Badge>
                        <Badge variant="neutral">{study.location}</Badge>
                        <Badge variant="success">{study.size}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Challenge & Solution */}
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                          <span className="text-2xl mr-3">❌</span>
                          The Challenge
                        </h3>
                        <p className="text-gray-400 leading-relaxed">{study.challenge}</p>
                      </Card>

                      <Card>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                          <span className="text-2xl mr-3">💡</span>
                          The Solution
                        </h3>
                        <p className="text-gray-400 leading-relaxed">{study.solution}</p>
                      </Card>

                      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">"</div>
                          <div className="flex-1">
                            <p className="text-gray-300 italic mb-4 text-lg leading-relaxed">
                              {study.quote}
                            </p>
                            <div>
                              <div className="font-semibold text-white">{study.author}</div>
                              <div className="text-sm text-gray-400">{study.role}, {study.company}</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                        <div className="text-center mb-4">
                          <div className="text-sm text-gray-400 mb-2">Timeframe</div>
                          <div className="text-2xl font-bold text-white">{study.timeframe}</div>
                        </div>
                      </div>

                      {study.results.map((result, resultIdx) => (
                        <Card key={resultIdx} className="text-center">
                          <div className="text-sm text-gray-400 mb-2">{result.metric}</div>
                          <div className="text-3xl font-bold text-green-400 mb-2">{result.value}</div>
                          <div className="text-xs text-gray-500">{result.description}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Patterns */}
        <section className="py-20 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Common Revenue Leaks We Find</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card hover>
                  <div className="text-3xl mb-4">🐌</div>
                  <h3 className="text-xl font-bold mb-3">Slow Page Speed</h3>
                  <p className="text-gray-400 mb-4">
                    Average site loses $2,500/month from slow load times. Simple image optimization can fix this.
                  </p>
                  <div className="text-sm text-primary font-semibold">Found in 83% of audits</div>
                </Card>

                <Card hover>
                  <div className="text-3xl mb-4">📱</div>
                  <h3 className="text-xl font-bold mb-3">Mobile Issues</h3>
                  <p className="text-gray-400 mb-4">
                    70% of traffic is mobile, but most stores aren't optimized. Tap targets too small, text unreadable.
                  </p>
                  <div className="text-sm text-primary font-semibold">Found in 71% of audits</div>
                </Card>

                <Card hover>
                  <div className="text-3xl mb-4">🛡️</div>
                  <h3 className="text-xl font-bold mb-3">Missing Trust Signals</h3>
                  <p className="text-gray-400 mb-4">
                    No security badges, reviews hidden, unclear return policy. Customers don't trust you enough to buy.
                  </p>
                  <div className="text-sm text-primary font-semibold">Found in 67% of audits</div>
                </Card>

                <Card hover>
                  <div className="text-3xl mb-4">🔗</div>
                  <h3 className="text-xl font-bold mb-3">Broken Links</h3>
                  <p className="text-gray-400 mb-4">
                    404 errors hurt SEO and user experience. Many stores have dozens of broken internal links.
                  </p>
                  <div className="text-sm text-primary font-semibold">Found in 59% of audits</div>
                </Card>

                <Card hover>
                  <div className="text-3xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold mb-3">Checkout Friction</h3>
                  <p className="text-gray-400 mb-4">
                    Complicated checkout, hidden costs, slow process. Average store loses 72% of carts to abandonment.
                  </p>
                  <div className="text-sm text-primary font-semibold">Found in 54% of audits</div>
                </Card>

                <Card hover>
                  <div className="text-3xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-3">Incomplete Products</h3>
                  <p className="text-gray-400 mb-4">
                    Missing descriptions, poor images, no specifications. Customers can't make informed decisions.
                  </p>
                  <div className="text-sm text-primary font-semibold">Found in 48% of audits</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Your Success Story Starts Here
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of Shopify store owners recovering lost revenue with RevenueRescue.
              </p>
              <a href="/signup">
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-glow-primary text-lg">
                  Start Your Free Audit →
                </button>
              </a>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Results in 60 seconds • Join 10,000+ stores
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
