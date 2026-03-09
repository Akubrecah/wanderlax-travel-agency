import { NextResponse } from "next/server";
import Stripe from "stripe";



export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 503 });
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-04-10" as any });

    const { amount, currency = "usd", bookingRef, serviceType } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Stripe expects amount in cents for USD
    const amountInCents = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: {
        bookingRef,
        serviceType,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    console.error("Stripe error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create payment intent";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
