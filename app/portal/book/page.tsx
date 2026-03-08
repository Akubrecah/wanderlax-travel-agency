"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createTourBooking, createHotelBooking, createCarHireBooking, getBookingByRef, confirmBookingByRef } from '@/app/actions/bookingActions';
import { getHotelBySlug, getRoomById } from '@/app/actions/hotelActions';
import { getCarById } from '@/app/actions/carActions';
import { StripePaymentWrapper } from '@/components/portal/StripeCheckoutForm';

const tourData: Record<string, { price: string; duration: string; description: string; image: string }> = {
  'Maldives Escape': {
    price: '$5,400',
    duration: '7 Days',
    description: '7 nights in an overwater villa with all-inclusive dining and private sunset cruises.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUV2tyz6So6VwYE94GJFnhBGH8Dco3cLebnCAULJDZHqwUaLKIvIveE5DwU8t3QvmDynrG_oH8wB05jvBSSYmKWDU4ZVpmRanjb_8tZy8F9eF5tAr1F2TKEcj44BhRPocSSrw9Rc9e1rbRP4lLUSbOTf5FmQ0mrjFn3mzuperyO0o04qCNpg6x45XYXnCM-Hl2jeisCIPLdS1kudpqrnBlZAcLn8IQdcc2mjxxjTEfbGQoPF4q-JHwrfR63xUONYmT0Zvpkc1Xfw',
  },
  'Ancient Kyoto': {
    price: '$3,200',
    duration: '5 Days',
    description: 'Explore the historic temples, tea ceremonies, and bamboo forests of ancient Japan.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_hhE52OZGgrrDPr3sPjMHs5sxUWPsEuBUaMhEHMiiZrHL3nq36rEfumHZzVvZzBqAciFltS802kVcL7QdQDNS8t7vNhnEnSTdzabGKtWFWUToeZg24ztzWiOQKUK6hfEWB6d2sbdQZ0PXHxt7zMSRZQlnsy2dQctFb66cKArvDoD2RLLDJRCjkrzL1UVmpk8XjR6uqkcyJKi1UV3Fd7hhTy_TUaBc9G-bs18Zm1v2UMDkJF4GfvugGQ_CC3Rlf62I6LhYaIIiBw',
  },
  'Swiss Alpine Trek': {
    price: '$4,150',
    duration: '8 Days',
    description: 'Guided hiking tour through the breathtaking landscapes of Zermatt and Interlaken.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBptty087RFv8nBqSoHJWVVHJKHF0NQhttWLEr5LTl8VdnU-vEwKdo6zRlM1oo-fbV-pDHbI_U3KFls8oG29PTMJS3H3nK_aDTAnd7RP7G_lkQQSL__vy8fNPrfveL3dKGjAcW-WJsS7yetY07aE2VPi3vKv8zFaWdVa2POQJ-guOxwu_l6Uir5DPujTA8Jm2T2aMUJP1Vhs1hiDTugzYgn-ndBaqGVJ6xQSsIdaWJnM1dHHKvkvSWeHWc8C_GBQxPFxlfNk2eHNA',
  },
  'Santorini Sunset': {
    price: '$3,800',
    duration: '6 Days',
    description: 'Experience the magic of the Aegean Sea with wine tasting and private yacht tours.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvoQ7Zvip5jn5ZaFMHXoEM4xSKpCN2Ih2qoH0roUXhbzZs-7ZSqG8ZzL4Cz9kS-1-Y94c1ZUregXQuU632IIgKboaohmGPX5sLqEMrmlsRbPTWfhkyEXX03RQX4ubesRC1WGOHYMWXtk02bodDUkEgW3RZBf1fS2YIeKYmJNbDrmFbaFpCmOAXTzN0x70thPnuXAKVWvKaUbJOCQcLZ5P4BlzU-UJuyNV_kxRfFIVfdzBuseetH5kf6snTVp9pJjzvqwRukC7lmg',
  },
  'NYC Penthouse Week': {
    price: '$6,200',
    duration: '5 Days',
    description: 'Luxury stay in Manhattan with Broadway tickets and helicopter tour included.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIRXc2032U2hY-HLjoK1Ag0J7DSNRzbKAc2V_dKqy80CC3MwKwHe49ZZvhLMwn1IjGvh8jdeJSfm5cW1ryHRpDr3WfqvchFpTRPz_gUnOiBRUgYwRqOygImLBgjdM7a-03U9khRpKmfCgQLotc7v52Gnj2vi5gBlgMBlMk9rN0xb58wM8D6gCa_vjpRjJx0pkBz-5zCw4J8-9U26zjU267MLvmaCAR0zjTsrruI-UVxI8zHCaJxxdBBDUaxqlgfGYq51IYN4TGaA',
  },
  'Mystic Machu Picchu': {
    price: '$2,900',
    duration: '6 Days',
    description: 'A guided journey through the Sacred Valley to the lost city of the Incas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCAVUB0h5vQRfF5hJZn-4xznNzIOGFq0GqG3kc9GG30esdrWAKSL9UrJEn4F-UxeK1BfGOuteIHrBjyue5n18qFSsZDlwlcUcpCLuV1qgsvNPB12Uyl4c4T3ZsaBUZ2nZj3qwH2e9mpVKxHUcZQ9F3_RYwvyg_fP-tyhmqZ2la28ecc6g92erllKxG36UrBISc5HRp1-8ZeE9qBQ49IxXSv82Vwttnuz4Sb-1LzPePg3mwOIT4HghZ3FNWQXpsPcUtMqeSQk2isg',
  },
  'The Royal Serengeti Safari': {
    price: '$12,000',
    duration: '10 Days',
    description: 'Immerse yourself in the wild heart of Africa with private game drives and luxury tented camps.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAae9-jgMtfLY4pZTb4At9kVVP0UyuN4ztEK3DfJyYBEKE971nIMS6zfggnNE4222TwuLC9qq0YmB-tqps4gRz_4oHkWZu9FTcu9RMCYyonHusYO-t0KIyenuZ8ZhATYeUgTkbssukdVW9eAHzo_46bLV52y6MCPq0dWHG8YQ99Mu3q8btP2iMLF8PpevjJAP4ut8hFo5YouwpHeIpWZ_7NQ0NAOtm2TMlTWUGl25gZSucltOaB_RiK03g-jT6fU2EwpDsbOLiFhg',
  },
  'The Brando Reserve': {
    price: '$24,900',
    duration: '7 Days',
    description: 'Exclusive private island resort featuring luxury villas with plunge pools and pristine beaches.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHDZw2P1Bt42QqK3S_ze8EGY_eGv8ylghIyD24u4tctGSvrm3TkZi7DTdX8k96quBef24tZEXLSw2m20GtGFi5Ag8QdytJo0u1UHOT5luYFRwTasxvpdOnjnaw45l_DSdmb5buDAY19_syqliRIKNq1QVMzjDw5hXX9Xcwo0DCf9YRg3Yo9QTnIf02G1y16jN5feXinGeao4CjtRdK1ZMNSVasRdK-RLDUXDSKqA55KiebzwSE1zFM8ZyMClE3iGDMTdjHCEk_YA',
  },
  'Aman Kyoto Sanctuary': {
    price: '$18,500',
    duration: '5 Days',
    description: 'A serene luxury pavilion set within a secret garden in the heart of ancient Kyoto.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJfQGGrlZ1FJuDxdSJqjTokju1EWXWtHli-FGMs1L38ktE0sA8i3rqQEPVhmSe-y211S0WrLDDiuwMB7F3MY9gdlInRaVBnGNmEAZgjLndTuplAYLpIeqKeA8TYY9lIgqjAmR1gLbhcciBrBv9ZWwScwywuqYsqPTV2LpSWmUXGtEcTQ4QXtxhEkaFrqvmUVFA8Ix688GLdZ2WS1_aptrJDgnH9jLcqg_ffI1a97RHgKy-4Rk_F32GnS6tofOtGQIWJbqcg4XNXw',
  },
  'Singita Grumeti': {
    price: '$32,000',
    duration: '7 Days',
    description: 'Ultra-luxury lodge offering exclusive access to the Serengeti wildlife and unparalleled service.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-xCu15TkqE2gKjOy-5legZG_kg0k-seYoAyjTOJxAXXXWYZMHHxygiznrneGLQ9P_K3wpW-YOr8l_5HZ6etP9mDO8uJorzVhASmkxFlAz6BiwBiBwnfMlpp7mpgX1ego9SEcLS1AgD93gTapFSJO0WEXaFYyea1GikFOzLl2Obk4_kNbl15zalhbZuv6BwuOXoaTJZ092rPMCDBFvPOWta5RDPZ-cObH0RDMViIg9jPVa77kts7MyGQyI8FAZG8P-t8qxlHsePw',
  },
};

function BookingFormContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const tourName = searchParams.get('tour') || '';
  const hotelSlug = searchParams.get('hotel') || '';
  const roomId = searchParams.get('room') || '';
  const carId = searchParams.get('carId') || '';
  const bookingRef = searchParams.get('bookingRef') || '';
  
  const tour = tourData[tourName];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hotel, setHotel] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [room, setRoom] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [car, setCar] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [existingBooking, setExistingBooking] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  React.useEffect(() => {
    async function fetchData() {
      const paymentIntentStatus = searchParams.get('payment_intent_status');

      if (bookingRef) {
        setIsLoadingData(true);
        try {
          const res = await getBookingByRef(bookingRef);
          if (res.success) {
             setExistingBooking(res.booking);

             // Handle successful payment redirect
             if (paymentIntentStatus === 'success' && res.booking.paymentStatus !== 'PAID') {
               const confirmRes = await confirmBookingByRef(bookingRef);
               if (confirmRes.success) {
                  setSubmitted(true);
               } else {
                  setError("Payment succeeded, but we couldn't confirm the booking. Please contact support.");
               }
             } else if (paymentIntentStatus === 'success' && res.booking.paymentStatus === 'PAID') {
                 setSubmitted(true);
             }
          }
        } catch (err) {
          console.error("Error fetching existing booking:", err);
        } finally {
          setIsLoadingData(false);
        }
      } else {
        if (hotelSlug && roomId) {
          setIsLoadingData(true);
          try {
            const [hotelData, roomData] = await Promise.all([
              getHotelBySlug(hotelSlug),
              getRoomById(roomId)
            ]);
            setHotel(hotelData);
            setRoom(roomData);
          } catch (err) {
            console.error("Error fetching hotel data:", err);
          } finally {
            setIsLoadingData(false);
          }
        }
        if (carId) {
          setIsLoadingData(true);
          try {
            const carData = await getCarById(carId);
            setCar(carData);
          } catch (err) {
            console.error("Error fetching car data:", err);
          } finally {
            setIsLoadingData(false);
          }
        }
      }
    }
    fetchData();
  }, [hotelSlug, roomId, carId, bookingRef, searchParams]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-[72px]">
        <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (existingBooking) {
        result = await confirmBookingByRef(existingBooking.bookingRef);
        if (result.success) setSubmitted(true);
        else setError(result.error || "Something went wrong. Please try again.");
      } else if (carId && car) {
        result = await createCarHireBooking({
          carId,
          pickupLocation,
          dropoffLocation,
          pickupDateTime: startDate,
          returnDateTime: endDate,
          notes: specialRequirements,
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          avatarUrl: user.imageUrl,
        });
        if (result.success && result.booking?.bookingRef) {
          // Redirect to Stripe payment step
          window.location.href = `/portal/book?bookingRef=${result.booking.bookingRef}`;
          return;
        } else {
          setError(result.error || "Something went wrong. Please try again.");
        }
      } else if (hotelSlug && roomId && hotel && room) {
        result = await createHotelBooking({
          hotelSlug,
          roomId,
          startDate,
          endDate,
          guestCount: guests,
          totalAmount: Number(room.pricePerNight) * guests,
          specialRequirements,
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          avatarUrl: user.imageUrl,
        });
        if (result.success && result.booking?.bookingRef) {
          // Redirect to Stripe payment step
          window.location.href = `/portal/book?bookingRef=${result.booking.bookingRef}`;
          return;
        } else {
          setError(result.error || "Something went wrong. Please try again.");
        }
      } else {
        const tourSlug = tourName.toLowerCase().replace(/ /g, '-');
        result = await createTourBooking({
          tourSlug,
          tourName,
          startDate,
          endDate,
          guestCount: guests,
          totalAmount: parseFloat(tour?.price.replace(/[^0-9.]/g, '') || '0') * guests,
          specialRequirements,
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          avatarUrl: user.imageUrl,
        });
        if (result.success) setSubmitted(true);
        else setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-[72px]">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-lg text-center space-y-6 animate-fade-in-up">
            <div className="size-20 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Booking Request Submitted!</h2>
            <p className="text-slate-400 text-lg">
              Thank you, {user?.firstName || 'Traveler'}! Your booking request for <span className="text-white font-semibold">{existingBooking?.eventBooking?.event?.title || (car ? `${car.make} ${car.model}` : (hotel ? hotel.name : tourName))}</span> has been received. Our team will reach out within 24 hours to confirm your reservation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href={existingBooking?.serviceType === "EVENT" ? "/portal/tickets" : "/portal/dashboard"}
                className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-primary/20"
              >
                Go to {existingBooking?.serviceType === "EVENT" ? "Tickets" : "Dashboard"}
              </Link>
              <Link
                href={existingBooking?.serviceType === "EVENT" ? "/events" : (car ? "/car-hire" : (hotel ? "/hotels" : "/tours"))}
                className="bg-white/10 border border-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/20 transition-all"
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-[72px]">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>

      <main className="flex-1 px-4 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href={existingBooking ? (existingBooking.serviceType === "EVENT" ? "/events" : "/tours") : (car ? "/car-hire" : (hotel ? "/hotels" : "/tours"))} className="hover:text-white transition-colors">{existingBooking ? existingBooking.serviceType : (car ? "Car Hire" : (hotel ? "Hotels" : "Tours"))}</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white font-medium">{existingBooking?.eventBooking?.event?.title || (car ? `${car.make} ${car.model}` : (hotel ? hotel.name : (tourName || 'Checkout')))}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Booking Form */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Progress */}
              <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-primary font-bold text-sm uppercase tracking-tighter">Step 1 of 3</p>
                    <h1 className="text-2xl font-extrabold text-white">Book Your Experience</h1>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">33% complete</p>
                </div>
                <div className="relative h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "33%" }}></div>
                </div>
              </div>

              {/* Traveler Info */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h2 className="text-xl font-bold text-white">Traveler Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">First Name</label>
                    <input
                      className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white placeholder:text-slate-600 transition-all"
                      value={user?.firstName || ''}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Last Name</label>
                    <input
                      className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white placeholder:text-slate-600 transition-all"
                      value={user?.lastName || ''}
                      readOnly
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Email</label>
                    <input
                      className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white placeholder:text-slate-600 transition-all"
                      value={user?.emailAddresses[0]?.emailAddress || ''}
                      readOnly
                    />
                  </div>
                </div>
              </section>

              {/* Trip or Payment Details */}
              <section className="flex flex-col gap-6">
                {existingBooking ? (
                  <>
                    <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      <h2 className="text-xl font-bold text-white">Payment Details</h2>
                    </div>
                    {existingBooking.paymentStatus === "PAID" ? (
                      <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl flex items-center justify-center gap-4">
                        <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                        <div className="text-white">
                          <p className="font-bold text-lg">Booking Fully Paid</p>
                          <p className="text-sm text-slate-400">This booking has already been paid for securely.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-background-dark p-6 border border-slate-700 rounded-xl space-y-4">
                          <p className="text-slate-400">You are about to securely pay for and confirm your booking reservation.</p>
                          <div className="flex justify-between items-center text-lg font-bold border-t border-slate-700 pt-4 mt-6">
                            <span className="text-white">Total Amount</span>
                            <span className="text-green-500 font-extrabold text-2xl">${Number(existingBooking.finalAmount).toFixed(2)}</span>
                          </div>
                        </div>
                        <StripePaymentWrapper 
                          bookingRef={existingBooking.bookingRef}
                          amount={Number(existingBooking.finalAmount)}
                          serviceType={existingBooking.serviceType}
                          onSuccess={async () => {
                            await confirmBookingByRef(existingBooking.bookingRef);
                            setSubmitted(true);
                          }}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <>
                      <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                        <span className="material-symbols-outlined text-primary">{car ? 'directions_car' : 'calendar_month'}</span>
                        <h2 className="text-xl font-bold text-white">{car ? 'Rental Details' : 'Trip Details'}</h2>
                      </div>
                      {car && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Pickup Location</label>
                            <input
                              type="text"
                              required
                              value={pickupLocation}
                              onChange={(e) => setPickupLocation(e.target.value)}
                              placeholder="e.g. Airport Terminal 1"
                              className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white placeholder:text-slate-600 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Drop-off Location</label>
                            <input
                              type="text"
                              required
                              value={dropoffLocation}
                              onChange={(e) => setDropoffLocation(e.target.value)}
                              placeholder="e.g. City Center Office"
                              className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white placeholder:text-slate-600 transition-all"
                            />
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">{car ? 'Pickup Date' : 'Start Date'}</label>
                          <input
                            type={car ? 'datetime-local' : 'date'}
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white transition-all [color-scheme:dark]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">{car ? 'Return Date' : 'End Date'}</label>
                          <input
                            type={car ? 'datetime-local' : 'date'}
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white transition-all [color-scheme:dark]"
                          />
                        </div>
                        {!car && (
                          <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Number of Guests</label>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                className="size-10 rounded-lg bg-surface-dark border border-slate-700 text-white flex items-center justify-center hover:bg-primary hover:border-primary transition-colors font-bold"
                              >
                                −
                              </button>
                              <span className="text-white font-semibold text-lg w-16 text-center">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                              <button
                                type="button"
                                onClick={() => setGuests(Math.min(20, guests + 1))}
                                className="size-10 rounded-lg bg-surface-dark border border-slate-700 text-white flex items-center justify-center hover:bg-primary hover:border-primary transition-colors font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">{car ? 'Additional Notes' : 'Special Requirements'}</label>
                        <textarea
                          value={specialRequirements}
                          onChange={(e) => setSpecialRequirements(e.target.value)}
                          placeholder={car ? 'Any special requests, child seat, GPS, etc...' : 'Any dietary restrictions, accessibility needs, or special requests...'}
                          rows={4}
                          className="w-full bg-background-dark border border-slate-700 focus:border-primary focus:ring-primary rounded-lg py-3 px-4 text-white placeholder:text-slate-600 transition-all resize-none"
                        />
                      </div>
                    </>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm mt-6">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting || (!tour && !hotel && !car)}
                      className="w-full bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(195,9,9,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg mt-6"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <span className="material-symbols-outlined">bookmark_check</span>
                      )}
                      {isSubmitting ? 'Processing...' : 'Confirm Booking Request'}
                    </button>
                  </form>
                )}
              </section>
            </div>

          {/* Right Column: Tour Summary */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 flex flex-col gap-6">
                <div className="bg-background-dark border border-primary/20 rounded-2xl overflow-hidden shadow-xl">
                  {/* Summary Image */}
                  {(existingBooking || tour || hotel || car) && (
                    <div
                      className="h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${existingBooking?.eventBooking?.event?.imageUrl || (car ? (car.images?.[0] || 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80') : (hotel ? (room?.images[0] || hotel.images[0]) : tour?.image))}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6 relative">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {existingBooking?.eventBooking?.event?.title || (car ? `${car.make} ${car.model}` : (hotel ? `${hotel.name} - ${room?.name}` : (tourName || 'Custom Tour')))}
                    </h3>
                    {hotel && (
                      <>
                        <p className="text-slate-400 text-sm mb-6">{hotel.address}</p>
                        <div className="space-y-3 py-4 border-t border-b border-slate-800">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">payments</span> Price per night
                            </span>
                            <span className="text-white font-semibold">${room?.pricePerNight}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">group</span> Guests
                            </span>
                            <span className="text-white font-semibold">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                          </div>
                        </div>
                      </>
                    )}
                    {tour && !hotel && (
                      <>
                        <p className="text-slate-400 text-sm mb-6">{tour.description}</p>
                        <div className="space-y-3 py-4 border-t border-b border-slate-800">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">payments</span> Price per person
                            </span>
                            <span className="text-white font-semibold">{tour.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">schedule</span> Duration
                            </span>
                            <span className="text-white font-semibold">{tour.duration}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">group</span> Guests
                            </span>
                            <span className="text-white font-semibold">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                          </div>
                        </div>
                      </>
                    )}
                    {car && (
                      <>
                        <p className="text-slate-400 text-sm mb-6">{car.year} • {car.transmission} • {car.fuelType}</p>
                        <div className="space-y-3 py-4 border-t border-b border-slate-800">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">payments</span> Daily Rate
                            </span>
                            <span className="text-white font-semibold">${car.dailyRate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">category</span> Category
                            </span>
                            <span className="text-white font-semibold">{car.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">airline_seat_recline_extra</span> Capacity
                            </span>
                            <span className="text-white font-semibold">{car.capacity} Passengers</span>
                          </div>
                          {startDate && endDate && (
                            <div className="flex justify-between text-sm pt-2 border-t border-slate-800">
                              <span className="text-slate-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">calculate</span> Estimated Total
                              </span>
                              <span className="text-primary font-bold">
                                ${(Number(car.dailyRate) * Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {existingBooking && (
                      <>
                        <p className="text-slate-400 text-sm mb-6 uppercase tracking-wider font-bold text-primary">
                          {existingBooking.serviceType.replace('_', ' ')}
                        </p>
                        <div className="space-y-3 py-4 border-t border-b border-slate-800">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">confirmation_number</span> Booking Ref
                            </span>
                            <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">{existingBooking.bookingRef}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">info</span> Status
                            </span>
                            <span className="text-white font-semibold">{existingBooking.status}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-slate-800 pt-3 mt-1">
                            <span className="text-slate-400 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">payments</span> Payment Status
                            </span>
                            <span className={`${existingBooking.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'} font-bold`}>
                              {existingBooking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {!existingBooking && !tour && !hotel && !car && (
                      <p className="text-slate-400 text-sm mt-2">
                        No matching item found. Please <Link href="/hotels" className="text-primary hover:underline">browse hotels</Link>, <Link href="/tours" className="text-primary hover:underline">tours</Link>, or <Link href="/car-hire" className="text-primary hover:underline">car hire</Link> and select one to book.
                      </p>
                    )}
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
                  <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Need help booking?</p>
                    <p className="text-[11px] text-slate-400">Our concierge team is available 24/7</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen pt-[72px]">
        <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <BookingFormContent />
    </Suspense>
  );
}
