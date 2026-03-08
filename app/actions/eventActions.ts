"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";

// ============ UTILS ============

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializePrisma(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'object' && 'toNumber' in data && typeof data.toNumber === 'function') {
    return data.toNumber();
  }
  if (Array.isArray(data)) return data.map(serializePrisma);
  if (typeof data === 'object' && data.constructor === Object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    for (const key in data) {
      result[key] = serializePrisma(data[key]);
    }
    return result;
  }
  return data;
}

// ============ ADMIN ACTIONS ============

export async function createEvent(data: {
  title: string;
  slug: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  totalCapacity: number;
  category: "CONFERENCE" | "CONCERT" | "EXPERIENCE" | "WORKSHOP" | "OTHER" | "FESTIVAL" | "EXHIBITION" | "GENERAL";
  organizer?: string;
  images: string[];
  highlights: string[];
  ticketTypes: Array<{
    name: string;
    basePrice: number;
    maxQuantity: number;
    earlyBirdEndDate?: Date;
    earlyBirdPrice?: number;
    surgeThreshold?: number;
    surgeMultiplier?: number;
  }>;
  seatingZones?: Array<{
    sectionName: string;
    capacity: number;
    priceModifier?: number;
  }>;
  refundPolicy?: {
    cancellationDeadlineDays: number;
    refundPercentageBeforeDeadline: number;
    refundPercentageAfterDeadline: number;
    refundPercentageAfterEvent?: number;
  };
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Unauthorized");

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        },
      });
    }

    // Ensure unique slug
    let uniqueSlug = data.slug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${data.slug}-${counter}`;
      counter++;
    }

    // Create Event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        totalCapacity: data.totalCapacity,
        category: data.category as any,
        organizer: data.organizer || undefined,
        images: data.images,
        highlights: data.highlights,
        status: "DRAFT" as any,
        ticketTypes: {
          create: data.ticketTypes.map((tt) => ({
            name: tt.name,
            basePrice: new Decimal(tt.basePrice),
            maxQuantity: tt.maxQuantity,
            earlyBirdEndDate: tt.earlyBirdEndDate,
            earlyBirdPrice: tt.earlyBirdPrice
              ? new Decimal(tt.earlyBirdPrice)
              : null,
            surgeThreshold: tt.surgeThreshold,
            surgeMultiplier: tt.surgeMultiplier
              ? new Decimal(tt.surgeMultiplier)
              : null,
          })),
        } as any,
        seatingZones: data.seatingZones
          ? {
              create: data.seatingZones.map((sz) => ({
                sectionName: sz.sectionName,
                capacity: sz.capacity,
                priceModifier: new Decimal(sz.priceModifier || 1.0),
              })),
            } as any
          : undefined as any,
        refundPolicy: data.refundPolicy
          ? {
              create: {
                cancellationDeadlineDays: data.refundPolicy.cancellationDeadlineDays,
                refundPercentageBeforeDeadline:
                  data.refundPolicy.refundPercentageBeforeDeadline,
                refundPercentageAfterDeadline:
                  data.refundPolicy.refundPercentageAfterDeadline,
                refundPercentageAfterEvent:
                  data.refundPolicy.refundPercentageAfterEvent || 0,
              },
            } as any
          : undefined as any,
      } as any,
      include: {
        ticketTypes: true,
        seatingZones: true,
        refundPolicy: true,
      } as any,
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true, event: serializePrisma(event) };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    description?: string;
    destination?: string;
    startDate?: Date;
    endDate?: Date;
    totalCapacity?: number;
    category?: string;
    organizer?: string;
    images?: string[];
    highlights?: string[];
    status?: "DRAFT" | "PUBLISHED" | "CANCELLED";
  }
) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        category: data.category as any,
        status: data.status as any,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return { success: true, event: serializePrisma(event) };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: String(error) };
  }
}

export async function publishEvent(id: string) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: { status: "PUBLISHED" as any },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return { success: true, event: serializePrisma(event) };
  } catch (error) {
    console.error("Error publishing event:", error);
    return { success: false, error: String(error) };
  }
}

export async function cancelEvent(id: string) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: { status: "CANCELLED" as any },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true, event: serializePrisma(event) };
  } catch (error) {
    console.error("Error cancelling event:", error);
    return { success: false, error: String(error) };
  }
}

export async function getAdminEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        ticketTypes: {
          include: {
            _count: {
              select: { tickets: true },
            },
          },
        },
        seatingZones: true,
        tickets: {
          where: { status: { in: ["ISSUED", "RESERVED"] } },
        },
        refundPolicy: true,
      } as any,
      orderBy: { createdAt: "desc" },
    });

    const eventsFormatted = events.map((event: any) => ({
      ...event,
      ticketsSold: event.tickets.length,
      ticketTypes: event.ticketTypes.map((tt: any) => ({
        ...tt,
        basePrice: Number(tt.basePrice),
        earlyBirdPrice: tt.earlyBirdPrice ? Number(tt.earlyBirdPrice) : null,
        surgeMultiplier: tt.surgeMultiplier ? Number(tt.surgeMultiplier) : null,
        quantitySold: tt._count?.tickets || 0,
      })),
      seatingZones: event.seatingZones.map((sz: any) => ({
        ...sz,
        priceModifier: Number(sz.priceModifier),
      })),
    }));

    const finalEvents = serializePrisma(eventsFormatted);
    return { success: true, events: finalEvents };
  } catch (err) {
    console.error("Error fetching admin events:", err);
    return { success: false, error: "Failed to fetch admin events" };
  }
}

// ============ CUSTOMER ACTIONS ============

export async function getPublicEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "PUBLISHED" as any,
        endDate: { gte: new Date() },
      },
      include: {
        ticketTypes: true,
        seatingZones: true,
        tickets: {
          where: { status: { in: ["ISSUED" as any, "RESERVED" as any] } },
        },
      } as any,
      orderBy: { startDate: "asc" },
    });

    const formattedEvents = events.map((e) => {
      const ticketsSold = e.tickets.filter((t: any) => (t.status as string) !== "CANCELLED").length;
      const capacityRemaining = Number(e.totalCapacity) - ticketsSold;
      const isSoldOut = capacityRemaining <= 0;

      const prices = e.ticketTypes.map((t: any) => {
        const isEarlyBird = t.earlyBirdPrice && t.earlyBirdEndDate && new Date() < new Date(t.earlyBirdEndDate);
        return isEarlyBird ? Number(t.earlyBirdPrice) : Number(t.basePrice);
      });

      return {
        ...e,
        ticketsSold,
        capacityRemaining,
        isSoldOut,
        basePrice: prices.length > 0 ? Math.min(...prices) : 0,
        price: prices.length > 0 ? Math.min(...prices) : 0,
        location: e.destination,
        ticketTypes: e.ticketTypes.map((tt: any) => ({
          ...tt,
          basePrice: Number(tt.basePrice),
          earlyBirdPrice: tt.earlyBirdPrice ? Number(tt.earlyBirdPrice) : null,
          surgeMultiplier: tt.surgeMultiplier ? Number(tt.surgeMultiplier) : null,
        })),
        seatingZones: e.seatingZones.map((sz: any) => ({
          ...sz,
          priceModifier: Number(sz.priceModifier),
        })),
      };
    });

    return { success: true, events: serializePrisma(formattedEvents) };
  } catch (error) {
    console.error("Error fetching public events:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        ticketTypes: true,
        seatingZones: true,
        tickets: true,
      } as any,
    });

    if (!event) return { success: false, error: "Event not found" };

    const ticketsSold = event.tickets.filter((t: any) => t.status !== "CANCELLED" as any).length;
    const capacityRemaining = (event as any).totalCapacity - ticketsSold;

    const formattedEvent = {
      ...event,
      ticketTypes: (event as any).ticketTypes.map((t: any) => ({
        ...t,
        basePrice: Number(t.basePrice),
        earlyBirdPrice: t.earlyBirdPrice ? Number(t.earlyBirdPrice) : null,
        surgeMultiplier: t.surgeMultiplier ? Number(t.surgeMultiplier) : null,
        quantitySold: (event as any).tickets.filter((tick: any) => (tick as any).ticketTypeId === t.id && tick.status !== 'CANCELLED' as any).length,
      })),
      seatingZones: (event as any).seatingZones.map((z: any) => ({
        ...z,
        priceModifier: Number(z.priceModifier),
      })),
      ticketsSold,
      capacityRemaining,
      isSoldOut: capacityRemaining <= 0,
    };

    return { success: true, event: serializePrisma(formattedEvent) };
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true,
        seatingZones: true,
        refundPolicy: true,
      } as any,
    });

    if (!event) return { success: false, error: "Event not found" };

    const formattedEvent = {
      ...event,
      seatingZones: (event as any).seatingZones.map((z: any) => ({
        ...z,
        priceModifier: Number(z.priceModifier),
      })),
    };

    return { success: true, event: serializePrisma(formattedEvent) };
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: String(error) };
  }
}

// ============ PRICING LOGIC ============

export async function calculateTicketPrice(
  ticketTypeId: string,
  seatingZoneId?: string
) {
  try {
    const ticketType = await (prisma as any).eventTicketType.findUnique({
      where: { id: ticketTypeId },
    });

    if (!ticketType) throw new Error("Ticket type not found");

    let price = Number(ticketType.basePrice);

    // Apply early bird
    if (
      ticketType.earlyBirdPrice &&
      ticketType.earlyBirdEndDate &&
      new Date() < ticketType.earlyBirdEndDate
    ) {
      price = Number(ticketType.earlyBirdPrice);
    }

    // Apply surge pricing
    if (ticketType.surgeThreshold && ticketType.surgeMultiplier) {
      // Fetch current quantity sold for this ticket type
      const ticketsSold = await prisma.ticket.count({
        where: {
          ticketTypeId: ticketType.id,
          status: { not: "CANCELLED" as any }
        }
      });

      if (ticketsSold >= ticketType.surgeThreshold) {
        price = price * Number(ticketType.surgeMultiplier);
      }
    }

    // Apply seating zone modifier
    if (seatingZoneId) {
      const zone = await (prisma as any).eventSeating.findUnique({
        where: { id: seatingZoneId },
      });
      if (zone) {
        price = price * Number(zone.priceModifier);
      }
    }

    return price;
  } catch (error) {
    console.error("Error calculating price:", error);
    return 0;
  }
}

export async function applyDynamicPricing(eventId: string) {
  // This could be a background job that updates prices based on velocity
  // For now, it's a placeholder for manual trigger if needed
}

// ============ TICKET BOOKING ============

export async function createTicketBooking(data: {
  eventId: string;
  ticketTypeId: string;
  seatingZoneId?: string;
  attendeeName: string;
  attendeeEmail: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    // 1. Validate availability
    const ticketType = await (prisma as any).eventTicketType.findUnique({
      where: { id: data.ticketTypeId },
    });

    if (!ticketType) {
      return { success: false, error: "Ticket type not found" };
    }

    const ticketsSoldForType = await prisma.ticket.count({
      where: {
        ticketTypeId: data.ticketTypeId,
        status: { not: "CANCELLED" as any }
      }
    });

    if (ticketsSoldForType >= ticketType.maxQuantity) {
      return { success: false, error: "Tickets sold out for this type" };
    }

    let zone = null;
    if (data.seatingZoneId) {
      zone = await (prisma as any).eventSeating.findUnique({
        where: { id: data.seatingZoneId },
      });
      if (!zone) {
        return { success: false, error: "Seating zone not found" };
      }

      const ticketsSoldForZone = await prisma.ticket.count({
        where: {
          seatSectionId: data.seatingZoneId,
          status: { not: "CANCELLED" as any }
        }
      });

      if (ticketsSoldForZone >= zone.capacity) {
        return { success: false, error: "Section full" };
      }
    }

    // 2. Ensure User exists
    let user = await prisma.user.findUnique({
      where: { clerkId: data.clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: data.clerkId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
    }

    // 3. Calculate price
    const finalPrice = await calculateTicketPrice(data.ticketTypeId, data.seatingZoneId);

    // 4. Create Transaction & Booking
    const booking = await prisma.$transaction(async (tx) => {
      // Create Booking
      const book = await tx.booking.create({
        data: {
          bookingRef: `EVT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          userId: user!.id,
          serviceType: "EVENT",
          status: "PENDING",
          totalAmount: new Decimal(finalPrice),
          finalAmount: new Decimal(finalPrice),
          eventId: data.eventId,
          ticketQuantity: 1,
        } as any,
      });

      // Create Ticket
      const ticket = await tx.ticket.create({
        data: {
          eventId: data.eventId,
          userId: user!.id,
          ticketTypeId: data.ticketTypeId,
          seatSectionId: data.seatingZoneId,
          attendeeName: data.attendeeName,
          attendeeEmail: data.attendeeEmail,
          pricePaid: new Decimal(finalPrice),
          status: "ISSUED" as any,
          bookingId: book.id, // Link ticket to booking
        } as any,
      });

      return { book, ticket };
    });

    revalidatePath("/portal/tickets");
    
    return { success: true, booking: booking.book };
  } catch (error) {
    console.error("Error creating ticket booking:", error);
    return { success: false, error: String(error) };
  }
}

