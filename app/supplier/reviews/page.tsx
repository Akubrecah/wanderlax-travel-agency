import React from 'react';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierNotifications } from '@/components/supplier/SupplierNotifications';
import { getSupplierStats } from '@/app/actions/supplierActions';

export const dynamic = 'force-dynamic';

export default async function SupplierReviewsPage() {
  const stats = await getSupplierStats();

  return (
    <div className="stitch-screen h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex h-full w-full overflow-hidden">
        <SupplierSidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#180a0a]">
          <SupplierHeader title="Customer Reviews" description="Monitor and respond to customer feedback.">
            <SupplierNotifications />
          </SupplierHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
            <div className="bg-surface-dark rounded-xl p-8 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Average Rating</p>
                <div className="flex items-center gap-4">
                  <h2 className="text-white text-5xl font-black">{stats.rating}</h2>
                  <div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`material-symbols-outlined filled text-xl ${i > Math.floor(stats.rating) ? 'opacity-30' : ''}`}>star</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-1">BASED ON {stats.reviewsCount} REVIEWS</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                 <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-all shadow-lg">
                    Export Reviews CSV
                 </button>
              </div>
            </div>

            <div className="p-20 text-center text-slate-500 bg-surface-dark rounded-xl border border-border-dark shadow-lg shadow-black/20 flex flex-col items-center">
                 <div className="size-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl opacity-30 text-white">rate_review</span>
                 </div>
                 <h3 className="text-white font-bold text-xl mb-2">No individual reviews to display</h3>
                 <p className="text-sm max-w-md mx-auto">We're currently aggregating your reviews from all sources. Detailed review cards will appear here shortly.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
