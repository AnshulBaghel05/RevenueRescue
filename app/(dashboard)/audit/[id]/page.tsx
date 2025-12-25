'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScoreCard from '@/components/audit/ScoreCard';
import IssueCard from '@/components/audit/IssueCard';
import RecommendationCard from '@/components/audit/RecommendationCard';
import Loader from '@/components/shared/Loader';
import Badge from '@/components/shared/Badge';
import type { AuditResult } from '@/lib/audit/types';
import { formatCurrency } from '@/lib/audit/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AuditResultPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');

  useEffect(() => {
    async function fetchAudit() {
      console.log('[Audit Results] Fetching audit:', resolvedParams.id);

      // Retry logic - sometimes database save takes a moment
      let retries = 3;
      let lastError = null;

      for (let i = 0; i < retries; i++) {
        try {
          console.log(`[Audit Results] Attempt ${i + 1}/${retries}`);

          const response = await fetch(`/api/audit?id=${resolvedParams.id}`);
          const data = await response.json();

          console.log('[Audit Results] Response:', response.status, data);

          if (!response.ok) {
            // If 404 and we have retries left, wait and try again
            if (response.status === 404 && i < retries - 1) {
              console.log('[Audit Results] Not found, retrying in 1 second...');
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            throw new Error(data.error || 'Failed to fetch audit');
          }

          console.log('[Audit Results] Audit loaded successfully');
          setAudit(data.audit);
          setLoading(false); // Clear loading state
          return; // Success, exit the function
        } catch (err) {
          console.error('[Audit Results] Fetch error:', err);
          lastError = err;

          // Wait before retry
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // All retries failed
      setError(lastError instanceof Error ? lastError.message : 'Failed to load audit');
      setLoading(false);
    }

    fetchAudit();
    checkSubscriptionTier();
  }, [resolvedParams.id]);

  const checkSubscriptionTier = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSubscriptionTier(profile.subscription_tier);
      }
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const response = await fetch(`/api/pdf/generate?auditId=${resolvedParams.id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-${audit?.storeUrl.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download error:', error);
      alert(error instanceof Error ? error.message : 'Failed to download PDF');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading audit results...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !audit) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Audit Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'Unable to load audit results'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-400 mb-4">
                <a href="/" className="hover:text-primary">Home</a>
                <span className="mx-2">/</span>
                <span>Audit Results</span>
              </div>

              {/* Store Info & Actions */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Audit Results</h1>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="font-mono">{audit.storeUrl}</span>
                    <span>•</span>
                    <span>{new Date(audit.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {/* PDF Download Button - Only for Starter & Pro users */}
                {(subscriptionTier === 'starter' || subscriptionTier === 'pro') ? (
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingPdf ? (
                      <>
                        <Loader size="sm" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF Report</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Upgrade for PDF Export</span>
                  </button>
                )}
              </div>

              {/* Overall Score */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <div className="text-sm text-gray-400 mb-2">Overall Health Score</div>
                    <div className="flex items-center gap-4">
                      <div className={`text-7xl font-bold ${
                        audit.overallScore >= 80 ? 'text-green-400' :
                        audit.overallScore >= 60 ? 'text-yellow-400' :
                        audit.overallScore >= 40 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {audit.overallGrade}
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-white">{audit.overallScore}/100</div>
                        <div className="text-sm text-gray-400">Health Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-6 py-4">
                      <div className="text-sm text-gray-400 mb-1">Estimated Monthly Loss</div>
                      <div className="text-3xl font-bold text-red-400">
                        {formatCurrency(audit.revenueImpact.estimatedMonthlyLoss)}
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-4">
                      <div className="text-sm text-gray-400 mb-1">Potential Recovery</div>
                      <div className="text-3xl font-bold text-green-400">
                        {formatCurrency(audit.revenueImpact.estimatedRecovery)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="text-2xl font-bold text-white">{audit.issues.length}</div>
                  <div className="text-sm text-gray-400">Issues Found</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">💡</div>
                  <div className="text-2xl font-bold text-white">{audit.recommendations.length}</div>
                  <div className="text-sm text-gray-400">Recommendations</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-white">{audit.instantWins.length}</div>
                  <div className="text-sm text-gray-400">Quick Wins</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-white">{Math.round(audit.metadata.duration)}s</div>
                  <div className="text-sm text-gray-400">Scan Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Score Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Score Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard
                  title="Performance Score"
                  score={audit.performanceScore.score}
                  grade={audit.performanceScore.grade}
                  icon="⚡"
                  subtitle="Page speed, Core Web Vitals, and loading time"
                />
                <ScoreCard
                  title="Conversion Score"
                  score={audit.conversionScore.score}
                  grade={audit.conversionScore.grade}
                  icon="🛒"
                  subtitle="Trust signals, mobile usability, and user experience"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Instant Wins */}
        {audit.instantWins.length > 0 && (
          <section className="py-12 bg-gray-800/50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-4xl">⚡</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Quick Wins</h2>
                    <p className="text-gray-400">Fix these in under 5 minutes for immediate impact</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {audit.instantWins.map((rec, idx) => (
                    <RecommendationCard key={rec.id} recommendation={rec} rank={idx + 1} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Critical Issues */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Issues Detected</h2>
              <div className="grid grid-cols-1 gap-6">
                {audit.issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Recommendations */}
        <section className="py-12 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Prioritized Recommendations</h2>
              <div className="grid grid-cols-1 gap-6">
                {audit.recommendations.map((rec, idx) => (
                  <RecommendationCard key={rec.id} recommendation={rec} rank={idx + 1} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Implement These Fixes?
              </h2>
              <p className="text-gray-300 mb-6">
                Upgrade to a paid plan to get weekly monitoring, detailed tracking, and expert support.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/pricing">
                  <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-glow-primary">
                    Upgrade Now
                  </button>
                </a>
                <a href="/">
                  <button className="px-6 py-3 border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary font-bold rounded-lg transition-all">
                    Run Another Audit
                  </button>
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
