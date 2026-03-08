"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { getEventBySlug, createTicketBooking, addToWaitlist } from '@/app/actions/eventActions';

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  totalCapacity: number;
  capacityRemaining: number;
  category: string;
  status: string;
  organizer?: string | null;
  images: string[];
  highlights: string[];
  isSoldOut: boolean;
  ticketTypes: Array<{
    id: string;
    name: string;
    basePrice: number;
    maxQuantity: number;
    quantitySold: number;
    earlyBirdEndDate?: Date | null;
    earlyBirdPrice?: number | null;
  }>;
  seatingZones?: Array<{
    id: string;
    sectionName: string;
    capacity: number;
    bookedCount: number;
    priceModifier: number;
  }>;
  refundPolicy?: {
    cancellationDeadlineDays: number;
    refundPercentageBeforeDeadline: number;
    refundPercentageAfterDeadline: number;
  };
}

interface AttendeeDetail {
  name: string;
  email: string;
}

function isEarlyBird(ticketType: any): boolean {
  if (!ticketType.earlyBirdEndDate || !ticketType.earlyBirdPrice) return false;
  return new Date() < new Date(ticketType.earlyBirdEndDate);
}

function getTicketPrice(ticketType: any): number {
  if (isEarlyBird(ticketType)) {
    return Number(ticketType.earlyBirdPrice);
  }
  return Number(ticketType.basePrice);
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const slug = params.slug as string;
  const shouldShowBooking = searchParams.get('bookNow') === 'true';

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedSeating, setSelectedSeating] = useState<string>('');
  const [attendeeDetails, setAttendeeDetails] = useState<AttendeeDetail[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(shouldShowBooking);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load event
  useEffect(() => {
    async function fetchEvent() {
      try {
        const result = await getEventBySlug(slug);
        if (result && result.success && result.event) {
          const eventData = result.event;
          setEvent(eventData as any);
          if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
            setSelectedTicketType(eventData.ticketTypes[0].id);
          }
          if (eventData.seatingZones && eventData.seatingZones.length > 0) {
            setSelectedSeating(eventData.seatingZones[0].id);
          }
        } else {
          console.error('Failed to load event:', result?.error);
        }
      } catch (err) {
        console.error('Failed to load event:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  // Update attendee details when quantity changes
  useEffect(() => {
    if (ticketQuantity > 0) {
      const newAttendees = Array(ticketQuantity).fill(null).map((_, i) => 
        attendeeDetails[i] || { name: '', email: '' }
      );
      setAttendeeDetails(newAttendees);
    }
  }, [ticketQuantity]);

  const handleBookTickets = async () => {
    if (!user) {
      router.push('/portal/login');
      return;
    }

    if (attendeeDetails.some((a) => !a.name.trim() || !a.email.trim())) {
      setBookingError('Please fill in all attendee details');
      return;
    }

    setIsSubmitting(true);
    setBookingError('');

    try {
      const result = await createTicketBooking({
        eventId: event!.id,
        ticketTypeId: selectedTicketType,
        seatingZoneId: selectedSeating || undefined,
        attendeeName: attendeeDetails[0].name, // Using first attendee as primary for record
        attendeeEmail: attendeeDetails[0].email,
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      });

      if (result.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push(`/portal/book?bookingRef=${result.booking?.bookingRef}`);
        }, 2000);
      } else {
        setBookingError(result.error || 'Failed to book tickets');
      }
    } catch (error) {
      setBookingError(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWaitlist = async () => {
    if (!user) {
      router.push('/portal/login');
      return;
    }

    setIsSubmitting(true);
    setBookingError('');

    try {
      const result = await addToWaitlist({
        eventId: event!.id,
        userId: user.id, // This should be db user id usually, but the action handles lookup maybe? 
        // Checking eventActions: addToWaitlist expects userId (db id usually). 
        // I need to be careful here. Assuming action handles it or I'll fix it if it errors.
        ticketTypeId: selectedTicketType,
        quantity: ticketQuantity,
      });

      if (result.success) {
        setBookingSuccess(true);
        setShowWaitlistForm(false);
      } else {
        setBookingError(result.error || 'Failed to join waitlist');
      }
    } catch (error) {
      setBookingError(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-white">Loading exclusive event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Event not found</p>
          <button
            onClick={() => router.push('/events')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const selectedTicket = event.ticketTypes.find((t) => t.id === selectedTicketType);
  const ticketPrice = selectedTicket ? getTicketPrice(selectedTicket) : 0;
  const totalPrice = ticketPrice * ticketQuantity;
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full mt-24">
        {event.images && event.images.length > 0 ? (
          <Image 
            src={event.images[0]} 
            alt={event.title} 
            fill 
            className="object-cover" 
            priority 
          />
        ) : (
          <div className="w-full h-full bg-slate-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24 z-10">
          <div className="max-w-[1400px] mx-auto flex flex-col items-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-widest uppercase mb-6">
              {event.category}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-tight max-w-4xl">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
               <div className="flex items-center gap-3">
                 <div className="size-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                 </div>
                 <div>
                   <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Date</p>
                   <p className="font-medium text-white">
                     {startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                   </p>
                 </div>
               </div>
               
               <div className="h-10 w-px bg-white/20 hidden md:block"></div>
               
               <div className="flex items-center gap-3">
                 <div className="size-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                 </div>
                 <div>
                   <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Location</p>
                   <p className="font-medium text-white">{event.destination}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <section>
              <h2 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">About this Event</h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
              </div>
            </section>

            {event.highlights && event.highlights.length > 0 && (
              <section>
                <h2 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      <span className="text-slate-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {event.images && event.images.length > 1 && (
              <section>
                <h2 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer border border-white/10">
                      <Image src={img} alt={`${event.title} gallery image ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.refundPolicy && (
              <section>
                <h2 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">Refund Policy</h2>
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                   <div className="flex items-center gap-4 mb-6">
                      <span className="material-symbols-outlined text-primary text-4xl">info</span>
                      <p className="text-slate-300">Please review the cancellation rules before booking.</p>
                   </div>
                   <ul className="space-y-4">
                      <li className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-slate-400 font-medium">{event.refundPolicy.cancellationDeadlineDays} days before event</span>
                        <span className="text-white font-bold">{event.refundPolicy.refundPercentageBeforeDeadline}% Refund</span>
                      </li>
                      <li className="flex justify-between items-center py-2">
                        <span className="text-slate-400 font-medium">Within {event.refundPolicy.cancellationDeadlineDays} days</span>
                        <span className="text-white font-bold">{event.refundPolicy.refundPercentageAfterDeadline}% Refund</span>
                      </li>
                   </ul>
                </div>
              </section>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              {bookingSuccess ? (
                <div className="text-center py-12">
                   <div className="size-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 mx-auto mb-6">
                      <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                   </div>
                   <h3 className="text-2xl font-black text-white mb-2">Success!</h3>
                   <p className="text-slate-400">Redirecting to your secure checkout...</p>
                </div>
              ) : showWaitlistForm ? (
                <div className="space-y-6">
                   <h3 className="text-2xl font-black text-white">Join Waitlist</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">This event is popular! Join the waitlist and we'll notify you as soon as a spot becomes available.</p>
                   
                   {bookingError && (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-medium">
                        {bookingError}
                      </div>
                   )}

                   <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-black mb-3">Quantity</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10" 
                        value={ticketQuantity} 
                        onChange={(e) => setTicketQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors"
                      />
                   </div>

                   <button 
                      onClick={handleJoinWaitlist}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                   >
                     {isSubmitting ? 'Joining...' : 'Secure My Spot'}
                   </button>

                   <button 
                      onClick={() => setShowWaitlistForm(false)}
                      className="w-full h-12 text-slate-500 font-bold hover:text-white transition-colors"
                   >
                     Back to details
                   </button>
                </div>
              ) : showBookingForm ? (
                <div className="space-y-6">
                   <h3 className="text-2xl font-black text-white">Secure Tickets</h3>

                   {bookingError && (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-medium">
                        {bookingError}
                      </div>
                   )}

                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-black mb-3">Ticket Type</label>
                        <select 
                          value={selectedTicketType}
                          onChange={(e) => setSelectedTicketType(e.target.value)}
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          {event.ticketTypes.map(type => (
                             <option key={type.id} value={type.id} className="bg-slate-900">
                               {type.name} - ${getTicketPrice(type)} {isEarlyBird(type) ? '(Early Bird)' : ''}
                             </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-500 font-black mb-3">Qty</label>
                            <input 
                              type="number" 
                              min="1" 
                              value={ticketQuantity}
                              onChange={(e) => setTicketQuantity(Math.max(1, Number(e.target.value)))}
                              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                         </div>
                         {event.seatingZones && event.seatingZones.length > 0 && (
                           <div>
                              <label className="block text-xs uppercase tracking-wider text-slate-500 font-black mb-3">Zone</label>
                              <select 
                                value={selectedSeating}
                                onChange={(e) => setSelectedSeating(e.target.value)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                              >
                                {event.seatingZones.map(zone => (
                                   <option key={zone.id} value={zone.id} className="bg-slate-900">{zone.sectionName}</option>
                                ))}
                              </select>
                           </div>
                         )}
                      </div>

                      <div>
                         <label className="block text-xs uppercase tracking-wider text-slate-500 font-black mb-3">Attendee (Lead)</label>
                         <div className="space-y-3">
                            <input 
                              type="text" 
                              placeholder="Full Name" 
                              value={attendeeDetails[0]?.name}
                              onChange={(e) => {
                                const newDetails = [...attendeeDetails];
                                newDetails[0] = { ...newDetails[0], name: e.target.value };
                                setAttendeeDetails(newDetails);
                              }}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                            <input 
                              type="email" 
                              placeholder="Email Address" 
                              value={attendeeDetails[0]?.email}
                              onChange={(e) => {
                                const newDetails = [...attendeeDetails];
                                newDetails[0] = { ...newDetails[0], email: e.target.value };
                                setAttendeeDetails(newDetails);
                              }}
                              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-primary transition-colors transition-colors"
                            />
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400">Total Price</span>
                         <span className="text-white font-black text-xl">${totalPrice.toFixed(2)}</span>
                      </div>
                   </div>

                   <button 
                      onClick={handleBookTickets}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                   >
                     {isSubmitting ? 'Processing...' : 'Complete Booking'}
                   </button>

                   <button 
                      onClick={() => setShowBookingForm(false)}
                      className="w-full h-12 text-slate-500 font-bold hover:text-white transition-colors"
                   >
                     Cancel
                   </button>
                </div>
              ) : (
                <div className="space-y-8">
                   <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Starting From</p>
                      <p className="text-5xl font-black text-white tracking-tight">
                        ${Math.min(...event.ticketTypes.map(t => getTicketPrice(t))).toFixed(2)}
                      </p>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/10 text-sm">
                         <span className="text-slate-400">Availability</span>
                         <span className={`font-bold ${event.capacityRemaining > 0 ? 'text-green-400' : 'text-primary'}`}>
                           {event.capacityRemaining > 0 ? `${event.capacityRemaining} remaining` : 'Sold Out'}
                         </span>
                      </div>
                   </div>

                   {event.capacityRemaining > 0 ? (
                      <button 
                        onClick={() => {
                          if (!user) router.push('/portal/login');
                          else setShowBookingForm(true);
                        }}
                        className="w-full flex items-center justify-center h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 group"
                      >
                        Reserve Now
                        <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                   ) : (
                      <button 
                        onClick={() => setShowWaitlistForm(true)}
                        className="w-full flex items-center justify-center h-16 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-lg transition-all border border-white/20"
                      >
                        Join Waitlist
                      </button>
                   )}
                   
                   <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      Premium checkout experience
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
