'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Enter Store URL',
      description: 'Simply paste your Shopify store URL or connect via OAuth for deeper insights.',
      icon: '🔗',
    },
    {
      number: '02',
      title: 'AI Analyzes 15+ Factors',
      description: 'Our engine checks performance, conversion, mobile usability, and revenue impact in under 60 seconds.',
      icon: '🤖',
    },
    {
      number: '03',
      title: 'Get Actionable Report',
      description: 'Receive prioritized fixes with revenue impact estimates and step-by-step instructions.',
      icon: '📊',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get your complete store audit in 3 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" style={{ top: '120px' }} />

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Step Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 relative z-10">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl mb-6 relative">
                    {step.number}
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-4">{step.icon}</div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-block bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to discover what's holding back your revenue?
            </h3>
            <p className="text-gray-400 mb-6">
              Join 10,000+ Shopify store owners who've recovered lost revenue
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-glow-primary text-lg">
              Start Your Free Audit Now →
            </button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
