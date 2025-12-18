'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import { useAuth } from '@/hooks/useAuth';

export default function NewAuditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [storeUrl, setStoreUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const handleStartAudit = async () => {
    // Validate URL
    if (!storeUrl.trim()) {
      setError('Please enter a store URL');
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    if (!urlPattern.test(storeUrl.trim())) {
      setError('Please enter a valid store URL');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(10);
    setProgressMessage('Initializing audit...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });

        // Update messages based on progress
        setProgressMessage((prev) => {
          const messages = [
            'Fetching store data...',
            'Analyzing performance...',
            'Checking conversion factors...',
            'Calculating revenue impact...',
            'Generating recommendations...',
            'Finalizing report...',
          ];
          const index = Math.min(Math.floor(progress / 15), messages.length - 1);
          return messages[index];
        });
      }, 2000);

      console.log('[New Audit] Starting audit for:', storeUrl.trim(), 'User:', user?.id);

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeUrl: storeUrl.trim(),
          userId: user?.id,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Complete!');

      const data = await response.json();
      console.log('[New Audit] Audit response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run audit');
      }

      console.log('[New Audit] Redirecting to:', `/audit/${data.audit.id}`);

      // Redirect to audit results page
      // Note: The results page has retry logic to handle any race conditions
      router.push(`/audit/${data.audit.id}`);
    } catch (err) {
      console.error('[New Audit] Audit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run audit');
      setLoading(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleStartAudit();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Run New Audit</h1>
          <p className="text-gray-400">
            Analyze your Shopify store and discover revenue optimization opportunities
          </p>
        </div>

        {/* Main Audit Card */}
        <Card className="mb-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Enter Your Store URL
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              We'll analyze your store's performance, conversion optimization, and identify
              potential revenue leaks. The audit typically takes 30-60 seconds.
            </p>

            {/* URL Input */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-gray-700 rounded-xl border border-gray-600">
                <input
                  type="text"
                  placeholder="mystore.myshopify.com or mystore.com"
                  value={storeUrl}
                  onChange={(e) => {
                    setStoreUrl(e.target.value);
                    setError(null);
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
                  autoFocus
                />
                <Button
                  size="lg"
                  onClick={handleStartAudit}
                  disabled={loading || !storeUrl.trim()}
                  className="whitespace-nowrap min-w-[180px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader size="sm" />
                      Analyzing...
                    </span>
                  ) : (
                    'Start Audit'
                  )}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Progress Bar */}
              {loading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{progressMessage}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Info Text */}
            {!loading && !error && (
              <p className="text-sm text-gray-500 mt-4">
                ✓ Free for all users • ✓ No installation required • ✓ Instant results
              </p>
            )}
          </div>
        </Card>

        {/* What We Analyze */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
                <p className="text-sm text-gray-400">
                  Page load times, Core Web Vitals, image optimization, and speed issues
                  that affect conversions
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Conversion</h3>
                <p className="text-sm text-gray-400">
                  Trust signals, mobile usability, checkout flow, and factors that impact
                  your conversion rate
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Revenue Impact</h3>
                <p className="text-sm text-gray-400">
                  Calculate potential monthly revenue loss and recovery opportunities from
                  optimization issues
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
                <p className="text-sm text-gray-400">
                  Actionable steps prioritized by impact, with clear instructions to fix
                  each issue
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Audits */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl">
              📊
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">View Past Audits</h3>
              <p className="text-sm text-gray-400">
                Check your audit history to track improvements over time
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/history')}
              className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors"
            >
              View History
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
