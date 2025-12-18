import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';

const steps = [
  {
    number: '01',
    title: 'Enter Your Store URL',
    description: 'Simply paste your Shopify store URL or connect via OAuth for deeper insights into your store\'s backend settings and configurations.',
    icon: '🔗',
    details: [
      'Works with any public Shopify store',
      'OAuth integration for authenticated stores',
      'Secure connection with encrypted tokens',
      'No installation required',
    ],
    image: '🖥️',
  },
  {
    number: '02',
    title: 'AI Analyzes 15+ Factors',
    description: 'Our advanced audit engine checks performance, conversion, mobile usability, and revenue impact across your entire store in under 60 seconds.',
    icon: '🤖',
    details: [
      'Performance metrics (Core Web Vitals)',
      'Conversion optimization analysis',
      'Mobile usability testing',
      'Revenue leak detection',
      'Competitor benchmarking',
    ],
    image: '📊',
  },
  {
    number: '03',
    title: 'Get Actionable Report',
    description: 'Receive a prioritized list of fixes ranked by revenue impact, with step-by-step instructions and estimated monthly savings.',
    icon: '📄',
    details: [
      'A-F overall health score',
      'Priority fixes by revenue impact',
      'Instant wins (< 5 min fixes)',
      'Detailed recommendations',
      'One-click PDF export',
    ],
    image: '✅',
  },
];

const processDetails = [
  {
    phase: 'Data Collection',
    duration: '10-15 seconds',
    description: 'We fetch your store pages, analyze HTML/CSS, check images, and test mobile responsiveness.',
    checks: [
      'Homepage analysis',
      'Product page scanning',
      'Checkout flow testing',
      'Mobile viewport check',
      'Asset loading analysis',
    ],
  },
  {
    phase: 'Performance Analysis',
    duration: '15-20 seconds',
    description: 'Using Google Lighthouse and custom algorithms, we measure real-world performance metrics.',
    checks: [
      'Core Web Vitals (LCP, FID, CLS)',
      'Page load speed',
      'Time to Interactive',
      'Total Blocking Time',
      'Image optimization',
    ],
  },
  {
    phase: 'Conversion Audit',
    duration: '15-20 seconds',
    description: 'We identify conversion blockers and trust issues that prevent visitors from becoming customers.',
    checks: [
      'Trust signal detection',
      'Broken link scanning',
      'Form usability testing',
      'CTA effectiveness',
      'Mobile tap targets',
    ],
  },
  {
    phase: 'Revenue Calculation',
    duration: '10-15 seconds',
    description: 'Our proprietary algorithm calculates the financial impact of each issue based on your traffic and industry benchmarks.',
    checks: [
      'Traffic estimation',
      'Conversion rate analysis',
      'Cart abandonment factors',
      'Revenue loss calculation',
      'ROI projections',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                How
                <span className="gradient-text"> RevenueRescue </span>
                Works
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Get a comprehensive audit of your Shopify store in 3 simple steps.
                No technical knowledge required.
              </p>
              <div className="inline-flex items-center gap-3 bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-semibold">Complete audit in under 60 seconds</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-24">
              {steps.map((step, idx) => (
                <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl mb-6">
                      {step.number}
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{step.title}</h2>
                    <p className="text-xl text-gray-400 mb-6">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="flex items-start">
                          <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 p-12">
                      <div className="text-center">
                        <div className="text-9xl mb-4">{step.image}</div>
                        <div className="text-6xl">{step.icon}</div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Details */}
        <section className="py-20 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Behind the Scenes</h2>
              <p className="text-xl text-gray-400">
                Here's what happens during your 60-second audit
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {processDetails.map((phase, idx) => (
                <Card key={idx} hover className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-8xl font-bold text-gray-700/10">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                      <span className="text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-6">{phase.description}</p>
                    <ul className="space-y-2">
                      {phase.checks.map((check, checkIdx) => (
                        <li key={checkIdx} className="flex items-center text-sm text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></span>
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">What You Get</h2>
              <p className="text-xl text-gray-400">
                Every audit includes these comprehensive insights
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-3">Overall Health Score</h3>
                <p className="text-gray-400">
                  A-F grade with detailed breakdown of performance, conversion, and mobile scores.
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-3">Revenue Impact</h3>
                <p className="text-gray-400">
                  Exact monthly revenue loss calculations for each identified issue.
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Priority Fixes</h3>
                <p className="text-gray-400">
                  Ranked action items by revenue impact with implementation difficulty.
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3">Instant Wins</h3>
                <p className="text-gray-400">
                  Quick fixes you can implement in under 5 minutes for immediate results.
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-3">Benchmarking</h3>
                <p className="text-gray-400">
                  Compare your store against industry averages and similar stores.
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-xl font-bold mb-3">PDF Report</h3>
                <p className="text-gray-400">
                  Professional exportable report to share with your team or developers.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to See What's Holding Back Your Revenue?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Start your free audit now. No credit card required.
              </p>
              <a href="/signup">
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-glow-primary text-lg">
                  Start Free Audit Now →
                </button>
              </a>
              <p className="text-sm text-gray-500 mt-4">
                Join 10,000+ Shopify store owners • Results in 60 seconds
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
