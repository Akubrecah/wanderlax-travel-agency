'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getSupplierStats() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Find user by clerkId to get internal DB id
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  });

  if (!user) {
    throw new Error('User not found in database');
  }

  const supplierId = user.id;

  try {
    // 1. Fetch active listings count
    const [toursCount, hotelsCount, carsCount, eventsCount] = await Promise.all([
      prisma.tourPackage.count({ where: { supplierId, status: 'ACTIVE' } }),
      prisma.hotel.count({ where: { supplierId, isActive: true } }),
      prisma.car.count({ where: { supplierId, status: 'AVAILABLE' } }),
      prisma.event.count({ where: { supplierId, status: 'PUBLISHED' } }),
    ]);

    const activeListings = toursCount + hotelsCount + carsCount + eventsCount;

    // Fetch the IDs of all properties owned by this supplier
    const [tours, hotels, cars] = await Promise.all([
      prisma.tourPackage.findMany({ where: { supplierId }, select: { id: true } }),
      prisma.hotel.findMany({ where: { supplierId }, select: { id: true } }),
      prisma.car.findMany({ where: { supplierId }, select: { id: true } }),
    ]);

    const tourIds = tours.map(t => t.id);
    const hotelIds = hotels.map(h => h.id);
    const carIds = cars.map(c => c.id);

    // 2. Fetch pending bookings counts
    const [pendingTours, pendingHotels, pendingCars] = await Promise.all([
      prisma.tourBooking.count({ where: { tourPackageId: { in: tourIds }, status: 'PENDING' } }),
      prisma.hotelBooking.count({ where: { hotelId: { in: hotelIds }, status: 'PENDING' } }),
      prisma.carHireBooking.count({ where: { carId: { in: carIds }, status: 'PENDING' } }),
    ]);

    const pendingBookings = pendingTours + pendingHotels + pendingCars;

    // 3. Fetch completed/confirmed bookings for revenue calculation
    const [confirmedTours, confirmedHotels, confirmedCars] = await Promise.all([
      prisma.tourBooking.findMany({ where: { tourPackageId: { in: tourIds }, status: { in: ['CONFIRMED', 'COMPLETED'] } }, select: { totalAmount: true } }),
      prisma.hotelBooking.findMany({ where: { hotelId: { in: hotelIds }, status: { in: ['CONFIRMED', 'COMPLETED'] } }, select: { totalAmount: true } }),
      prisma.carHireBooking.findMany({ where: { carId: { in: carIds }, status: { in: ['CONFIRMED', 'COMPLETED'] } }, select: { totalAmount: true } }),
    ]);

    const calculateTotal = (bookings: { totalAmount: any }[]) => 
      bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

    const totalRevenue = calculateTotal(confirmedTours) + calculateTotal(confirmedHotels) + calculateTotal(confirmedCars);
    const completedBookings = confirmedTours.length + confirmedHotels.length + confirmedCars.length;

    // TODO: implement actual rating fetching once ratings are tied to supplier properly.
    // For now returning mock rating
    return {
      activeListings,
      pendingBookings,
      completedBookings,
      totalRevenue,
      rating: 4.8, 
      reviewsCount: 89
    };

  } catch (error) {
    console.error("Error fetching supplier stats:", error);
    throw new Error('Failed to fetch supplier statistics');
  }
}

export async function getRecentSupplierBookings() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  });
  if (!user) return [];

  const supplierId = user.id;

  try {
    const [tours, hotels, cars] = await Promise.all([
      prisma.tourPackage.findMany({ where: { supplierId }, select: { id: true, title: true } }),
      prisma.hotel.findMany({ where: { supplierId }, select: { id: true, name: true } }),
      prisma.car.findMany({ where: { supplierId }, select: { id: true, make: true, model: true } }),
    ]);

    const tourMap = new Map(tours.map(t => [t.id, t.title]));
    const hotelMap = new Map(hotels.map(h => [h.id, h.name]));
    const carMap = new Map(cars.map(c => [c.id, `${c.make} ${c.model}`]));

    const [recentTourBookings, recentHotelBookings, recentCarBookings] = await Promise.all([
      prisma.tourBooking.findMany({
        where: { tourPackageId: { in: Array.from(tourMap.keys()) } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { firstName: true, lastName: true, email: true } } }
      }),
      prisma.hotelBooking.findMany({
        where: { hotelId: { in: Array.from(hotelMap.keys()) } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { firstName: true, lastName: true, email: true } } }
      }),
      prisma.carHireBooking.findMany({
        where: { carId: { in: Array.from(carMap.keys()) } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { firstName: true, lastName: true, email: true } } }
      }),
    ]);

    const allRequests: any[] = [];

    recentTourBookings.forEach(b => {
      allRequests.push({
        id: b.id,
        service: tourMap.get(b.tourPackageId) || 'Unknown Tour',
        client: b.user ? `${b.user.firstName || ''} ${b.user.lastName || ''}`.trim() || b.user.email : 'Guest',
        dates: `${b.startDate.toLocaleDateString()} - ${b.endDate.toLocaleDateString()}`,
        status: b.status,
        amount: Number(b.totalAmount),
        createdAt: b.createdAt
      });
    });

    recentHotelBookings.forEach(b => {
      allRequests.push({
        id: b.id,
        service: hotelMap.get(b.hotelId) || 'Unknown Hotel',
        client: b.user ? `${b.user.firstName || ''} ${b.user.lastName || ''}`.trim() || b.user.email : 'Guest',
        dates: `${b.checkIn.toLocaleDateString()} - ${b.checkOut.toLocaleDateString()}`,
        status: b.status,
        amount: Number(b.totalAmount),
        createdAt: b.createdAt
      });
    });

    recentCarBookings.forEach(b => {
      allRequests.push({
        id: b.id,
        service: carMap.get(b.carId) || 'Unknown Car',
        client: b.user ? `${b.user.firstName || ''} ${b.user.lastName || ''}`.trim() || b.user.email : 'Guest',
        dates: `${b.pickupDateTime.toLocaleDateString()} - ${b.returnDateTime.toLocaleDateString()}`,
        status: b.status,
        amount: Number(b.totalAmount),
        createdAt: b.createdAt
      });
    });

    // Sort all combined bookings by createdAt desc and take top 5
    allRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allRequests.slice(0, 5);

  } catch (error) {
    console.error("Error fetching recent supplier bookings:", error);
    return [];
  }
}
