import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { name, birthDay, contract } = await request.json();

    if (!name || !birthDay || !contract) {
      return NextResponse.json({ error: "Missing required fields for checkout" }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Sovereign Reading: ${contract.identity_layer.compound_number} (${contract.identity_layer.planet})`,
              description: `Full Pilgrim's Narrative for ${name}. Includes PDF report.`,
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}&name=${encodeURIComponent(name)}&birthDay=${encodeURIComponent(birthDay)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`,
      metadata: {
        name,
        birthDay,
        compound_number: contract.identity_layer.compound_number,
      }
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Stripe Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
