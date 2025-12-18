import type {
  AuditRequest,
  AuditResult,
  AuditProgress,
  Issue,
  Recommendation,
} from './types';
import { ShopifyPerformanceAnalyzer } from './analyzers/performance';
import { ShopifyConversionAnalyzer } from './analyzers/conversion';
import { ShopifyRevenueCalculator } from './analyzers/revenue';
import { generateAuditId, isShopifyStore, normalizeStoreUrl, calculateGrade } from './utils';
import { generateIssues, generateRecommendations } from './recommendations';

export class AuditEngine {
  private performanceAnalyzer: ShopifyPerformanceAnalyzer;
  private conversionAnalyzer: ShopifyConversionAnalyzer;
  private revenueCalculator: ShopifyRevenueCalculator;
  private progressCallback?: (progress: AuditProgress) => void;

  constructor(googleApiKey?: string) {
    this.performanceAnalyzer = new ShopifyPerformanceAnalyzer(googleApiKey);
    this.conversionAnalyzer = new ShopifyConversionAnalyzer();
    this.revenueCalculator = new ShopifyRevenueCalculator();
  }

  // Set progress callback for real-time updates
  onProgress(callback: (progress: AuditProgress) => void) {
    this.progressCallback = callback;
  }

  // Main audit execution
  async runAudit(request: AuditRequest): Promise<AuditResult> {
    const startTime = Date.now();
    const auditId = generateAuditId();

    try {
      // Validate store URL
      const normalized = normalizeStoreUrl(request.storeUrl);
      if (!isShopifyStore(normalized)) {
        throw new Error('Invalid Shopify store URL');
      }

      const storeUrl = normalized.startsWith('http') ? normalized : `https://${normalized}`;

      // Phase 1: Initialize
      this.updateProgress({
        phase: 'initializing',
        progress: 0,
        message: 'Starting audit...',
        startTime: new Date().toISOString(),
      });

      // Phase 2: Fetch data
      this.updateProgress({
        phase: 'fetching_data',
        progress: 10,
        message: 'Fetching store data...',
        startTime: new Date().toISOString(),
      });

      // Phase 3: Analyze performance
      this.updateProgress({
        phase: 'analyzing_performance',
        progress: 25,
        message: 'Analyzing page speed and performance...',
        startTime: new Date().toISOString(),
      });

      const performanceScore = await this.performanceAnalyzer.analyze(storeUrl);

      // Phase 4: Analyze conversion
      this.updateProgress({
        phase: 'analyzing_conversion',
        progress: 50,
        message: 'Analyzing conversion factors...',
        startTime: new Date().toISOString(),
      });

      const conversionScore = await this.conversionAnalyzer.analyze(storeUrl);

      // Phase 5: Calculate revenue impact
      this.updateProgress({
        phase: 'calculating_revenue',
        progress: 75,
        message: 'Calculating revenue impact...',
        startTime: new Date().toISOString(),
      });

      const revenueImpact = await this.revenueCalculator.calculate(
        performanceScore,
        conversionScore
      );

      // Phase 6: Generate recommendations
      this.updateProgress({
        phase: 'generating_recommendations',
        progress: 90,
        message: 'Generating recommendations...',
        startTime: new Date().toISOString(),
      });

      const issues = generateIssues(performanceScore, conversionScore, revenueImpact);
      const recommendations = generateRecommendations(issues);
      const instantWins = recommendations.filter((r) => r.isInstantWin);

      // Calculate overall score
      const overallScore = Math.round(
        performanceScore.score * 0.4 + conversionScore.score * 0.6
      );

      const duration = (Date.now() - startTime) / 1000;

      const result: AuditResult = {
        id: auditId,
        storeUrl: normalized,
        overallScore,
        overallGrade: calculateGrade(overallScore),
        performanceScore,
        conversionScore,
        revenueImpact,
        issues,
        recommendations,
        instantWins,
        metadata: {
          duration,
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          checksPerformed: [
            'page_speed',
            'core_web_vitals',
            'image_optimization',
            'trust_signals',
            'mobile_usability',
            'broken_links',
            'product_completeness',
            'checkout_analysis',
          ],
          storePlatform: 'shopify',
        },
        createdAt: new Date().toISOString(),
      };

      // Phase 7: Complete
      this.updateProgress({
        phase: 'completed',
        progress: 100,
        message: 'Audit complete!',
        startTime: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      this.updateProgress({
        phase: 'failed',
        progress: 0,
        message: error instanceof Error ? error.message : 'Audit failed',
        startTime: new Date().toISOString(),
      });

      throw error;
    }
  }

  private updateProgress(progress: AuditProgress) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }
}

// Export singleton instance
export const auditEngine = new AuditEngine(process.env.GOOGLE_PAGESPEED_API_KEY);
