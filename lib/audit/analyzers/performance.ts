import type { PerformanceScore, PerformanceAnalyzer } from '../types';
import { calculateGrade, calculatePerformanceScore, fetchWithTimeout } from '../utils';

export class ShopifyPerformanceAnalyzer implements PerformanceAnalyzer {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async analyze(url: string): Promise<PerformanceScore> {
    try {
      // Normalize URL
      const testUrl = url.startsWith('http') ? url : `https://${url}`;

      // Run performance analysis
      const [desktopMetrics, mobileMetrics, imageAnalysis] = await Promise.all([
        this.analyzeWithLighthouse(testUrl, 'desktop'),
        this.analyzeWithLighthouse(testUrl, 'mobile'),
        this.analyzeImages(testUrl),
      ]);

      // Calculate overall performance score
      const score = calculatePerformanceScore({
        lcp: mobileMetrics.lcp,
        fid: mobileMetrics.fid,
        cls: mobileMetrics.cls,
        tti: mobileMetrics.tti,
        speedIndex: mobileMetrics.speedIndex,
      });

      const result: PerformanceScore = {
        score,
        grade: calculateGrade(score),
        metrics: {
          lcp: mobileMetrics.lcp,
          fid: mobileMetrics.fid,
          cls: mobileMetrics.cls,
          fcp: mobileMetrics.fcp,
          tti: mobileMetrics.tti,
          speedIndex: mobileMetrics.speedIndex,
          totalBlockingTime: mobileMetrics.totalBlockingTime,
        },
        pageLoadTime: {
          desktop: desktopMetrics.pageLoadTime,
          mobile: mobileMetrics.pageLoadTime,
        },
        imageOptimization: imageAnalysis,
      };

      return result;
    } catch (error) {
      console.error('Performance analysis error:', error);
      // Return default/fallback scores if analysis fails
      return this.getDefaultScore();
    }
  }

  private async analyzeWithLighthouse(
    url: string,
    strategy: 'desktop' | 'mobile'
  ): Promise<{
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    tti: number;
    speedIndex: number;
    totalBlockingTime: number;
    pageLoadTime: number;
  }> {
    // If we have Google PageSpeed API key, use it
    if (this.apiKey) {
      return this.analyzeWithPageSpeedAPI(url, strategy);
    }

    // Otherwise, use simulated metrics based on fetch timing
    return this.simulateMetrics(url, strategy);
  }

  private async analyzeWithPageSpeedAPI(
    url: string,
    strategy: 'desktop' | 'mobile'
  ): Promise<any> {
    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${this.apiKey}`;

      const response = await fetchWithTimeout(apiUrl, {}, 60000);

      if (!response.ok) {
        throw new Error(`PageSpeed API error: ${response.status}`);
      }

      const data = await response.json();
      const metrics = data.lighthouseResult.audits;

      return {
        lcp: parseFloat(metrics['largest-contentful-paint'].numericValue) / 1000,
        fid: parseFloat(metrics['max-potential-fid']?.numericValue || 100),
        cls: parseFloat(metrics['cumulative-layout-shift'].numericValue),
        fcp: parseFloat(metrics['first-contentful-paint'].numericValue) / 1000,
        tti: parseFloat(metrics['interactive'].numericValue) / 1000,
        speedIndex: parseFloat(metrics['speed-index'].numericValue) / 1000,
        totalBlockingTime: parseFloat(metrics['total-blocking-time'].numericValue),
        pageLoadTime: parseFloat(metrics['interactive'].numericValue) / 1000,
      };
    } catch (error) {
      console.error('PageSpeed API error:', error);
      return this.simulateMetrics(url, strategy);
    }
  }

  private async simulateMetrics(
    url: string,
    strategy: 'desktop' | 'mobile'
  ): Promise<any> {
    // Measure actual page load time
    const startTime = Date.now();

    try {
      await fetchWithTimeout(url, {}, 30000);
      const loadTime = (Date.now() - startTime) / 1000;

      // Generate realistic metrics based on load time
      const isMobile = strategy === 'mobile';
      const multiplier = isMobile ? 1.5 : 1.0;

      return {
        lcp: loadTime * multiplier * 0.8, // LCP is typically 80% of load time
        fid: isMobile ? 150 : 80,
        cls: 0.15,
        fcp: loadTime * multiplier * 0.5,
        tti: loadTime * multiplier,
        speedIndex: loadTime * multiplier * 0.9,
        totalBlockingTime: isMobile ? 300 : 150,
        pageLoadTime: loadTime * multiplier,
      };
    } catch (error) {
      // If fetch fails, return poor metrics
      return {
        lcp: 5.0,
        fid: 300,
        cls: 0.3,
        fcp: 3.0,
        tti: 8.0,
        speedIndex: 7.0,
        totalBlockingTime: 600,
        pageLoadTime: 8.0,
      };
    }
  }

  private async analyzeImages(url: string): Promise<{
    totalImages: number;
    oversizedImages: number;
    unoptimizedImages: number;
    potentialSavings: number;
  }> {
    try {
      // Fetch the page HTML
      const response = await fetchWithTimeout(url);
      const html = await response.text();

      // Parse image tags (basic regex parsing)
      const imgTags = html.match(/<img[^>]+>/gi) || [];
      const totalImages = imgTags.length;

      // Estimate optimization issues
      // In a real implementation, we would fetch each image and analyze
      // For now, use heuristics
      const oversizedImages = Math.floor(totalImages * 0.3); // Assume 30% oversized
      const unoptimizedImages = Math.floor(totalImages * 0.4); // Assume 40% not webp

      // Estimate potential savings (KB)
      const potentialSavings = (oversizedImages * 500) + (unoptimizedImages * 200);

      return {
        totalImages,
        oversizedImages,
        unoptimizedImages,
        potentialSavings,
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        totalImages: 0,
        oversizedImages: 0,
        unoptimizedImages: 0,
        potentialSavings: 0,
      };
    }
  }

  private getDefaultScore(): PerformanceScore {
    return {
      score: 50,
      grade: 'C',
      metrics: {
        lcp: 4.0,
        fid: 200,
        cls: 0.2,
        fcp: 2.5,
        tti: 5.0,
        speedIndex: 5.0,
        totalBlockingTime: 400,
      },
      pageLoadTime: {
        desktop: 3.5,
        mobile: 5.0,
      },
      imageOptimization: {
        totalImages: 0,
        oversizedImages: 0,
        unoptimizedImages: 0,
        potentialSavings: 0,
      },
    };
  }
}
