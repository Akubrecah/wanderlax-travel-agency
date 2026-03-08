import { NextResponse } from "next/server";
import Stripe from "stripe";
import { confirmBookingByRef } from "@/app/actions/bookingActions";
import { recordStripePayment, recordStripeFailure } from "@/app/actions/paymentActions";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("Webhook signature verification failed.", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingRef = paymentIntent.metadata?.bookingRef;

        if (bookingRef) {
          console.log(`Payment succeeded for booking ${bookingRef} via Webhook`);
          
          // 1. Fetch booking to get its internal ID
          const booking = await prisma.booking.findUnique({
            where: { bookingRef }
          });

          if (booking) {
            // 2. Record the payment
            await recordStripePayment({
              bookingId: booking.id,
              amount: paymentIntent.amount / 100, // Stripe uses cents
              currency: paymentIntent.currency,
              transactionId: paymentIntent.id,
              providerResponse: paymentIntent,
            });
            console.log(`Successfully recorded payment for booking ${bookingRef}`);
          } else {
            console.error(`Booking with ref ${bookingRef} not found during webhook processing`);
            // Still confirm by ref if possible (maybe it's a legacy flow)
            await confirmBookingByRef(bookingRef);
          }
        } else {
          console.warn("PaymentIntent succeeded but missing bookingRef in metadata");
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingRef = paymentIntent.metadata?.bookingRef;
        const failureMessage = paymentIntent.last_payment_error?.message || "Payment failed";

        if (bookingRef) {
          console.log(`Payment failed for booking ${bookingRef}: ${failureMessage}`);
          
          const booking = await prisma.booking.findUnique({
            where: { bookingRef }
          });

          if (booking) {
            await recordStripeFailure({
              bookingId: booking.id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              transactionId: paymentIntent.id,
              failureReason: failureMessage,
              providerResponse: paymentIntent,
            });
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("Error processing webhook:", errorMessage);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
