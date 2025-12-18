'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Loader from '@/components/shared/Loader';
import TrendChart, { DataPoint } from '@/components/dashboard/TrendChart';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
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

export default function TrendsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchAudits();
    }
  }, [user, authLoading, router]);

  const fetchAudits = async () => {
    try {
      const supabase = createClient();

      const { data: auditsData } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (auditsData) {
        setAudits(auditsData);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique stores
  const stores = Array.from(new Set(audits.map(a => a.store_url)));

  // Filter audits by selected store
  const filteredAudits = selectedStore === 'all'
    ? audits
    : audits.filter(a => a.store_url === selectedStore);

  // Prepare chart data
  const overallScoreData: DataPoint[] = filteredAudits.map(audit => ({
    date: audit.created_at,
    value: audit.overall_score,
    label: new Date(audit.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));

  const performanceScoreData: DataPoint[] = filteredAudits.map(audit => ({
    date: audit.created_at,
    value: audit.performance_score,
  }));

  const conversionScoreData: DataPoint[] = filteredAudits.map(audit => ({
    date: audit.created_at,
    value: audit.conversion_score,
  }));

  const revenueRiskData: DataPoint[] = filteredAudits.map(audit => ({
    date: audit.created_at,
    value: audit.estimated_revenue_loss,
  }));

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading trends...</p>
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
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-white mb-2">Not Enough Data</h3>
            <p className="text-gray-400 mb-6">
              You need at least 2 audits to see trends. Run more audits to track your progress over time.
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Score Trends</h1>
              <p className="text-gray-400">
                Track your store's performance improvements over time
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/new')}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              + New Audit
            </button>
          </div>

          {/* Store Filter */}
          {stores.length > 1 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Filter by Store
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="all">All Stores ({audits.length} audits)</option>
                {stores.map((store) => {
                  const storeAudits = audits.filter(a => a.store_url === store);
                  return (
                    <option key={store} value={store}>
                      {store} ({storeAudits.length} audits)
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card padding="md">
            <div className="text-sm text-gray-400 mb-1">Total Audits</div>
            <div className="text-2xl font-bold text-white">{filteredAudits.length}</div>
          </Card>
          <Card padding="md">
            <div className="text-sm text-gray-400 mb-1">Latest Score</div>
            <div className="text-2xl font-bold text-primary">
              {filteredAudits[filteredAudits.length - 1]?.overall_score || 0}/100
            </div>
          </Card>
          <Card padding="md">
            <div className="text-sm text-gray-400 mb-1">First Score</div>
            <div className="text-2xl font-bold text-gray-400">
              {filteredAudits[0]?.overall_score || 0}/100
            </div>
          </Card>
          <Card padding="md">
            <div className="text-sm text-gray-400 mb-1">Total Improvement</div>
            <div className={`text-2xl font-bold ${
              (filteredAudits[filteredAudits.length - 1]?.overall_score || 0) - (filteredAudits[0]?.overall_score || 0) >= 0
                ? 'text-green-400'
                : 'text-red-400'
            }`}>
              {((filteredAudits[filteredAudits.length - 1]?.overall_score || 0) - (filteredAudits[0]?.overall_score || 0)) > 0 ? '+' : ''}
              {(filteredAudits[filteredAudits.length - 1]?.overall_score || 0) - (filteredAudits[0]?.overall_score || 0)}
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Overall Score Trend */}
          <TrendChart
            data={overallScoreData}
            title="Overall Score"
            subtitle="Your combined performance and conversion score over time"
            color="primary"
            height={250}
          />

          {/* Performance Score Trend */}
          <TrendChart
            data={performanceScoreData}
            title="Performance Score"
            subtitle="Page speed, Core Web Vitals, and image optimization"
            color="green"
            height={200}
          />

          {/* Conversion Score Trend */}
          <TrendChart
            data={conversionScoreData}
            title="Conversion Score"
            subtitle="Trust signals, mobile usability, and checkout optimization"
            color="yellow"
            height={200}
          />

          {/* Revenue at Risk Trend */}
          <TrendChart
            data={revenueRiskData}
            title="Estimated Revenue at Risk"
            subtitle="Potential monthly revenue loss from optimization issues"
            color="red"
            height={200}
          />
        </div>

        {/* Insights */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <h3 className="text-lg font-bold text-white mb-4">Insights</h3>
          <div className="space-y-3 text-sm">
            {(() => {
              const latestScore = filteredAudits[filteredAudits.length - 1]?.overall_score || 0;
              const firstScore = filteredAudits[0]?.overall_score || 0;
              const improvement = latestScore - firstScore;

              const insights = [];

              if (improvement > 10) {
                insights.push(`🎉 Great progress! Your score improved by ${improvement} points since your first audit.`);
              } else if (improvement < -10) {
                insights.push(`⚠️ Your score decreased by ${Math.abs(improvement)} points. Review recent changes to your store.`);
              } else {
                insights.push(`➡️ Your score is relatively stable with a ${improvement} point change.`);
              }

              if (latestScore >= 80) {
                insights.push(`✅ Your latest score of ${latestScore} is excellent! Keep up the good work.`);
              } else if (latestScore >= 60) {
                insights.push(`💡 Your latest score of ${latestScore} is good, but there's room for improvement.`);
              } else {
                insights.push(`🔧 Your latest score of ${latestScore} indicates significant optimization opportunities.`);
              }

              const avgRevenueLoss = filteredAudits.reduce((sum, a) => sum + a.estimated_revenue_loss, 0) / filteredAudits.length;
              insights.push(`💰 On average, you have ${Math.round(avgRevenueLoss)} in potential monthly revenue at risk across audits.`);

              return insights.map((insight, i) => (
                <p key={i} className="text-gray-300">{insight}</p>
              ));
            })()}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
