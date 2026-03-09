import React from 'react';
import Image from 'next/image';
import { currentUser, auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { TripHistoryList } from './TripHistoryList';

export const dynamic = 'force-dynamic';

export default async function TripHistoryArchivePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/login');
  }

  let user = null;
  try {
    user = await currentUser();
  } catch (err: unknown) {
    console.error("Clerk currentUser() Error:", err);
  }

  if (!user) {
    redirect('/portal/login');
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    const primaryEmail = user.emailAddresses?.[0]?.emailAddress || '';
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: primaryEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.imageUrl,
        role: 'CUSTOMER',
      }
    });
  }

  // Fetch all bookings for the user, prioritizing TourBookings for now as per schema
  const bookings = await prisma.booking.findMany({
    where: {
      userId: dbUser.id,
      status: {
        in: ['CONFIRMED', 'COMPLETED', 'PENDING']
      }
    },
    include: {
      tourBooking: {
        include: {
          tourPackage: {
            include: {
              destination: true
            }
          }
        }
      },
      hotelBooking: {
        include: {
          hotel: {
             include: {
               destination: true
             }
          }
        }
      },
      carHireBooking: {
        include: {
          car: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  const totalTrips = bookings.length;
  // Calculate total spent only from Confirmed/Completed bookings to be more accurate, or all non-cancelled. Let's use all valid ones.
  const totalSpent = bookings.reduce((sum, booking) => sum + Number(booking.finalAmount || 0), 0);
  
  // Extract unique countries
  const countries = new Set<string>();
  bookings.forEach(booking => {
    if (booking.tourBooking?.tourPackage?.destination?.country) {
      countries.add(booking.tourBooking.tourPackage.destination.country);
    }
    if (booking.hotelBooking?.hotel?.destination?.country) {
      countries.add(booking.hotelBooking.hotel.destination.country);
    }
  });
  const uniqueCountriesCount = countries.size;

  // Serialize Prisma Decimal and Date objects to plain JSON-safe primitives
  // before passing to the Client Component (Next.js cannot serialize these across the boundary).
  const serializedBookings = bookings.map((b) => ({
    ...b,
    finalAmount: b.finalAmount != null ? Number(b.finalAmount) : null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    tourBooking: b.tourBooking
      ? {
          ...b.tourBooking,
          startDate: b.tourBooking.startDate instanceof Date
            ? b.tourBooking.startDate.toISOString()
            : b.tourBooking.startDate,
          endDate: b.tourBooking.endDate instanceof Date
            ? b.tourBooking.endDate.toISOString()
            : b.tourBooking.endDate,
          createdAt: b.tourBooking.createdAt instanceof Date
            ? b.tourBooking.createdAt.toISOString()
            : b.tourBooking.createdAt,
          updatedAt: b.tourBooking.updatedAt instanceof Date
            ? b.tourBooking.updatedAt.toISOString()
            : b.tourBooking.updatedAt,
        }
      : null,
    hotelBooking: b.hotelBooking
      ? {
          ...b.hotelBooking,
          checkIn: b.hotelBooking.checkIn instanceof Date
            ? b.hotelBooking.checkIn.toISOString()
            : b.hotelBooking.checkIn,
          checkOut: b.hotelBooking.checkOut instanceof Date
            ? b.hotelBooking.checkOut.toISOString()
            : b.hotelBooking.checkOut,
          createdAt: b.hotelBooking.createdAt instanceof Date
            ? b.hotelBooking.createdAt.toISOString()
            : b.hotelBooking.createdAt,
          updatedAt: b.hotelBooking.updatedAt instanceof Date
            ? b.hotelBooking.updatedAt.toISOString()
            : b.hotelBooking.updatedAt,
        }
      : null,
    carHireBooking: b.carHireBooking
      ? {
          ...b.carHireBooking,
          pickupDateTime: b.carHireBooking.pickupDateTime instanceof Date
            ? b.carHireBooking.pickupDateTime.toISOString()
            : b.carHireBooking.pickupDateTime,
          returnDateTime: b.carHireBooking.returnDateTime instanceof Date
            ? b.carHireBooking.returnDateTime.toISOString()
            : b.carHireBooking.returnDateTime,
          createdAt: b.carHireBooking.createdAt instanceof Date
            ? b.carHireBooking.createdAt.toISOString()
            : b.carHireBooking.createdAt,
          updatedAt: b.carHireBooking.updatedAt instanceof Date
            ? b.carHireBooking.updatedAt.toISOString()
            : b.carHireBooking.updatedAt,
        }
      : null,
  }));

  return (
    <div className="stitch-screen">
      <div className="noise-overlay"></div>
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pt-[72px]">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar relative px-6 md:px-20 lg:px-40 py-12">
            <div className="max-w-5xl mx-auto">
              {/* Header Section */}
              <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Trip History</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">A curated archive of your exceptional journeys across the globe.</p>
                </div>
                <div className="flex items-center gap-2 border-b-2 border-primary/20 pb-2 hidden md:flex opacity-0">
                  {/* We rendered the filter buttons inside the Client Component now. But to keep layout structure, we can just remove the old hardcoded ones from here. */}
                </div>
              </header>
              <TripHistoryList bookings={serializedBookings} />
              
              {/* Footer Stats (Subtle) */}
              <footer className="mt-20 py-8 border-t border-slate-200 dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">Twende Africa Tours Archive © 2024</p>
                <div className="flex gap-10">
                  <div className="text-center">
                    <p className="text-slate-900 dark:text-white text-xl font-black italic">{totalTrips}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 dark:text-white text-xl font-black italic">{uniqueCountriesCount}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">Countries</p>
                  </div>
                  <div className="text-center">
                     <p className="text-slate-900 dark:text-white text-xl font-black italic">{totalSpent < 1000 ? `$${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : `$${(totalSpent / 1000 % 1 === 0 ? (totalSpent / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 }) : (totalSpent / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }))}k`}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total Spent</p>
                  </div>
                </div>
              </footer>

              {/* Map Overlay Accent (Aesthetic) */}
              <div className="fixed bottom-0 right-0 w-96 h-96 opacity-5 pointer-events-none z-0 overflow-hidden">
                <Image fill alt="Abstract geographical map lines" className="object-contain filter invert dark:invert-0" sizes="384px" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZzAsew6At7aKbbADCxAXK5URcIbaNWppe0sDDQvr5F8NG2v3qUUAW38e3fDKRHgT1f__F-dWLRI6Sm0wuCmeeYryB7T2XDeP3a78uJQzN1g-5WMdLHl4KUpS7SkBDu2qKiZe_bjwSy_lJK31zw-rpWEOhEmqBO43A2XfxtbtgYR_2b1eteub70ZeOt-j4b3OgNwIyl-Hvjdm6lxQeG3GXzV_hTHBrTRKxGi4wqzj5xofu2vbm4eCS6cAEzZM2HUvi2H4-2AfSVQ"/>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
