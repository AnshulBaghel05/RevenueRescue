import type {
  Issue,
  Recommendation,
  PerformanceScore,
  ConversionScore,
  RevenueImpact,
} from './types';
import { formatCurrency } from './utils';

export function generateIssues(
  performance: PerformanceScore,
  conversion: ConversionScore,
  revenue: RevenueImpact
): Issue[] {
  const issues: Issue[] = [];
  let issueId = 1;

  // Performance issues
  if (performance.metrics.lcp > 2.5) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'poor_lcp',
      severity: performance.metrics.lcp > 4.0 ? 'critical' : 'high',
      title: 'Slow Largest Contentful Paint (LCP)',
      description: `Your LCP is ${performance.metrics.lcp.toFixed(1)}s. Google recommends under 2.5s for good user experience.`,
      impact: 'Slow LCP directly impacts user experience and Google rankings, leading to higher bounce rates.',
      revenueImpact: revenue.breakdown.performanceIssues * 0.3,
      effort: 'medium',
      estimatedTimeToFix: '2-4 hours',
      category: 'performance',
    });
  }

  if (performance.metrics.cls > 0.1) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'high_cls',
      severity: performance.metrics.cls > 0.25 ? 'critical' : 'high',
      title: 'High Cumulative Layout Shift (CLS)',
      description: `Your CLS score is ${performance.metrics.cls.toFixed(2)}. This causes annoying layout jumps as the page loads.`,
      impact: 'Layout shifts frustrate users and can cause accidental clicks, hurting conversion rates.',
      revenueImpact: revenue.breakdown.performanceIssues * 0.2,
      effort: 'medium',
      estimatedTimeToFix: '1-3 hours',
      category: 'performance',
    });
  }

  if (performance.pageLoadTime.mobile > 3.5) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'slow_page_load',
      severity: 'critical',
      title: 'Slow Mobile Page Load Time',
      description: `Mobile pages take ${performance.pageLoadTime.mobile.toFixed(1)}s to load. Industry benchmark is under 3.5s.`,
      impact: '53% of mobile users abandon sites that take longer than 3 seconds to load.',
      revenueImpact: revenue.breakdown.mobileIssues * 0.4,
      effort: 'medium',
      estimatedTimeToFix: '3-6 hours',
      category: 'performance',
    });
  }

  if (performance.imageOptimization.oversizedImages > 0) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'oversized_images',
      severity: performance.imageOptimization.oversizedImages > 10 ? 'high' : 'medium',
      title: 'Oversized Images Slowing Your Site',
      description: `Found ${performance.imageOptimization.oversizedImages} oversized images. Potential savings: ${Math.round(performance.imageOptimization.potentialSavings / 1024)}MB`,
      impact: 'Large images increase page load time and consume mobile data, frustrating users.',
      revenueImpact: revenue.breakdown.performanceIssues * 0.15,
      effort: 'easy',
      estimatedTimeToFix: '30 minutes - 2 hours',
      category: 'performance',
    });
  }

  // Trust signal issues
  if (!conversion.trustSignals.hasSSL) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'missing_ssl',
      severity: 'critical',
      title: 'Missing SSL Certificate',
      description: 'Your store does not have HTTPS enabled. This is a major trust and security issue.',
      impact: 'Browsers warn users about insecure sites. 85% of users abandon purchases on non-HTTPS sites.',
      revenueImpact: revenue.breakdown.trustIssues * 0.4,
      effort: 'easy',
      estimatedTimeToFix: '15 minutes',
      category: 'trust',
    });
  }

  if (!conversion.trustSignals.hasSecurityBadges) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'no_security_badges',
      severity: 'high',
      title: 'Missing Security & Trust Badges',
      description: 'No visible security badges or trust seals found on your store.',
      impact: 'Trust badges can increase conversions by up to 42% by reducing purchase anxiety.',
      revenueImpact: revenue.breakdown.trustIssues * 0.3,
      effort: 'easy',
      estimatedTimeToFix: '15-30 minutes',
      category: 'trust',
    });
  }

  if (!conversion.trustSignals.hasReviews) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'missing_reviews',
      severity: 'high',
      title: 'No Customer Reviews Visible',
      description: 'Product reviews are missing or not prominently displayed.',
      impact: '95% of shoppers read reviews before purchasing. Missing reviews hurt trust and conversions.',
      revenueImpact: revenue.breakdown.trustIssues * 0.3,
      effort: 'easy',
      estimatedTimeToFix: '1 hour',
      category: 'trust',
    });
  }

  // Mobile issues
  if (conversion.mobileUsability.score < 70) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'mobile_unfriendly',
      severity: 'critical',
      title: 'Poor Mobile Experience',
      description: `Mobile usability score is ${conversion.mobileUsability.score}/100. With 70%+ mobile traffic, this is costing you sales.`,
      impact: 'Poor mobile experience leads to high bounce rates and abandoned carts on mobile devices.',
      revenueImpact: revenue.breakdown.mobileIssues * 0.5,
      effort: 'hard',
      estimatedTimeToFix: '1-2 days',
      category: 'mobile',
    });
  }

  if (conversion.mobileUsability.tapTargetSize === 'poor') {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'poor_mobile_tap_targets',
      severity: 'medium',
      title: 'Tap Targets Too Small on Mobile',
      description: 'Buttons and links are too small or too close together on mobile devices.',
      impact: 'Users struggle to tap the right elements, leading to frustration and cart abandonment.',
      revenueImpact: revenue.breakdown.mobileIssues * 0.2,
      effort: 'medium',
      estimatedTimeToFix: '2-4 hours',
      category: 'mobile',
    });
  }

  // Broken links
  if (conversion.brokenLinks.brokenCount > 0) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'broken_links',
      severity: conversion.brokenLinks.brokenCount > 5 ? 'high' : 'medium',
      title: `${conversion.brokenLinks.brokenCount} Broken Links Found`,
      description: 'Broken internal links hurt SEO and create a poor user experience.',
      impact: 'Broken links reduce trust, hurt Google rankings, and frustrate users trying to navigate your store.',
      revenueImpact: revenue.breakdown.conversionIssues * 0.15,
      effort: 'easy',
      estimatedTimeToFix: '1-2 hours',
      category: 'seo',
      affectedUrls: conversion.brokenLinks.brokenUrls,
    });
  }

  // Product page issues
  if (conversion.productPages.incompleteProducts > 0) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'incomplete_products',
      severity: 'high',
      title: `${conversion.productPages.incompleteProducts} Incomplete Product Pages`,
      description: 'Products missing descriptions, images, or other critical information.',
      impact: 'Incomplete product pages prevent customers from making informed decisions, reducing conversions.',
      revenueImpact: revenue.breakdown.conversionIssues * 0.25,
      effort: 'medium',
      estimatedTimeToFix: '4-8 hours',
      category: 'products',
    });
  }

  // Checkout issues
  if (conversion.checkoutAnalysis.checkoutSpeed > 5.0) {
    issues.push({
      id: `issue_${issueId++}`,
      type: 'slow_checkout',
      severity: 'high',
      title: 'Slow Checkout Process',
      description: `Checkout takes ${conversion.checkoutAnalysis.checkoutSpeed.toFixed(1)}s to complete. This is causing cart abandonment.`,
      impact: 'Every extra second in checkout increases abandonment by 7%.',
      revenueImpact: revenue.breakdown.conversionIssues * 0.3,
      effort: 'medium',
      estimatedTimeToFix: '3-6 hours',
      category: 'conversion',
    });
  }

  return issues.sort((a, b) => b.revenueImpact - a.revenueImpact);
}

