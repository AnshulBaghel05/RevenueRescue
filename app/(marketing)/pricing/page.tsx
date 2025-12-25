'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Loader from '@/components/shared/Loader';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for testing the waters',
    badge: null,
    popular: false,
    auditsLimit: 3,
    features: [
      { name: '3 audits per month', included: true },
      { name: 'Basic health score (A-F)', included: true },
      { name: 'Performance & conversion analysis', included: true },
      { name: 'Revenue impact calculator', included: true },
      { name: 'Basic recommendations', included: true },
      { name: 'Community support', included: true },
      { name: 'Trend analysis', included: false },
      { name: 'PDF export', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Current Plan',
    ctaDisabled: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'For serious store owners',
    badge: 'Most Popular',
    popular: true,
    auditsLimit: 16,
    features: [
      { name: '16 audits per month', included: true },
      { name: 'All Free features', included: true },
      { name: 'Trend analysis & insights', included: true },
      { name: 'Compare audits', included: true },
      { name: 'Priority recommendations', included: true },
      { name: 'PDF export reports', included: true },
      { name: 'Email support', included: true },
      { name: 'Automated weekly audits', included: false },
      { name: 'Custom branding', included: false },
    ],
    cta: 'Upgrade to Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    period: 'month',
    description: 'For growing businesses',
    badge: 'Best Value',
    popular: false,
    auditsLimit: 30,
    features: [
      { name: '30 audits per month', included: true },
      { name: 'All Starter features', included: true },
      { name: 'Advanced Analytics Dashboard', included: true },
      { name: 'Predictive score forecasting', included: true },
      { name: 'AI-powered insights', included: true },
      { name: 'PDF export with custom branding', included: true },
      { name: 'Data export (CSV/JSON)', included: true },
      { name: 'Priority support', included: true },
      { name: 'Weekly automated audits (Coming Soon)', included: true },
      { name: 'Email alerts (Coming Soon)', included: true },
    ],
    cta: 'Upgrade to Pro',
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your subscription at any time from your dashboard settings. Your subscription will remain active until the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, and net banking through our secure payment partner Razorpay. All transactions are encrypted and secure.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and we\'ll prorate the difference.',
  },
  {
    question: 'How do audit credits work?',
    answer: 'Each plan comes with a monthly allocation of audits. Free tier gets 3/month, Starter gets 16/month, and Pro gets 30/month. Credits reset at the start of each billing cycle.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! All new users start with 3 free audits. You can test the platform before committing to a paid plan.',
  },
  {
    question: 'What happens if I run out of audits?',
    answer: 'You can upgrade your plan at any time to get more audits. Your new limit will be available immediately.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (planId === 'free') {
      return; // Already on free plan
    }

    setLoading(planId);

    try {
      // Create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: data.razorpayKeyId,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'RevenueRescue',
          description: `Subscribe to ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
          order_id: data.order.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planType: planId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              router.push('/dashboard?payment=success');
            } else {
              router.push('/dashboard?payment=failed');
            }
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: '#2B44E7',
          },
          modal: {
            ondismiss: function () {
              setLoading(null);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(null);
    }
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
                Pricing
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Simple, Transparent Pricing
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Start free, upgrade when you're ready. Cancel anytime, no questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative ${
                      plan.popular
                        ? 'border-primary shadow-glow-primary scale-105'
                        : ''
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge variant="success">{plan.badge}</Badge>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-end justify-center gap-1">
                        <span className="text-gray-400">$</span>
                        <span className="text-5xl font-bold text-white">
                          {plan.price}
                        </span>
                        <span className="text-gray-400 mb-2">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className={`text-xl flex-shrink-0 ${
                              feature.included ? 'text-green-400' : 'text-gray-600'
                            }`}
                          >
                            {feature.included ? '✓' : '✗'}
                          </span>
                          <span
                            className={
                              feature.included ? 'text-gray-300' : 'text-gray-600'
                            }
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading !== null || plan.ctaDisabled}
                      className={`w-full py-4 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white shadow-lg hover:shadow-glow-primary'
                          : plan.ctaDisabled
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader size="sm" />
                          Processing...
                        </span>
                      ) : (
                        plan.cta
                      )}
                    </button>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-400">
                  All plans include secure payments, instant access, and email support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-400">
                  Everything you need to know about pricing and billing
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <Card key={idx} hover>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-400 mb-4">
                  Still have questions?
                </p>
                <a
                  href="mailto:support@revenuerescue.com"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  Contact our support team →
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
