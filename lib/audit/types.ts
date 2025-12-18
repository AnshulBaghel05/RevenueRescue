// Audit Engine Type Definitions

export interface AuditRequest {
  storeUrl: string;
  userId?: string;
  auditType: 'public' | 'oauth';
  shopifyAccessToken?: string;
}

export interface AuditResult {
  id: string;
  storeUrl: string;
  overallScore: number; // 0-100
  overallGrade: Grade;
  performanceScore: PerformanceScore;
  conversionScore: ConversionScore;
  revenueImpact: RevenueImpact;
  issues: Issue[];
  recommendations: Recommendation[];
  instantWins: Recommendation[];
  metadata: AuditMetadata;
  createdAt: string;
}

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface PerformanceScore {
  score: number; // 0-100
  grade: Grade;
  metrics: {
    lcp: number; // Largest Contentful Paint (seconds)
    fid: number; // First Input Delay (milliseconds)
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint (seconds)
    tti: number; // Time to Interactive (seconds)
    speedIndex: number;
    totalBlockingTime: number; // milliseconds
  };
  pageLoadTime: {
    desktop: number; // seconds
    mobile: number; // seconds
  };
  imageOptimization: {
    totalImages: number;
    oversizedImages: number;
    unoptimizedImages: number;
    potentialSavings: number; // KB
  };
}

export interface ConversionScore {
  score: number; // 0-100
  grade: Grade;
  trustSignals: {
    hasSSL: boolean;
    hasSecurityBadges: boolean;
    hasReviews: boolean;
    hasReturnPolicy: boolean;
    hasContactInfo: boolean;
    hasSocialProof: boolean;
  };
  checkoutAnalysis: {
    checkoutSpeed: number; // seconds
    stepsCount: number;
    hasGuestCheckout: boolean;
    hasMultiplePaymentOptions: boolean;
  };
  mobileUsability: {
    score: number;
    isMobileFriendly: boolean;
    tapTargetSize: 'good' | 'warning' | 'poor';
    textReadability: 'good' | 'warning' | 'poor';
    viewportConfigured: boolean;
  };
  brokenLinks: {
    totalLinks: number;
    brokenCount: number;
    brokenUrls: string[];
  };
  productPages: {
    totalProducts: number;
    incompleteProducts: number;
    missingDescriptions: number;
    missingImages: number;
    missingPrices: number;
  };
}

export interface RevenueImpact {
  estimatedMonthlyLoss: number; // USD
  estimatedRecovery: number; // USD
  breakdown: {
    performanceIssues: number;
    conversionIssues: number;
    mobileIssues: number;
    trustIssues: number;
  };
  benchmarking: {
    industryAverageConversion: number;
    yourConversionRate: number;
    topPerformersConversion: number;
  };
}

export interface Issue {
  id: string;
  type: IssueType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  revenueImpact: number; // Monthly USD
  effort: 'easy' | 'medium' | 'hard';
  estimatedTimeToFix: string; // e.g., "5 minutes", "2 hours"
  category: IssueCategory;
  affectedUrls?: string[];
  technicalDetails?: Record<string, any>;
}

export type IssueType =
  | 'slow_page_load'
  | 'poor_lcp'
  | 'high_cls'
  | 'oversized_images'
  | 'unused_apps'
  | 'missing_trust_signals'
  | 'slow_checkout'
  | 'mobile_unfriendly'
  | 'broken_links'
  | 'incomplete_products'
  | 'missing_ssl'
  | 'poor_mobile_tap_targets'
  | 'cart_abandonment_high'
  | 'missing_reviews'
  | 'no_security_badges';

export type IssueCategory =
  | 'performance'
  | 'conversion'
  | 'mobile'
  | 'trust'
  | 'seo'
  | 'products';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: number; // 1-10, 10 being highest
  impact: 'critical' | 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  estimatedRevenueLift: number; // Monthly USD
  steps: string[];
  resources?: {
    title: string;
    url: string;
  }[];
  isInstantWin?: boolean; // Can be fixed in < 5 minutes
}

export interface AuditMetadata {
  duration: number; // seconds
  timestamp: string;
  version: string; // Audit engine version
  checksPerformed: string[];
  storePlatform: 'shopify';
  storeTheme?: string;
  estimatedTraffic?: number;
  detectedApps?: string[];
}

// Analyzer interfaces
export interface PerformanceAnalyzer {
  analyze(url: string): Promise<PerformanceScore>;
}

export interface ConversionAnalyzer {
  analyze(url: string): Promise<ConversionScore>;
}

export interface RevenueCalculator {
  calculate(
    performanceScore: PerformanceScore,
    conversionScore: ConversionScore,
    traffic?: number
  ): Promise<RevenueImpact>;
}

// Audit phases
export type AuditPhase =
  | 'initializing'
  | 'fetching_data'
  | 'analyzing_performance'
  | 'analyzing_conversion'
  | 'calculating_revenue'
  | 'generating_recommendations'
  | 'completed'
  | 'failed';

export interface AuditProgress {
  phase: AuditPhase;
  progress: number; // 0-100
  message: string;
  startTime: string;
  estimatedCompletion?: string;
}
