import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import type { AuditResult } from '@/lib/audit/types';

// Register fonts (optional - using default fonts for now)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#2B44E7',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B44E7',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  storeInfo: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  storeUrl: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 9,
    color: '#666',
  },
  scoreSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scoreCard: {
    width: '23%',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  scoreGrade: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradeA: { color: '#10B981' },
  gradeB: { color: '#3B82F6' },
  gradeC: { color: '#F59E0B' },
  gradeD: { color: '#EF4444' },
  gradeF: { color: '#DC2626' },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
  },
  revenueBox: {
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderLeft: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: 15,
  },
  revenueTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 5,
  },
  revenueSubtext: {
    fontSize: 9,
    color: '#78350F',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  issueCard: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderLeft: 3,
    marginBottom: 10,
  },
  criticalBorder: { borderLeftColor: '#DC2626' },
  highBorder: { borderLeftColor: '#F59E0B' },
  mediumBorder: { borderLeftColor: '#3B82F6' },
  lowBorder: { borderLeftColor: '#10B981' },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  issueTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  issueBadge: {
    fontSize: 8,
    padding: '3 8',
    borderRadius: 3,
    color: '#fff',
  },
  criticalBadge: { backgroundColor: '#DC2626' },
  highBadge: { backgroundColor: '#F59E0B' },
  mediumBadge: { backgroundColor: '#3B82F6' },
  lowBadge: { backgroundColor: '#10B981' },
  issueDescription: {
    fontSize: 9,
    color: '#666',
    marginBottom: 6,
  },
  issueImpact: {
    fontSize: 9,
    color: '#333',
    marginBottom: 4,
  },
  issueRevenue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  recommendationCard: {
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    borderLeft: 3,
    borderLeftColor: '#2B44E7',
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  recommendationDescription: {
    fontSize: 9,
    color: '#1E40AF',
    marginBottom: 8,
  },
  recommendationSteps: {
    marginTop: 6,
  },
  step: {
    fontSize: 8,
    color: '#1E3A8A',
    marginBottom: 3,
    paddingLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#666',
  },
  pageNumber: {
    fontSize: 8,
    color: '#666',
  },
});

interface AuditReportTemplateProps {
  audit: AuditResult;
  customBranding?: {
    companyName?: string;
    logoUrl?: string;
  };
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return styles.gradeA;
  if (grade.startsWith('B')) return styles.gradeB;
  if (grade.startsWith('C')) return styles.gradeC;
  if (grade.startsWith('D')) return styles.gradeD;
  return styles.gradeF;
};

const getSeverityBadgeStyle = (severity: string) => {
  switch (severity) {
    case 'critical':
      return styles.criticalBadge;
    case 'high':
      return styles.highBadge;
    case 'medium':
      return styles.mediumBadge;
    default:
      return styles.lowBadge;
  }
};

const getSeverityBorderStyle = (severity: string) => {
  switch (severity) {
    case 'critical':
      return styles.criticalBorder;
    case 'high':
      return styles.highBorder;
    case 'medium':
      return styles.mediumBorder;
    default:
      return styles.lowBorder;
  }
};

