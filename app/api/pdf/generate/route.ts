import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToStream } from '@react-pdf/renderer';
import { AuditReportTemplate } from '@/lib/pdf/AuditReportTemplate';
import type { AuditResult } from '@/lib/audit/types';
import { createElement } from 'react';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get audit ID from query params
    const searchParams = request.nextUrl.searchParams;
    const auditId = searchParams.get('auditId');

    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Fetch audit from database
    const { data: auditData, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', user.id)
      .single();

    if (auditError || !auditData) {
      console.error('[PDF Generate] Audit fetch error:', auditError);
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    // Check user subscription tier (PDF export is Pro feature)
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, company_name')
      .eq('id', user.id)
      .single();

    // Only Pro users get custom branding
    const customBranding =
      profile?.subscription_tier === 'pro'
        ? {
            companyName: profile.company_name || undefined,
          }
        : undefined;

    // Transform database audit to AuditResult type
    const audit: AuditResult = {
      id: auditData.id,
      storeUrl: auditData.store_url,
      overallScore: auditData.overall_score || 0,
      overallGrade: auditData.grade || 'F',
      performanceScore: auditData.performance_data || {
        score: auditData.performance_score || 0,
        grade: 'F',
        metrics: {
          lcp: 0,
          fid: 0,
          cls: 0,
          fcp: 0,
          tti: 0,
          speedIndex: 0,
          totalBlockingTime: 0,
        },
        pageLoadTime: { desktop: 0, mobile: 0 },
        imageOptimization: {
          totalImages: 0,
          oversizedImages: 0,
          unoptimizedImages: 0,
          potentialSavings: 0,
        },
      },
      conversionScore: auditData.conversion_data || {
        score: auditData.conversion_score || 0,
        grade: 'F',
        trustSignals: {
          hasSSL: false,
          hasSecurityBadges: false,
          hasReviews: false,
          hasReturnPolicy: false,
          hasContactInfo: false,
          hasSocialProof: false,
        },
        checkoutAnalysis: {
          checkoutSpeed: 0,
          stepsCount: 0,
          hasGuestCheckout: false,
          hasMultiplePaymentOptions: false,
        },
        mobileUsability: {
          score: auditData.mobile_score || 0,
          isMobileFriendly: false,
          tapTargetSize: 'poor',
          textReadability: 'poor',
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
      },
      revenueImpact: auditData.revenue_data || {
        estimatedMonthlyLoss: 0,
        estimatedRecovery: 0,
        breakdown: {
          performanceIssues: 0,
          conversionIssues: 0,
          mobileIssues: 0,
          trustIssues: 0,
        },
        benchmarking: {
          industryAverageConversion: 2.5,
          yourConversionRate: 0,
          topPerformersConversion: 5.0,
        },
      },
      issues: [], // Will be populated from instant_wins and priority_fixes
      recommendations: [],
      instantWins: auditData.instant_wins || [],
      metadata: {
        duration: auditData.audit_duration_seconds || 0,
        timestamp: auditData.created_at,
        version: '1.0',
        checksPerformed: [],
        storePlatform: 'shopify',
      },
      createdAt: auditData.created_at,
    };

    // Combine instant_wins and priority_fixes into issues
    const instantWinIssues = (auditData.instant_wins || []).map(
      (win: any, idx: number) => ({
        id: `instant-${idx}`,
        type: 'quick_win',
        severity: 'medium' as const,
        title: win.title || 'Quick Win',
        description: win.description || '',
        impact: `Can be fixed quickly for immediate impact`,
        revenueImpact: win.estimatedRevenueLift || 0,
        effort: win.effort || 'easy',
        estimatedTimeToFix: '5 minutes',
        category: 'conversion' as const,
      })
    );

    const priorityFixIssues = (auditData.priority_fixes || []).map(
      (fix: any, idx: number) => ({
        id: `priority-${idx}`,
        type: 'priority_fix',
        severity: fix.impact || ('high' as const),
        title: fix.title || 'Priority Fix',
        description: fix.description || '',
        impact: `High priority issue affecting revenue`,
        revenueImpact: fix.estimatedRevenueLift || 0,
        effort: fix.effort || 'medium',
        estimatedTimeToFix: fix.estimatedTimeToFix || '1 hour',
        category: 'performance' as const,
      })
    );

    audit.issues = [...instantWinIssues, ...priorityFixIssues];
    audit.recommendations = [
      ...(auditData.instant_wins || []),
      ...(auditData.priority_fixes || []),
    ];

    // Generate PDF using react-pdf
    const stream = await renderToStream(
      createElement(AuditReportTemplate, { audit, customBranding }) as any
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF as downloadable file
    const filename = `audit-${auditData.store_url
      .replace(/https?:\/\//, '')
      .replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[PDF Generate] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
