import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const blogPosts = [
  {
    id: 1,
    title: '10 Silent Revenue Killers Lurking in Your Shopify Store',
    excerpt: 'Most store owners focus on traffic, but ignore the leaks costing them thousands monthly. Here are the hidden issues killing your revenue.',
    category: 'Revenue Optimization',
    date: 'December 20, 2024',
    readTime: '8 min read',
    author: 'Alex Thompson',
    featured: true,
  },
  {
    id: 2,
    title: 'How to Reduce Cart Abandonment by 50% in 30 Days',
    excerpt: 'Cart abandonment is the #1 revenue killer for e-commerce. Learn the exact strategies that helped our customers cut it in half.',
    category: 'Conversion Optimization',
    date: 'December 15, 2024',
    readTime: '6 min read',
    author: 'Sarah Chen',
    featured: true,
  },
  {
    id: 3,
    title: 'The True Cost of a 1-Second Page Load Delay',
    excerpt: 'Page speed impacts more than just UX. We analyzed 1,000 stores to quantify exactly how much slow pages cost you.',
    category: 'Performance',
    date: 'December 10, 2024',
    readTime: '5 min read',
    author: 'Michael Rodriguez',
    featured: true,
  },
  {
    id: 4,
    title: 'Mobile Commerce: Why 60% of Your Revenue is at Risk',
    excerpt: 'Mobile traffic is up, but mobile conversions lag. Here\'s how to optimize your store for mobile shoppers.',
    category: 'Mobile Optimization',
    date: 'December 5, 2024',
    readTime: '7 min read',
    author: 'Emily Johnson',
    featured: false,
  },
  {
    id: 5,
    title: 'A/B Testing That Actually Moves Revenue (Not Just Metrics)',
    excerpt: 'Stop testing button colors. Learn how to run experiments that impact your bottom line.',
    category: 'Testing & Analytics',
    date: 'November 28, 2024',
    readTime: '9 min read',
    author: 'Alex Thompson',
    featured: false,
  },
  {
    id: 6,
    title: 'Checkout Optimization: The Ultimate Guide',
    excerpt: 'Your checkout is where revenue lives or dies. Optimize every step with this comprehensive guide.',
    category: 'Conversion Optimization',
    date: 'November 20, 2024',
    readTime: '12 min read',
    author: 'Sarah Chen',
    featured: false,
  },
  {
    id: 7,
    title: 'Trust Signals That Actually Increase Conversions',
    excerpt: 'Not all trust badges are created equal. Learn which ones actually drive sales.',
    category: 'Conversion Optimization',
    date: 'November 15, 2024',
    readTime: '6 min read',
    author: 'Emily Johnson',
    featured: false,
  },
  {
    id: 8,
    title: 'How to Use Data to Predict Revenue Trends',
    excerpt: 'Stop reacting to problems. Use predictive analytics to stay ahead of revenue dips.',
    category: 'Analytics',
    date: 'November 10, 2024',
    readTime: '8 min read',
    author: 'Michael Rodriguez',
    featured: false,
  },
  {
    id: 9,
    title: 'The Psychology of Pricing for E-commerce',
    excerpt: 'Pricing isn\'t just math—it\'s psychology. Learn strategies that maximize revenue per visitor.',
    category: 'Pricing Strategy',
    date: 'November 5, 2024',
    readTime: '10 min read',
    author: 'Alex Thompson',
    featured: false,
  },
];

const categories = [
  'All Posts',
  'Revenue Optimization',
  'Conversion Optimization',
  'Performance',
  'Analytics',
  'Mobile Optimization',
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="info" size="lg" className="mb-6">
                Blog
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  E-commerce Insights That Drive Revenue
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Actionable strategies, case studies, and data-driven insights to help you grow your Shopify store.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-gray-800/30 sticky top-20 z-40 backdrop-blur-lg border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {categories.map((category, idx) => (
                <Badge
                  key={idx}
                  variant={idx === 0 ? 'info' : 'neutral'}
                  className="cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Featured Articles</h2>
                <p className="text-gray-400">Our most popular and impactful content</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {blogPosts.filter(post => post.featured).map((post) => (
                  <Card key={post.id} hover className="flex flex-col">
                    <Badge variant="success" size="sm" className="mb-4 self-start">
                      Featured
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-700">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* All Posts */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Latest Articles</h2>
                <p className="text-gray-400">Stay updated with our newest insights</p>
              </div>

              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} hover>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="neutral" size="sm">
                            {post.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{post.date}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.readTime}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-4">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <div className="md:flex-shrink-0">
                        <button className="px-6 py-3 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all whitespace-nowrap">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Newsletter Signup */}
              <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Get Revenue Insights Delivered Weekly
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Join 5,000+ store owners getting actionable tips to increase revenue.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
