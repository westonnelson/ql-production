import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handleSuccessfulPayment(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get the agent associated with this customer
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!agent) {
    console.error('No agent found for customer:', customerId);
    return;
  }

  // Update the agent's subscription status
  await supabase
    .from('agents')
    .update({
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_tier: subscription.items.data[0].price.id,
      subscription_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    })
    .eq('id', agent.id);

  // If this is a new subscription, send a welcome email
  if (subscription.status === 'active' && subscription.items.data[0].price.id) {
    // TODO: Send welcome email to agent
    console.log('New subscription activated for agent:', agent.id);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get the agent associated with this customer
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!agent) {
    console.error('No agent found for customer:', customerId);
    return;
  }

  // Update the agent's subscription status
  await supabase
    .from('agents')
    .update({
      subscription_status: 'canceled',
      subscription_canceled_at: new Date().toISOString(),
    })
    .eq('id', agent.id);

  // TODO: Send cancellation email to agent
  console.log('Subscription canceled for agent:', agent.id);
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Get the agent associated with this customer
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!agent) {
    console.error('No agent found for customer:', customerId);
    return;
  }

  // Record the successful payment
  await supabase
    .from('payments')
    .insert({
      agent_id: agent.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      stripe_invoice_id: invoice.id,
      payment_date: new Date().toISOString(),
    });

  // TODO: Send payment confirmation email to agent
  console.log('Payment succeeded for agent:', agent.id);
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Get the agent associated with this customer
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!agent) {
    console.error('No agent found for customer:', customerId);
    return;
  }

  // Record the failed payment
  await supabase
    .from('payments')
    .insert({
      agent_id: agent.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      stripe_invoice_id: invoice.id,
      payment_date: new Date().toISOString(),
    });

  // TODO: Send payment failure notification email to agent
  console.log('Payment failed for agent:', agent.id);
} 