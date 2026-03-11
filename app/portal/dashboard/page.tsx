/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { currentUser, auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getWishlistItemDetails, WishlistItemLocal } from '@/app/lib/data/mockData';

const travelerLinks = [
  { icon: 'person', label: 'My Profile', href: '/portal/profile', description: 'View & edit your info' },
  { icon: 'explore', label: 'Browse Tours', href: '/tours', description: 'Find your next adventure' },
  { icon: 'favorite', label: 'My Wishlist', href: '/portal/wishlist', description: 'Saved destinations' },
  { icon: 'loyalty', label: 'Loyalty Points', href: '/portal/loyalty', description: '2,450 points available' },
  { icon: 'support_agent', label: 'Private Consultation', href: '/portal/consultation', description: 'Bespoke planning' },
];

const adminQuickLinks = [
  { icon: 'storefront', label: 'Supplier Dashboard', href: '/supplier', description: 'View supplier portal' },
  { icon: 'directions_car', label: 'Fleet Management', href: '/admin/fleet', description: 'Manage luxury fleet' },
  { icon: 'confirmation_number', label: 'Manage Bookings', href: '/admin/bookings', description: 'Oversee all reservations' },
  { icon: 'analytics', label: 'CRM & Users', href: '/admin/crm', description: 'Customer relationships' },
  { icon: 'forum', label: 'Inquiries', href: '/admin/messages', description: 'Handle client inquiries' },
  { icon: 'payments', label: 'Payments', href: '/admin/payments', description: 'Revenue & transactions' },
];

const consultantQuickLinks = [
  { icon: 'calendar_today', label: 'Appointments', href: '/portal/consultation', description: 'View scheduled meetings' },
  { icon: 'forum', label: 'Inquiries', href: '/admin/messages', description: 'Respond to client inquiries' },
  { icon: 'person', label: 'My Profile', href: '/portal/profile', description: 'View your profile' },
];

const supplierQuickLinks = [
  { icon: 'storefront', label: 'Supplier Dashboard', href: '/supplier', description: 'Manage listings and bookings' },
  { icon: 'sell', label: 'My Listings', href: '/supplier/listings', description: 'Manage your touring services' },
  { icon: 'person', label: 'My Profile', href: '/portal/profile', description: 'View your profile' },
];

