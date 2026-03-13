"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSupplierSidebar } from './SupplierSidebarContext';

export function SupplierSidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { isMobileOpen, closeMobileSidebar } = useSupplierSidebar();

  const getLinkClasses = (path: string) => {
    const isActive =
      path === '/supplier' ? pathname === path : pathname.startsWith(path);
    if (isActive) {
      return 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary transition-all group';
    }
    return 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-surface-dark hover:text-white transition-all border-l-4 border-transparent hover:border-border-dark group';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
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
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/50" data-alt="Company Logo Abstract" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxItnaRqAa0g0uhxpuiOdb5rjaRHwYCL0n7dcgj6gpBxbVgzVSpOmVpNDtlkLqEm6Ze2lhMUbFi2PsMFtMdhjHvUW_zqdcsNNAYgdvNCAWPx37jaVg5l-X5JXTcHfj1vcStnvVtqx8d5SjGu0XUlkjaqPEyozRkQfyAY8G8g8Pe-ML_RLvR-ZGxXZPqtBhApMJd6cuGxcuLGsk7ywOLEOUtj_0wy8V0aGHeasXxMKgasV-t32xtgl9phTGColXAYURYBQrnR-sNg')" }}></div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold tracking-tight">Twende Africa</h1>
              <p className="text-primary text-xs font-semibold uppercase tracking-wider">
                Supplier Portal
              </p>
            </div>
          </div>
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <Link className={getLinkClasses('/supplier')} href="/supplier">
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
          <Link className={getLinkClasses('/supplier/listings')} href="/supplier/listings">
            <span className="material-symbols-outlined text-[24px]">sell</span>
            <span className="text-sm font-medium">My Listings</span>
          </Link>
          <Link className={getLinkClasses('/supplier/bookings')} href="/supplier/bookings">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
            <span className="text-sm font-medium">Booking Requests</span>
          </Link>
          <Link className={getLinkClasses('/supplier/earnings')} href="/supplier/earnings">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            <span className="text-sm font-medium">Earnings</span>
          </Link>
          <Link className={getLinkClasses('/supplier/reviews')} href="/supplier/reviews">
            <span className="material-symbols-outlined text-[24px]">reviews</span>
            <span className="text-sm font-medium">Reviews</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-border-dark/50">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Account
            </p>
            <Link className={getLinkClasses('/portal/profile')} href="/portal/profile">
              <span className="material-symbols-outlined text-[24px]">person</span>
              <span className="text-sm font-medium">My Profile</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary/80 hover:bg-surface-dark hover:text-primary transition-all border-l-4 border-transparent hover:border-border-dark mt-1 group"
            >
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-sm font-medium">Main Website</span>
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
              <span className="text-xs text-primary truncate capitalize font-medium">
                Supplier
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
