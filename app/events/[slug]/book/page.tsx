"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { createEventBooking } from '@/app/actions/eventBookingActions';
import { getEventBySlug } from '@/app/actions/eventActions';

export default function EventBookingPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { isLoaded, userId, isSignedIn } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [attendees, setAttendees] = useState([{ name: '', email: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(`/portal/login?redirect=/events/${params.slug}/book`);
    }
  }, [isLoaded, isSignedIn, router, params.slug]);

  useEffect(() => {
    const fetchEvent = async () => {
      const { success, event: fetchedEvent } = await getEventBySlug(params.slug);
      if (success && fetchedEvent) {
        setEvent(fetchedEvent);
      } else {
        setError('Failed to load event details.');
      }
      setLoading(false);
    };

    if (isSignedIn) {
      fetchEvent();
    }
  }, [params.slug, isSignedIn]);

  const handleTicketChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(10, ticketCount + delta)); // Max 10 tickets per transaction
    if (newCount > (event?.capacity - event?.soldTickets)) return; // Prevent overbooking UI
    
    setTicketCount(newCount);
    
    // Adjust attendees array
    if (newCount > attendees.length) {
      setAttendees([...attendees, ...Array(newCount - attendees.length).fill({ name: '', email: '' })]);
    } else if (newCount < attendees.length) {
      setAttendees(attendees.slice(0, newCount));
    }
  };

  const handleAttendeeChange = (index: number, field: 'name' | 'email', value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !event) return;
    
    // Validate attendees
    if (attendees.some(a => !a.name || !a.email)) {
      setError("Please fill out all attendee information.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const totalAmount = event.price * ticketCount;

    const result = await createEventBooking({
      userId,
      eventId: event.id,
      ticketCount,
      totalAmount,
      attendees,
    });

    if (result.success) {
      router.push('/portal/tickets?success=true');
    } else {
      setError('error' in result ? result.error : 'Failed to complete booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-24 pb-32">
        <div className="size-16 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-24 pb-32 text-center">
        <span className="material-symbols-outlined text-[64px] text-primary mb-4">error</span>
        <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">Go Back</button>
      </div>
    );
  }

  const startDate = new Date(event.startDate);

  return (
    <div className="min-h-screen bg-black pt-24 pb-32 px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column: Form */}
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Event
          </button>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">Secure Checkout</h1>
          <p className="text-slate-400 mb-10">Complete your reservation for an unforgettable experience.</p>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Ticket Selection */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Select Tickets</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white">General Admission</p>
                  <p className="text-slate-400 text-sm">${Number(event.price).toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-full p-1">
                  <button 
                    type="button" 
                    onClick={() => handleTicketChange(-1)} 
                    disabled={ticketCount <= 1}
                    className="size-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="text-2xl font-black text-white w-8 text-center">{ticketCount}</span>
                  <button 
                    type="button" 
                    onClick={() => handleTicketChange(1)} 
                    disabled={ticketCount >= (event.capacity - event.soldTickets) || ticketCount >= 10}
                    className="size-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Attendee Information</h3>
              
              <div className="space-y-8">
                {attendees.map((attendee, index) => (
                  <div key={index} className="space-y-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="material-symbols-outlined text-[16px]">person</span>
                       Attendee {index + 1}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={attendee.name}
                          onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={attendee.email}
                          onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-primary/20 border border-primary text-white p-4 rounded-xl flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">error</span>
                 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center h-16 rounded-2xl bg-white text-black hover:bg-slate-200 font-black text-lg transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="size-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  Complete Purchase • ${(event.price * ticketCount).toFixed(2)}
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">lock</span>
                </>
              )}
            </button>
            <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
               By proceeding, you agree to our Terms & Conditions for events.
            </p>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:sticky lg:top-32 h-fit">
           <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
             <div className="relative h-48 w-full">
                {event.images && event.images.length > 0 ? (
                  <Image src={event.images[0]} alt={event.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded text-xs font-bold text-white uppercase tracking-wider mb-2">
                    {event.category}
                  </span>
                  <h3 className="text-2xl font-black text-white leading-tight truncate">{event.title}</h3>
                </div>
             </div>
             
             <div className="p-8">
               <div className="space-y-4 mb-8">
                 <div className="flex items-start gap-3">
                   <div className="size-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                     <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                     <p className="text-white font-medium">{startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                     <p className="text-slate-300 text-sm">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="size-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                     <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Location</p>
                     <p className="text-white font-medium">{event.location}</p>
                   </div>
                 </div>
               </div>

               <div className="border-t border-white/10 pt-6 space-y-3">
                 <h4 className="text-lg font-bold text-white mb-4">Order Summary</h4>
                 <div className="flex justify-between text-slate-300">
                   <span>General Admission  x{ticketCount}</span>
                   <span>${(event.price * ticketCount).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-300">
                   <span>Taxes & Fees</span>
                   <span>Included</span>
                 </div>
                 <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-2">
                   <span className="text-xl font-bold text-white">Total</span>
                   <span className="text-3xl font-black text-primary">${(event.price * ticketCount).toFixed(2)}</span>
                 </div>
               </div>
               
               <div className="mt-8 bg-black/40 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
                  <span className="material-symbols-outlined text-yellow-500 shrink-0">info</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tickets are non-refundable. Please ensure all attendee details are correct. Digital tickets will be available in your Member Portal immediately after purchase.
                  </p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
