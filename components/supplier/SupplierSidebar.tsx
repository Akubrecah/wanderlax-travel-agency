"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export function SupplierSidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getLinkClasses = (path: string) => {
    const isActive =
      path === '/supplier' ? pathname === path : pathname.startsWith(path);
    if (isActive) {
      return 'flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-600/10 text-emerald-400 border-l-4 border-emerald-500 transition-all';
    }
    return 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-surface-dark hover:text-white transition-all border-l-4 border-transparent hover:border-border-dark';
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-background-dark border border-border-dark rounded-lg text-slate-300"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border-dark bg-background-dark transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-border-dark/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-600/20 flex items-center justify-center ring-2 ring-emerald-500/30">
              <span className="material-symbols-outlined text-emerald-400 text-[22px]">storefront</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold tracking-tight">Twende Africa</h1>
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Supplier Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <Link className={getLinkClasses('/supplier')} href="/supplier">
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
          <Link className={getLinkClasses('/supplier/listings')} href="/supplier/listings">
            <span className="material-symbols-outlined text-[22px]">sell</span>
            <span className="text-sm font-medium">My Listings</span>
          </Link>
          <Link className={getLinkClasses('/supplier/bookings')} href="/supplier/bookings">
            <span className="material-symbols-outlined text-[22px]">event_available</span>
            <span className="text-sm font-medium">Booking Requests</span>
          </Link>
          <Link className={getLinkClasses('/supplier/earnings')} href="/supplier/earnings">
            <span className="material-symbols-outlined text-[22px]">payments</span>
            <span className="text-sm font-medium">Earnings</span>
          </Link>
          <Link className={getLinkClasses('/supplier/reviews')} href="/supplier/reviews">
            <span className="material-symbols-outlined text-[22px]">reviews</span>
            <span className="text-sm font-medium">Reviews</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-border-dark/50">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Account
            </p>
            <Link className={getLinkClasses('/portal/profile')} href="/portal/profile">
              <span className="material-symbols-outlined text-[22px]">person</span>
              <span className="text-sm font-medium">My Profile</span>
            </Link>
            <Link
              href="/portal/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-400/80 hover:bg-surface-dark hover:text-emerald-400 transition-all border-l-4 border-transparent hover:border-border-dark mt-1"
            >
              <span className="material-symbols-outlined text-[22px]">switch_account</span>
              <span className="text-sm font-medium">Traveler Dashboard</span>
            </Link>
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border-dark">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark border border-border-dark">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-8"
              style={{
                backgroundImage: `url('${
                  user?.imageUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-IBtcNloCVv54a1j2HpwGpjo2wGjfX2gOihiZLlnhLqVsOvBlMASFZ0laWjaPmD9n0CEb_cMJCeW9SVs4-g7mTjYrireW7qoW9U820REumIp6RiZlqnzLi8P6Xg-M6RkHhD3qcADu_9R6fi7jGAMdsu8EXoKTViRIfLASpzS3x3bvXGlrup4ioKFxxP540_LmF5K5o8hq-MkkxFXvj2fgeDQt1kTATsSF2LY2MkB21U9DBUE3N3MWUGneYtxycRhnPC4P8020Bw'
                }')`
              }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">
                {user?.fullName || 'Supplier'}
              </span>
              <span className="text-xs text-emerald-400 truncate capitalize font-medium">
                Supplier
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