export const AuditReportTemplate: React.FC<AuditReportTemplateProps> = ({
  audit,
  customBranding,
}) => {
  const formattedDate = new Date(audit.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Sort issues by severity
  const sortedIssues = [...audit.issues].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // Get top 5 recommendations
  const topRecommendations = [...audit.recommendations]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  return (
    <Document>
      {/* Page 1: Overview & Scores */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            {customBranding?.companyName || 'RevenueRescue'}
          </Text>
          <Text style={styles.subtitle}>Shopify Store Audit Report</Text>
        </View>

        <View style={styles.storeInfo}>
          <Text style={styles.storeUrl}>{audit.storeUrl}</Text>
          <Text style={styles.date}>Report Generated: {formattedDate}</Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <View style={styles.scoreGrid}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Overall Score</Text>
              <Text
                style={[styles.scoreValue, getGradeColor(audit.overallGrade)]}
              >
                {audit.overallScore}
              </Text>
              <Text
                style={[styles.scoreGrade, getGradeColor(audit.overallGrade)]}
              >
                {audit.overallGrade}
              </Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Performance</Text>
              <Text
                style={[
                  styles.scoreValue,
                  getGradeColor(audit.performanceScore.grade),
                ]}
              >
                {audit.performanceScore.score}
              </Text>
              <Text
                style={[
                  styles.scoreGrade,
                  getGradeColor(audit.performanceScore.grade),
                ]}
              >
                {audit.performanceScore.grade}
              </Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Conversion</Text>
              <Text
                style={[
                  styles.scoreValue,
                  getGradeColor(audit.conversionScore.grade),
                ]}
              >
                {audit.conversionScore.score}
              </Text>
              <Text
                style={[
                  styles.scoreGrade,
                  getGradeColor(audit.conversionScore.grade),
                ]}
              >
                {audit.conversionScore.grade}
              </Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Mobile</Text>
              <Text
                style={[
                  styles.scoreValue,
                  getGradeColor(audit.conversionScore.grade),
                ]}
              >
                {audit.conversionScore.mobileUsability.score}
              </Text>
              <Text
                style={[
                  styles.scoreGrade,
                  getGradeColor(audit.conversionScore.grade),
                ]}
              >
                {audit.conversionScore.mobileUsability.isMobileFriendly
                  ? 'Good'
                  : 'Poor'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Impact</Text>
          <View style={styles.revenueBox}>
            <Text style={styles.revenueTitle}>
              Estimated Monthly Revenue Loss
            </Text>
            <Text style={styles.revenueAmount}>
              ${audit.revenueImpact.estimatedMonthlyLoss.toLocaleString()}
            </Text>
            <Text style={styles.revenueSubtext}>
              Potential Recovery: $
              {audit.revenueImpact.estimatedRecovery.toLocaleString()} per
              month
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Performance Issues Impact
              </Text>
              <Text style={styles.metricValue}>
                ${audit.revenueImpact.breakdown.performanceIssues.toLocaleString()}
                /mo
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Conversion Issues Impact</Text>
              <Text style={styles.metricValue}>
                ${audit.revenueImpact.breakdown.conversionIssues.toLocaleString()}
                /mo
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Mobile Issues Impact</Text>
              <Text style={styles.metricValue}>
                ${audit.revenueImpact.breakdown.mobileIssues.toLocaleString()}
                /mo
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Trust Issues Impact</Text>
              <Text style={styles.metricValue}>
                ${audit.revenueImpact.breakdown.trustIssues.toLocaleString()}
                /mo
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Largest Contentful Paint (LCP)
              </Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.metrics.lcp.toFixed(2)}s
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>First Input Delay (FID)</Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.metrics.fid.toFixed(0)}ms
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Cumulative Layout Shift (CLS)
              </Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.metrics.cls.toFixed(3)}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Page Load Time (Mobile)</Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.pageLoadTime.mobile.toFixed(2)}s
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {customBranding?.companyName || 'RevenueRescue'} - Shopify Store
            Audit Report
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>

      {/* Page 2: Critical Issues */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            {customBranding?.companyName || 'RevenueRescue'}
          </Text>
          <Text style={styles.subtitle}>Critical Issues & Recommendations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Critical & High Priority Issues ({sortedIssues.length})
          </Text>
          {sortedIssues.slice(0, 8).map((issue) => (
            <View
              key={issue.id}
              style={[styles.issueCard, getSeverityBorderStyle(issue.severity)]}
            >
              <View style={styles.issueHeader}>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <Text
                  style={[
                    styles.issueBadge,
                    getSeverityBadgeStyle(issue.severity),
                  ]}
                >
                  {issue.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.issueDescription}>{issue.description}</Text>
              <Text style={styles.issueImpact}>Impact: {issue.impact}</Text>
              <Text style={styles.issueRevenue}>
                Revenue Impact: ${issue.revenueImpact.toLocaleString()}/month •
                Fix Time: {issue.estimatedTimeToFix} • Effort: {issue.effort}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {customBranding?.companyName || 'RevenueRescue'} - Shopify Store
            Audit Report
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>

      {/* Page 3: Instant Wins & Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            {customBranding?.companyName || 'RevenueRescue'}
          </Text>
          <Text style={styles.subtitle}>Quick Wins & Action Plan</Text>
        </View>

        {audit.instantWins && audit.instantWins.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ⚡ Instant Wins (Fix in &lt; 5 min)
            </Text>
            {audit.instantWins.slice(0, 5).map((win) => (
              <View key={win.id} style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>{win.title}</Text>
                <Text style={styles.recommendationDescription}>
                  {win.description}
                </Text>
                <Text style={styles.issueRevenue}>
                  Estimated Lift: ${win.estimatedRevenueLift.toLocaleString()}
                  /month • Effort: {win.effort}
                </Text>
                <View style={styles.recommendationSteps}>
                  {win.steps.slice(0, 3).map((step, idx) => (
                    <Text key={idx} style={styles.step}>
                      {idx + 1}. {step}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Top Recommendations (Ranked by Impact)
          </Text>
          {topRecommendations.map((rec) => (
            <View key={rec.id} style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.recommendationDescription}>
                {rec.description}
              </Text>
              <Text style={styles.issueRevenue}>
                Estimated Lift: ${rec.estimatedRevenueLift.toLocaleString()}
                /month • Priority: {rec.priority}/10 • Effort: {rec.effort}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {customBranding?.companyName || 'RevenueRescue'} - Shopify Store
            Audit Report
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>

      {/* Page 4: Detailed Metrics & Benchmarking */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            {customBranding?.companyName || 'RevenueRescue'}
          </Text>
          <Text style={styles.subtitle}>Detailed Analysis & Benchmarking</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Optimization</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Images</Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.imageOptimization.totalImages}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Oversized Images</Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.imageOptimization.oversizedImages}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Unoptimized Images</Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.imageOptimization.unoptimizedImages}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Potential Savings</Text>
              <Text style={styles.metricValue}>
                {audit.performanceScore.imageOptimization.potentialSavings}KB
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversion Rate Benchmarking</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Your Conversion Rate</Text>
              <Text style={styles.metricValue}>
                {audit.revenueImpact.benchmarking.yourConversionRate.toFixed(2)}
                %
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Industry Average</Text>
              <Text style={styles.metricValue}>
                {audit.revenueImpact.benchmarking.industryAverageConversion.toFixed(
                  2
                )}
                %
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Top Performers</Text>
              <Text style={styles.metricValue}>
                {audit.revenueImpact.benchmarking.topPerformersConversion.toFixed(
                  2
                )}
                %
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trust & Security</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>SSL Certificate</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.trustSignals.hasSSL ? '✓ Yes' : '✗ No'}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Reviews</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.trustSignals.hasReviews
                  ? '✓ Yes'
                  : '✗ No'}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Security Badges</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.trustSignals.hasSecurityBadges
                  ? '✓ Yes'
                  : '✗ No'}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Social Proof</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.trustSignals.hasSocialProof
                  ? '✓ Yes'
                  : '✗ No'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product & Link Quality</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Products</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.productPages.totalProducts}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Incomplete Products</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.productPages.incompleteProducts}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Links</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.brokenLinks.totalLinks}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Broken Links</Text>
              <Text style={styles.metricValue}>
                {audit.conversionScore.brokenLinks.brokenCount}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {customBranding?.companyName || 'RevenueRescue'} - Shopify Store
            Audit Report
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>
    </Document>
  );
};
