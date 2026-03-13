import React from 'react';
import Link from 'next/link';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierNotifications } from '@/components/supplier/SupplierNotifications';
import { getSupplierStats, getRecentSupplierBookings } from '@/app/actions/supplierActions';

export const dynamic = 'force-dynamic';

export default async function SupplierDashboardPage() {
  const [stats, bookings] = await Promise.all([
    getSupplierStats(),
    getRecentSupplierBookings(),
  ]);

  return (
    <div className="stitch-screen h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <SupplierSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#180a0a]">
          {/* Header */}
          <SupplierHeader title="Overview" description="Manage your listings and track performance.">
            <SupplierNotifications />
          </SupplierHeader>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Listings</p>
                    <h3 className="text-white text-3xl font-black mt-2">{stats.activeListings}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    <span className="material-symbols-outlined">sell</span>
                  </div>
                </div>
                <Link href="/supplier/listings" className="text-primary text-xs font-bold hover:text-white transition-colors flex items-center gap-1">
                  View all listings <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Requests</p>
                    <h3 className="text-white text-3xl font-black mt-2">{stats.pendingBookings}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                </div>
                <Link href="/supplier/bookings" className="text-primary text-xs font-bold hover:text-white transition-colors flex items-center gap-1">
                  Review requests <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-white text-3xl font-black mt-2">${stats.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <Link href="/supplier/earnings" className="text-primary text-xs font-bold hover:text-white transition-colors flex items-center gap-1">
                   Earnings breakdown <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings List */}
              <div className="lg:col-span-2 bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg shadow-black/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-lg font-bold">Recent Booking Requests</h3>
                  <Link href="/supplier/bookings" className="text-primary text-sm font-bold hover:text-white transition-colors">See all</Link>
                </div>
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background-dark/50 text-[10px] uppercase tracking-wider text-slate-400">
                        <th className="p-4 font-bold border-b border-border-dark/50">Service</th>
                        <th className="p-4 font-bold border-b border-border-dark/50">Client</th>
                        <th className="p-4 font-bold border-b border-border-dark/50">Amount</th>
                        <th className="p-4 font-bold border-b border-border-dark/50 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-border-dark/30">
                      {bookings.length > 0 ? (
                        bookings.map((req) => (
                          <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 text-white font-bold">{req.service}</td>
                            <td className="p-4 text-slate-400 font-medium">{req.client}</td>
                            <td className="p-4 text-primary font-black">${req.amount}</td>
                            <td className="p-4 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                req.status === 'CONFIRMED' || req.status === 'COMPLETED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">
                            No recent booking requests found for your properties.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions & Support */}
              <div className="space-y-6">
                <div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg shadow-black/20">
                  <h3 className="text-white text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/supplier/listings" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark/50 border border-border-dark text-slate-300 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        </div>
                        <span className="text-sm font-medium">Add New Listing</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </Link>
                    <Link href="/supplier/earnings" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark/50 border border-border-dark text-slate-300 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                        </div>
                        <span className="text-sm font-medium">Request Payout</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-primary rounded-xl p-6 shadow-lg shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="text-white font-black text-xl mb-2 relative z-10">Need Help?</h4>
                  <p className="text-white/80 text-xs mb-4 relative z-10">Our support team is available 24/7 to assist with your listings.</p>
                  <Link href="/contact" className="px-4 py-2 bg-white text-primary rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors relative z-10 inline-block shadow-lg">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
