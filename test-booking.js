const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Decimal } = require('@prisma/client/runtime/library');

async function testBooking() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found to test with.');
      return;
    }

    const event = await prisma.event.findFirst({
      include: { ticketTypes: true }
    });

    if (!event || event.ticketTypes.length === 0) {
      console.log('No event/ticket types found to test with.');
      return;
    }

    console.log(`Testing with user: ${user.id}, event: ${event.id}`);

    const data = {
      userId: user.id,
      eventId: event.id,
      ticketCount: 1,
      totalAmount: 100,
      attendees: [{ name: 'Test User', email: 'test@example.com' }]
    };

    const ticketTypeId = event.ticketTypes[0].id;
    const pricePerTicket = data.totalAmount / data.ticketCount;

    const booking = await prisma.$transaction(async (tx) => {
      const book = await tx.booking.create({
        data: {
          bookingRef: `EVT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          userId: user.id,
          serviceType: "EVENT",
          status: "CONFIRMED",
          totalAmount: data.totalAmount,
          finalAmount: data.totalAmount,
          eventId: data.eventId,
          ticketQuantity: data.ticketCount,
        },
      });

      console.log('Booking created:', book.id);

      for (const attendee of data.attendees) {
        if (!attendee.name || !attendee.email) continue;
        const ticket = await tx.ticket.create({
          data: {
            eventId: data.eventId,
            userId: user.id,
            ticketTypeId: ticketTypeId,
            attendeeName: attendee.name,
            attendeeEmail: attendee.email,
            pricePaid: pricePerTicket,
            status: "ISSUED",
          },
        });
        console.log('Ticket created:', ticket.id);
      }

      return book;
    });

    console.log('Success!', booking.id);
  } catch (err) {
    console.error('FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testBooking();
