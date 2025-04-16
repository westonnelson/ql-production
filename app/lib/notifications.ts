import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Consumer Notifications
export async function sendQuoteConfirmation(quoteId: string, consumerEmail: string) {
  try {
    const { data: quote } = await supabase
      .from('quotes')
      .select('*, insurance_type')
      .eq('id', quoteId)
      .single();

    if (!quote) {
      throw new Error('Quote not found');
    }

    await resend.emails.send({
      from: 'QuoteLinker <quotes@quotelinker.com>',
      to: consumerEmail,
      subject: 'Your Insurance Quote Request Confirmation',
      html: `
        <h1>Thank you for your quote request!</h1>
        <p>We've received your request for ${quote.insurance_type} insurance.</p>
        <p>Our team of licensed agents will review your information and contact you shortly with personalized quotes.</p>
        <p>Quote Reference: ${quoteId}</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    });

    // Log the notification
    await supabase.from('notifications').insert({
      recipient_type: 'consumer',
      recipient_email: consumerEmail,
      notification_type: 'quote_confirmation',
      quote_id: quoteId,
      status: 'sent',
    });
  } catch (error) {
    console.error('Error sending quote confirmation:', error);
    throw error;
  }
}

export async function sendAgentAssigned(quoteId: string, consumerEmail: string, agentEmail: string) {
  try {
    const { data: quote } = await supabase
      .from('quotes')
      .select('*, insurance_type, agent:agents(name)')
      .eq('id', quoteId)
      .single();

    if (!quote) {
      throw new Error('Quote not found');
    }

    // Send email to consumer
    await resend.emails.send({
      from: 'QuoteLinker <quotes@quotelinker.com>',
      to: consumerEmail,
      subject: 'Your Insurance Agent Has Been Assigned',
      html: `
        <h1>Your Insurance Agent is Ready to Help</h1>
        <p>We've assigned ${quote.agent.name} to help you with your ${quote.insurance_type} insurance needs.</p>
        <p>You'll receive a call or email from them shortly to discuss your options.</p>
        <p>Quote Reference: ${quoteId}</p>
      `,
    });

    // Send email to agent
    await resend.emails.send({
      from: 'QuoteLinker <quotes@quotelinker.com>',
      to: agentEmail,
      subject: 'New Lead Assigned',
      html: `
        <h1>New Lead Assigned</h1>
        <p>You have been assigned a new ${quote.insurance_type} insurance lead.</p>
        <p>Quote Reference: ${quoteId}</p>
        <p>Please contact the consumer as soon as possible.</p>
      `,
    });

    // Log the notifications
    await supabase.from('notifications').insert([
      {
        recipient_type: 'consumer',
        recipient_email: consumerEmail,
        notification_type: 'agent_assigned',
        quote_id: quoteId,
        status: 'sent',
      },
      {
        recipient_type: 'agent',
        recipient_email: agentEmail,
        notification_type: 'new_lead',
        quote_id: quoteId,
        status: 'sent',
      },
    ]);
  } catch (error) {
    console.error('Error sending agent assignment notifications:', error);
    throw error;
  }
}

// Agent Notifications
export async function sendSubscriptionConfirmation(agentId: string, subscriptionId: string) {
  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('email, name')
      .eq('id', agentId)
      .single();

    if (!agent) {
      throw new Error('Agent not found');
    }

    await resend.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: agent.email,
      subject: 'Welcome to QuoteLinker!',
      html: `
        <h1>Welcome to QuoteLinker, ${agent.name}!</h1>
        <p>Thank you for subscribing to our platform. Your subscription is now active.</p>
        <p>Subscription ID: ${subscriptionId}</p>
        <p>You can now start receiving and managing leads through your dashboard.</p>
        <p>If you have any questions, our support team is here to help.</p>
      `,
    });

    // Log the notification
    await supabase.from('notifications').insert({
      recipient_type: 'agent',
      recipient_email: agent.email,
      notification_type: 'subscription_confirmation',
      subscription_id: subscriptionId,
      status: 'sent',
    });
  } catch (error) {
    console.error('Error sending subscription confirmation:', error);
    throw error;
  }
}

export async function sendPaymentConfirmation(agentId: string, paymentId: string, amount: number) {
  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('email, name')
      .eq('id', agentId)
      .single();

    if (!agent) {
      throw new Error('Agent not found');
    }

    await resend.emails.send({
      from: 'QuoteLinker <billing@quotelinker.com>',
      to: agent.email,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Received</h1>
        <p>Dear ${agent.name},</p>
        <p>We've received your payment of $${amount.toFixed(2)}.</p>
        <p>Payment ID: ${paymentId}</p>
        <p>Thank you for your continued support!</p>
      `,
    });

    // Log the notification
    await supabase.from('notifications').insert({
      recipient_type: 'agent',
      recipient_email: agent.email,
      notification_type: 'payment_confirmation',
      payment_id: paymentId,
      status: 'sent',
    });
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
    throw error;
  }
}

export async function sendPaymentFailure(agentId: string, paymentId: string, amount: number) {
  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('email, name')
      .eq('id', agentId)
      .single();

    if (!agent) {
      throw new Error('Agent not found');
    }

    await resend.emails.send({
      from: 'QuoteLinker <billing@quotelinker.com>',
      to: agent.email,
      subject: 'Payment Failed',
      html: `
        <h1>Payment Failed</h1>
        <p>Dear ${agent.name},</p>
        <p>We were unable to process your payment of $${amount.toFixed(2)}.</p>
        <p>Payment ID: ${paymentId}</p>
        <p>Please update your payment method in your account settings to ensure uninterrupted service.</p>
        <p>If you need assistance, please contact our support team.</p>
      `,
    });

    // Log the notification
    await supabase.from('notifications').insert({
      recipient_type: 'agent',
      recipient_email: agent.email,
      notification_type: 'payment_failure',
      payment_id: paymentId,
      status: 'sent',
    });
  } catch (error) {
    console.error('Error sending payment failure notification:', error);
    throw error;
  }
} 