"use client";

import React, { useState, useMemo } from 'react';
import { BookingStatus } from '@prisma/client';
import { updateBookingStatus } from '@/app/actions/bookingActions';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { deleteBooking } from '@/app/actions/bookingActions';

interface AdminBookingsClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialBookings: any[];
}

export function AdminBookingsClient({ initialBookings }: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = filter === 'ALL' || booking.status === filter;
      const matchesSearch = 
        booking.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filter, searchTerm]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    setIsUpdating(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (result.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      const result = await deleteBooking(bookingId);
      if (result.success) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'COMPLETED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getServiceDetails = (booking: any) => {
    switch (booking.serviceType) {
      case "CAR_HIRE":
        return {
          icon: "directions_car",
          name: "Car Hire",
          dest: booking.carHireBooking?.pickupLocation || "Unknown",
          subDest: (booking.carHireBooking?.car?.make || "") + " " + (booking.carHireBooking?.car?.model || "")
        };
      case "HOTEL":
        return {
          icon: "hotel",
          name: "Hotel Stay",
          dest: booking.hotelBooking?.hotel?.name || "Unknown",
          subDest: booking.hotelBooking?.room?.name || "Standard Room"
        };
      case "TOUR_PACKAGE":
        return {
          icon: "map",
          name: "Tour Package",
          dest: booking.tourBooking?.tourPackage?.title || "Custom Tour",
          subDest: booking.tourBooking?.tourPackage?.destination?.name || ""
        };
      case "EVENT":
        return {
          icon: "event",
          name: "Event Ticket",
          dest: booking.event?.title || "Special Event",
          subDest: booking.event?.destination || "Event Location"
        };
      case "APPOINTMENT":
        return {
          icon: "schedule",
          name: "Service Appt",
          dest: booking.appointment?.topic || "Service Appointment",
          subDest: booking.appointment?.scheduledAt ? new Date(booking.appointment.scheduledAt).toLocaleTimeString() : "TBD"
        };
      default:
        return {
          icon: "help",
          name: booking.serviceType,
          dest: "General Booking",
          subDest: booking.bookingRef
        };
    }
  };

  const getBookingDate = (booking: any) => {
    const date = booking.carHireBooking?.pickupDate || 
                 booking.hotelBooking?.checkInDate || 
                 booking.tourBooking?.startDate || 
                 booking.event?.startDate || 
                 booking.appointment?.scheduledAt || 
                 booking.createdAt;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-background-dark">
      <AdminSidebar />
      
      <main className="flex-1">
        <AdminHeader title="Booking Management" />
        
        <div className="p-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input 
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-surface-dark border border-border-dark rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary transition-colors h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="bg-surface-dark border border-border-dark rounded-xl px-4 text-white focus:border-primary transition-colors h-12 md:w-48 appearance-none cursor-pointer"
              value={filter}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">All Statuses</option>
              {Object.values(BookingStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Bookings List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => {
              const details = getServiceDetails(booking);
              return (
                <div key={booking.id} className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Service Icon */}
                    <div className="size-14 rounded-xl bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-3xl">{details.icon}</span>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="flex flex-col justify-center">
                        <h3 className="text-white font-bold truncate">{booking.user?.firstName} {booking.user?.lastName}</h3>
                        <p className="text-slate-500 text-xs truncate">{booking.user?.email}</p>
                      </div>

                      <div className="flex flex-col justify-center">
                        <p className="text-white font-medium text-sm truncate">{details.name}</p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-tighter truncate font-bold">{details.dest}</p>
                      </div>

                      <div className="flex flex-col justify-center">
                        <p className="text-slate-300 text-sm">{getBookingDate(booking)}</p>
                        <p className="text-slate-500 text-[10px] uppercase">Start Date</p>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border w-fit ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                        <p className="text-slate-500 text-[10px] uppercase mt-1">Status</p>
                        
                        {/* Show failure reason if available */}
                        {booking.paymentStatus === 'FAILED' && booking.payments?.[0]?.failureReason && (
                          <div className="mt-2 p-1.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] text-red-400 max-w-[150px] leading-tight flex items-start gap-1">
                            <span className="material-symbols-outlined text-[12px] mt-0.5">error</span>
                            <span>{booking.payments[0].failureReason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:border-l md:border-border-dark md:pl-6">
                      <div className="flex flex-col md:items-end mr-4">
                        <p className="text-white font-bold">${booking.totalAmount}</p>
                        <p className="text-slate-500 text-[10px] uppercase">Amount</p>
                      </div>
                      
                      <div className="relative group/actions">
                        <select 
                          className={`bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-xs text-white focus:border-primary transition-all cursor-pointer appearance-none pr-8 ${isUpdating === booking.id ? 'opacity-50 pointer-events-none' : ''}`}
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                        >
                          {Object.values(BookingStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-500 pointer-events-none">expand_more</span>
                      </div>

                      <button 
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="size-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredBookings.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-border-dark rounded-3xl">
                <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">search_off</span>
                <p className="text-slate-500 font-medium">No bookings found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
