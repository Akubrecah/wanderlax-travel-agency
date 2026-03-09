"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  category: string;
  startDate: Date | string;
  destination: string;
  basePrice: number;
}

interface HomeClientProps {
  featuredEvents: Event[];
}

export default function HomeClient({ featuredEvents }: HomeClientProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const eventsCarouselRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Set slow cinematic playback once video is ready
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const setSpeed = () => { video.playbackRate = 0.6; };
    video.addEventListener('canplay', setSpeed);
    setSpeed();
    return () => video.removeEventListener('canplay', setSpeed);
  }, []);

  // Intersection Observer — trigger scroll-reveal animations
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const bookingTabs = [
    { icon: 'flight', label: 'Flights' },
    { icon: 'hotel', label: 'Hotels' },
    { icon: 'directions_car', label: 'Cars' },
    { icon: 'map', label: 'Tours' },
  ];

  type Destination = { name: string; country: string; price: string; tag: string; tagStyle: string; img: string; slug: string; };
  const destinations: Destination[] = [
    { 
      name: "Bora Bora", country: "French Polynesia", price: "$850", tag: "Luxury", tagStyle: "bg-blue-500", 
      img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop", 
      slug: "/destinations/bora-bora" 
    },
    { 
      name: "Amalfi Coast", country: "Italy", price: "$620", tag: "Romantic", tagStyle: "bg-red-500", 
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop", 
      slug: "/destinations/amalfi" 
    },
    { 
      name: "Kyoto", country: "Japan", price: "$450", tag: "Cultural", tagStyle: "bg-green-600", 
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop", 
      slug: "/destinations/kyoto" 
    },
    { 
      name: "Santorini", country: "Greece", price: "$720", tag: "Featured", tagStyle: "bg-primary", 
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2024&auto=format&fit=crop", 
      slug: "/destinations/santorini" 
    }
  ];

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = 360;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="relative w-full flex flex-col overflow-x-hidden">
      {/* Hero Section with Video Background */}
      <div className="relative pt-[72px]">
        <div style={{ position: 'relative', height: '90vh', minHeight: '600px', width: '100%', overflow: 'hidden' }}>

          {/* Video — full bleed, always visible */}
          <video
            ref={heroVideoRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/Kenya_Africa_Wildlife_Video_Prompt.mp4" type="video/mp4" />
          </video>

          {/* Dark gradient overlay so text is readable */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%)' }}></div>


          {/* Hero Content */}
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
              <span className="text-primary font-semibold tracking-[0.25em] uppercase text-xs sm:text-sm">
                🇰🇪 Discover the Heart of Africa
              </span>
              <h1 className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                Nairobi to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500">
                  Wild Savanna
                </span>
              </h1>
              <p className="text-slate-300 max-w-xl text-base sm:text-lg md:text-xl font-light leading-relaxed">
                From the vibrant streets of Nairobi to the untamed wilderness of the Maasai Mara — experience Kenya&apos;s breathtaking wildlife adventures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/tours"
                  style={{ backgroundColor: '#C61010', color: '#ffffff', fontWeight: 700 }}
                  className="flex items-center justify-center h-14 px-8 rounded-full text-base transition-all transform hover:scale-105 shadow-2xl hover:brightness-110"
                >
                  Start Your Journey
                </Link>
                <Link href="/about" className="flex items-center justify-center h-14 px-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-medium text-base transition-all">
                  <span className="material-symbols-outlined mr-2">explore</span>
                  Explore Kenya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Bar */}
      <div className="relative z-20 -mt-16 md:-mt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto reveal">
        <div className="bg-surface-dark/80 backdrop-blur-xl border border-border-dark rounded-2xl shadow-2xl p-2 md:p-4">
          <div className="flex overflow-x-auto pb-4 md:pb-0 border-b border-border-dark/50 md:border-b-0 gap-4 md:gap-8 px-4 mb-4 md:mb-0 no-scrollbar">
            {bookingTabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 pb-3 md:pb-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === idx ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined ${activeTab === idx ? 'filled' : ''}`}>{tab.icon}</span>
                <span className="font-bold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
            <div className="bg-background-dark/50 rounded-lg p-3 border border-border-dark hover:border-primary/50 transition-colors group">
              <label className="block text-xs text-text-muted font-medium mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-transparent border-none text-white font-semibold placeholder-slate-500 focus:outline-none focus:ring-0 text-sm"
              />
            </div>
            <div className="bg-background-dark/50 rounded-lg p-3 border border-border-dark hover:border-primary/50 transition-colors group">
              <label className="block text-xs text-text-muted font-medium mb-1">Check In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent border-none text-white font-semibold focus:outline-none focus:ring-0 text-sm [color-scheme:dark]"
              />
            </div>
            <div className="bg-background-dark/50 rounded-lg p-3 border border-border-dark hover:border-primary/50 transition-colors group">
              <label className="block text-xs text-text-muted font-medium mb-1">Travelers</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="size-7 rounded bg-border-dark text-white flex items-center justify-center hover:bg-primary transition-colors text-sm font-bold">−</button>
                <span className="text-white font-semibold text-sm">{travelers} {travelers === 1 ? 'Guest' : 'Guests'}</span>
                <button onClick={() => setTravelers(Math.min(20, travelers + 1))} className="size-7 rounded bg-border-dark text-white flex items-center justify-center hover:bg-primary transition-colors text-sm font-bold">+</button>
              </div>
            </div>
            <Link href={`/tours${destination ? `?destination=${encodeURIComponent(destination)}` : ''}`} className="bg-primary hover:bg-red-700 text-white font-bold rounded-lg min-h-[56px] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(198,16,16,0.3)]">
              Search Availability
            </Link>
          </div>
        </div>
      </div>

      {/* Special Events - DYNAMIC CRUD DATA */}
      {featuredEvents.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div className="reveal-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Exclusive Events</h2>
              <p className="text-text-muted">Curated events and experiences across Africa and the world</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(eventsCarouselRef, 'left')}
                className="size-10 rounded-full border border-border-dark bg-surface-dark hover:bg-border-dark text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                onClick={() => scrollCarousel(eventsCarouselRef, 'right')}
                className="size-10 rounded-full border border-border-dark bg-surface-dark hover:bg-border-dark text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          <div ref={eventsCarouselRef} className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth no-scrollbar">
            {featuredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="min-w-[300px] md:min-w-[400px] snap-center group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 border border-white/5">
                <img alt={event.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={event.images?.[0] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                    {event.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3 uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-light">{event.description}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-500 text-[18px]">location_on</span>
                      <span className="text-slate-300 text-xs">{event.destination}</span>
                    </div>
                    <span className="text-white font-bold text-lg">
                      From ${event.basePrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="reveal-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Destinations</h2>
            <p className="text-text-muted">Hand-picked locations for your next adventure</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel(carouselRef, 'left')}
              className="size-10 rounded-full border border-border-dark bg-surface-dark hover:bg-border-dark text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              onClick={() => scrollCarousel(carouselRef, 'right')}
              className="size-10 rounded-full border border-border-dark bg-surface-dark hover:bg-border-dark text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth no-scrollbar">
          {destinations.map((dest) => (
            <Link key={dest.name} href={dest.slug} className="min-w-[280px] md:min-w-[340px] snap-center group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer flex-shrink-0">
              <img alt={dest.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={dest.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <span className={`inline-block px-3 py-1 rounded-full ${dest.tagStyle} text-white text-xs font-bold mb-3`}>{dest.tag}</span>
                <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-slate-300 text-sm">{dest.country}</p>
                  <span className="text-white font-bold text-lg">{dest.price}<span className="text-xs font-normal text-slate-400">/night</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-surface-dark relative">
        <div className="absolute inset-0 bg-noise opacity-30"></div>
        <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 sticky top-24 reveal-left">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Our Services</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Everything you need for a perfect journey.</h3>
              <p className="text-text-muted mb-8 text-lg">From safari adventures in Kenya to international city tours — we handle every detail so you can focus on the experience.</p>
              <Link href="/tours" className="group flex items-center gap-2 text-white font-bold border-b border-primary pb-1 hover:text-primary transition-colors">
                View All Services
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: 'travel_explore', title: 'Tours & Safaris', desc: 'Exciting safari adventures, wildlife tours, cultural experiences, and holiday packages across Kenya and other African destinations.' },
                { icon: 'flight_takeoff', title: 'International Travel', desc: 'Travel packages for global destinations including city tours, holiday vacations, and guided travel experiences worldwide.' },
                { icon: 'hotel', title: 'Hotel Booking', desc: 'Assistance booking comfortable and affordable hotels, resorts, and holiday apartments in various destinations worldwide.' },
                { icon: 'confirmation_number', title: 'Flight Reservations', desc: 'Find and book convenient and cost-effective flight tickets for both domestic and international travel.' },
                { icon: 'local_taxi', title: 'Airport Transfers', desc: 'Reliable airport pick-up and drop-off services to ensure a smooth, stress-free travel experience from arrival to departure.' },
                { icon: 'directions_car', title: 'Car Hire', desc: 'Self-driven vehicles, chauffeur-driven cars, safari tour vehicles, and corporate transport — flexible options for every need.' },
              ].map((service, i) => (
                <div key={i} className={`group bg-background-dark border border-border-dark p-8 rounded-2xl hover:border-primary/50 transition-colors duration-300 reveal-scale delay-${(i % 3 + 1) * 100}`}>
                  <div className="size-14 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border-dark bg-background-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '40+', label: 'Destinations' },
              { val: '2k+', label: 'Happy Travelers' },
              { val: '6', label: 'Services Offered' },
              { val: '24/7', label: 'Support Available' }
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col gap-1 reveal delay-${(i + 1) * 100}`}>
                <span className="text-4xl md:text-5xl font-black text-white">{stat.val}</span>
                <span className="text-text-muted text-sm font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop')" }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/90 to-background-dark/60"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 reveal">
          <span className="material-symbols-outlined text-5xl text-primary animate-float">mail</span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Stay Connected with Twende Africa Tours</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Get exclusive travel deals, safari packages, and travel inspiration delivered straight to your inbox.</p>

          {newsletterSubmitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 max-w-lg mx-auto animate-fade-in-up">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
                <h3 className="text-lg font-bold text-white">Welcome to the Club!</h3>
              </div>
              <p className="text-slate-400 text-sm">You&apos;ll receive our next exclusive offer in your inbox.</p>
              <button onClick={() => setNewsletterSubmitted(false)} className="text-primary text-sm font-bold mt-3 hover:underline">Subscribe another email</button>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4" onSubmit={handleNewsletterSubmit}>
              <input
                className="flex-1 h-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none backdrop-blur-sm transition-all"
                placeholder="Enter your email address"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button className="h-12 px-8 rounded-lg bg-primary hover:bg-red-700 text-white font-bold whitespace-nowrap transition-colors shadow-lg" type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
