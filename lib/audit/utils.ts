import type { Grade } from './types';

// Calculate letter grade from numeric score
export function calculateGrade(score: number): Grade {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

// Validate and normalize store URL
export function normalizeStoreUrl(url: string): string {
  let normalized = url.trim().toLowerCase();

  // Remove protocol if present
  normalized = normalized.replace(/^https?:\/\//, '');

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');

  // Remove www. if present
  normalized = normalized.replace(/^www\./, '');

  return normalized;
}

// Check if URL is a valid Shopify store
export function isShopifyStore(url: string): boolean {
  const normalized = normalizeStoreUrl(url);

  // Check if it's a myshopify.com domain
  if (normalized.includes('.myshopify.com')) {
    return true;
  }

  // For custom domains, we'll need to check if Shopify is detected
  // This will be done in the analyzer
  return true; // Allow all URLs for now, validation happens in analyzer
}

// Generate unique audit ID (UUID v4 format for database compatibility)
export function generateAuditId(): string {
  // Generate a UUID v4 format ID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Calculate revenue impact from conversion rate difference
export function calculateRevenueImpact(
  currentConversion: number,
  potentialConversion: number,
  monthlyTraffic: number,
  averageOrderValue: number = 75
): number {
  const currentOrders = monthlyTraffic * (currentConversion / 100);
  const potentialOrders = monthlyTraffic * (potentialConversion / 100);
  const additionalOrders = potentialOrders - currentOrders;

  return Math.round(additionalOrders * averageOrderValue);
}

// Estimate monthly traffic from limited data
export function estimateMonthlyTraffic(pageViews?: number): number {
  // If we have page views, estimate based on that
  if (pageViews) {
    return Math.round(pageViews * 30);
  }

  // Default conservative estimate for a small store
  return 10000;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Calculate average from array
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// Delay helper for rate limiting
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Safe fetch with timeout
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(normalized);
    return urlObj.hostname;
  } catch {
    return normalizeStoreUrl(url);
  }
}

// Check if image is optimized
export function isImageOptimized(
  size: number,
  format: string,
  dimensions?: { width: number; height: number }
): boolean {
  // Check format
  const optimizedFormats = ['webp', 'avif'];
  if (!optimizedFormats.some(f => format.toLowerCase().includes(f))) {
    // If not modern format, check size
    if (size > 200 * 1024) { // > 200KB
      return false;
    }
  }

  // Check if dimensions are reasonable
  if (dimensions) {
    const { width, height } = dimensions;
    if (width > 2000 || height > 2000) {
      return false;
    }
  }

  return true;
}

// Parse HTML safely
export function parseHTML(html: string): Document | null {
  if (typeof DOMParser === 'undefined') {
    // Server-side: we'll need to use a library like jsdom
    return null;
  }

  try {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  } catch {
    return null;
  }
}

// Industry benchmarks
export const INDUSTRY_BENCHMARKS = {
  ecommerce: {
    averageConversion: 2.5,
    topPerformersConversion: 5.0,
    averagePageLoadTime: 3.5,
    averageCartAbandonment: 70,
  },
  performance: {
    goodLCP: 2.5, // seconds
    needsImprovementLCP: 4.0,
    goodFID: 100, // milliseconds
    needsImprovementFID: 300,
    goodCLS: 0.1,
    needsImprovementCLS: 0.25,
  },
};

// Calculate performance score from metrics
export function calculatePerformanceScore(metrics: {
  lcp: number;
  fid: number;
  cls: number;
  tti: number;
  speedIndex: number;
}): number {
  const lcpScore = metrics.lcp <= 2.5 ? 100 : metrics.lcp <= 4.0 ? 75 : 50;
  const fidScore = metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 75 : 50;
  const clsScore = metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 75 : 50;
  const ttiScore = metrics.tti <= 3.8 ? 100 : metrics.tti <= 7.3 ? 75 : 50;
  const speedScore = metrics.speedIndex <= 3.4 ? 100 : metrics.speedIndex <= 5.8 ? 75 : 50;

  // Weighted average
  const score = (
    lcpScore * 0.25 +
    fidScore * 0.15 +
    clsScore * 0.15 +
    ttiScore * 0.25 +
    speedScore * 0.20
  );

  return Math.round(score);
}

// Calculate conversion score from factors
export function calculateConversionScore(factors: {
  trustSignalsCount: number; // out of 6
  mobileScore: number; // 0-100
  brokenLinksCount: number;
  productCompleteness: number; // 0-100
  checkoutScore: number; // 0-100
}): number {
  const trustScore = (factors.trustSignalsCount / 6) * 100;
  const linkScore = factors.brokenLinksCount === 0 ? 100 : Math.max(0, 100 - factors.brokenLinksCount * 10);

  const score = (
    trustScore * 0.25 +
    factors.mobileScore * 0.25 +
    linkScore * 0.15 +
    factors.productCompleteness * 0.20 +
    factors.checkoutScore * 0.15
  );

  return Math.round(score);
}
