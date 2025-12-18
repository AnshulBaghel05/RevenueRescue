'use client';

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
  performance_score: number;
  conversion_score: number;
  estimated_revenue_loss: number;
  created_at: string;
  results: AuditResult;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'poor' | 'good'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'error' | 'info' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  // Filter audits
  const filteredAudits = audits.filter((audit) => {
    // Search filter
    if (searchQuery && !audit.store_url.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Score filter
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(audit.created_at) >= weekAgo;
    }
    if (filter === 'poor') return audit.overall_score < 60;
    if (filter === 'good') return audit.overall_score >= 80;

    return true;
  });

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading audit history...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Audit History</h1>
              <p className="text-gray-400">
                View all your store audits and track improvements over time
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/new')}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              + New Audit
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card padding="md">
              <div className="text-sm text-gray-400 mb-1">Total Audits</div>
              <div className="text-2xl font-bold text-white">{audits.length}</div>
            </Card>
            <Card padding="md">
              <div className="text-sm text-gray-400 mb-1">Average Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(
                audits.length > 0
                  ? Math.round(audits.reduce((sum, a) => sum + a.overall_score, 0) / audits.length)
                  : 0
              )}`}>
                {audits.length > 0
                  ? Math.round(audits.reduce((sum, a) => sum + a.overall_score, 0) / audits.length)
                  : 0}
                /100
              </div>
            </Card>
            <Card padding="md">
              <div className="text-sm text-gray-400 mb-1">Total Revenue at Risk</div>
              <div className="text-2xl font-bold text-red-400">
                {formatCurrency(audits.reduce((sum, a) => sum + (a.estimated_revenue_loss || 0), 0))}
              </div>
            </Card>
            <Card padding="md">
              <div className="text-sm text-gray-400 mb-1">Stores Audited</div>
              <div className="text-2xl font-bold text-white">
                {new Set(audits.map(a => a.store_url)).size}
              </div>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by store URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {(['all', 'recent', 'good', 'poor'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f === 'all' && 'All'}
                  {f === 'recent' && 'Recent (7d)'}
                  {f === 'good' && 'Good (80+)'}
                  {f === 'poor' && 'Poor (<60)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit List */}
        {filteredAudits.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery || filter !== 'all' ? 'No audits found' : 'No audits yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Run your first audit to start tracking your store performance'}
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => router.push('/dashboard/new')}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
              >
                Run First Audit
              </button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAudits.map((audit) => (
              <Card
                key={audit.id}
                hover
                onClick={() => router.push(`/audit/${audit.id}`)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  {/* Grade Badge */}
                  <div
                    className={`w-20 h-20 rounded-xl border flex items-center justify-center flex-shrink-0 ${getGradeColor(
                      audit.overall_grade
                    )}`}
                  >
                    <div className="text-3xl font-bold">{audit.overall_grade}</div>
                  </div>

                  {/* Audit Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {audit.store_url}
                      </h3>
                      <Badge variant="info" size="sm">
                        {audit.overall_score}/100
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Date</div>
                        <div className="text-gray-300">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Performance</div>
                        <Badge variant={getScoreBadgeVariant(audit.performance_score)} size="sm">
                          {audit.performance_score}/100
                        </Badge>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Conversion</div>
                        <Badge variant={getScoreBadgeVariant(audit.conversion_score)} size="sm">
                          {audit.conversion_score}/100
                        </Badge>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Revenue at Risk</div>
                        <div className="text-red-400 font-semibold">
                          {formatCurrency(audit.estimated_revenue_loss)}/mo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-6 h-6 text-gray-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results count */}
        {filteredAudits.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredAudits.length} of {audits.length} audits
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
