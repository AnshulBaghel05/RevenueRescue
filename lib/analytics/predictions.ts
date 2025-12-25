/**
 * Analytics & Prediction Utilities
 * Phase 8: Advanced Analytics Dashboard
 */

export interface DataPoint {
  date: string;
  value: number;
}

export interface PredictionResult {
  predictedValue: number;
  confidence: number; // 0-1
  trend: 'improving' | 'declining' | 'stable';
  trendPercentage: number;
}

export interface InsightData {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  message: string;
  metric?: string;
  value?: number;
  priority: number; // 1-5, 5 being highest
}

/**
 * Linear Regression for Trend Prediction
 * Uses least squares method to predict future values
 */
export function predictNextValue(data: DataPoint[]): PredictionResult | null {
  if (data.length < 2) return null;

  // Convert dates to numeric values (days from first point)
  const firstDate = new Date(data[0].date).getTime();
  const points = data.map((d, i) => ({
    x: (new Date(d.date).getTime() - firstDate) / (1000 * 60 * 60 * 24), // days
    y: d.value,
  }));

  // Calculate linear regression coefficients
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict next point (assume same time interval)
  const avgInterval = points.length > 1 ?
    (points[points.length - 1].x - points[0].x) / (points.length - 1) : 1;
  const nextX = points[points.length - 1].x + avgInterval;
  const predictedValue = Math.max(0, Math.min(100, slope * nextX + intercept));

  // Calculate confidence based on R-squared
  const yMean = sumY / n;
  const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = points.reduce((sum, p) => {
    const predicted = slope * p.x + intercept;
    return sum + Math.pow(p.y - predicted, 2);
  }, 0);
  const rSquared = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;
  const confidence = Math.max(0, Math.min(1, rSquared));

  // Determine trend
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const trendPercentage = ((lastValue - firstValue) / firstValue) * 100;

  let trend: 'improving' | 'declining' | 'stable';
  if (trendPercentage > 5) trend = 'improving';
  else if (trendPercentage < -5) trend = 'declining';
  else trend = 'stable';

  return {
    predictedValue: Math.round(predictedValue),
    confidence,
    trend,
    trendPercentage,
  };
}

/**
 * Calculate moving average for smoothing trends
 */
export function calculateMovingAverage(data: DataPoint[], window: number = 3): DataPoint[] {
  if (data.length < window) return data;

  return data.map((point, index) => {
    if (index < window - 1) return point;

    const windowData = data.slice(index - window + 1, index + 1);
    const avg = windowData.reduce((sum, d) => sum + d.value, 0) / window;

    return {
      date: point.date,
      value: Math.round(avg),
    };
  });
}

/**
 * Identify anomalies in the data (outliers)
 */
