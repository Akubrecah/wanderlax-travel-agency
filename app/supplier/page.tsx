import React from 'react';
import Link from 'next/link';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierNotifications } from '@/components/supplier/SupplierNotifications';
import { getSupplierStats, getRecentSupplierBookings } from '@/app/actions/supplierActions';

export const dynamic = 'force-dynamic';

export default async function SupplierDashboardPage() {
  const stats = await getSupplierStats();
  const recentRequests = await getRecentSupplierBookings();

  return (
    <div className="stitch-screen h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <SupplierSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-[#180a0a]">
          {/* Header */}
          <SupplierHeader 
            title="Supplier Dashboard" 
            description="Manage your listings, bookings, and earnings."
          >
            <SupplierNotifications />
          </SupplierHeader>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-dark rounded-xl p-6 border-l-4 border-emerald-500 border border-border-dark shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Active Listings</p>
                    <h3 className="text-white text-2xl font-bold mt-1">{stats.activeListings}</h3>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <span className="material-symbols-outlined">sell</span>
                  </div>
                </div>
                <Link href="/supplier/listings" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">View all listings</Link>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-dark rounded-xl p-6 border-l-4 border-emerald-500 border border-border-dark shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Pending Requests</p>
                    <h3 className="text-white text-2xl font-bold mt-1">{stats.pendingBookings}</h3>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                  Needs Attention
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-dark rounded-xl p-6 border-l-4 border-emerald-500 border border-border-dark shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Earnings</p>
                    <h3 className="text-white text-2xl font-bold mt-1">${stats.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    Calculated from Bookings
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-dark rounded-xl p-6 border-l-4 border-emerald-500 border border-border-dark shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Average Rating</p>
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="text-white text-2xl font-bold">{stats.rating}</h3>
                      <span className="material-symbols-outlined text-yellow-500 filled text-[20px]">star</span>
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <span className="material-symbols-outlined">reviews</span>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  Based on {stats.reviewsCount} reviews
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Requests Table */}
              <div className="lg:col-span-2 bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-lg flex flex-col">
                <div className="p-6 border-b border-border-dark flex justify-between items-center">
                  <h3 className="text-white text-lg font-bold">Recent Booking Requests</h3>
                  <Link href="/supplier/bookings" className="text-emerald-400 text-sm font-medium hover:text-white transition-colors">View All</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background-dark/50 text-xs uppercase tracking-wider text-slate-400">
                        <th className="p-4 font-semibold">Service</th>
                        <th className="p-4 font-semibold">Client</th>
                        <th className="p-4 font-semibold">Dates</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border-dark">
                      {recentRequests.length > 0 ? (
                        recentRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">{req.service}</td>
                            <td className="p-4 text-slate-300">{req.client}</td>
                            <td className="p-4 text-slate-400">{req.dates}</td>
                            <td className="p-4 text-emerald-400 font-medium">${req.amount}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border w-fit inline-block
                                ${req.status === 'CONFIRMED' || req.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                              `}>
                                {req.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            No recent booking requests found for your properties.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg h-fit">
                <h3 className="text-white text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/supplier/listings/new" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-white transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded-md text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">add_business</span>
                      </div>
                      <span className="text-sm font-medium">Add New Listing</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                  <Link href="/supplier/bookings?filter=pending" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-white transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded-md text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">rule</span>
                      </div>
                      <span className="text-sm font-medium">Review Pending ({stats.pendingBookings})</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                  <Link href="/supplier/finances" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-white transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded-md text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">account_balance</span>
                      </div>
                      <span className="text-sm font-medium">Request Payout</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                </div>
                
                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex gap-3 mb-2">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">help</span>
                    <h4 className="text-white font-bold text-sm">Need Help?</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 pl-8">Our supplier support team is here for you 24/7.</p>
                  <Link href="/supplier/support" className="ml-8 text-xs font-bold text-emerald-400 hover:text-white transition-colors">Contact Support &rarr;</Link>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
