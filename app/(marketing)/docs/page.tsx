import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const categories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    description: 'New to RevenueRescue? Start here',
    docs: [
      { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', time: '5 min' },
      { title: 'Connecting Your Shopify Store', description: 'Step-by-step integration guide', time: '3 min' },
      { title: 'Understanding Your First Audit', description: 'Learn what the metrics mean', time: '8 min' },
      { title: 'Dashboard Overview', description: 'Navigate the dashboard like a pro', time: '10 min' },
    ],
  },
  {
    title: 'Features',
    icon: '⚡',
    description: 'Deep dives into RevenueRescue features',
    docs: [
      { title: 'Health Score Explained', description: 'What your A-F grade really means', time: '7 min' },
      { title: 'Trend Analysis', description: 'Track performance over time', time: '6 min' },
      { title: 'Compare Audits', description: 'See how your store improves', time: '5 min' },
      { title: 'PDF Export Reports', description: 'Create professional reports', time: '4 min' },
      { title: 'Revenue Impact Calculator', description: 'Quantify potential gains', time: '8 min' },
    ],
  },
  {
    title: 'Optimization Guides',
    icon: '📈',
    description: 'Actionable advice to improve your store',
    docs: [
      { title: 'Reducing Cart Abandonment', description: 'Proven strategies to recover lost sales', time: '12 min' },
      { title: 'Improving Page Speed', description: 'Make your store lightning fast', time: '15 min' },
      { title: 'Mobile Optimization', description: 'Convert mobile visitors better', time: '10 min' },
      { title: 'Checkout Best Practices', description: 'Optimize your checkout flow', time: '9 min' },
      { title: 'Trust Signals That Convert', description: 'Build customer confidence', time: '7 min' },
    ],
  },
  {
    title: 'Account & Billing',
    icon: '💳',
    description: 'Manage your subscription',
    docs: [
      { title: 'Subscription Plans', description: 'Choose the right plan for you', time: '5 min' },
      { title: 'Upgrading Your Plan', description: 'Get more audits and features', time: '3 min' },
      { title: 'Billing & Invoices', description: 'Manage payments and receipts', time: '4 min' },
      { title: 'Canceling Your Subscription', description: 'How to cancel (we hope you stay!)', time: '2 min' },
    ],
  },
  {
    title: 'API & Integrations',
    icon: '🔌',
    description: 'Technical documentation',
    docs: [
      { title: 'API Overview', description: 'Introduction to the RevenueRescue API', time: '10 min' },
      { title: 'Authentication', description: 'API keys and security', time: '5 min' },
      { title: 'API Endpoints', description: 'Complete endpoint reference', time: '20 min' },
      { title: 'Rate Limits', description: 'Understand API quotas', time: '4 min' },
      { title: 'Webhooks', description: 'Real-time audit notifications', time: '8 min' },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: '🔧',
    description: 'Common issues and solutions',
    docs: [
      { title: 'Connection Issues', description: 'Shopify connection problems', time: '5 min' },
      { title: 'Audit Not Running', description: 'Why your audit might be stuck', time: '4 min' },
      { title: 'Incorrect Data', description: 'Data accuracy and syncing', time: '6 min' },
      { title: 'Payment Failed', description: 'Resolving billing issues', time: '3 min' },
    ],
  },
];

const popularDocs = [
  { title: 'Quick Start Guide', category: 'Getting Started', views: '12.5K' },
  { title: 'Health Score Explained', category: 'Features', views: '8.2K' },
  { title: 'Reducing Cart Abandonment', category: 'Optimization', views: '7.9K' },
  { title: 'API Authentication', category: 'API', views: '6.1K' },
  { title: 'Improving Page Speed', category: 'Optimization', views: '5.8K' },
];

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="info" size="lg" className="mb-6">
                Documentation
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Help Center & Guides
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Everything you need to know about using RevenueRescue to grow your Shopify store
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    className="w-full px-6 py-4 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Docs */}
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Most Popular</h2>
                <Badge variant="success">Trending</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularDocs.slice(0, 3).map((doc, idx) => (
                  <Card key={idx} hover>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="neutral" size="sm">
                        {doc.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{doc.views} views</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1 hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, idx) => (
                  <Card key={idx} hover className="h-full">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-gray-400 text-sm mb-6">{category.description}</p>

                    <div className="space-y-3">
                      {category.docs.map((doc, docIdx) => (
                        <div key={docIdx} className="group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors mb-1">
                                {doc.title}
                              </h4>
                              <p className="text-gray-500 text-xs">{doc.description}</p>
                            </div>
                            <span className="text-xs text-gray-600 ml-2">{doc.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <a href="#" className="text-primary hover:text-primary-light text-sm font-semibold">
                        View all {category.docs.length} articles →
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Quick Links</h2>
                <p className="text-gray-400">Frequently accessed resources</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card hover className="text-center">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                  <a href="/api-info" className="text-primary hover:text-primary-light text-sm">
                    View docs →
                  </a>
                </Card>

                <Card hover className="text-center">
                  <div className="text-3xl mb-3">💬</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Support</h3>
                  <a href="/contact" className="text-primary hover:text-primary-light text-sm">
                    Get help →
                  </a>
                </Card>

                <Card hover className="text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">System Status</h3>
                  <a href="/status" className="text-primary hover:text-primary-light text-sm">
                    Check status →
                  </a>
                </Card>

                <Card hover className="text-center">
                  <div className="text-3xl mb-3">📖</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Blog</h3>
                  <a href="/blog" className="text-primary hover:text-primary-light text-sm">
                    Read articles →
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Video Tutorials</h2>
                <p className="text-gray-400">Learn by watching</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-5xl">▶️</div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Getting Started (5:23)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Complete walkthrough of setting up your first audit
                  </p>
                </Card>

                <Card hover>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-5xl">▶️</div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Understanding Metrics (8:15)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Deep dive into what each metric means for your revenue
                  </p>
                </Card>

                <Card hover>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-5xl">▶️</div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Optimization Tips (12:45)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Actionable strategies to improve your health score
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our support team is here to help you succeed
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
                >
                  Contact Support
                </a>
                <a
                  href="/signup"
                  className="px-8 py-4 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all"
                >
                  Start Free Trial
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
