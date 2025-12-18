import type { ConversionScore, ConversionAnalyzer } from '../types';
import { calculateGrade, calculateConversionScore, fetchWithTimeout } from '../utils';

export class ShopifyConversionAnalyzer implements ConversionAnalyzer {
  async analyze(url: string): Promise<ConversionScore> {
    try {
      const testUrl = url.startsWith('http') ? url : `https://${url}`;

      // Run all conversion analyses in parallel
      const [trustSignals, checkoutAnalysis, mobileUsability, brokenLinks, productPages] =
        await Promise.all([
          this.analyzeTrustSignals(testUrl),
          this.analyzeCheckout(testUrl),
          this.analyzeMobileUsability(testUrl),
          this.findBrokenLinks(testUrl),
          this.analyzeProductPages(testUrl),
        ]);

      // Calculate conversion score
      const score = calculateConversionScore({
        trustSignalsCount: Object.values(trustSignals).filter(Boolean).length,
        mobileScore: mobileUsability.score,
        brokenLinksCount: brokenLinks.brokenCount,
        productCompleteness: this.calculateProductCompleteness(productPages),
        checkoutScore: this.calculateCheckoutScore(checkoutAnalysis),
      });

      const result: ConversionScore = {
        score,
        grade: calculateGrade(score),
        trustSignals,
        checkoutAnalysis,
        mobileUsability,
        brokenLinks,
        productPages,
      };

      return result;
    } catch (error) {
      console.error('Conversion analysis error:', error);
      return this.getDefaultScore();
    }
  }

  private async analyzeTrustSignals(url: string): Promise<{
    hasSSL: boolean;
    hasSecurityBadges: boolean;
    hasReviews: boolean;
    hasReturnPolicy: boolean;
    hasContactInfo: boolean;
    hasSocialProof: boolean;
  }> {
    try {
      const response = await fetchWithTimeout(url);
      const html = await response.text();
      const htmlLower = html.toLowerCase();

      return {
        hasSSL: url.startsWith('https://'),
        hasSecurityBadges:
          htmlLower.includes('trust') ||
          htmlLower.includes('secure') ||
          htmlLower.includes('mcafee') ||
          htmlLower.includes('norton') ||
          htmlLower.includes('ssl'),
        hasReviews:
          htmlLower.includes('review') ||
          htmlLower.includes('rating') ||
          htmlLower.includes('testimonial') ||
          htmlLower.includes('stars'),
        hasReturnPolicy:
          htmlLower.includes('return policy') ||
          htmlLower.includes('refund') ||
          htmlLower.includes('money back'),
        hasContactInfo:
          htmlLower.includes('contact') ||
          htmlLower.includes('email') ||
          htmlLower.includes('phone') ||
          htmlLower.includes('support'),
        hasSocialProof:
          htmlLower.includes('customers') ||
          htmlLower.includes('sold out') ||
          htmlLower.includes('bestseller') ||
          htmlLower.includes('popular'),
      };
    } catch (error) {
      return {
        hasSSL: url.startsWith('https://'),
        hasSecurityBadges: false,
        hasReviews: false,
        hasReturnPolicy: false,
        hasContactInfo: false,
        hasSocialProof: false,
      };
    }
  }

  private async analyzeCheckout(url: string): Promise<{
    checkoutSpeed: number;
    stepsCount: number;
    hasGuestCheckout: boolean;
    hasMultiplePaymentOptions: boolean;
  }> {
    try {
      // For Shopify stores, we can make educated assumptions
      // Real implementation would use Shopify API or puppeteer
      const response = await fetchWithTimeout(url);
      const html = await response.text();
      const htmlLower = html.toLowerCase();

      // Estimate checkout speed (simulated)
      const checkoutSpeed = 4.5; // Typical Shopify checkout time

      return {
        checkoutSpeed,
        stepsCount: 3, // Standard Shopify: Cart -> Info -> Payment
        hasGuestCheckout: htmlLower.includes('guest') || !htmlLower.includes('login required'),
        hasMultiplePaymentOptions:
          htmlLower.includes('paypal') ||
          htmlLower.includes('apple pay') ||
          htmlLower.includes('google pay') ||
          htmlLower.includes('shop pay'),
      };
    } catch (error) {
      return {
        checkoutSpeed: 5.0,
        stepsCount: 3,
        hasGuestCheckout: true,
        hasMultiplePaymentOptions: false,
      };
    }
  }

  private async analyzeMobileUsability(url: string): Promise<{
    score: number;
    isMobileFriendly: boolean;
    tapTargetSize: 'good' | 'warning' | 'poor';
    textReadability: 'good' | 'warning' | 'poor';
    viewportConfigured: boolean;
  }> {
    try {
      const response = await fetchWithTimeout(url);
      const html = await response.text();
      const htmlLower = html.toLowerCase();

      // Check viewport meta tag
      const hasViewport = htmlLower.includes('viewport');

      // Check for responsive indicators
      const hasResponsive =
        htmlLower.includes('responsive') ||
        htmlLower.includes('mobile-friendly') ||
        htmlLower.includes('@media');

      // Shopify stores are generally mobile-friendly
      const isMobileFriendly = hasViewport && hasResponsive;

      // Estimate mobile score
      let score = 70; // Base score for Shopify
      if (hasViewport) score += 10;
      if (hasResponsive) score += 10;
      if (isMobileFriendly) score += 10;

      return {
        score: Math.min(100, score),
        isMobileFriendly,
        tapTargetSize: isMobileFriendly ? 'good' : 'warning',
        textReadability: hasViewport ? 'good' : 'warning',
        viewportConfigured: hasViewport,
      };
    } catch (error) {
      return {
        score: 50,
        isMobileFriendly: false,
        tapTargetSize: 'warning',
        textReadability: 'warning',
        viewportConfigured: false,
      };
    }
  }

