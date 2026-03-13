import React from 'react';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierNotifications } from '@/components/supplier/SupplierNotifications';
import { getSupplierStats } from '@/app/actions/supplierActions';

export const dynamic = 'force-dynamic';

export default async function SupplierEarningsPage() {
  const stats = await getSupplierStats();

  return (
    <div className="stitch-screen h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        <SupplierSidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#180a0a]">
          <SupplierHeader title="Earnings" description="Track your revenue and request payouts.">
            <SupplierNotifications />
          </SupplierHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-dark rounded-xl p-8 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Revenue</p>
                <h2 className="text-white text-4xl font-black">${stats.totalRevenue.toLocaleString()}</h2>
                <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+12% from last month</span>
                </div>
              </div>
              
              <div className="bg-surface-dark rounded-xl p-8 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Available Balance</p>
                <h2 className="text-white text-4xl font-black">${(stats.totalRevenue * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                <button className="mt-4 w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20">
                  Request Payout
                </button>
              </div>

              <div className="bg-surface-dark rounded-xl p-8 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Completed Bookings</p>
                <h2 className="text-white text-4xl font-black">{stats.completedBookings}</h2>
                <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Successfully processed</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-lg shadow-black/20">
              <div className="p-6 border-b border-border-dark">
                <h3 className="text-white text-lg font-bold">Payout History</h3>
              </div>
              <div className="p-12 text-center text-slate-500">
                 <span className="material-symbols-outlined text-5xl mb-4 block opacity-20">receipt_long</span>
                 <p className="font-medium">No payout history yet.</p>
                 <p className="text-xs mt-1">Earnings from your upcoming bookings will appear here once processed.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
