import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRazorpayInstance, RAZORPAY_PLANS, type PlanType } from '@/lib/payments/razorpay';

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

    const { planType } = await request.json();

    if (!planType || !(planType in RAZORPAY_PLANS)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    const plan = RAZORPAY_PLANS[planType as PlanType];
    const razorpay = getRazorpayInstance();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.amount * 100, // Convert to paise
      currency: plan.currency,
      receipt: `order_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_type: planType,
      },
    });

    // Save order to database
    await supabase.from('payments').insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: plan.amount,
      currency: plan.currency,
      status: 'created',
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
