"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserTickets(userId: string) {
  try {
    const clerkUser = await prisma.user.findFirst({
      where: { clerkId: userId },
    });
    const dbUserId = clerkUser ? clerkUser.id : userId;

    const tickets = await (prisma as any).ticket.findMany({
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
        ticketType: {
          ...t.ticketType,
          basePrice: Number(t.ticketType.basePrice),
          earlyBirdPrice: t.ticketType.earlyBirdPrice ? Number(t.ticketType.earlyBirdPrice) : null,
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
    const tickets = await (prisma as any).ticket.findMany({
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
        ticketType: {
          ...t.ticketType,
          basePrice: Number(t.ticketType.basePrice),
          earlyBirdPrice: t.ticketType.earlyBirdPrice ? Number(t.ticketType.earlyBirdPrice) : null,
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
    await (prisma as any).ticket.update({
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
    await (prisma as any).ticket.update({
      where: { id },
      data: { 
        status: 'USED' as any,
        issuedAt: new Date(), 
      },
    });
    revalidatePath('/admin/tickets');
    revalidatePath('/portal/tickets');
    return { success: true };
  } catch (error) {
    console.error("Error marking ticket used:", error);
    return { success: false, error: "Failed to mark ticket used" };
  }
}
