'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const contactMethods = [
  {
    title: 'Email Support',
    description: 'Get a response within 24 hours',
    icon: '📧',
    contact: 'support@revenuerescue.com',
    link: 'mailto:support@revenuerescue.com',
  },
  {
    title: 'Sales Inquiries',
    description: 'Questions about plans or enterprise?',
    icon: '💼',
    contact: 'sales@revenuerescue.com',
    link: 'mailto:sales@revenuerescue.com',
  },
  {
    title: 'Live Chat',
    description: 'Available Mon-Fri, 9am-6pm EST',
    icon: '💬',
    contact: 'Click to start chat',
    link: '#',
  },
  {
    title: 'Documentation',
    description: 'Browse our help center',
    icon: '📚',
    contact: 'View docs',
    link: '/docs',
  },
];

const faqs = [
  {
    question: 'How quickly will I get a response?',
    answer: 'We typically respond to all inquiries within 24 hours during business days. Priority support customers (Pro plan) receive responses within 4 hours.',
  },
  {
    question: 'Do you offer phone support?',
    answer: 'Currently, we provide support via email and live chat. For enterprise customers, we can arrange dedicated phone support.',
  },
  {
    question: 'Can I schedule a demo?',
    answer: 'Absolutely! Email sales@revenuerescue.com or use the contact form below to schedule a personalized demo of RevenueRescue.',
  },
  {
    question: 'Where are you located?',
    answer: 'Our team is distributed globally, with headquarters in San Francisco, CA. We serve customers worldwide.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
      setFormData({ name: '', email: '', subject: '', message: '' });

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
              <Badge variant="info" size="lg" className="mb-6">
                Contact Us
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  We're Here to Help
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Have questions about RevenueRescue? Need help with your account? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactMethods.map((method, idx) => (
                  <Card key={idx} hover className="text-center">
                    <div className="text-4xl mb-3">{method.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{method.description}</p>
                    <a
                      href={method.link}
                      className="text-primary hover:text-primary-light transition-colors font-semibold"
                    >
                      {method.contact}
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
                  <Card>
                    {submitted && (
                      <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400 font-semibold">
                          Thank you! We've received your message and will get back to you soon.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Email *
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
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales & Pricing</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </Card>
                </div>

                {/* Company Info & FAQs */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Company Information</h2>
                  <Card className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">RevenueRescue</h3>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start gap-3">
                        <span className="text-primary">📍</span>
                        <div>
                          <div className="font-semibold text-white mb-1">Headquarters</div>
                          <div className="text-gray-400">
                            123 Market Street, Suite 400<br />
                            San Francisco, CA 94103<br />
                            United States
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary">📧</span>
                        <div>
                          <div className="font-semibold text-white mb-1">Email</div>
                          <a href="mailto:support@revenuerescue.com" className="text-primary hover:text-primary-light">
                            support@revenuerescue.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary">🕐</span>
                        <div>
                          <div className="font-semibold text-white mb-1">Business Hours</div>
                          <div className="text-gray-400">
                            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                            Saturday - Sunday: Closed
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <h3 className="text-2xl font-bold text-white mb-4">Quick Answers</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <Card key={idx} hover>
                        <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                        <p className="text-gray-400 text-sm">{faq.answer}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Prefer to See It in Action?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start your free audit now and experience RevenueRescue firsthand.
              </p>
              <a
                href="/signup"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
              >
                Start Free Audit
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