export function generateRecommendations(issues: Issue[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let recId = 1;

  for (const issue of issues) {
    const recommendation = createRecommendation(issue, recId++);
    if (recommendation) {
      recommendations.push(recommendation);
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority);
}

function createRecommendation(issue: Issue, id: number): Recommendation | null {
  const baseRec = {
    id: `rec_${id}`,
    priority: calculatePriority(issue),
    impact: issue.severity,
    effort: issue.effort,
    estimatedRevenueLift: issue.revenueImpact,
  };

  switch (issue.type) {
    case 'poor_lcp':
      return {
        ...baseRec,
        title: 'Optimize Largest Contentful Paint',
        description: 'Improve your LCP score to under 2.5s by optimizing images, removing render-blocking resources, and improving server response time.',
        steps: [
          'Compress and resize hero images to under 200KB',
          'Use WebP or AVIF image formats',
          'Implement lazy loading for below-fold images',
          'Minimize CSS and JavaScript files',
          'Use a CDN for faster asset delivery',
        ],
        resources: [
          { title: 'Google LCP Guide', url: 'https://web.dev/lcp/' },
        ],
      };

    case 'oversized_images':
      return {
        ...baseRec,
        title: 'Compress Oversized Images',
        description: 'Reduce image file sizes by 60-80% without visible quality loss using image compression.',
        steps: [
          'Use TinyPNG or ImageOptim to compress all product images',
          'Convert images to WebP format',
          'Set maximum image dimensions to 2000x2000px',
          'Enable lazy loading in your theme settings',
          'Use Shopify\'s built-in image optimization',
        ],
        resources: [
          { title: 'TinyPNG', url: 'https://tinypng.com/' },
        ],
        isInstantWin: true,
      };

    case 'no_security_badges':
      return {
        ...baseRec,
        title: 'Add Trust & Security Badges',
        description: 'Display security badges, payment icons, and trust seals prominently on your product and checkout pages.',
        steps: [
          'Add SSL/HTTPS badge to footer',
          'Display accepted payment methods (Visa, Mastercard, PayPal, etc.)',
          'Add money-back guarantee badge',
          'Show "Secure Checkout" text near checkout button',
          'Consider adding third-party trust seals (McAfee, Norton, etc.)',
        ],
        isInstantWin: true,
      };

    case 'missing_reviews':
      return {
        ...baseRec,
        title: 'Add Customer Reviews',
        description: 'Implement a review system to display customer testimonials and product ratings.',
        steps: [
          'Install a review app from Shopify App Store (Judge.me, Loox, Yotpo)',
          'Import existing reviews if available',
          'Send automated review request emails',
          'Display star ratings on product pages',
          'Feature top reviews on homepage',
        ],
        resources: [
          { title: 'Judge.me Reviews', url: 'https://apps.shopify.com/judgeme' },
        ],
      };

    case 'mobile_unfriendly':
      return {
        ...baseRec,
        title: 'Fix Mobile Usability Issues',
        description: 'Optimize your store for mobile devices where 70%+ of traffic comes from.',
        steps: [
          'Test your store on multiple mobile devices',
          'Increase button sizes to at least 48x48 pixels',
          'Ensure text is readable without zooming (min 16px)',
          'Fix horizontal scrolling issues',
          'Simplify mobile navigation',
          'Test mobile checkout flow',
        ],
        resources: [
          { title: 'Mobile-Friendly Test', url: 'https://search.google.com/test/mobile-friendly' },
        ],
      };

    case 'broken_links':
      return {
        ...baseRec,
        title: 'Fix Broken Links',
        description: 'Repair or redirect broken internal and external links to improve SEO and user experience.',
        steps: [
          'Review list of broken URLs',
          'Update or remove broken links',
          'Set up 301 redirects for moved pages',
          'Check navigation menu links',
          'Verify all footer links work',
        ],
        isInstantWin: true,
      };

    case 'incomplete_products':
      return {
        ...baseRec,
        title: 'Complete Product Information',
        description: 'Add missing descriptions, images, and specifications to all product pages.',
        steps: [
          'Audit all product pages for completeness',
          'Add detailed descriptions (minimum 150 words)',
          'Upload high-quality product images (3-5 per product)',
          'Add product specifications and dimensions',
          'Include sizing guides where applicable',
        ],
      };

    case 'slow_checkout':
      return {
        ...baseRec,
        title: 'Optimize Checkout Speed',
        description: 'Reduce checkout time and friction to recover abandoned carts.',
        steps: [
          'Enable Shopify\'s accelerated checkout',
          'Remove unnecessary checkout fields',
          'Enable guest checkout',
          'Add express payment options (Apple Pay, Google Pay)',
          'Show shipping costs upfront',
        ],
      };

    default:
      return null;
  }
}

function calculatePriority(issue: Issue): number {
  // Priority based on revenue impact and effort
  const impactScore = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 2,
  }[issue.severity];

  const effortScore = {
    easy: 3,
    medium: 2,
    hard: 1,
  }[issue.effort];

  // Normalized revenue impact (0-10)
  const revenueScore = Math.min(10, issue.revenueImpact / 500);

  // Weighted priority
  return Math.round(impactScore * 0.4 + effortScore * 0.3 + revenueScore * 0.3);
}