// ============ WAITLIST ============

export async function getEventWaitlist(eventId: string) {
  try {
    const waitlist = await prisma.eventWaitlist.findMany({
      where: { eventId },
      include: {
        user: true,
      },
      orderBy: { position: "asc" },
    });
    return serializePrisma(waitlist);
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return [];
  }
}
export async function addToWaitlist(data: {
  eventId: string;
  userId: string;
  ticketTypeId: string;
  quantity?: number;
}) {
  try {
    const waitlistCount = await prisma.eventWaitlist.count({
      where: { eventId: data.eventId, ticketTypeId: data.ticketTypeId },
    });

    const entry = await prisma.eventWaitlist.create({
      data: {
        eventId: data.eventId,
        userId: data.userId,
        ticketTypeId: data.ticketTypeId,
        quantity: data.quantity || 1,
        position: waitlistCount + 1,
        status: "WAITING" as any,
      },
    });

    return { success: true, entry };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return { success: false, error: String(error) };
  }
}

export async function promoteFromWaitlist(waitlistId: string) {
  try {
    const entry = await prisma.eventWaitlist.update({
      where: { id: waitlistId },
      data: {
        status: "PROMOTED" as any,
        promotedAt: new Date(),
      },
    });

    // Notify user logic would go here

    return { success: true, entry };
  } catch (error) {
    console.error("Error promoting from waitlist:", error);
    return { success: false, error: String(error) };
  }
}

