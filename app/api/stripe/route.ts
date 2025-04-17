import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

// If no real Stripe key is set, fallback to mock logic
if (!stripeSecret || stripeSecret === 'placeholder') {
  console.log('⚠️ Stripe is disabled — using mock logic for Joe.');

  export async function POST() {
    return Response.json({
      success: true,
      message: "Stripe is mocked. Pretending payment was successful for Joe."
    });
  }
} else {
  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2022-11-15',
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  export async function POST(req: Request) {
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 2500, // $25.00
            product_data: {
              name: 'QuoteLinker Lead Package (Test)',
            },
          },
          quantity: 1,
        },
      ],
      success_url: 'https://quotelinker.com/success',
      cancel_url: 'https://quotelinker.com/cancel',
    });

    return Response.json({ id: session.id });
  }
} 