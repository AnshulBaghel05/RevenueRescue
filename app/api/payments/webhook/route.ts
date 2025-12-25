import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Razorpay webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const supabase = await createClient();

    console.log('[Razorpay Webhook] Event:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity, supabase);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity, supabase);
        break;

      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity, supabase);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity, supabase);
        break;

      case 'subscription.paused':
        await handleSubscriptionPaused(event.payload.subscription.entity, supabase);
        break;

      case 'subscription.resumed':
        await handleSubscriptionResumed(event.payload.subscription.entity, supabase);
        break;

      default:
        console.log('[Razorpay Webhook] Unhandled event:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Razorpay Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any, supabase: any) {
  console.log('[Webhook] Payment captured:', payment.id);

  await supabase
    .from('payments')
    .update({
      status: 'captured',
      razorpay_payment_id: payment.id,
    })
    .eq('razorpay_order_id', payment.order_id);
}

async function handlePaymentFailed(payment: any, supabase: any) {
  console.log('[Webhook] Payment failed:', payment.id);

  await supabase
    .from('payments')
    .update({
      status: 'failed',
      razorpay_payment_id: payment.id,
    })
    .eq('razorpay_order_id', payment.order_id);
}

async function handleSubscriptionActivated(subscription: any, supabase: any) {
  console.log('[Webhook] Subscription activated:', subscription.id);

  const userId = subscription.notes?.user_id;
  if (!userId) return;

  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      razorpay_subscription_id: subscription.id,
    })
    .eq('user_id', userId)
    .eq('razorpay_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
    })
    .eq('id', userId);
}

async function handleSubscriptionCancelled(subscription: any, supabase: any) {
  console.log('[Webhook] Subscription cancelled:', subscription.id);

  const userId = subscription.notes?.user_id;
  if (!userId) return;

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      subscription_tier: 'free',
      audits_limit: 3,
    })
    .eq('id', userId);
}

async function handleSubscriptionPaused(subscription: any, supabase: any) {
  console.log('[Webhook] Subscription paused:', subscription.id);

  await supabase
    .from('subscriptions')
    .update({
      status: 'paused',
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionResumed(subscription: any, supabase: any) {
  console.log('[Webhook] Subscription resumed:', subscription.id);

  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
    })
    .eq('razorpay_subscription_id', subscription.id);
}