// ============ REFUNDS ============

export async function processRefund(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          include: { refundPolicy: true },
        },
      } as any,
    });

    if (!ticket) throw new Error("Ticket not found");
    const eventWithPolicy = (ticket as any).event;
    if (!eventWithPolicy.refundPolicy) throw new Error("No refund policy defined");

    const now = new Date();
    const eventStart = new Date(eventWithPolicy.startDate);
    const policy = eventWithPolicy.refundPolicy;

    const daysUntilEvent = Math.ceil(
      (eventStart.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );

    let refundPercentage = 0;

    if (now > eventStart) {
      refundPercentage = policy.refundPercentageAfterEvent || 0; // Ensure default if null
    } else if (daysUntilEvent >= policy.cancellationDeadlineDays) {
      refundPercentage = policy.refundPercentageBeforeDeadline;
    } else {
      refundPercentage = policy.refundPercentageAfterDeadline;
    }

    const refundAmount = Number(ticket.pricePaid) * (refundPercentage / 100);

    // Update ticket and potentially trigger payment provider refund
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "REFUNDED" as any,
      } as any,
    });

    // Update the associated booking status if it was the only ticket
    const booking = await prisma.booking.findUnique({
      where: { id: (ticket as any).bookingId },
      include: { tickets: true } as any
    });

    if (booking && (booking as any).tickets.every((t: any) => t.status === "REFUNDED" as any)) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "REFUNDED" as any }
      });
    }

    return { success: true, refundAmount };
  } catch (error) {
    console.error("Error processing refund:", error);
    return { success: false, error: String(error) };
  }
}

