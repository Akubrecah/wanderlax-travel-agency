import React from 'react';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierNotifications } from '@/components/supplier/SupplierNotifications';
import { getRecentSupplierBookings } from '@/app/actions/supplierActions';

export const dynamic = 'force-dynamic';

export default async function SupplierBookingsPage() {
  const bookings = await getRecentSupplierBookings();

  return (
    <div className="stitch-screen h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        <SupplierSidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#180a0a]">
          <SupplierHeader title="Booking Requests" description="Manage and review customer reservations.">
            <SupplierNotifications />
          </SupplierHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-lg shadow-black/20">
              <div className="p-6 border-b border-border-dark flex justify-between items-center">
                <h3 className="text-white text-lg font-bold uppercase tracking-tight">All Requests</h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1 bg-white/5 border border-white/10 text-white rounded-md text-[10px] font-bold hover:bg-white/10 transition-all">Filter</button>
                   <button className="px-3 py-1 bg-white/5 border border-white/10 text-white rounded-md text-[10px] font-bold hover:bg-white/10 transition-all">Download</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-dark/30 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                      <th className="p-4 border-b border-border-dark/50">Service</th>
                      <th className="p-4 border-b border-border-dark/50">Client</th>
                      <th className="p-4 border-b border-border-dark/50 text-center">Dates</th>
                      <th className="p-4 border-b border-border-dark/50 text-center">Amount</th>
                      <th className="p-4 border-b border-border-dark/50 text-center">Status</th>
                      <th className="p-4 border-b border-border-dark/50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-border-dark/30">
                    {bookings.length > 0 ? (
                      bookings.map((req) => (
                        <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 text-white font-bold">{req.service}</td>
                          <td className="p-4 text-slate-400 font-medium">{req.client}</td>
                          <td className="p-4 text-slate-500 text-center font-medium">{req.dates}</td>
                          <td className="p-4 text-primary font-black text-center">${req.amount}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider
                              ${req.status === 'CONFIRMED' || req.status === 'COMPLETED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                            `}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-primary hover:text-white transition-colors text-[11px] font-black uppercase tracking-tight">Details</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-600">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-20 block">inbox</span>
                          No booking requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
