import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const team = [
  {
    name: 'Alex Thompson',
    role: 'Founder & CEO',
    bio: 'Former Shopify merchant who lost $100K+ to preventable issues. Built RevenueRescue to help others avoid the same mistakes.',
    initials: 'AT',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    bio: 'E-commerce performance expert with 10+ years optimizing high-traffic stores. Previously at Shopify and Amazon.',
    initials: 'SC',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Product',
    bio: 'Data scientist passionate about making complex analytics accessible. Built ML models for Fortune 500 retailers.',
    initials: 'MR',
  },
  {
    name: 'Emily Johnson',
    role: 'Head of Customer Success',
    bio: 'Helped 500+ store owners recover millions in lost revenue. Expert in conversion optimization and UX.',
    initials: 'EJ',
  },
];

const values = [
  {
    title: 'Merchant-First',
    description: 'Built by merchants, for merchants. Every feature solves a real problem we\'ve experienced.',
    icon: '🛍️',
  },
  {
    title: 'Actionable Insights',
    description: 'No vanity metrics. We only show you data that directly impacts your bottom line.',
    icon: '📊',
  },
  {
    title: 'Transparency',
    description: 'Clear pricing, honest results, no hidden fees. We succeed when you succeed.',
    icon: '💎',
  },
  {
    title: 'Continuous Innovation',
    description: 'We\'re constantly improving based on merchant feedback and e-commerce trends.',
    icon: '🚀',
  },
];

const milestones = [
  { year: '2023', event: 'Founded by frustrated Shopify merchant', metric: '1 store audited' },
  { year: '2023', event: 'Launched beta with 50 stores', metric: '$2M recovered' },
  { year: '2024', event: 'Reached 500+ active merchants', metric: '$15M recovered' },
  { year: '2024', event: 'Introduced AI-powered insights', metric: '10K+ audits run' },
  { year: '2025', event: 'Helping 2,000+ stores worldwide', metric: '$50M+ recovered' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="info" size="lg" className="mb-6">
                About Us
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  We're On a Mission to Stop Revenue Leaks
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Every day, thousands of Shopify stores lose money to preventable issues.
                We're changing that with actionable insights that actually move the needle.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    RevenueRescue was born from frustration. In 2023, our founder Alex was running a successful
                    Shopify store generating $50K/month. Everything seemed fine—until he dug into the data.
                  </p>
                  <p>
                    His cart abandonment rate was 82%. Page load times were killing mobile conversions.
                    Checkout friction was costing him over $100,000 annually. The worst part? He had no idea
                    until it was too late.
                  </p>
                  <p>
                    After fixing these issues, revenue jumped 3x in just 4 months. Alex realized that most
                    Shopify merchants were flying blind—losing money to problems they couldn't see.
                  </p>
                  <p>
                    That's why we built RevenueRescue: to give every store owner the insights they need to
                    stop leaving money on the table. We've since helped over 2,000 merchants recover more than
                    $50 million in lost revenue.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
                <p className="text-gray-400">The principles that guide everything we do</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, idx) => (
                  <Card key={idx} hover>
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Meet the Team</h2>
                <p className="text-gray-400">
                  E-commerce veterans passionate about helping merchants succeed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, idx) => (
                  <Card key={idx} hover className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
                      {member.initials}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <Badge variant="info" size="sm" className="mb-4">
                      {member.role}
                    </Badge>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
                <p className="text-gray-400">Key milestones in our mission to help merchants</p>
              </div>

              <div className="space-y-6">
                {milestones.map((milestone, idx) => (
                  <Card key={idx} hover>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <Badge variant="success" size="lg">
                          {milestone.year}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {milestone.event}
                        </h3>
                        <p className="text-primary font-semibold">{milestone.metric}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">2,000+</div>
                  <div className="text-gray-400">Active Merchants</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
                  <div className="text-gray-400">Revenue Recovered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-gray-400">Audits Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">94%</div>
                  <div className="text-gray-400">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Thousands of Successful Merchants
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Stop losing revenue to preventable issues. Get your first audit free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
                >
                  Start Your Free Audit
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all"
                >
                  Contact Us
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