// ============ BUNDLED BOOKINGS ============

export async function createBundledEventTourBooking(data: {
  eventId: string;
  ticketTypeId: string;
  tourSlug: string;
  tourStartDate: Date;
  tourEndDate: Date;
  tourGuestCount: number;
  tourTotalAmount: number;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  try {
    // 1. Create Event Booking first
    const ticketResult = await createTicketBooking({
      eventId: data.eventId,
      ticketTypeId: data.ticketTypeId,
      attendeeName: `${data.firstName} ${data.lastName}`,
      attendeeEmail: data.email,
      clerkId: data.clerkId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (!ticketResult.success) {
      return ticketResult;
    }

    // Import and call tour booking (avoid circular dependency)
    const bookingActions = await import('./bookingActions');
    const { createTourBooking } = bookingActions;

    const tourResult = await createTourBooking({
      tourSlug: data.tourSlug,
      startDate: data.tourStartDate,
      endDate: data.tourEndDate,
      guestCount: data.tourGuestCount,
      totalAmount: data.tourTotalAmount,
      clerkId: data.clerkId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    } as any);

    if (!tourResult.success) {
      return tourResult;
    }

    // Link both bookings via bundledTourBookingId
    const user = await prisma.user.findUnique({
      where: { clerkId: data.clerkId },
    });

    if (user) {
      const eventBooking = await prisma.booking.findUnique({
        where: { id: (ticketResult as any).booking.id },
      });

      if (eventBooking) {
        await prisma.booking.update({
          where: { id: eventBooking.id },
          data: {
            bundledTourBookingId: (tourResult as any).booking.id,
          } as any,
        });
      }
    }

    revalidatePath("/portal/book");

    return {
      success: true,
      bookings: {
        eventBooking: (ticketResult as any).booking,
        tourBooking: (tourResult as any).booking,
      },
    };
  } catch (error) {
    console.error("Error creating bundled booking:", error);
    return { success: false, error: String(error) };
  }
}