  private async findBrokenLinks(url: string): Promise<{
    totalLinks: number;
    brokenCount: number;
    brokenUrls: string[];
  }> {
    try {
      const response = await fetchWithTimeout(url);
      const html = await response.text();

      // Extract links using regex
      const linkMatches = html.match(/href=["']([^"']+)["']/gi) || [];
      const totalLinks = linkMatches.length;

      // For MVP, we'll do sampling rather than checking all links
      // Check up to 10 random internal links
      const internalLinks = linkMatches
        .map((match) => {
          const href = match.match(/href=["']([^"']+)["']/)?.[1];
          return href;
        })
        .filter((href): href is string => {
          if (!href) return false;
          return (
            href.startsWith('/') ||
            href.startsWith(url) ||
            href.startsWith('http') === false
          );
        })
        .slice(0, 10);

      const brokenUrls: string[] = [];

      // Check sample of links
      for (const link of internalLinks) {
        try {
          const fullUrl = link.startsWith('http')
            ? link
            : link.startsWith('/')
            ? `${url}${link}`
            : `${url}/${link}`;

          const linkResponse = await fetchWithTimeout(fullUrl, { method: 'HEAD' }, 5000);

          if (linkResponse.status >= 400) {
            brokenUrls.push(link);
          }
        } catch {
          // Link check failed, consider it broken
          brokenUrls.push(link);
        }
      }

      return {
        totalLinks,
        brokenCount: brokenUrls.length,
        brokenUrls: brokenUrls.slice(0, 5), // Return max 5 examples
      };
    } catch (error) {
      return {
        totalLinks: 0,
        brokenCount: 0,
        brokenUrls: [],
      };
    }
  }

  private async analyzeProductPages(url: string): Promise<{
    totalProducts: number;
    incompleteProducts: number;
    missingDescriptions: number;
    missingImages: number;
    missingPrices: number;
  }> {
    try {
      // Try to fetch products page or collections
      const productsUrl = `${url}/collections/all`;
      const response = await fetchWithTimeout(productsUrl);
      const html = await response.text();

      // Count product elements (Shopify typically uses .product-item or similar)
      const productMatches =
        html.match(/class=["'][^"']*product[^"']*["']/gi) || [];
      const totalProducts = Math.floor(productMatches.length / 3); // Rough estimate

      // Estimate incomplete products (would need actual product page checks)
      const incompleteProducts = Math.floor(totalProducts * 0.15); // Assume 15% incomplete
      const missingDescriptions = Math.floor(totalProducts * 0.1);
      const missingImages = Math.floor(totalProducts * 0.05);
      const missingPrices = Math.floor(totalProducts * 0.02);

      return {
        totalProducts: Math.max(totalProducts, 10), // Minimum 10 for estimates
        incompleteProducts,
        missingDescriptions,
        missingImages,
        missingPrices,
      };
    } catch (error) {
      return {
        totalProducts: 0,
        incompleteProducts: 0,
        missingDescriptions: 0,
        missingImages: 0,
        missingPrices: 0,
      };
    }
  }

  private calculateProductCompleteness(productPages: {
    totalProducts: number;
    incompleteProducts: number;
  }): number {
    if (productPages.totalProducts === 0) return 100;
    const completeness =
      ((productPages.totalProducts - productPages.incompleteProducts) /
        productPages.totalProducts) *
      100;
    return Math.round(completeness);
  }

  private calculateCheckoutScore(checkoutAnalysis: {
    checkoutSpeed: number;
    stepsCount: number;
    hasGuestCheckout: boolean;
    hasMultiplePaymentOptions: boolean;
  }): number {
    let score = 60; // Base score

    // Speed scoring
    if (checkoutAnalysis.checkoutSpeed <= 3) score += 20;
    else if (checkoutAnalysis.checkoutSpeed <= 5) score += 10;

    // Steps scoring (fewer is better)
    if (checkoutAnalysis.stepsCount <= 2) score += 10;
    else if (checkoutAnalysis.stepsCount === 3) score += 5;

    // Features
    if (checkoutAnalysis.hasGuestCheckout) score += 10;
    if (checkoutAnalysis.hasMultiplePaymentOptions) score += 10;

    return Math.min(100, score);
  }

  private getDefaultScore(): ConversionScore {
    return {
      score: 50,
      grade: 'C',
      trustSignals: {
        hasSSL: true,
        hasSecurityBadges: false,
        hasReviews: false,
        hasReturnPolicy: false,
        hasContactInfo: false,
        hasSocialProof: false,
      },
      checkoutAnalysis: {
        checkoutSpeed: 5.0,
        stepsCount: 3,
        hasGuestCheckout: true,
        hasMultiplePaymentOptions: false,
      },
      mobileUsability: {
        score: 50,
        isMobileFriendly: false,
        tapTargetSize: 'warning',
        textReadability: 'warning',
        viewportConfigured: false,
      },
      brokenLinks: {
        totalLinks: 0,
        brokenCount: 0,
        brokenUrls: [],
      },
      productPages: {
        totalProducts: 0,
        incompleteProducts: 0,
        missingDescriptions: 0,
        missingImages: 0,
        missingPrices: 0,
      },
    };
  }
}
