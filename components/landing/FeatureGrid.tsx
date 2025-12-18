'use client';

import Card from '@/components/shared/Card';

const features = [
  // Performance & Speed (5 features)
  {
    category: 'Performance & Speed',
    icon: '⚡',
    title: 'Overall Store Health Score',
    description: 'Get an A-F grade with detailed breakdown of all performance metrics.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    category: 'Performance & Speed',
    icon: '🚀',
    title: 'Page Load Speed Analysis',
    description: 'Desktop and mobile speed metrics with specific recommendations.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    category: 'Performance & Speed',
    icon: '📊',
    title: 'Core Web Vitals (LCP)',
    description: 'Real user experience metrics that impact your Google rankings.',
    color: 'from-green-500 to-teal-500',
  },
  {
    category: 'Performance & Speed',
    icon: '🖼️',
    title: 'Image Optimization Scanner',
    description: 'Find oversized images with compression savings calculator.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    category: 'Performance & Speed',
    icon: '🔌',
    title: 'Unused App Detector',
    description: 'Identify apps slowing your store with performance impact scores.',
    color: 'from-red-500 to-orange-500',
  },

  // Conversion Killers (5 features)
  {
    category: 'Conversion Killers',
    icon: '🛡️',
    title: 'Missing Trust Signals',
    description: 'Check SSL, reviews, return policy visibility, and security badges.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    category: 'Conversion Killers',
    icon: '🛒',
    title: 'Checkout Speed Analysis',
    description: 'Time to complete checkout vs industry average benchmarks.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    category: 'Conversion Killers',
    icon: '📱',
    title: 'Mobile Usability Score',
    description: 'Touch targets, form fields, and mobile readability analysis.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    category: 'Conversion Killers',
    icon: '🔗',
    title: 'Broken Link Detector',
    description: 'Find all internal and external broken links hurting your SEO.',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    category: 'Conversion Killers',
    icon: '✅',
    title: 'Product Page Completeness',
    description: 'Missing descriptions, images, prices, and required elements.',
    color: 'from-emerald-500 to-green-500',
  },

  // Revenue Impact (3 features)
  {
    category: 'Revenue Impact',
    icon: '💰',
    title: 'Revenue Recovery Calculator',
    description: 'See exactly how much money you\'re losing from each issue.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    category: 'Revenue Impact',
    icon: '🛍️',
    title: 'Cart Abandonment Detector',
    description: 'Identify reasons: shipping costs, load speed, or trust issues.',
    color: 'from-orange-500 to-red-500',
  },
  {
    category: 'Revenue Impact',
    icon: '📈',
    title: 'Conversion Rate Benchmark',
    description: 'Compare your 2.3% vs industry average 3.8% conversion rate.',
    color: 'from-blue-500 to-indigo-500',
  },

  // Actionable Insights (2 features)
  {
    category: 'Actionable Insights',
    icon: '🎯',
    title: 'Priority Fix List',
    description: 'Ranked by revenue impact with effort estimates for each fix.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    category: 'Actionable Insights',
    icon: '📄',
    title: 'One-Click PDF Export',
    description: 'Professional report with all findings, ready to share with your team.',
    color: 'from-sky-500 to-blue-500',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            15 Core Features to
            <span className="gradient-text"> Maximize Revenue</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our comprehensive audit engine analyzes every aspect of your store
            to identify hidden revenue opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="group"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Icon with gradient background */}
              <div className="mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} text-2xl`}>
                  {feature.icon}
                </div>
              </div>

              {/* Category Badge */}
              <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                {feature.category}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">
            All features included in every paid plan
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-glow-primary">
              Start Free Audit
            </button>
            <button className="px-8 py-3 border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary font-semibold rounded-lg transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
