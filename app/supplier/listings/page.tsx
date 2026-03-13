import React from 'react';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierNotifications } from '@/components/supplier/SupplierNotifications';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export default async function SupplierListingsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  });

  if (!user) return <div>User not found</div>;

  const supplierId = user.id;

  // Fetch all listings owned by this supplier
  const [tours, hotels, cars, events] = await Promise.all([
    prisma.tourPackage.findMany({ where: { supplierId } }),
    prisma.hotel.findMany({ where: { supplierId } }),
    prisma.car.findMany({ where: { supplierId } }),
    prisma.event.findMany({ where: { supplierId } }),
  ]);

  interface ListingItem {
    id: string;
    type: string;
    name: string;
    title?: string;
    images?: string[];
    address?: string;
    destination?: string;
    status?: string;
    isActive?: boolean;
    make?: string;
    model?: string;
  }

  return (
    <div className="stitch-screen h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        <SupplierSidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#180a0a]">
          <SupplierHeader title="My Listings" description="Manage your properties, tours, and services.">
            <SupplierNotifications />
          </SupplierHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...tours.map(t => ({ ...t, type: 'Tour', name: t.title })), 
                ...hotels.map(h => ({ ...h, type: 'Hotel' })), 
                ...cars.map(c => ({ ...c, type: 'Car', name: `${c.make} ${c.model}` })),
                ...events.map(e => ({ ...e, type: 'Event', name: e.title }))
              ].map((listing: ListingItem) => (
                <div key={listing.id} className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-lg shadow-black/20 group hover:border-primary/50 transition-all">
                  <div className="h-40 bg-slate-800 relative">
                    {listing.images?.[0] ? (
                       // eslint-disable-next-line @next/next/no-img-element
                      <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                      {listing.type}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">{listing.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate">{listing.address || listing.destination || 'Multiple Locations'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border-dark">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</p>
                        <p className="text-xs text-primary font-bold">{listing.status || listing.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                      <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Listing Card */}
              <button className="bg-surface-dark/50 rounded-xl border border-dashed border-border-dark flex flex-col items-center justify-center p-8 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 shadow-lg shadow-black/10 transition-all group min-h-[300px]">
                <div className="size-14 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </div>
                <p className="font-bold text-lg text-white">Add New Listing</p>
                <p className="text-xs mt-2 text-center text-slate-600">Start offering a new service on Twende Africa</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