export default async function TravelerProfileDashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  let dbUser = null;
  
  try {
    // 1. Try to find the user in our database using the Clerk ID from the fast auth() call
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        bookings: {
          include: {
            tourBooking: { include: { tourPackage: true } },
            hotelBooking: { include: { hotel: true } },
            carHireBooking: { include: { car: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        wishlistItems: true
      }
    });
  } catch (prismaError) {
    console.error("Prisma error fetching dashboard user:", prismaError);
  }

  // 2. If user doesn't exist in DB yet, or if we need their current info, we fetch the full Clerk user
  let clerkUser = null;
  if (!dbUser) {
    try {
      clerkUser = await currentUser();
    } catch (err: unknown) {
      console.error("Clerk currentUser() Error:", err);
    }

    if (clerkUser) {
      const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || '';
      const isAdminEmail = primaryEmail.toLowerCase() === 'poweldayck@gmail.com';
      
      try {
        // Try to find by email first (in case they exist but clerkId isn't linked)
        if (primaryEmail) {
          dbUser = await prisma.user.findUnique({
            where: { email: primaryEmail },
            include: {
              bookings: {
                include: {
                  tourBooking: { include: { tourPackage: true } },
                  hotelBooking: { include: { hotel: true } },
                  carHireBooking: { include: { car: true } },
                },
                take: 5
              },
              notifications: { take: 3 },
              activityLogs: { take: 5 },
              wishlistItems: true
            }
          });

          // If found by email, link the Clerk ID to this record
          if (dbUser) {
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: { clerkId: userId },
              include: {
                bookings: {
                  include: {
                    tourBooking: { include: { tourPackage: true } },
                    hotelBooking: { include: { hotel: true } },
                    carHireBooking: { include: { car: true } },
                  },
                  take: 5
                },
                notifications: { take: 3 },
                activityLogs: { take: 5 },
                wishlistItems: true
              }
            });
          }
        }

        // If still not found, create a new user record
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              clerkId: userId,
              email: primaryEmail,
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
              avatarUrl: clerkUser.imageUrl,
              role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
            },
            include: {
              bookings: {
                include: {
                  tourBooking: { include: { tourPackage: true } },
                  hotelBooking: { include: { hotel: true } },
                  carHireBooking: { include: { car: true } },
                },
                take: 5
              },
              notifications: { take: 3 },
              activityLogs: { take: 5 },
              wishlistItems: true
            }
          });
        }
      } catch (error) {
        console.error("Error identifying/creating user in dashboard:", error);
      }
    }
  }

  const userName = dbUser?.firstName || clerkUser?.firstName || 'Traveler';
  const bookingsCount = dbUser?.bookings?.length || 0;
  
  const wishlistItems = dbUser?.wishlistItems?.map(item => getWishlistItemDetails(item.itemType, item.itemId)).filter(Boolean) as WishlistItemLocal[] || [];

  // Maps the database bookings to the UI format
  const userTrips = dbUser?.bookings?.map((b: { 
    id: string;
    createdAt: Date; 
    status: string; 
    tourBooking?: { tourPackage?: { title: string; images: string[] } } | null;
    hotelBooking?: { hotel?: { name: string; images: string[] } } | null;
    carHireBooking?: { car?: { make: string; model: string; images: string[] } } | null;
  }) => {
    let destination = 'Trip';
    let type = 'Travel';
    let image = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
    
    if (b.tourBooking) {
      destination = b.tourBooking.tourPackage?.title || 'Tour';
      type = 'Tour';
      const images = b.tourBooking.tourPackage?.images;
      if (images && images.length > 0) image = images[0];
    } else if (b.hotelBooking) {
      destination = b.hotelBooking.hotel?.name || 'Hotel';
      type = 'Hotel';
      const images = b.hotelBooking.hotel?.images;
      if (images && images.length > 0) image = images[0];
    } else if (b.carHireBooking) {
      destination = b.carHireBooking.car ? `${b.carHireBooking.car.make} ${b.carHireBooking.car.model}` : 'Car Hire';
      type = 'Car Hire';
      const images = b.carHireBooking.car?.images;
      if (images && images.length > 0) image = images[0];
    }
    
    return {
      id: b.id,
      destination,
      dates: b.createdAt.toLocaleDateString(),
      status: b.status,
      statusColor: b.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      image,
      type
    };
  }) || [];


  return (
    <div className="relative min-h-screen w-full pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {userName}</h1>
          <p className="text-slate-400 text-lg">Here&apos;s an overview of your upcoming journeys and account.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">confirmation_number</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{bookingsCount}</p>
            <p className="text-sm text-slate-400">Active Bookings</p>
          </div>
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">public</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{dbUser?.bookings.length ? 1 : 0}</p>
            <p className="text-sm text-slate-400">Countries Visited</p>
          </div>
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">loyalty</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{(dbUser?.loyaltyPoints || 0).toLocaleString()}</p>
            <p className="text-sm text-slate-400">Reward Points</p>
          </div>
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">favorite</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{dbUser?.wishlistItems.length || 0}</p>
            <p className="text-sm text-slate-400">Wishlist Items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upcoming Trips</h2>
              <Link href="/tours" className="text-primary text-sm font-medium hover:underline">Book New Trip</Link>
            </div>

            {userTrips.length > 0 ? (
              userTrips.map((trip: {
                id: string;
                destination: string;
                type: string;
                image: string;
                status: string;
                statusColor: string;
                dates: string;
              }, idx: number) => (
                <div key={`${trip.destination}-${idx}`} className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/30 transition-all">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-32 sm:h-auto relative">
                      <img src={trip.image} alt={trip.destination} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{trip.destination}</h3>
                          <p className="text-sm text-slate-400">{trip.type}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${trip.statusColor}`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          {trip.dates}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Link href={`/portal/itinerary/${trip.id}`} className="text-sm font-medium text-primary hover:underline">View Details</Link>
                        <span className="text-border-dark">|</span>
                        <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-white">Contact Concierge</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface-dark border border-dashed border-border-dark rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">explore</span>
                <p className="text-white font-medium mb-1">No upcoming trips found</p>
                <p className="text-slate-400 text-sm mb-6">Ready to explore the world? Start planning your next adventure today.</p>
                <Link href="/tours" className="inline-flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                  Browse Tours
                </Link>
              </div>
            )}
            
            {/* Wishlist Section */}
            {wishlistItems.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">My Wishlist</h2>
                  <Link href="/portal/wishlist" className="text-primary text-sm font-medium hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.slice(0, 4).map((item) => (
                    <Link key={item.id} href={item.category === 'Tours' ? `/tours/${item.slug || 'serengeti'}` : '#'} className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/30 transition-all flex flex-col">
                      <div className="relative h-32 w-full">
                        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-3">
                          <p className="text-white font-bold text-sm line-clamp-1">{item.title}</p>
                          <p className="text-primary text-[10px] font-bold uppercase tracking-wider">{item.location}</p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold text-slate-200">${item.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span className="material-symbols-outlined text-[14px] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[10px] font-bold">{item.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Past Trips */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="bg-surface-dark border border-border-dark rounded-xl p-5 space-y-4">
                {dbUser?.activityLogs && dbUser.activityLogs.length > 0 ? (
                  dbUser.activityLogs.map((log: {
                    id: string;
                    action: string;
                    module: string;
                    createdAt: Date;
                  }) => (
                    <div key={log.id} className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{log.action} in {log.module}</p>
                        <p className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4 italic">No recent activity found.</p>
                )}
              </div>
            </div>
          </div>


          {/* Quick Links Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Quick Links</h2>
            <div className="space-y-3">
              {(dbUser?.role === 'ADMIN' || dbUser?.role === 'SUPER_ADMIN' 
                ? adminQuickLinks 
                : dbUser?.role === 'CONSULTANT' 
                  ? consultantQuickLinks 
                  : dbUser?.role === 'SUPPLIER'
                    ? supplierQuickLinks
                    : travelerLinks
              ).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-4 p-4 bg-surface-dark border border-border-dark rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">{link.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{link.label}</p>
                    <p className="text-xs text-slate-400">{link.description}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 ml-auto text-[18px]">chevron_right</span>
                </Link>
              ))}
            </div>

            {/* Concierge CTA */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
                <h3 className="text-white font-bold">Need Help?</h3>
              </div>
              <p className="text-sm text-slate-300 mb-4">Our dedicated concierge is available 24/7 for any travel needs.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">
                Contact Concierge
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
