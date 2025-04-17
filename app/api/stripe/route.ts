import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Get environment variables with type assertions
const stripeSecret = process.env.STRIPE_SECRET_KEY as string | undefined;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Initialize Stripe client if secret is available
const stripe = stripeSecret && stripeSecret !== 'placeholder' 
  ? new Stripe(stripeSecret, { apiVersion: '2025-03-31.basil' })
  : null;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  // If no real Stripe key is set, fallback to mock logic
  if (!stripe) {
    console.log('⚠️ Stripe is disabled — using mock logic for Joe.');
    return Response.json({
      success: true,
      message: "Stripe is mocked. Pretending payment was successful for Joe."
    });
  }

  // Real Stripe implementation
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