
import { createTicketBooking } from './app/actions/eventActions'
import { prisma } from './lib/prisma'

async function test() {
  console.log('--- Testing createTicketBooking ---');
  
  // Find an event
  const event = await prisma.event.findFirst({ include: { ticketTypes: true } });
  if (!event || event.ticketTypes.length === 0) {
    console.log('No event or ticket types found to test with.');
    return;
  }
  
  // Find a user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found to test with.');
    return;
  }
  
  const ticketTypeId = event.ticketTypes[0].id;
  
  console.log(`Testing with Event: ${event.title}, User: ${user.email}, TicketType: ${event.ticketTypes[0].name}`);
  
  // Create 50 tickets to trigger a potential timeout if not optimized
  const result = await createTicketBooking({
    eventId: event.id,
    ticketTypeId: ticketTypeId,
    attendeeName: "Test Attendee",
    attendeeEmail: "test@example.com",
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    ticketQuantity: 50
  });
  
  console.log('Result:', JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('SUCCESS: Booking created successfully with 50 tickets!');
    // Clean up
    const bookingId = result.booking?.id;
    if (bookingId) {
      await prisma.ticket.deleteMany({ where: { bookingId } });
      await prisma.booking.delete({ where: { id: bookingId } });
    }
    console.log('Cleaned up test data.');
  } else {
    console.log('FAILED:', result.error);
  }
}

test().catch(console.error);
