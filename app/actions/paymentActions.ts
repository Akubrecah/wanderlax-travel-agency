"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@prisma/client";

export async function getPaymentsData() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: PaymentStatus.PAID
      }
    });

    // Revenue breakdown by service type from payments (consistent with totalRevenue)
    const paymentsWithBookings = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
      include: { booking: { select: { serviceType: true } } }
    });

    const revenueByServiceMap = paymentsWithBookings.reduce((acc, payment) => {
      const serviceType = payment.booking?.serviceType ?? 'UNKNOWN';
      acc[serviceType] = (acc[serviceType] || 0) + Number(payment.amount);
      return acc;
    }, {} as Record<string, number>);

    const revenueBreakdown = Object.entries(revenueByServiceMap).map(
      ([serviceType, total]) => ({ serviceType, total })
    );

    return {
      success: true,
      payments: JSON.parse(JSON.stringify(payments)),
      totalRevenue: Number(totalRevenue._sum?.amount || 0),
      revenueBreakdown,
    };
  } catch (error: unknown) {
    console.error("Error fetching payment data:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function createManualInvoice(data: { bookingId: string, dueDate: Date, subtotal: number, tax: number, total: number }) {
  try {
    const invoiceNumber = `INV-${Date.now()}`;
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        bookingId: data.bookingId,
        dueDate: data.dueDate,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        status: 'UNPAID',
      }
    });

    revalidatePath('/admin/payments');
    return { success: true, invoice: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: unknown) {
    console.error("Error creating manual invoice:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus) {
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
      include: { booking: true }
    });

    if (payment.bookingId) {
       await prisma.booking.update({
         where: { id: payment.bookingId },
         data: { 
           paymentStatus: status,
           status: status === "PAID" ? "COMPLETED" : undefined 
         }
       });
    }

    revalidatePath('/admin/payments');
    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    
    return { success: true, payment: JSON.parse(JSON.stringify(payment)) };
  } catch (error: unknown) {
    console.error("Error updating payment status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update payment status" };
  }
}
export async function recordStripePayment(data: {
  bookingId: string;
  amount: number;
  currency: string;
  transactionId: string;
  providerResponse?: unknown;
}) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId }
    });

    if (!booking) {
      throw new Error(`Booking not found: ${data.bookingId}`);
    }

    // Check if there's already a PENDING payment for this booking
    // This happens because many booking flows create a PENDING payment first
    const existingPendingPayment = await prisma.payment.findFirst({
      where: {
        bookingId: data.bookingId,
        status: "PENDING"
      }
    });

    let payment;
    if (existingPendingPayment) {
      // Update existing pending payment instead of creating a duplicate
      payment = await prisma.payment.update({
        where: { id: existingPendingPayment.id },
        data: {
          amount: data.amount,
          currency: data.currency.toUpperCase(),
          method: "STRIPE",
          status: "PAID",
          transactionId: data.transactionId,
          providerResponse: data.providerResponse as any,
          paidAt: new Date(),
        }
      });
    } else {
      // Create new payment entry
      payment = await prisma.payment.create({
        data: {
          bookingId: data.bookingId,
          userId: booking.userId,
          amount: data.amount,
          currency: data.currency.toUpperCase(),
          method: "STRIPE",
          status: "PAID",
          transactionId: data.transactionId,
          providerResponse: data.providerResponse as any,
          paidAt: new Date(),
        }
      });
    }

    // Also ensure booking status is updated to COMPLETED if it wasn't already
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { 
        paymentStatus: "PAID",
        status: "COMPLETED"
      }
    });

    revalidatePath('/admin/payments');
    revalidatePath('/admin/bookings');
    
    return { success: true, payment: JSON.parse(JSON.stringify(payment)) };
  } catch (error: unknown) {
    console.error("Error recording stripe payment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to record payment" };
  }
}
export async function recordStripeFailure(data: {
  bookingId: string;
  amount: number;
  currency: string;
  transactionId: string;
  failureReason: string;
  providerResponse?: unknown;
}) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId }
    });

    if (!booking) {
      throw new Error(`Booking not found: ${data.bookingId}`);
    }

    // Check if there's already a PENDING payment for this booking
    const existingPendingPayment = await prisma.payment.findFirst({
      where: {
        bookingId: data.bookingId,
        status: "PENDING"
      }
    });

    let payment;
    if (existingPendingPayment) {
      payment = await prisma.payment.update({
        where: { id: existingPendingPayment.id },
        data: {
          amount: data.amount,
          currency: data.currency.toUpperCase(),
          method: "STRIPE",
          status: "FAILED",
          transactionId: data.transactionId,
          failureReason: data.failureReason,
          providerResponse: data.providerResponse as any,
        }
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          bookingId: data.bookingId,
          userId: booking.userId,
          amount: data.amount,
          currency: data.currency.toUpperCase(),
          method: "STRIPE",
          status: "FAILED",
          transactionId: data.transactionId,
          failureReason: data.failureReason,
          providerResponse: data.providerResponse as any,
        }
      });
    }

    // Also update booking status to FAILED
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { 
        paymentStatus: "FAILED",
      }
    });

    revalidatePath('/admin/payments');
    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    
    return { success: true, payment: JSON.parse(JSON.stringify(payment)) };
  } catch (error: unknown) {
    console.error("Error recording stripe failure:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to record payment failure" };
  }
}
