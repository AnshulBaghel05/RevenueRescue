import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { AuditReportTemplate } from '@/lib/pdf/AuditReportTemplate';
import type { AuditResult } from '@/lib/audit/types';

export const dynamic = 'force-dynamic';

// Note: For production, you would integrate with an email service like:
// - Resend (https://resend.com)
// - SendGrid
// - AWS SES
// - Postmark
//
// For now, this is a placeholder that generates the PDF and returns success
// In production, you would send the PDF as an email attachment

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { auditId, recipientEmail } = body;

    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Use user's email if no recipient specified
    const emailTo = recipientEmail || user.email;

    // Fetch audit from database
    const { data: auditData, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', user.id)
      .single();

    if (auditError || !auditData) {
      console.error('[PDF Email] Audit fetch error:', auditError);
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    // Check user subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, company_name, email')
      .eq('id', user.id)
      .single();

    // PDF export is available for Starter and Pro users
    if (
      profile?.subscription_tier !== 'starter' &&
      profile?.subscription_tier !== 'pro'
    ) {
      return NextResponse.json(
        {
          error: 'PDF export is only available for Starter and Pro users',
          upgrade: true,
        },
        { status: 403 }
      );
    }

    // Custom branding for Pro users only
    const customBranding =
      profile?.subscription_tier === 'pro'
        ? {
            companyName: profile.company_name || undefined,
          }
        : undefined;

    // Transform database audit to AuditResult type (same as generate endpoint)
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
      issues: [],
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

    // Populate issues
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

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      <AuditReportTemplate audit={audit} customBranding={customBranding} />
    );

    // TODO: Integrate with email service
    // Example with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'RevenueRescue <reports@revenuerescue.com>',
    //   to: emailTo,
    //   subject: `Your Shopify Audit Report - ${auditData.store_url}`,
    //   html: `
    //     <h1>Your Shopify Store Audit Report</h1>
    //     <p>Here's your comprehensive audit report for ${auditData.store_url}</p>
    //     <p><strong>Overall Score:</strong> ${auditData.overall_score}/100 (${auditData.grade})</p>
    //     <p>The detailed PDF report is attached to this email.</p>
    //   `,
    //   attachments: [
    //     {
    //       filename: `audit-report-${new Date().toISOString().split('T')[0]}.pdf`,
    //       content: pdfBuffer,
    //     },
    //   ],
    // });

    // For now, just return success
    console.log(
      `[PDF Email] Would send PDF to ${emailTo} for audit ${auditId}`
    );

    return NextResponse.json({
      success: true,
      message: `Report will be sent to ${emailTo}`,
      note: 'Email integration not yet configured. Please set up Resend, SendGrid, or another email service.',
    });
  } catch (error) {
    console.error('[PDF Email] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
