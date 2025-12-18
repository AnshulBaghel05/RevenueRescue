import type { RevenueImpact, PerformanceScore, ConversionScore, RevenueCalculator } from '../types';
import { INDUSTRY_BENCHMARKS, calculateRevenueImpact, estimateMonthlyTraffic } from '../utils';

export class ShopifyRevenueCalculator implements RevenueCalculator {
  async calculate(
    performanceScore: PerformanceScore,
    conversionScore: ConversionScore,
    traffic?: number
  ): Promise<RevenueImpact> {
    // Estimate traffic if not provided
    const monthlyTraffic = traffic || estimateMonthlyTraffic();

    // Calculate current conversion rate based on scores
    const currentConversion = this.estimateCurrentConversion(performanceScore, conversionScore);

    // Calculate potential conversion rate after fixes
    const potentialConversion = this.estimatePotentialConversion(
      performanceScore,
      conversionScore
    );

    // Industry benchmarks
    const industryAverage = INDUSTRY_BENCHMARKS.ecommerce.averageConversion;
    const topPerformers = INDUSTRY_BENCHMARKS.ecommerce.topPerformersConversion;

    // Calculate revenue impact
    const totalImpact = calculateRevenueImpact(
      currentConversion,
      potentialConversion,
      monthlyTraffic
    );

    // Break down by issue category
    const breakdown = this.calculateBreakdown(
      performanceScore,
      conversionScore,
      monthlyTraffic,
      currentConversion
    );

    return {
      estimatedMonthlyLoss: totalImpact,
      estimatedRecovery: Math.round(totalImpact * 0.7), // Conservative 70% recovery estimate
      breakdown,
      benchmarking: {
        industryAverageConversion: industryAverage,
        yourConversionRate: currentConversion,
        topPerformersConversion: topPerformers,
      },
    };
  }

  private estimateCurrentConversion(
    performanceScore: PerformanceScore,
    conversionScore: ConversionScore
  ): number {
    // Base conversion rate
    let conversion = INDUSTRY_BENCHMARKS.ecommerce.averageConversion;

    // Adjust based on performance
    if (performanceScore.score >= 80) {
      conversion *= 1.2;
    } else if (performanceScore.score <= 50) {
      conversion *= 0.7;
    }

    // Adjust based on conversion factors
    if (conversionScore.score >= 80) {
      conversion *= 1.15;
    } else if (conversionScore.score <= 50) {
      conversion *= 0.6;
    }

    // Mobile penalty if poor mobile experience
    if (conversionScore.mobileUsability.score < 60) {
      conversion *= 0.85; // 15% penalty for poor mobile
    }

    // Trust signals impact
    const trustCount = Object.values(conversionScore.trustSignals).filter(Boolean).length;
    if (trustCount <= 2) {
      conversion *= 0.8; // 20% penalty for low trust
    }

    return Math.max(0.5, Math.min(5.0, parseFloat(conversion.toFixed(2))));
  }

  private estimatePotentialConversion(
    performanceScore: PerformanceScore,
    conversionScore: ConversionScore
  ): number {
    // Start with industry average as baseline potential
    let potential = INDUSTRY_BENCHMARKS.ecommerce.averageConversion;

    // Calculate improvement potential
    const performanceGap = (100 - performanceScore.score) / 100;
    const conversionGap = (100 - conversionScore.score) / 100;

    // Apply improvements (conservative estimates)
    potential += potential * performanceGap * 0.5; // 50% of gap
    potential += potential * conversionGap * 0.6; // 60% of gap

    // Cap at top performers benchmark
    return Math.min(
      INDUSTRY_BENCHMARKS.ecommerce.topPerformersConversion,
      parseFloat(potential.toFixed(2))
    );
  }

  private calculateBreakdown(
    performanceScore: PerformanceScore,
    conversionScore: ConversionScore,
    monthlyTraffic: number,
    currentConversion: number
  ): {
    performanceIssues: number;
    conversionIssues: number;
    mobileIssues: number;
    trustIssues: number;
  } {
    const averageOrderValue = 75; // Default AOV

    // Performance impact
    const performanceImpact = this.calculateIssueImpact(
      performanceScore.score,
      monthlyTraffic,
      currentConversion,
      averageOrderValue,
      0.3 // Performance contributes 30% to conversion
    );

    // Conversion factors impact
    const conversionImpact = this.calculateIssueImpact(
      conversionScore.score,
      monthlyTraffic,
      currentConversion,
      averageOrderValue,
      0.25 // Conversion factors contribute 25%
    );

    // Mobile impact
    const mobileImpact = this.calculateIssueImpact(
      conversionScore.mobileUsability.score,
      monthlyTraffic * 0.7, // 70% mobile traffic
      currentConversion,
      averageOrderValue,
      0.25 // Mobile contributes 25%
    );

    // Trust signals impact
    const trustCount = Object.values(conversionScore.trustSignals).filter(Boolean).length;
    const trustScore = (trustCount / 6) * 100;
    const trustImpact = this.calculateIssueImpact(
      trustScore,
      monthlyTraffic,
      currentConversion,
      averageOrderValue,
      0.2 // Trust contributes 20%
    );

    return {
      performanceIssues: Math.round(performanceImpact),
      conversionIssues: Math.round(conversionImpact),
      mobileIssues: Math.round(mobileImpact),
      trustIssues: Math.round(trustImpact),
    };
  }

  private calculateIssueImpact(
    score: number,
    traffic: number,
    conversion: number,
    aov: number,
    weight: number
  ): number {
    // Calculate how much this issue is costing
    const gap = (100 - score) / 100;
    const potentialIncrease = conversion * gap * weight;
    const additionalOrders = (traffic * potentialIncrease) / 100;

    return additionalOrders * aov;
  }
}
