"use client";
 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NOTIFICATIONS } from '@/lib/notifications';
import { getAdminBookings } from '@/app/actions/bookingActions';
import { getAdminTours } from '@/app/actions/tourActions';

import { Booking, User, TourBooking, HotelBooking, CarHireBooking } from '@prisma/client';

type AdminBooking = Booking & {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'avatarUrl' | 'role'> | null;
  tourBooking: (TourBooking & { tourPackage: { title: string; destination: { name: string; country: string; images: string[] } } }) | null;
  hotelBooking: (HotelBooking & { hotel: { name: string; destination: { name: string; country: string; images: string[] } }; room: { name: string } }) | null;
  carHireBooking: (CarHireBooking & { car: { model: string } }) | null;
  event: { title: string; destination: string } | null;
  payments: { status: string; failureReason: string | null }[];
};

export default function TwendeAdminDashboardOverviewPage() {
  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [showNotifications, setShowNotifications] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [featuredTours, setFeaturedTours] = useState<{ id: string; title: string; images: string[]; destination: { name: string; country: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsData, toursData] = await Promise.all([
          getAdminBookings(),
          getAdminTours(),
        ]);
        setBookings(bookingsData || []);
        const featured = (toursData || []).filter((t: { featured?: boolean }) => t.featured);
        setFeaturedTours(featured);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalBookings = bookings.length;
  // Calculate revenue from PAID payments or COMPLETED/CONFIRMED bookings with totals
  const totalRevenue = bookings.reduce((sum, b) => {
    // Check if there are any PAID payments for this booking
    const hasPaidPayment = b.payments?.some(p => p.status === 'PAID');
    if (hasPaidPayment || b.paymentStatus === 'PAID' || b.status === 'COMPLETED') {
      return sum + (Number(b.totalAmount) || 0);
    }
    return sum;
  }, 0);
  
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;

  const toggleDropdown = (id: number) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };
  const destinationCounts: Record<string, { count: number; image: string; name: string }> = {};

  bookings.forEach(booking => {
     let destName = '';
     let destImage = '';
     if (booking.tourBooking?.tourPackage?.destination) {
       destName = `${booking.tourBooking.tourPackage.destination.name}, ${booking.tourBooking.tourPackage.destination.country}`;
       destImage = booking.tourBooking.tourPackage.destination.images?.[0] || 'https://via.placeholder.com/150';
     } else if (booking.hotelBooking?.hotel?.destination) {
       destName = `${booking.hotelBooking.hotel.destination.name}, ${booking.hotelBooking.hotel.destination.country}`;
       destImage = booking.hotelBooking.hotel.destination.images?.[0] || 'https://via.placeholder.com/150';
     }
     
     if (destName) {
        if (!destinationCounts[destName]) {
           destinationCounts[destName] = { count: 0, image: destImage, name: destName };
        }
        destinationCounts[destName].count += 1;
     }
  });

  const topDestinations = Object.values(destinationCounts)
     .sort((a, b) => b.count - a.count)
     .slice(0, 3);
  
  const totalDestBookings = Object.values(destinationCounts).reduce((sum, dest) => sum + dest.count, 0);

  return (
    <div className="stitch-screen h-screen overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
{/* Sidebar */}
<AdminSidebar />
{/* Main Content */}
<main className="flex-1 flex flex-col h-full overflow-hidden bg-[#180a0a]">
{/* Header */}
<AdminHeader 
  title="Overview" 
  description="Welcome back, here's what's happening today."
>
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
      <span className="material-symbols-outlined text-[20px]">search</span>
    </span>
    <input className="w-full max-w-[10rem] sm:max-w-xs py-2 pl-10 pr-4 bg-surface-dark border border-border-dark rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Search..." type="text"/>
  </div>
  <div className="relative">
    <button 
      onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 rounded-lg bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark transition-colors"
    >
      <span className="material-symbols-outlined">notifications</span>
      {NOTIFICATIONS.length > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full ring-2 ring-surface-dark flex items-center justify-center">
          <span className="text-[10px] font-bold text-white leading-none">{NOTIFICATIONS.length}</span>
        </span>
      )}
    </button>
    
    {showNotifications && (
      <div className="absolute right-0 mt-2 w-80 bg-surface-dark border border-border-dark rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 border-b border-border-dark flex justify-between items-center bg-background-dark/50">
          <h3 className="text-white font-bold text-sm">Notifications <span className="ml-1 text-xs font-normal text-slate-400">({NOTIFICATIONS.length})</span></h3>
          <Link href="/admin/messages" className="text-xs text-primary hover:text-white transition-colors" onClick={() => setShowNotifications(false)}>View all</Link>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {NOTIFICATIONS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <span className="material-symbols-outlined text-4xl opacity-30">notifications_off</span>
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            NOTIFICATIONS.map((n, index) => (
              <Link
                key={n.id}
                href="/admin/messages"
                onClick={() => setShowNotifications(false)}
                className={`block p-4 ${index < NOTIFICATIONS.length - 1 ? 'border-b border-border-dark' : ''} hover:bg-white/5 transition-colors cursor-pointer text-left relative z-10`}
              >
                <div className="flex gap-3">
                  <div className={`h-8 w-8 rounded-full ${n.iconBg} ${n.iconColor} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      {n.message}
                      <strong className={`font-semibold ${n.highlightColor}`}>{n.highlight}</strong>
                      {n.id === 2 && ' received'}
                      {n.id === 3 && ' returned'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    )}
  </div>
</AdminHeader>
{/* Scrollable Area */}
<div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
{/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* Card 1 */}
<div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
<div className="flex justify-between items-start mb-4">
<div>
<p className="text-slate-400 text-sm font-medium">Total Bookings</p>
<h3 className="text-white text-2xl font-bold mt-1">{totalBookings}</h3>
</div>
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">confirmation_number</span>
</div>
</div>
<div className="flex items-center gap-2 text-sm">
{totalBookings > 0 ? (
  <>
    <span className="text-green-500 flex items-center gap-1 font-medium">
      <span className="material-symbols-outlined text-[16px]">trending_up</span>
      --% {/* TODO: Calculate actual MoM change */}
    </span>
    <span className="text-slate-500">vs last month (placeholder)</span>
  </>
) : (
  <span className="text-slate-500">No data yet</span>
)}
</div>
</div>
{/* Card 2 */}
<div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
<div className="flex justify-between items-start mb-4">
<div>
<p className="text-slate-400 text-sm font-medium">Total Revenue</p>
<h3 className="text-white text-2xl font-bold mt-1">${totalRevenue >= 1000 ? (totalRevenue/1000).toFixed(1) + 'k' : totalRevenue}</h3>
</div>
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">payments</span>
</div>
</div>
<div className="flex items-center gap-2 text-sm">
{totalRevenue > 0 ? (
  <>
    <span className="text-green-500 flex items-center gap-1 font-medium">
      <span className="material-symbols-outlined text-[16px]">trending_up</span>
      {loading ? '...' : '8.2%'}
    </span>
    <span className="text-slate-500">vs last month</span>
  </>
) : (
  <span className="text-slate-500">No data yet</span>
)}
</div>
</div>
{/* Card 3 */}
<div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
<div className="flex justify-between items-start mb-4">
<div>
<p className="text-slate-400 text-sm font-medium">Confirmed</p>
<h3 className="text-white text-2xl font-bold mt-1">{confirmedBookings}</h3>
</div>
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">check_circle</span>
</div>
</div>
<div className="flex items-center gap-2 text-sm">
<span className="text-slate-400">Past & Upcoming</span>
</div>
</div>
{/* Card 4 */}
<div className="bg-surface-dark rounded-lg p-6 border-l-4 border-primary border-y border-r border-y-border-dark border-r-border-dark shadow-lg shadow-black/20">
<div className="flex justify-between items-start mb-4">
<div>
<p className="text-slate-400 text-sm font-medium">Pending</p>
<h3 className="text-white text-2xl font-bold mt-1">{pendingBookings}</h3>
</div>
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">pending_actions</span>
</div>
</div>
<div className="flex items-center gap-2 text-sm">
<span className="text-yellow-500 font-medium">Needs Attention</span>
</div>
</div>
</div>
{/* Main Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Chart Section */}
<div className="lg:col-span-2 bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg shadow-black/20">
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
<div>
<h3 className="text-white text-lg font-bold">Revenue Trends</h3>
<p className="text-slate-400 text-sm">Monthly revenue analytics</p>
</div>
{bookings.length > 0 && (
<div className="flex items-center gap-2 bg-background-dark p-1 rounded-lg border border-border-dark">
<button 
  onClick={() => setRevenuePeriod('monthly')}
  className={`px-3 py-1 text-xs font-medium rounded shadow-sm transition-colors ${revenuePeriod === 'monthly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>
  Monthly
</button>
<button 
  onClick={() => setRevenuePeriod('weekly')}
  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${revenuePeriod === 'weekly' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
  Weekly
</button>
</div>
)}
</div>
{bookings.length === 0 ? (
<div className="flex flex-col items-center justify-center h-64 text-slate-500">
  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">bar_chart</span>
  <p className="text-sm">No revenue data yet.</p>
</div>
) : (
<>
<div className="relative h-64 w-full">
{/* Simulated Chart Area */}
<div className="absolute inset-0 flex items-end justify-between px-2 gap-2">
{revenuePeriod === 'monthly' ? (
  <>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[40%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$12k</div></div>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[65%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$34k</div></div>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[50%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$22k</div></div>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[75%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$45k</div></div>
    <div className="w-full bg-primary/20 hover:bg-primary/30 transition-all rounded-t-sm h-[60%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$28k</div></div>
    <div className="w-full bg-primary/30 hover:bg-primary/40 transition-all rounded-t-sm h-[85%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$56k</div></div>
    <div className="w-full bg-gradient-to-t from-primary/40 to-primary/80 hover:to-primary transition-all rounded-t-sm h-[95%] relative group shadow-[0_0_15px_rgba(198,16,16,0.3)]"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$68k</div></div>
    <div className="w-full bg-primary/20 hover:bg-primary/30 transition-all rounded-t-sm h-[70%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$38k</div></div>
  </>
) : (
  <>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[30%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$8k</div></div>
    <div className="w-full bg-primary/20 hover:bg-primary/30 transition-all rounded-t-sm h-[45%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$14k</div></div>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[55%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$19k</div></div>
    <div className="w-full bg-gradient-to-t from-primary/40 to-primary/80 hover:to-primary transition-all rounded-t-sm h-[85%] relative group shadow-[0_0_15px_rgba(198,16,16,0.3)]"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$31k</div></div>
    <div className="w-full bg-primary/20 hover:bg-primary/30 transition-all rounded-t-sm h-[65%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$23k</div></div>
    <div className="w-full bg-primary/10 hover:bg-primary/20 transition-all rounded-t-sm h-[50%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$17k</div></div>
    <div className="w-full bg-primary/30 hover:bg-primary/40 transition-all rounded-t-sm h-[75%] relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$26k</div></div>
  </>
)}
</div>
{/* Grid Lines */}
<div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
<div className="w-full h-px bg-border-dark/30 border-t border-dashed border-slate-700"></div>
<div className="w-full h-px bg-border-dark/30 border-t border-dashed border-slate-700"></div>
<div className="w-full h-px bg-border-dark/30 border-t border-dashed border-slate-700"></div>
<div className="w-full h-px bg-border-dark/30 border-t border-dashed border-slate-700"></div>
<div className="w-full h-px bg-border-dark"></div>
</div>
</div>
<div className="flex justify-between mt-4 text-xs text-slate-500 font-medium px-2">
{revenuePeriod === 'monthly' ? (
  <><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></>
) : (
  <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
)}
</div>
</>
)}
</div>
{/* Quick Actions & Mini List */}
<div className="flex flex-col gap-6">
{/* Quick Actions */}
<div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg shadow-black/20">
<h3 className="text-white text-lg font-bold mb-4">Quick Actions</h3>
<div className="space-y-3">
<Link href="/admin/tours" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark text-slate-300 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all group">
<div className="flex items-center gap-3">
<div className="bg-primary/10 p-2 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-[20px]">add_location_alt</span>
</div>
<span className="text-sm font-medium">Add New Tour</span>
</div>
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</Link>
<Link href="/admin/fleet" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark text-slate-300 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all group">
<div className="flex items-center gap-3">
<div className="bg-primary/10 p-2 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-[20px]">no_crash</span>
</div>
<span className="text-sm font-medium">Add Rental Car</span>
</div>
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</Link>
<Link href="/admin/crm" className="w-full flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark text-slate-300 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all group">
<div className="flex items-center gap-3">
<div className="bg-primary/10 p-2 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-[20px]">person_add</span>
</div>
<span className="text-sm font-medium">New Customer</span>
</div>
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</Link>
</div>
</div>
{/* Mini Stats: Top Destinations */}
<div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg shadow-black/20 flex-1">
<h3 className="text-white text-lg font-bold mb-4">Top Destinations</h3>
{topDestinations.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">map</span>
    <p className="text-sm">No destinations booked yet.</p>
  </div>
) : (
  <div className="space-y-4">
    {topDestinations.map((dest, i) => {
       const percentage = totalDestBookings > 0 ? Math.round((dest.count / totalDestBookings) * 100) : 0;
       return (
         <div key={i} className="flex items-center gap-3">
           <div className="size-10 rounded-lg bg-cover bg-center" data-alt={`${dest.name} Thumbnail`} data-location={dest.name.split(',')[0]} style={{ backgroundImage: `url('${dest.image}')` }}></div>
           <div className="flex-1">
             <h4 className="text-white text-sm font-medium">{dest.name}</h4>
             <div className="w-full bg-background-dark rounded-full h-1.5 mt-2">
               <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
             </div>
           </div>
           <span className="text-xs font-bold text-white">{percentage}%</span>
         </div>
       );
    })}
  </div>
)}
</div>
{/* Featured Tours */}
<div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-lg shadow-black/20">
<div className="flex justify-between items-center mb-4">
  <h3 className="text-white text-lg font-bold">Featured Tours</h3>
  <Link href="/admin/tours" className="text-primary text-xs font-medium hover:text-white transition-colors">Manage</Link>
</div>
{featuredTours.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">star</span>
    <p className="text-sm">No featured tours yet.</p>
    <Link href="/admin/tours" className="text-primary text-xs mt-2 hover:text-white transition-colors">Go to Tours to feature one</Link>
  </div>
) : (
  <div className="space-y-3">
    {featuredTours.slice(0, 4).map((tour) => (
      <Link key={tour.id} href={`/admin/tours`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-dark transition-colors group">
        <div className="size-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${tour.images?.[0] || 'https://via.placeholder.com/80'}')` }}></div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium truncate group-hover:text-primary transition-colors">{tour.title}</h4>
          <p className="text-xs text-slate-500">{tour.destination?.name}, {tour.destination?.country}</p>
        </div>
        <span className="material-symbols-outlined text-yellow-500 text-[16px] filled shrink-0">star</span>
      </Link>
    ))}
  </div>
)}
</div>
</div>
</div>
{/* Recent Bookings Table */}
<div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-lg shadow-black/20">
<div className="p-6 border-b border-border-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
<h3 className="text-white text-lg font-bold">Recent Bookings</h3>
<Link className="text-primary text-sm font-medium hover:text-white transition-colors" href="/admin/bookings">View All</Link>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-border-dark bg-background-dark/50 text-xs uppercase tracking-wider text-slate-400">
<th className="p-4 font-semibold">Customer</th>
<th className="p-4 font-semibold">Destination</th>
<th className="p-4 font-semibold">Date</th>
<th className="p-4 font-semibold">Amount</th>
<th className="p-4 font-semibold">Status</th>
<th className="p-4 font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="text-sm divide-y divide-border-dark">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                {loading ? 'Loading bookings...' : 'No recent bookings found.'}
              </td>
            </tr>
          ) : (
            bookings.slice(0, 5).map((booking, index) => {
              const customerName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Guest User';
              const avatar = booking.user?.avatarUrl || 'https://via.placeholder.com/32';
              const serviceName = booking.tourBooking?.tourPackage?.title || 
                                 booking.hotelBooking?.hotel?.name || 
                                 booking.carHireBooking?.car?.model || 
                                 booking.event?.title ||
                                 booking.serviceType.replace('_', ' ');
              const date = new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              const statusColors: Record<string, string> = {
                'CONFIRMED': 'bg-green-500/10 text-green-500 border-green-500/20',
                'COMPLETED': 'bg-green-500/10 text-green-500 border-green-500/20',
                'PENDING': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
              };

              return (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${avatar}')` }}></div>
                      <span className="font-medium text-white">{customerName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{serviceName}</td>
                  <td className="p-4 text-slate-400">{date}</td>
                  <td className="p-4 text-white font-medium">${Number(booking.totalAmount).toLocaleString()}</td>
                  <td className="p-4">
                  <div className="flex flex-col">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit ${statusColors[booking.status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                      {booking.status}
                    </span>
                    {booking.paymentStatus === 'FAILED' && booking.payments?.[0]?.failureReason && (
                      <span className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">error</span>
                        {booking.payments[0].failureReason}
                      </span>
                    )}
                  </div>
                </td>
                  <td className="p-4 text-right">
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(index)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-background-dark">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                      {openDropdownId === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface-dark border border-border-dark rounded-xl shadow-2xl z-50 py-1">
                          <Link href="/admin/bookings" className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">visibility</span> View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
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
