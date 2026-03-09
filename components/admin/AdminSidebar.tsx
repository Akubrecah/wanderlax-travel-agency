"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useAdminSidebar } from './AdminSidebarContext';

export function AdminSidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { isMobileOpen, closeMobileSidebar } = useAdminSidebar();

  const getLinkClasses = (path: string) => {
    // Exact match for dashboard, startswith for others (like /admin/bookings/...)
    const isActive = path === '/admin' ? pathname === path : pathname.startsWith(path);
    
    if (isActive) {
        return "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary transition-all group";
    }
    return "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-surface-dark hover:text-white transition-all group border-l-4 border-transparent hover:border-border-dark";
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

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border-dark bg-background-dark transition-transform duration-300 lg:static lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-border-dark/50">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/50" data-alt="Company Logo Abstract" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxItnaRqAa0g0uhxpuiOdb5rjaRHwYCL0n7dcgj6gpBxbVgzVSpOmVpNDtlkLqEm6Ze2lhMUbFi2PsMFtMdhjHvUW_zqdcsNNAYgdvNCAWPx37jaVg5l-X5JXTcHfj1vcStnvVtqx8d5SjGu0XUlkjaqPEyozRkQfyAY8G8g8Pe-ML_RLvR-ZGxXZPqtBhApMJd6cuGxcuLGsk7ywOLEOUtj_0wy8V0aGHeasXxMKgasV-t32xtgl9phTGColXAYURYBQrnR-sNg')" }}></div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold tracking-tight">Twende Africa Tours</h1>
              <p className="text-primary text-xs font-semibold uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <Link className={getLinkClasses("/admin")} href="/admin">
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="text-sm font-semibold">Dashboard</span>
        </Link>
        <Link className={getLinkClasses("/admin/bookings")} href="/admin/bookings">
          <span className="material-symbols-outlined text-[24px]">calendar_month</span>
          <span className="text-sm font-medium">Bookings</span>
        </Link>
        <Link className={getLinkClasses("/admin/hotels")} href="/admin/hotels">
          <span className="material-symbols-outlined text-[24px]">hotel</span>
          <span className="text-sm font-medium">Hotels</span>
        </Link>
        <Link className={getLinkClasses("/admin/tours")} href="/admin/tours">
          <span className="material-symbols-outlined text-[24px]">map</span>
          <span className="text-sm font-medium">Tours</span>
        </Link>
        <Link className={getLinkClasses("/admin/events")} href="/admin/events">
          <span className="material-symbols-outlined text-[24px]">local_activity</span>
          <span className="text-sm font-medium">Events</span>
        </Link>
        <Link className={getLinkClasses("/admin/tickets")} href="/admin/tickets">
           <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
           <span className="text-sm font-medium">Tickets</span>
        </Link>
        <Link className={getLinkClasses("/admin/fleet")} href="/admin/fleet">
          <span className="material-symbols-outlined text-[24px]">directions_car</span>
          <span className="text-sm font-medium">Rentals</span>
        </Link>
        <Link className={getLinkClasses("/admin/staff")} href="/admin/staff">
          <span className="material-symbols-outlined text-[24px]">group</span>
          <span className="text-sm font-medium">Staff & Roles</span>
        </Link>
        <Link className={getLinkClasses("/admin/payments")} href="/admin/payments">
          <span className="material-symbols-outlined text-[24px]">credit_card</span>
          <span className="text-sm font-medium">Payments</span>
        </Link>
        <Link className={getLinkClasses("/admin/crm")} href="/admin/crm">
          <span className="material-symbols-outlined text-[24px]">group</span>
          <span className="text-sm font-medium">Customers</span>
        </Link>
        <Link className={getLinkClasses("/admin/messages")} href="/admin/messages">
          <span className="material-symbols-outlined text-[24px]">forum</span>
          <span className="text-sm font-medium">Messages</span>
        </Link>
        <Link className={getLinkClasses("/admin/testimonials")} href="/admin/testimonials">
          <span className="material-symbols-outlined text-[24px]">reviews</span>
          <span className="text-sm font-medium">Testimonials</span>
        </Link>
        <Link className={getLinkClasses("/admin/reports")} href="/admin/reports">
          <span className="material-symbols-outlined text-[24px]">assessment</span>
          <span className="text-sm font-medium">Reports</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-border-dark/50">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
          <Link className={getLinkClasses("/admin/settings")} href="/admin/settings">
            <span className="material-symbols-outlined text-[24px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary/80 hover:bg-surface-dark hover:text-primary transition-all group border-l-4 border-transparent hover:border-border-dark mt-2" href="/portal/dashboard">
            <span className="material-symbols-outlined text-[24px]">switch_account</span>
            <span className="text-sm font-medium">User Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-border-dark">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark border border-border-dark">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-8" data-alt="User Avatar Profile" style={{ backgroundImage: `url('${user?.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-IBtcNloCVv54a1j2HpwGpjo2wGjfX2gOihiZLlnhLqVsOvBlMASFZ0laWjaPmD9n0CEb_cMJCeW9SVs4-g7mTjYrireW7qoW9U820REumIp6RiZlqnzLi8P6Xg-M6RkHhD3qcADu_9R6fi7jGAMdsu8EXoKTViRIfLASpzS3x3bvXGlrup4ioKFxxP540_LmF5K5o8hq-MkkxFXvj2fgeDQt1kTATsSF2LY2MkB21U9DBUE3N3MWUGneYtxycRhnPC4P8020Bw'}')` }}></div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user?.fullName || 'Admin User'}</span>
            <span className="text-xs text-slate-400 truncate capitalize">
              {user?.publicMetadata?.role as string || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  </>
  );
}