export function detectAnomalies(data: DataPoint[]): number[] {
  if (data.length < 4) return [];

  const values = data.map(d => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const anomalyIndices: number[] = [];
  data.forEach((point, index) => {
    const zScore = Math.abs((point.value - mean) / stdDev);
    if (zScore > 2) { // More than 2 standard deviations
      anomalyIndices.push(index);
    }
  });

  return anomalyIndices;
}

/**
 * Generate AI-powered insights from audit data
 */
export function generateInsights(audits: any[]): InsightData[] {
  if (audits.length === 0) return [];

  const insights: InsightData[] = [];
  const latestAudit = audits[audits.length - 1];
  const firstAudit = audits[0];

  // 1. Overall Score Trend
  const scoreImprovement = latestAudit.overall_score - firstAudit.overall_score;
  if (scoreImprovement > 15) {
    insights.push({
      type: 'success',
      title: 'Significant Improvement',
      message: `Your overall score improved by ${scoreImprovement} points! Your optimization efforts are paying off.`,
      metric: 'overall_score',
      value: scoreImprovement,
      priority: 5,
    });
  } else if (scoreImprovement < -10) {
    insights.push({
      type: 'danger',
      title: 'Performance Decline',
      message: `Your score dropped by ${Math.abs(scoreImprovement)} points. Recent changes may have negatively impacted performance.`,
      metric: 'overall_score',
      value: scoreImprovement,
      priority: 5,
    });
  }

  // 2. Performance Score Analysis
  const perfImprovement = latestAudit.performance_score - firstAudit.performance_score;
  if (perfImprovement < -5 && latestAudit.performance_score < 60) {
    insights.push({
      type: 'warning',
      title: 'Performance Degradation',
      message: `Performance score decreased by ${Math.abs(perfImprovement)} points. Check for new unoptimized images or scripts.`,
      metric: 'performance_score',
      value: perfImprovement,
      priority: 4,
    });
  }

  // 3. Conversion Score Analysis
  const convImprovement = latestAudit.conversion_score - firstAudit.conversion_score;
  if (convImprovement > 10) {
    insights.push({
      type: 'success',
      title: 'Conversion Optimizations Working',
      message: `Conversion score improved by ${convImprovement} points. Your trust signals and checkout optimizations are effective.`,
      metric: 'conversion_score',
      value: convImprovement,
      priority: 4,
    });
  }

  // 4. Revenue Risk Analysis
  const avgRevenueLoss = audits.reduce((sum, a) => sum + a.estimated_revenue_loss, 0) / audits.length;
  const latestRevenueLoss = latestAudit.estimated_revenue_loss;

  if (latestRevenueLoss < avgRevenueLoss * 0.7) {
    insights.push({
      type: 'success',
      title: 'Revenue Risk Reduced',
      message: `Estimated revenue at risk is ${Math.round(((avgRevenueLoss - latestRevenueLoss) / avgRevenueLoss) * 100)}% below average. Great progress!`,
      metric: 'revenue_loss',
      value: latestRevenueLoss,
      priority: 5,
    });
  } else if (latestRevenueLoss > avgRevenueLoss * 1.3) {
    insights.push({
      type: 'danger',
      title: 'Increased Revenue Risk',
      message: `Estimated monthly revenue loss increased to $${latestRevenueLoss.toLocaleString()}. Immediate action recommended.`,
      metric: 'revenue_loss',
      value: latestRevenueLoss,
      priority: 5,
    });
  }

  // 5. Consistency Analysis
  if (audits.length >= 5) {
    const recentAudits = audits.slice(-5);
    const scores = recentAudits.map(a => a.overall_score);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 5) {
      insights.push({
        type: 'info',
        title: 'Stable Performance',
        message: `Your scores are consistent (±${Math.round(stdDev)} points). Your store performance is stable.`,
        metric: 'consistency',
        value: stdDev,
        priority: 2,
      });
    } else if (stdDev > 15) {
      insights.push({
        type: 'warning',
        title: 'Volatile Performance',
        message: `Your scores vary significantly (±${Math.round(stdDev)} points). Consider stabilizing your optimization approach.`,
        metric: 'consistency',
        value: stdDev,
        priority: 3,
      });
    }
  }

  // 6. Audit Frequency Insight
  if (audits.length >= 3) {
    const dates = audits.map(a => new Date(a.created_at).getTime());
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24)); // days
    }
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;

    if (avgInterval > 30) {
      insights.push({
        type: 'info',
        title: 'Infrequent Monitoring',
        message: `You audit every ${Math.round(avgInterval)} days on average. More frequent audits help catch issues early.`,
        metric: 'frequency',
        value: avgInterval,
        priority: 2,
      });
    } else if (avgInterval < 7) {
      insights.push({
        type: 'success',
        title: 'Active Monitoring',
        message: `You audit every ${Math.round(avgInterval)} days on average. Frequent monitoring helps maintain performance.`,
        metric: 'frequency',
        value: avgInterval,
        priority: 1,
      });
    }
  }

  // 7. Latest Score Assessment
  if (latestAudit.overall_score >= 90) {
    insights.push({
      type: 'success',
      title: 'Excellent Performance',
      message: `Your latest score of ${latestAudit.overall_score}/100 is outstanding! Your store is highly optimized.`,
      metric: 'latest_score',
      value: latestAudit.overall_score,
      priority: 3,
    });
  } else if (latestAudit.overall_score < 50) {
    insights.push({
      type: 'danger',
      title: 'Critical Issues Detected',
      message: `Your latest score of ${latestAudit.overall_score}/100 indicates critical issues. Prioritize recommended fixes.`,
      metric: 'latest_score',
      value: latestAudit.overall_score,
      priority: 5,
    });
  }

  // Sort by priority (highest first)
  return insights.sort((a, b) => b.priority - a.priority);
}

/**
 * Calculate performance metrics for dashboard
 */
export function calculateMetrics(audits: any[]) {
  if (audits.length === 0) {
    return {
      totalAudits: 0,
      avgScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalImprovement: 0,
      avgRevenueLoss: 0,
      trendDirection: 'stable' as const,
    };
  }

  const scores = audits.map(a => a.overall_score);
  const totalAudits = audits.length;
  const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);
  const totalImprovement = audits[audits.length - 1].overall_score - audits[0].overall_score;
  const avgRevenueLoss = Math.round(
    audits.reduce((sum, a) => sum + a.estimated_revenue_loss, 0) / audits.length
  );

  let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
  if (totalImprovement > 5) trendDirection = 'improving';
  else if (totalImprovement < -5) trendDirection = 'declining';

  return {
    totalAudits,
    avgScore,
    bestScore,
    worstScore,
    totalImprovement,
    avgRevenueLoss,
    trendDirection,
  };
}

/**
 * Export data to CSV format
 */
export function exportToCSV(audits: any[]): string {
  if (audits.length === 0) return '';

  const headers = [
    'Date',
    'Store URL',
    'Overall Score',
    'Grade',
    'Performance Score',
    'Conversion Score',
    'Mobile Score',
    'SEO Score',
    'Revenue Loss ($)',
  ];

  const rows = audits.map(audit => [
    new Date(audit.created_at).toLocaleDateString(),
    audit.store_url,
    audit.overall_score,
    audit.grade,
    audit.performance_score || 'N/A',
    audit.conversion_score || 'N/A',
    audit.mobile_score || 'N/A',
    audit.seo_score || 'N/A',
    audit.estimated_revenue_loss,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csv;
}

/**
 * Export data to JSON format
 */
export function exportToJSON(audits: any[]): string {
  const exportData = audits.map(audit => ({
    date: audit.created_at,
    storeUrl: audit.store_url,
    overallScore: audit.overall_score,
    grade: audit.grade,
    performanceScore: audit.performance_score,
    conversionScore: audit.conversion_score,
    mobileScore: audit.mobile_score,
    seoScore: audit.seo_score,
    revenueLoss: audit.estimated_revenue_loss,
  }));

  return JSON.stringify(exportData, null, 2);
}
