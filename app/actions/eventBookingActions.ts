"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserTickets(userId: string) {
  try {
    const clerkUser = await prisma.user.findFirst({
      where: { clerkId: userId },
    });
    const dbUserId = clerkUser ? clerkUser.id : userId;

    const tickets = await prisma.ticket.findMany({
      where: {
        userId: dbUserId,
      },
      include: {
        event: true,
        ticketType: true,
      },
      orderBy: {
        event: {
          startDate: 'asc',
        },
      } as any,
    });
    
    return { 
      success: true, 
      tickets: tickets.map((t: any) => ({
        ...t,
        pricePaid: Number(t.pricePaid),
        ticketType: {
          ...t.ticketType,
          basePrice: Number(t.ticketType.basePrice),
          earlyBirdPrice: t.ticketType.earlyBirdPrice ? Number(t.ticketType.earlyBirdPrice) : null,
          surgeMultiplier: t.ticketType.surgeMultiplier ? Number(t.ticketType.surgeMultiplier) : null,
        }
      }))
    };
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return { success: false, error: "Failed to fetch user tickets" };
  }
}

export async function getAllEventTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
        event: true,
        ticketType: true,
        seatSection: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return { 
      success: true, 
      tickets: tickets.map((t: any) => ({
        ...t,
        pricePaid: Number(t.pricePaid),
        ticketType: {
          ...t.ticketType,
          basePrice: Number(t.ticketType.basePrice),
          earlyBirdPrice: t.ticketType.earlyBirdPrice ? Number(t.ticketType.earlyBirdPrice) : null,
          surgeMultiplier: t.ticketType.surgeMultiplier ? Number(t.ticketType.surgeMultiplier) : null,
        }
      }))
    };
  } catch (error) {
    console.error("Error fetching all event tickets:", error);
    return { success: false, error: "Failed to fetch event tickets" };
  }
}

export async function cancelTicket(id: string) {
  try {
    await prisma.ticket.update({
      where: { id },
      data: { status: 'CANCELLED' as any },
    });
    revalidatePath('/portal/tickets');
    revalidatePath('/admin/tickets');
    return { success: true };
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    return { success: false, error: "Failed to cancel ticket" };
  }
}

export async function markTicketUsed(id: string) {
  try {
    await prisma.ticket.update({
      where: { id },
      data: { 
        status: 'USED' as any,
        issuedAt: new Date(), 
      } as any,
    });
    revalidatePath('/admin/tickets');
    revalidatePath('/portal/tickets');
    return { success: true };
  } catch (error) {
    console.error("Error marking ticket used:", error);
    return { success: false, error: "Failed to mark ticket used" };
  }
}

export async function createEventBooking(data: {
  userId: string;
  eventId: string;
  ticketCount: number;
  totalAmount: number;
  attendees: { name: string; email: string }[];
}) {
  console.log('--- STARTING EVENT BOOKING ---');
  console.log('Received Data:', JSON.stringify(data, null, 2));

  try {
    let user = await prisma.user.findUnique({
      where: { clerkId: data.userId },
    });

    if (!user) {
      console.log('Did not find user by clerkId, trying by db id...');
      user = await prisma.user.findUnique({ where: { id: data.userId }});
      if (!user) {
        console.error('User not found by id either.');
        return { success: false, error: "User not found" };
      }
    }

    console.log('User OK:', user.id);

    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: { ticketTypes: true }
    });

    if (!event || event.ticketTypes.length === 0) {
      console.error('Event or ticket types not found.');
      return { success: false, error: "Event or ticket types not found" };
    }

    console.log('Event OK, TicketType Count:', event.ticketTypes.length);

    const ticketTypeId = event.ticketTypes[0].id;
    const pricePerTicket = data.totalAmount / data.ticketCount;

    console.log('Starting transaction...');

    const booking = await prisma.$transaction(async (tx: any) => {
      console.log('Creating booking record at amount:', data.totalAmount);
      const book = await tx.booking.create({
        data: {
          bookingRef: `EVT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          userId: user!.id,
          serviceType: "EVENT",
          status: "CONFIRMED",
          totalAmount: data.totalAmount,
          finalAmount: data.totalAmount,
          eventId: data.eventId,
          ticketQuantity: data.ticketCount,
        },
      });

      console.log('Creating tickets...', data.attendees.length);
      const ticketData = data.attendees
        .filter(attendee => attendee.name && attendee.email)
        .map(attendee => ({
          eventId: data.eventId,
          userId: user!.id,
          ticketTypeId: ticketTypeId,
          attendeeName: attendee.name,
          attendeeEmail: attendee.email,
          pricePaid: pricePerTicket,
          status: "ISSUED" as any,
        }));

      if (ticketData.length > 0) {
        await tx.ticket.createMany({
          data: ticketData,
        });
      }

      console.log('Tickets created successfully.');
      return book;
    }, {
      timeout: 30000 // Increase timeout to 30s
    });

    console.log('Transaction succeeded, revalidating paths...');
    revalidatePath("/portal/tickets");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Error creating event booking:", error);
    return { success: false, error: "Failed to create booking", detailedError: String(error) };
  }
}
