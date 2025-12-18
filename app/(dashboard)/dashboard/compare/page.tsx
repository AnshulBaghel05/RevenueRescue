'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Loader from '@/components/shared/Loader';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/audit/utils';
import type { AuditResult } from '@/lib/audit/types';

interface AuditRecord {
  id: string;
  store_url: string;
  overall_score: number;
  overall_grade: string;
  performance_score: number;
  conversion_score: number;
  estimated_revenue_loss: number;
  created_at: string;
  results: AuditResult;
}

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [selectedAudit1, setSelectedAudit1] = useState<string>('');
  const [selectedAudit2, setSelectedAudit2] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchAudits();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Get audit IDs from URL params if provided
    const audit1 = searchParams.get('audit1');
    const audit2 = searchParams.get('audit2');

    if (audit1) setSelectedAudit1(audit1);
    if (audit2) setSelectedAudit2(audit2);
  }, [searchParams]);

  const fetchAudits = async () => {
    try {
      const supabase = createClient();

      const { data: auditsData } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (auditsData) {
        setAudits(auditsData);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const audit1 = audits.find(a => a.id === selectedAudit1);
  const audit2 = audits.find(a => a.id === selectedAudit2);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getDifference = (val1: number, val2: number) => {
    const diff = val1 - val2;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      isNegative: diff < 0,
      isNeutral: diff === 0,
    };
  };

  const DifferenceIndicator = ({ diff }: { diff: ReturnType<typeof getDifference> }) => {
    if (diff.isNeutral) return <span className="text-gray-500">—</span>;

    return (
      <span className={diff.isPositive ? 'text-green-400' : 'text-red-400'}>
        {diff.isPositive ? '+' : '-'}{diff.value}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading audits...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (audits.length < 2) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Not Enough Audits</h3>
            <p className="text-gray-400 mb-6">
              You need at least 2 audits to compare. Run more audits to track your improvements.
            </p>
            <button
              onClick={() => router.push('/dashboard/new')}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Run New Audit
            </button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Compare Audits</h1>
          <p className="text-gray-400">
            Compare two audits side-by-side to track improvements and changes
          </p>
        </div>

        {/* Audit Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Audit 1 Selector */}
          <Card>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              First Audit
            </label>
            <select
              value={selectedAudit1}
              onChange={(e) => setSelectedAudit1(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="">Select an audit...</option>
              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  {audit.store_url} - {new Date(audit.created_at).toLocaleDateString()} (Score: {audit.overall_score})
                </option>
              ))}
            </select>
          </Card>

          {/* Audit 2 Selector */}
          <Card>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Second Audit
            </label>
            <select
              value={selectedAudit2}
              onChange={(e) => setSelectedAudit2(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="">Select an audit...</option>
              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  {audit.store_url} - {new Date(audit.created_at).toLocaleDateString()} (Score: {audit.overall_score})
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Comparison Results */}
        {audit1 && audit2 ? (
          <div className="space-y-6">
            {/* Overall Comparison */}
            <Card>
              <h2 className="text-xl font-bold text-white mb-6">Overall Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Audit 1 */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">First Audit</div>
                  <div className="text-lg font-semibold text-white mb-2">{audit1.store_url}</div>
                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(audit1.created_at).toLocaleDateString()}
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(audit1.overall_score)}`}>
                    {audit1.overall_score}/100
                  </div>
                  <Badge variant="info">{audit1.overall_grade}</Badge>
                </div>

                {/* Difference */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Score Change</div>
                    <div className="text-3xl font-bold">
                      <DifferenceIndicator diff={getDifference(audit1.overall_score, audit2.overall_score)} />
                    </div>
                    {audit1.overall_score !== audit2.overall_score && (
                      <div className="text-sm text-gray-500 mt-2">
                        {audit1.overall_score > audit2.overall_score ? '📈 Improved' : '📉 Declined'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit 2 */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Second Audit</div>
                  <div className="text-lg font-semibold text-white mb-2">{audit2.store_url}</div>
                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(audit2.created_at).toLocaleDateString()}
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(audit2.overall_score)}`}>
                    {audit2.overall_score}/100
                  </div>
                  <Badge variant="info">{audit2.overall_grade}</Badge>
                </div>
              </div>
            </Card>

            {/* Detailed Metrics Comparison */}
            <Card>
              <h2 className="text-xl font-bold text-white mb-6">Detailed Metrics</h2>
              <div className="space-y-4">
                {/* Performance Score */}
                <div className="grid grid-cols-3 gap-4 items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Performance Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(audit1.performance_score)}`}>
                      {audit1.performance_score}
                    </div>
                  </div>
                  <div className="text-center">
                    <DifferenceIndicator diff={getDifference(audit1.performance_score, audit2.performance_score)} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Performance Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(audit2.performance_score)}`}>
                      {audit2.performance_score}
                    </div>
                  </div>
                </div>

                {/* Conversion Score */}
                <div className="grid grid-cols-3 gap-4 items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Conversion Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(audit1.conversion_score)}`}>
                      {audit1.conversion_score}
                    </div>
                  </div>
                  <div className="text-center">
                    <DifferenceIndicator diff={getDifference(audit1.conversion_score, audit2.conversion_score)} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Conversion Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(audit2.conversion_score)}`}>
                      {audit2.conversion_score}
                    </div>
                  </div>
                </div>

                {/* Revenue at Risk */}
                <div className="grid grid-cols-3 gap-4 items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Revenue at Risk</div>
                    <div className="text-2xl font-bold text-red-400">
                      {formatCurrency(audit1.estimated_revenue_loss)}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                  <div className="text-center">
                    {audit1.estimated_revenue_loss !== audit2.estimated_revenue_loss && (
                      <div className={audit1.estimated_revenue_loss < audit2.estimated_revenue_loss ? 'text-green-400' : 'text-red-400'}>
                        {audit1.estimated_revenue_loss < audit2.estimated_revenue_loss ? '✓ Reduced' : '⚠ Increased'}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Revenue at Risk</div>
                    <div className="text-2xl font-bold text-red-400">
                      {formatCurrency(audit2.estimated_revenue_loss)}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* View Full Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <h3 className="text-lg font-bold text-white mb-2">First Audit Report</h3>
                <p className="text-sm text-gray-400 mb-4">
                  View the complete audit report and recommendations
                </p>
                <button
                  onClick={() => router.push(`/audit/${audit1.id}`)}
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors w-full"
                >
                  View Full Report →
                </button>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <h3 className="text-lg font-bold text-white mb-2">Second Audit Report</h3>
                <p className="text-sm text-gray-400 mb-4">
                  View the complete audit report and recommendations
                </p>
                <button
                  onClick={() => router.push(`/audit/${audit2.id}`)}
                  className="px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-colors w-full"
                >
                  View Full Report →
                </button>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">👆</div>
            <h3 className="text-xl font-bold text-white mb-2">Select Audits to Compare</h3>
            <p className="text-gray-400">
              Choose two audits from the dropdowns above to see a detailed comparison
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading comparison...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
