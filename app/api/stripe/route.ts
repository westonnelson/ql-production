import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case 'create-subscription':
        return await handleCreateSubscription(data);
      case 'update-subscription':
        return await handleUpdateSubscription(data);
      case 'cancel-subscription':
        return await handleCancelSubscription(data);
      case 'create-payment-intent':
        return await handleCreatePaymentIntent(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCreateSubscription(data: {
  customerId: string;
  priceId: string;
  agentId: string;
}) {
  try {
    const { customerId, priceId, agentId } = data;

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update agent's subscription status in Supabase
    await supabase
      .from('agents')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_tier: priceId,
      })
      .eq('id', agentId);

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

async function handleUpdateSubscription(data: {
  subscriptionId: string;
  priceId: string;
  agentId: string;
}) {
  try {
    const { subscriptionId, priceId, agentId } = data;

    // Update the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{ price: priceId }],
    });

    // Update agent's subscription status in Supabase
    await supabase
      .from('agents')
      .update({
        subscription_status: subscription.status,
        subscription_tier: priceId,
      })
      .eq('id', agentId);

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

async function handleCancelSubscription(data: {
  subscriptionId: string;
  agentId: string;
}) {
  try {
    const { subscriptionId, agentId } = data;

    // Cancel the subscription
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update agent's subscription status in Supabase
    await supabase
      .from('agents')
      .update({
        subscription_status: 'canceled',
      })
      .eq('id', agentId);

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

async function handleCreatePaymentIntent(data: {
  amount: number;
  currency: string;
  customerId: string;
}) {
  try {
    const { amount, currency, customerId } = data;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 