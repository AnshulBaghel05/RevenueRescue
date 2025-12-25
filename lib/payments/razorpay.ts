// Razorpay Payment Integration
// Handles subscription creation, verification, and management

import Razorpay from 'razorpay';

// Initialize Razorpay instance (server-side only)
export function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Razorpay plans configuration
export const RAZORPAY_PLANS = {
  starter: {
    name: 'Starter Plan',
    amount: 2900, // $29 per month (in cents)
    currency: 'USD',
    period: 'monthly',
    interval: 1,
    audits_limit: 16,
    features: [
      '16 audits per month',
      'Performance & conversion analysis',
      'Revenue impact calculator',
      'Priority fix recommendations',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro Plan',
    amount: 7900, // $79 per month (in cents)
    currency: 'USD',
    period: 'monthly',
    interval: 1,
    audits_limit: 30,
    features: [
      '30 audits per month',
      'Everything in Starter',
      'Weekly automated audits',
      'Trend analysis & insights',
      'PDF export reports',
      'Priority support',
      'Custom recommendations',
    ],
  },
} as const;

export type PlanType = keyof typeof RAZORPAY_PLANS;

// Create a subscription
export async function createSubscription(planId: string, customerId: string) {
  const razorpay = getRazorpayInstance();

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months
      notes: {
        customer_id: customerId,
      },
    });

    return subscription;
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error);
    throw error;
  }
}

// Verify payment signature
export function verifyPaymentSignature(
  razorpaySubscriptionId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const crypto = require('crypto');

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayPaymentId}|${razorpaySubscriptionId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const razorpay = getRazorpayInstance();

  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  const razorpay = getRazorpayInstance();

  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

// Format amount for display (cents to dollars)
export function formatAmount(amountInCents: number): string {
  return `$${(amountInCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Get plan details
export function getPlanDetails(planType: PlanType) {
  return RAZORPAY_PLANS[planType];
}
