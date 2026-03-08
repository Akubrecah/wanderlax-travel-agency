"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({
  bookingRef,
  amount,
  onSuccess,
}: {
  bookingRef: string;
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/portal/book?bookingRef=${bookingRef}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else if (paymentIntent) {
      // Handle other statuses like 'processing', 'requires_action'
      setErrorMessage(`Payment status: ${paymentIntent.status}. Please wait or try again.`);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm mt-4">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(195,9,9,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg mt-4"
      >
        {isProcessing ? (
          <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <span className="material-symbols-outlined">payments</span>
        )}
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export function StripePaymentWrapper({
  bookingRef,
  amount,
  serviceType,
  onSuccess,
}: {
  bookingRef: string;
  amount: number;
  serviceType: string;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, bookingRef, serviceType }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, bookingRef, serviceType]);

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#e50914",
      colorBackground: "#1e293b",
      colorText: "#ffffff",
      colorDanger: "#ef4444",
    },
  };

  return (
    <div className="bg-background-dark p-6 border border-slate-700 rounded-xl space-y-4">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm
            bookingRef={bookingRef}
            amount={amount}
            onSuccess={onSuccess}
          />
        </Elements>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}
