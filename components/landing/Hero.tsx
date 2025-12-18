'use client';

import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    // Validate URL
    if (!storeUrl.trim()) {
      setError('Please enter a store URL');
      return;
    }

    console.log('[Hero] Starting audit for:', storeUrl.trim());
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeUrl: storeUrl.trim() }),
      });

      const data = await response.json();
      console.log('[Hero] Audit response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run audit');
      }

      console.log('[Hero] Redirecting to:', `/audit/${data.audit.id}`);
      // Redirect immediately - results page has retry logic to handle timing
      router.push(`/audit/${data.audit.id}`);
    } catch (err) {
      console.error('[Hero] Audit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run audit');
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 mt-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-primary-light font-medium">
              Trusted by 10,000+ Shopify stores
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fadeInUp">
            Recover Lost Revenue
            <br />
            <span className="gradient-text">
              From Your Shopify Store
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Get a complete audit of your store's performance, conversion issues, and revenue leaks.
            <span className="text-white font-semibold"> Fix what's costing you money.</span>
          </p>

          {/* Audit Input */}
          <div className="max-w-2xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-gray-800 rounded-xl border border-gray-700">
              <input
                type="text"
                placeholder="Enter your store URL (e.g., mystore.myshopify.com)"
                value={storeUrl}
                onChange={(e) => {
                  setStoreUrl(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleAudit();
                  }
                }}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
              />
              <Button
                size="lg"
                onClick={handleAudit}
                disabled={loading}
                className="whitespace-nowrap min-w-[180px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader size="sm" />
                    Analyzing...
                  </span>
                ) : (
                  'Start Free Audit'
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-400 mt-3">
                ⚠️ {error}
              </p>
            )}
            {!error && (
              <p className="text-sm text-gray-500 mt-3">
                ✓ Free forever • ✓ No credit card required • ✓ Results in 60 seconds
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Button variant="outline" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-16 border-t border-gray-800 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400 text-sm">Stores Audited</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2.5M+</div>
                <div className="text-gray-400 text-sm">Revenue Recovered</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-gray-400 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
    </section>
  );
}
