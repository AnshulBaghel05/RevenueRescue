import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET - Fetch user's scheduled audits
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

    // Fetch user's scheduled audits
    const { data: scheduledAudits, error } = await supabase
      .from('scheduled_audits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Scheduled Audits] Error fetching:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scheduled audits' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduledAudits: scheduledAudits || [],
    });
  } catch (error) {
    console.error('[Scheduled Audits] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new scheduled audit
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

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (!profile || profile.subscription_tier === 'free') {
      return NextResponse.json(
        { error: 'Scheduled audits are only available for Starter and Pro plans' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { store_url, frequency } = body;

    // Validate input
    if (!store_url || !frequency) {
      return NextResponse.json(
        { error: 'Store URL and frequency are required' },
        { status: 400 }
      );
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json(
        { error: 'Invalid frequency. Must be daily, weekly, or monthly' },
        { status: 400 }
      );
    }

    // Validate store URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(store_url)) {
      return NextResponse.json(
        { error: 'Invalid store URL format' },
        { status: 400 }
      );
    }

    // Calculate next run time
    const nextRunAt = new Date();
    switch (frequency) {
      case 'daily':
        nextRunAt.setDate(nextRunAt.getDate() + 1);
        break;
      case 'weekly':
        nextRunAt.setDate(nextRunAt.getDate() + 7);
        break;
      case 'monthly':
        nextRunAt.setMonth(nextRunAt.getMonth() + 1);
        break;
    }

    // Create scheduled audit (trigger will check limits)
    const { data: scheduledAudit, error } = await supabase
      .from('scheduled_audits')
      .insert({
        user_id: user.id,
        store_url,
        frequency,
        next_run_at: nextRunAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[Scheduled Audits] Error creating:', error);

      // Check if error is due to limit
      if (error.message.includes('reached the maximum')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }

      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You already have a scheduled audit for this store' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create scheduled audit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduledAudit,
      message: `Scheduled ${frequency} audit for ${store_url}`,
    });
  } catch (error) {
    console.error('[Scheduled Audits] POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update scheduled audit
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { id, is_active, frequency } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Scheduled audit ID is required' },
        { status: 400 }
      );
    }

    // Build update object
    const updates: any = {};
    if (typeof is_active === 'boolean') {
      updates.is_active = is_active;
    }
    if (frequency && ['daily', 'weekly', 'monthly'].includes(frequency)) {
      updates.frequency = frequency;

      // Recalculate next run time if frequency changed
      const nextRunAt = new Date();
      switch (frequency) {
        case 'daily':
          nextRunAt.setDate(nextRunAt.getDate() + 1);
          break;
        case 'weekly':
          nextRunAt.setDate(nextRunAt.getDate() + 7);
          break;
        case 'monthly':
          nextRunAt.setMonth(nextRunAt.getMonth() + 1);
          break;
      }
      updates.next_run_at = nextRunAt.toISOString();
    }

    // Update scheduled audit
    const { data: scheduledAudit, error } = await supabase
      .from('scheduled_audits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[Scheduled Audits] Error updating:', error);
      return NextResponse.json(
        { error: 'Failed to update scheduled audit' },
        { status: 500 }
      );
    }

    if (!scheduledAudit) {
      return NextResponse.json(
        { error: 'Scheduled audit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduledAudit,
      message: 'Scheduled audit updated successfully',
    });
  } catch (error) {
    console.error('[Scheduled Audits] PATCH Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove scheduled audit
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Scheduled audit ID is required' },
        { status: 400 }
      );
    }

    // Delete scheduled audit
    const { error } = await supabase
      .from('scheduled_audits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Scheduled Audits] Error deleting:', error);
      return NextResponse.json(
        { error: 'Failed to delete scheduled audit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduled audit deleted successfully',
    });
  } catch (error) {
    console.error('[Scheduled Audits] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
