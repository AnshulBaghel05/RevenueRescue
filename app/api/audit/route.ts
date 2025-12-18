import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auditEngine } from '@/lib/audit/engine';
import { cacheAudit, getCachedAudit } from '@/lib/audit/cache';
import type { AuditRequest } from '@/lib/audit/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeUrl, userId } = body;

    if (!storeUrl) {
      return NextResponse.json(
        { error: 'Store URL is required' },
        { status: 400 }
      );
    }

    // Validate user if userId provided
    if (userId) {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || user.id !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Check user's audit quota
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, audits_used, audits_limit')
        .eq('id', userId)
        .single();

      if (profile && profile.audits_used >= profile.audits_limit) {
        return NextResponse.json(
          { error: 'Audit limit reached. Please upgrade your plan.' },
          { status: 403 }
        );
      }
    }

    // Log the audit request
    console.log('[Audit API] Starting audit for:', storeUrl, userId ? `(user: ${userId})` : '(anonymous)');

    // Run the audit
    const auditRequest: AuditRequest = {
      storeUrl,
      userId,
      auditType: 'public',
    };

    const result = await auditEngine.runAudit(auditRequest);
    console.log('[Audit API] Audit completed:', result.id, 'Score:', result.overallScore);

    // For authenticated users, save to database
    if (userId) {
      const supabase = await createClient();

      console.log('[Audit API] Saving audit to database:', result.id);

      // Save audit result
      const { error: insertError } = await supabase.from('audits').insert({
        id: result.id,
        user_id: userId,
        store_url: result.storeUrl,
        overall_score: result.overallScore,
        overall_grade: result.overallGrade,
        performance_score: result.performanceScore.score,
        conversion_score: result.conversionScore.score,
        estimated_revenue_loss: result.revenueImpact.estimatedMonthlyLoss,
        results: result,
        status: 'completed',
      });

      if (insertError) {
        console.error('[Audit API] Insert error:', insertError);
        console.error('[Audit API] Insert error details:', JSON.stringify(insertError, null, 2));
        return NextResponse.json(
          {
            error: 'Failed to save audit to database',
            message: insertError.message || 'Database error',
            details: insertError,
          },
          { status: 500 }
        );
      }

      console.log('[Audit API] Successfully saved to database');

      // Increment audits_used counter
      const { error: rpcError } = await supabase.rpc('increment_audits_used', { user_id: userId });

      if (rpcError) {
        console.error('[Audit API] RPC error:', rpcError);
        // Don't fail the request for counter errors, just log it
      }

      console.log('[Audit API] Audit saved and counter incremented successfully');
    } else {
      // For anonymous users, cache the result in memory (expires in 1 hour)
      cacheAudit(result);
      console.log('[Audit API] Cached anonymous audit:', result.id);
    }

    return NextResponse.json({
      success: true,
      audit: result,
    });
  } catch (error) {
    console.error('Audit API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to run audit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const auditId = searchParams.get('id');

    console.log('[Audit API GET] Fetching audit:', auditId);

    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // First, check in-memory cache (for anonymous audits)
    const cachedAudit = getCachedAudit(auditId);
    if (cachedAudit) {
      console.log('[Audit API GET] Found in cache:', auditId);
      return NextResponse.json({
        success: true,
        audit: cachedAudit,
      });
    }

    console.log('[Audit API GET] Not in cache, checking database:', auditId);

    // If not in cache, check database (for authenticated audits)
    const supabase = await createClient();
    const { data: audit, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single();

    if (error || !audit) {
      console.log('[Audit API GET] Audit not found:', auditId, error);
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    console.log('[Audit API GET] Found in database:', auditId);
    return NextResponse.json({
      success: true,
      audit: audit.results,
    });
  } catch (error) {
    console.error('Get audit API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    );
  }
}
