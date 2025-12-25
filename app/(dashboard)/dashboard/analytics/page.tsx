'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Loader from '@/components/shared/Loader';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  predictNextValue,
  calculateMovingAverage,
  generateInsights,
  calculateMetrics,
  exportToCSV,
  exportToJSON,
  type InsightData,
} from '@/lib/analytics/predictions';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';

interface AuditRecord {
  id: string;
  store_url: string;
  overall_score: number;
  overall_grade: string;
  performance_score: number;
  conversion_score: number;
  mobile_score: number;
  seo_score: number;
  estimated_revenue_loss: number;
  created_at: string;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [showPrediction, setShowPrediction] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      checkSubscriptionTier();
      fetchAudits();
    }
  }, [user, authLoading, router]);

  const checkSubscriptionTier = async () => {
    try {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user!.id)
        .single();

      if (profile) {
        setSubscriptionTier(profile.subscription_tier);
      }
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
    }
  };

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
        setInsights(generateInsights(auditsData));
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter audits by time range and store
  const filteredAudits = audits.filter((audit) => {
    const auditDate = new Date(audit.created_at);
    const now = new Date();

    let dateFilter = true;
    if (timeRange === '7d') {
      dateFilter = auditDate >= subDays(now, 7);
    } else if (timeRange === '30d') {
      dateFilter = auditDate >= subDays(now, 30);
    } else if (timeRange === '90d') {
      dateFilter = auditDate >= subMonths(now, 3);
    }

    const storeFilter = selectedStore === 'all' || audit.store_url === selectedStore;

    return dateFilter && storeFilter;
  });

  // Get unique stores
  const stores = Array.from(new Set(audits.map(a => a.store_url)));

  // Calculate metrics
  const metrics = calculateMetrics(filteredAudits);

  // Prepare chart data
  const chartData = filteredAudits.map(audit => ({
    date: format(new Date(audit.created_at), 'MMM dd'),
    fullDate: audit.created_at,
    overallScore: audit.overall_score,
    performance: audit.performance_score || 0,
    conversion: audit.conversion_score || 0,
    mobile: audit.mobile_score || 0,
    seo: audit.seo_score || 0,
    revenueLoss: audit.estimated_revenue_loss,
  }));

  // Prediction data
  const prediction = filteredAudits.length >= 3
    ? predictNextValue(filteredAudits.map(a => ({ date: a.created_at, value: a.overall_score })))
    : null;

  // Radar chart data for latest audit
  const latestAudit = filteredAudits[filteredAudits.length - 1];
  const radarData = latestAudit
    ? [
        { category: 'Overall', score: latestAudit.overall_score, fullMark: 100 },
        { category: 'Performance', score: latestAudit.performance_score || 0, fullMark: 100 },
        { category: 'Conversion', score: latestAudit.conversion_score || 0, fullMark: 100 },
        { category: 'Mobile', score: latestAudit.mobile_score || 0, fullMark: 100 },
        { category: 'SEO', score: latestAudit.seo_score || 0, fullMark: 100 },
      ]
    : [];

  // Export functions
  const handleExport = (format: 'csv' | 'json') => {
    const data = format === 'csv' ? exportToCSV(filteredAudits) : exportToJSON(filteredAudits);
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format === 'csv' ? 'export.csv' : 'export.json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Tier gate: Analytics is only available for Pro users
  if (subscriptionTier !== 'pro') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12 border-primary/30">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Get deep insights into your store's performance with predictive analytics,
              AI-powered recommendations, multi-metric comparisons, and data export capabilities.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <h4 className="font-semibold text-white mb-3">Advanced Analytics Includes:</h4>
              <ul className="text-sm text-gray-300 space-y-2 text-left">
                <li>✓ Predictive score forecasting</li>
                <li>✓ AI-powered insights & recommendations</li>
                <li>✓ Multi-metric comparison charts</li>
                <li>✓ Performance radar analysis</li>
                <li>✓ Historical data export (CSV/JSON)</li>
                <li>✓ Custom date range filtering</li>
                <li>✓ Anomaly detection</li>
                <li>✓ Trend analysis with confidence scores</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/pricing')}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
              >
                Upgrade to Pro ($79/mo)
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 border border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (filteredAudits.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
            <p className="text-gray-400 mb-6">
              Run some audits to see advanced analytics and insights. You need at least 2 audits for meaningful analysis.
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
                <Badge variant="success">Pro Feature</Badge>
              </div>
              <p className="text-gray-400">
                Deep insights and predictive analytics for your store performance
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                📥 Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                📥 Export JSON
              </button>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors text-sm"
              >
                + New Audit
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Time Range
              </label>
              <div className="flex gap-2">
                {[
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' },
                  { value: '90d', label: 'Last 90 Days' },
                  { value: 'all', label: 'All Time' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value as TimeRange)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      timeRange === option.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {stores.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Filter by Store
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
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
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Total Audits</div>
            <div className="text-2xl font-bold text-white">{metrics.totalAudits}</div>
          </Card>
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Avg Score</div>
            <div className="text-2xl font-bold text-primary">{metrics.avgScore}</div>
          </Card>
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Best Score</div>
            <div className="text-2xl font-bold text-green-400">{metrics.bestScore}</div>
          </Card>
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Worst Score</div>
            <div className="text-2xl font-bold text-red-400">{metrics.worstScore}</div>
          </Card>
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Improvement</div>
            <div className={`text-2xl font-bold ${
              metrics.totalImprovement >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.totalImprovement >= 0 ? '+' : ''}{metrics.totalImprovement}
            </div>
          </Card>
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Avg Revenue Loss</div>
            <div className="text-2xl font-bold text-orange-400">${metrics.avgRevenueLoss}</div>
          </Card>
          <Card padding="md">
            <div className="text-xs text-gray-400 mb-1">Trend</div>
            <div className="text-2xl">
              {metrics.trendDirection === 'improving' ? '📈' : metrics.trendDirection === 'declining' ? '📉' : '➡️'}
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🤖 AI-Powered Insights
              <Badge variant="info">Generated</Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.slice(0, 6).map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : insight.type === 'danger'
                      ? 'bg-red-500/10 border-red-500/30'
                      : insight.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <h4 className="font-semibold text-white text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-300">{insight.message}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Prediction Card */}
        {prediction && showPrediction && (
          <Card className="mb-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  🔮 Predictive Forecast
                  <Badge variant="info">AI Prediction</Badge>
                </h3>
                <p className="text-sm text-gray-400">Based on linear regression analysis</p>
              </div>
              <button
                onClick={() => setShowPrediction(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Predicted Next Score</div>
                <div className="text-3xl font-bold text-purple-400">{prediction.predictedValue}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Confidence Level</div>
                <div className="text-3xl font-bold text-white">
                  {Math.round(prediction.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Trend Direction</div>
                <div className="text-2xl font-bold capitalize text-white">
                  {prediction.trend === 'improving' ? '📈 ' : prediction.trend === 'declining' ? '📉 ' : '➡️ '}
                  {prediction.trend}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Trend Strength</div>
                <div className={`text-3xl font-bold ${
                  Math.abs(prediction.trendPercentage) > 10 ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {prediction.trendPercentage >= 0 ? '+' : ''}{prediction.trendPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Multi-Metric Chart */}
        <Card className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Multi-Metric Performance Analysis</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="overallScore"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorOverall)"
                name="Overall Score"
              />
              <Area
                type="monotone"
                dataKey="performance"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorPerformance)"
                name="Performance"
              />
              <Area
                type="monotone"
                dataKey="conversion"
                stroke="#F59E0B"
                fillOpacity={1}
                fill="url(#colorConversion)"
                name="Conversion"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Grid: Radar Chart + Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Latest Audit Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="category" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Loss Chart */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Revenue at Risk Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="revenueLoss" fill="#EF4444" name="Revenue Loss ($)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Score Trends Line Chart */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Detailed Score Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="overallScore"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: '#6366F1', r: 4 }}
                name="Overall"
              />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 3 }}
                name="Performance"
              />
              <Line
                type="monotone"
                dataKey="conversion"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 3 }}
                name="Conversion"
              />
              <Line
                type="monotone"
                dataKey="mobile"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 3 }}
                name="Mobile"
              />
              <Line
                type="monotone"
                dataKey="seo"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: '#EC4899', r: 3 }}
                name="SEO"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  );
}
