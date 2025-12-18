'use client';
// Force dynamic rendering - this page requires authenticationexport const dynamic = 'force-dynamic';export const revalidate = 0;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  estimated_revenue_loss: number;
  created_at: string;
  results: AuditResult;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAudits: 0,
    auditsRemaining: 3,
    averageScore: 0,
    totalRevenueLoss: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient();

      // Fetch user profile for stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('audits_used, audits_limit')
        .eq('id', user!.id)
        .single();

      // Fetch recent audits
      const { data: auditsData } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (auditsData) {
        setAudits(auditsData);

        // Calculate stats
        const avgScore = auditsData.length > 0
          ? Math.round(auditsData.reduce((sum, a) => sum + a.overall_score, 0) / auditsData.length)
          : 0;

        const totalLoss = auditsData.reduce((sum, a) => sum + (a.estimated_revenue_loss || 0), 0);

        setStats({
          totalAudits: auditsData.length,
          auditsRemaining: (profile?.audits_limit || 3) - (profile?.audits_used || 0),
          averageScore: avgScore,
          totalRevenueLoss: totalLoss,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (grade === 'B') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (grade === 'C') return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    return 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's an overview of your store audits.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total Audits</div>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalAudits}</div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Audits Remaining</div>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.auditsRemaining}</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Average Score</div>
              <span className="text-2xl">🎯</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore}/100
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Revenue at Risk</div>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {formatCurrency(stats.totalRevenueLoss)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Per month</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl">
                ➕
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Run New Audit</h3>
                <p className="text-sm text-gray-400">
                  {stats.auditsRemaining} audits remaining this month
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
              >
                Start Audit
              </button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl">
                📈
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Upgrade Plan</h3>
                <p className="text-sm text-gray-400">
                  Get unlimited audits and advanced features
                </p>
              </div>
              <button
                onClick={() => router.push('/pricing')}
                className="px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-colors"
              >
                View Plans
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Audits */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Audits</h2>
            <button
              onClick={() => router.push('/dashboard/history')}
              className="text-primary hover:text-primary-light transition-colors"
            >
              View All →
            </button>
          </div>

          {audits.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">No audits yet</h3>
              <p className="text-gray-400 mb-6">
                Run your first audit to start tracking your store's performance
              </p>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
              >
                Run First Audit
              </button>
            </Card>
          ) : (
            <div className="space-y-4">
              {audits.map((audit) => (
                <Card
                  key={audit.id}
                  hover
                  onClick={() => router.push(`/audit/${audit.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    {/* Grade Badge */}
                    <div className={`w-20 h-20 rounded-xl border flex items-center justify-center ${getGradeColor(audit.overall_grade)}`}>
                      <div className="text-3xl font-bold">{audit.overall_grade}</div>
                    </div>

                    {/* Audit Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{audit.store_url}</h3>
                        <Badge variant="info" size="sm">
                          {audit.overall_score}/100
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>📅 {new Date(audit.created_at).toLocaleDateString()}</span>
                        {audit.estimated_revenue_loss > 0 && (
                          <span className="text-red-400">
                            💰 {formatCurrency(audit.estimated_revenue_loss)}/mo at risk
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
