'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const rights = [
  {
    title: 'Right to Access',
    icon: '🔍',
    description: 'Request a copy of all personal data we hold about you',
    action: 'Request My Data',
  },
  {
    title: 'Right to Rectification',
    icon: '✏️',
    description: 'Correct any inaccurate or incomplete personal data',
    action: 'Update My Data',
  },
  {
    title: 'Right to Erasure',
    icon: '🗑️',
    description: 'Request deletion of your personal data ("right to be forgotten")',
    action: 'Delete My Data',
  },
  {
    title: 'Right to Restriction',
    icon: '⏸️',
    description: 'Limit how we process your personal data',
    action: 'Restrict Processing',
  },
  {
    title: 'Right to Portability',
    icon: '📦',
    description: 'Receive your data in a structured, machine-readable format',
    action: 'Export My Data',
  },
  {
    title: 'Right to Object',
    icon: '🛑',
    description: 'Object to processing of your data for marketing or other purposes',
    action: 'Object to Processing',
  },
];

export default function GDPRPage() {
  const [formData, setFormData] = useState({
    requestType: '',
    name: '',
    email: '',
    details: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ requestType: '', name: '', email: '', details: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="success" size="lg" className="mb-6">
                Your Privacy Rights
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  GDPR Compliance & Data Rights
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                We're committed to protecting your privacy and giving you control over your data.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <h2 className="text-2xl font-bold text-white mb-4">What is GDPR?</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    The General Data Protection Regulation (GDPR) is a comprehensive data protection law that gives you control over your personal data. It applies to all companies processing data of individuals in the European Union.
                  </p>
                  <p>
                    RevenueRescue is fully GDPR compliant. We've implemented strict data protection measures and respect all your privacy rights.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Your Data Rights</h2>
                <p className="text-gray-400">
                  Under GDPR, you have the following rights regarding your personal data
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {rights.map((right, idx) => (
                  <Card key={idx} hover>
                    <div className="text-4xl mb-3">{right.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{right.title}</h3>
                    <p className="text-gray-400 mb-4">{right.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How We Protect Your Data */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">How We Protect Your Data</h2>
                <p className="text-gray-400">Our commitment to data security</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-primary">🔒</span> Encryption
                  </h3>
                  <p className="text-gray-400 text-sm">
                    All data is encrypted in transit (SSL/TLS) and at rest (AES-256). Your information is always protected.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-primary">🛡️</span> Access Controls
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Strict access controls ensure only authorized personnel can access your data, and only when necessary.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-primary">📝</span> Data Minimization
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We only collect data that's necessary for our service. No unnecessary or excessive data collection.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-primary">⏱️</span> Retention Limits
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Data is only kept as long as needed. Automatic deletion after account closure (30-90 days).
                  </p>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-primary">🔍</span> Regular Audits
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We conduct regular security audits and penetration testing to identify and fix vulnerabilities.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-primary">📋</span> DPAs with Vendors
                  </h3>
                  <p className="text-gray-400 text-sm">
                    All third-party vendors sign Data Processing Agreements to ensure they protect your data.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise Your Rights */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Exercise Your Rights</h2>
                <p className="text-gray-400">
                  Submit a request to access, modify, or delete your personal data
                </p>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                {submitted && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 font-semibold">
                      Thank you! We've received your request and will respond within 30 days as required by GDPR.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Type of Request *
                    </label>
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                      <option value="">Select a request type</option>
                      <option value="access">Right to Access - Request my data</option>
                      <option value="rectification">Right to Rectification - Correct my data</option>
                      <option value="erasure">Right to Erasure - Delete my data</option>
                      <option value="restriction">Right to Restriction - Limit processing</option>
                      <option value="portability">Right to Portability - Export my data</option>
                      <option value="object">Right to Object - Stop processing</option>
                      <option value="other">Other GDPR Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      placeholder="your@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Must match the email associated with your RevenueRescue account
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Additional Details
                    </label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
                      placeholder="Provide any additional details about your request..."
                    />
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400">
                      <strong className="text-white">Response Time:</strong> We will respond to your request within 30 days, as required by GDPR. You may be asked to verify your identity before we process your request.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting Request...' : 'Submit GDPR Request'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center">
                    Or email us directly at{' '}
                    <a href="mailto:privacy@revenuerescue.com" className="text-primary hover:text-primary-light">
                      privacy@revenuerescue.com
                    </a>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Common Questions</h2>
              </div>

              <div className="space-y-4">
                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    How long does it take to process a GDPR request?
                  </h3>
                  <p className="text-gray-400">
                    We respond to all GDPR requests within 30 days, as required by law. Complex requests may take longer, but we'll keep you informed.
                  </p>
                </Card>

                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Do I need to pay to access my data?
                  </h3>
                  <p className="text-gray-400">
                    No. Exercising your GDPR rights is completely free. We never charge for data access, portability, or deletion requests.
                  </p>
                </Card>

                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What happens when I request data deletion?
                  </h3>
                  <p className="text-gray-400">
                    We will permanently delete all your personal data within 30 days, except data we're legally required to retain (e.g., payment records for tax purposes).
                  </p>
                </Card>

                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Can I download all my data?
                  </h3>
                  <p className="text-gray-400">
                    Yes. You can request a complete export of your data in machine-readable formats (JSON, CSV, PDF) under the right to data portability.
                  </p>
                </Card>

                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Who is your Data Protection Officer?
                  </h3>
                  <p className="text-gray-400">
                    You can contact our Data Protection Officer at privacy@revenuerescue.com for any privacy concerns or questions.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
                  <a href="/privacy" className="text-primary hover:text-primary-light">
                    Read full policy →
                  </a>
                </Card>
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie Policy</h3>
                  <a href="/cookies" className="text-primary hover:text-primary-light">
                    Manage cookies →
                  </a>
                </Card>
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                  <a href="/contact" className="text-primary hover:text-primary-light">
                    Get in touch →
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
