import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaymentSignature, RAZORPAY_PLANS, type PlanType } from '@/lib/payments/razorpay';

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

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planType,
    } = await request.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !planType) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    const plan = RAZORPAY_PLANS[planType as PlanType];

    // Update payment status
    await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        status: 'captured',
      })
      .eq('razorpay_order_id', razorpay_order_id);

    // Create subscription record
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    await supabase.from('subscriptions').insert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      plan_name: planType,
      amount: plan.amount,
      currency: plan.currency,
      billing_cycle: 'monthly',
      status: 'active',
      current_start: new Date().toISOString(),
      current_end: subscriptionEndDate.toISOString(),
      audits_per_month: plan.audits_limit,
      audits_used_this_period: 0,
      period_start: new Date().toISOString(),
      period_end: subscriptionEndDate.toISOString(),
    });

    // Update user profile
    await supabase
      .from('profiles')
      .update({
        subscription_tier: planType,
        subscription_status: 'active',
        subscription_ends_at: subscriptionEndDate.toISOString(),
        audits_limit: plan.audits_limit,
        audits_used: 0, // Reset usage
      })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
