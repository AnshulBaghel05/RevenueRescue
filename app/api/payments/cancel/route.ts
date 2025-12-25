import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Update subscription to cancelled
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancel_at_period_end: true,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      throw updateError;
    }

    // Update profile status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
      })
      .eq('id', user.id);

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
      cancelsAt: subscription.current_end,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
