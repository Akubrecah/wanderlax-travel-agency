"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs';

const experiencesLinks = [
  { label: 'Destinations', href: '/tours', icon: 'explore', desc: 'World-class bespoke journeys' },
  { label: 'Exclusive Events', href: '/events', icon: 'local_activity', desc: 'Curated global experiences' },
  { label: 'Luxury Hotels', href: '/hotels', icon: 'hotel', desc: 'Handpicked five-star stays' },
  { label: 'Elite Fleet', href: '/car-hire', icon: 'directions_car', desc: 'Premium private transport' },
];

const companyLinks = [
  { label: 'Concierge', href: '/concierge' },
  { label: 'Weather', href: '/weather' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const adminLinks = [
  { label: 'Tours', href: '/admin/tours', icon: 'tour' },
  { label: 'Events', href: '/admin/events', icon: 'event' },
  { label: 'Fleet', href: '/admin/fleet', icon: 'directions_car' },
  { label: 'Bookings', href: '/admin/bookings', icon: 'confirmation_number' },
  { label: 'Reports', href: '/admin/reports', icon: 'bar_chart' },
  { label: 'CRM', href: '/admin/crm', icon: 'analytics' },
  { label: 'Messages', href: '/admin/messages', icon: 'forum' },
];

const consultantLinks = [
  { label: 'Appointments', href: '/portal/consultation', icon: 'calendar_today' },
  { label: 'Inquiries', href: '/admin/messages', icon: 'forum' },
];

const portalLinks = [
  { label: 'Itinerary', href: '/portal/itinerary', icon: 'event_available' },
  { label: 'Trip History', href: '/portal/history', icon: 'history_edu' },
  { label: 'Loyalty Rewards', href: '/portal/loyalty', icon: 'card_giftcard' },
  { label: 'My Wishlist', href: '/portal/wishlist', icon: 'favorite' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setDropdownOpen(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(null);
    }, 400);
  };
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;
  const isExperiencesActive = experiencesLinks.some(link => pathname === link.href);
  const isManagementActive = adminLinks.some(link => pathname === link.href);
  const isPortalActive = portalLinks.some(link => pathname === link.href);
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  const isConsultant = userRole === 'CONSULTANT';

  // Fetch user role when signed in
  useEffect(() => {
    let isMounted = true;
    const checkRole = async (retryCount = 0) => {
      if (!isSignedIn) {
        setUserRole(null);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased to 15 second timeout

      try {
        const res = await fetch('/api/auth/role', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        
        const data = await res.json();
        if (isMounted && data.role) {
          setUserRole(data.role);
        }
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        const isAbortError = error instanceof Error && error.name === 'AbortError';
        
        if (retryCount < 2) {
          console.warn(`Retrying /api/auth/role fetch (attempt ${retryCount + 1})...`);
          // Use a small backoff before retrying
          setTimeout(() => {
            if (isMounted) checkRole(retryCount + 1);
          }, 1000 * (retryCount + 1));
          return;
        }

        if (isAbortError) {
          console.error('Request to /api/auth/role timed out after multiple attempts');
        } else {
          console.error('NetworkError/FetchError in Header.tsx:', error);
        }
        if (isMounted) setUserRole(null);
      }
    };
    
    checkRole();
    
    return () => {
      isMounted = false;
    };
  }, [isSignedIn]);

  // Hide global header on admin pages (admin has its own sidebar) and checkout page
  if (pathname.startsWith('/admin') || pathname === '/portal/checkout') return null;

  const handleBookNow = () => {
    if (!isSignedIn) {
      router.push('/portal/login');
    } else {
      router.push('/tours');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all">
            <span className="material-symbols-outlined text-2xl font-light">diamond</span>
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-white text-xl font-bold tracking-tight leading-none">Twende Africa Tours</h2>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] leading-none mt-1">Explore Africa and the World</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-8 flex-1 justify-center px-4">
          {/* Experiences Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('experiences')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-all duration-300 py-2 ${
                isExperiencesActive || dropdownOpen === 'experiences'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Experiences
              <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${dropdownOpen === 'experiences' ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-transform duration-300 origin-left ${isExperiencesActive ? 'scale-x-100' : 'scale-x-0'}`}></span>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 transition-all duration-300 ${
              dropdownOpen === 'experiences' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}>
              <div className="rounded-2xl bg-black border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-br from-white/[0.03] to-transparent">
                <div className="space-y-1">
                  {experiencesLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item"
                    >
                      <div className="size-10 rounded-lg bg-surface-dark border border-white/5 flex items-center justify-center text-slate-400 group-hover/item:text-primary group-hover/item:border-primary/20 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover/item:text-primary transition-colors">{link.label}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{link.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Member Portal Dropdown */}
          <SignedIn>
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('portal')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-all duration-300 py-2 ${
                  isPortalActive || dropdownOpen === 'portal'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Member Portal
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${dropdownOpen === 'portal' ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-transform duration-300 origin-left ${isPortalActive ? 'scale-x-100' : 'scale-x-0'}`}></span>

              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 transition-all duration-300 ${
                dropdownOpen === 'portal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}>
                <div className="rounded-2xl bg-black border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-white/[0.03] to-transparent">
                  <div className="space-y-1">
                    {portalLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group/item"
                      >
                        <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive(link.href) ? 'text-primary' : 'text-slate-400 group-hover/item:text-primary'}`}>{link.icon}</span>
                        <span className={`text-sm font-bold transition-colors ${isActive(link.href) ? 'text-primary' : 'text-white group-hover/item:text-primary'}`}>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </SignedIn>

          {/* Admin/Management Dropdown */}
          {(isAdmin || isConsultant) && (
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('management')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-all duration-300 py-2 ${
                  isManagementActive || dropdownOpen === 'management'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Management
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${dropdownOpen === 'management' ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-transform duration-300 origin-left ${isManagementActive ? 'scale-x-100' : 'scale-x-0'}`}></span>

              <div className={`absolute top-full left-0 pt-2 w-64 transition-all duration-300 ${
                dropdownOpen === 'management' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}>
                <div className="rounded-2xl bg-black border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-white/[0.03] to-transparent">
                  <div className="space-y-1">
                    {(isAdmin ? adminLinks : consultantLinks).map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group/item"
                      >
                        <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive(link.href) ? 'text-primary' : 'text-slate-400 group-hover/item:text-primary'}`}>{link.icon}</span>
                        <span className={`text-sm font-bold transition-colors ${isActive(link.href) ? 'text-primary' : 'text-white group-hover/item:text-primary'}`}>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {companyLinks.map((link) => (
            <Link
              key={link.label}
              className={`text-sm font-medium tracking-wide transition-all duration-300 relative group overflow-hidden shrink-0 ${
                isActive(link.href)
                  ? 'text-primary font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              href={link.href}
            >
              {link.label}
              <span className={`absolute bottom-[-4px] left-0 w-full h-[2px] bg-primary transition-transform duration-300 origin-left ${isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
          ))}
          
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Auth Buttons */}
          <SignedOut>
            <Link
              href="/portal/login"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              Member Access
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  title="Admin Panel"
                  className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
                >
                  <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                </Link>
              )}
              <Link
                href="/portal/dashboard"
                title="User Dashboard"
                className="flex items-center justify-center size-10 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[22px]">dashboard</span>
              </Link>
            </div>
            <div className="h-8 w-px bg-white/10 mx-1 hidden md:block"></div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 border border-white/10 ring-2 ring-white/5 transition-transform hover:scale-105',
                },
              }}
            />
          </SignedIn>

            <button
              onClick={() => router.push('/portal/consultation')}
              className="hidden xl:flex items-center justify-center rounded-lg h-10 px-5 bg-transparent hover:bg-white/5 text-white text-sm font-bold border border-white/20 transition-all hover:border-white/40"
            >
              Consultation
            </button>
            <button
              onClick={handleBookNow}
              className="hidden sm:flex items-center justify-center rounded-xl h-10 px-6 bg-primary hover:bg-red-700 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              Reserve
            </button>
          
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined leading-none">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col pt-32 px-8 overflow-y-auto animate-fade-in-up scrollbar-hide">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 size-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="space-y-8 pb-12">
            <div>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-6 opacity-80">Experiences</p>
              <div className="grid gap-4">
                {experiencesLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-4 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`size-12 rounded-xl border flex items-center justify-center transition-all ${
                      isActive(link.href) 
                        ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined">{link.icon}</span>
                    </div>
                    <span className={`text-xl font-bold transition-colors ${
                      isActive(link.href) ? 'text-primary' : 'text-white group-hover:text-primary'
                    }`}>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-6 opacity-80">Company</p>
              <div className="flex flex-col gap-6">
                {companyLinks.map((link) => (
                  <Link
                    key={link.label}
                    className={`text-2xl font-black transition-colors ${
                      isActive(link.href) ? 'text-primary' : 'text-white hover:text-primary'
                    }`}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <SignedIn>
                <div className="grid gap-6">
                  {(isAdmin || isConsultant) && (
                    <div className="space-y-6">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] opacity-80">Management</p>
                      {(isAdmin ? adminLinks : consultantLinks).map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className={`flex items-center gap-4 text-2xl font-black transition-colors ${
                            isActive(link.href) ? 'text-primary' : 'text-white hover:text-primary'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className={`material-symbols-outlined text-[32px] ${isActive(link.href) ? 'text-primary' : ''}`}>{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] opacity-80">Account</p>
                    <Link
                      href="/portal/dashboard"
                      className={`flex items-center gap-4 text-2xl font-black transition-colors ${
                        isActive('/portal/dashboard') ? 'text-primary' : 'text-slate-400 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`material-symbols-outlined text-[32px] ${isActive('/portal/dashboard') ? 'text-primary' : ''}`}>dashboard</span>
                      Dashboard
                    </Link>

                    <Link
                      href="/portal/itinerary"
                      className={`flex items-center gap-4 text-2xl font-black transition-colors ${
                        isActive('/portal/itinerary') ? 'text-primary' : 'text-slate-400 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`material-symbols-outlined text-[32px] ${isActive('/portal/itinerary') ? 'text-primary' : ''}`}>event_available</span>
                      Itinerary
                    </Link>

                    <Link
                      href="/portal/history"
                      className={`flex items-center gap-4 text-2xl font-black transition-colors ${
                        isActive('/portal/history') ? 'text-primary' : 'text-slate-400 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`material-symbols-outlined text-[32px] ${isActive('/portal/history') ? 'text-primary' : ''}`}>history_edu</span>
                      Trip History
                    </Link>
                    <Link
                      href="/portal/loyalty"
                      className={`flex items-center gap-4 text-2xl font-black transition-colors ${
                        isActive('/portal/loyalty') ? 'text-primary' : 'text-slate-400 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`material-symbols-outlined text-[32px] ${isActive('/portal/loyalty') ? 'text-primary' : ''}`}>card_giftcard</span>
                      Loyalty
                    </Link>
                    <Link
                      href="/portal/wishlist"
                      className={`flex items-center gap-4 text-2xl font-black transition-colors ${
                        isActive('/portal/wishlist') ? 'text-primary' : 'text-slate-400 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`material-symbols-outlined text-[32px] ${isActive('/portal/wishlist') ? 'text-primary' : ''}`}>favorite</span>
                      Wishlist
                    </Link>
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  href="/portal/login"
                  className="flex items-center gap-4 text-2xl font-black text-white hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-[32px]">login</span>
                  Login
                </Link>
              </SignedOut>
            </div>

            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/portal/consultation'); }}
              className="w-full flex items-center justify-center rounded-2xl h-14 bg-transparent border border-white/20 text-white text-lg font-bold transition-all hover:bg-white/5 mt-6"
            >
              Book Consultation
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); handleBookNow(); }}
              className="w-full flex items-center justify-center rounded-2xl h-16 bg-primary hover:bg-red-700 text-white text-lg font-black transition-all shadow-xl shadow-primary/30 mt-4"
            >
              Reserve Experience
            </button>
          </div>
        </div>
      )}
    </>
  );
}
