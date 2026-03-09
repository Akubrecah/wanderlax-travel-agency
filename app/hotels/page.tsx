"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getHotels, HotelFilters } from '@/app/actions/hotelActions';

// Type definitions based on Prisma schema expectation
type HotelWithRelations = {
  id: string;
  name: string;
  slug: string;
  description: string;
  starRating: string;
  address: string;
  amenities: string[];
  images: string[];
  destination: { name: string; country: string };
  rooms: { pricePerNight: number }[];
  reviews: { rating: number }[];
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [destination, setDestination] = useState('');
  const [starRatings, setStarRatings] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Recommended');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  
  // Date selection states
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-18');
  
  // Simulated price range
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });

  // destination is passed as a param so typing doesn't trigger re-fetches;
  // only the search button (or filter toggles) call this explicitly.
  const fetchHotels = useCallback(async (searchDestination: string = destination) => {
    setIsLoading(true);
    try {
      const filters: HotelFilters = {
        destination: searchDestination,
        starRatings: starRatings.length > 0 ? starRatings : undefined,
        amenities: amenities.length > 0 ? amenities : undefined,
        sortBy,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      };
      const data = await getHotels(filters);
      setHotels(data);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starRatings, amenities, sortBy, priceRange]);

  // Runs once on mount (initial load) and whenever filter toggles change.
  // destination is intentionally excluded — typing alone does not trigger a fetch.
  useEffect(() => {
    fetchHotels(destination);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchHotels]);

  // Handlers
  const handleStarToggle = (rating: number) => {
    setStarRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const handleAmenityToggle = (amenityLabel: string) => {
    setAmenities(prev =>
      prev.includes(amenityLabel) ? prev.filter(a => a !== amenityLabel) : [...prev, amenityLabel]
    );
  };


  const getLowestPrice = (hotel: HotelWithRelations) => {
    if (!hotel.rooms || hotel.rooms.length === 0) return 'N/A';
    const prices = hotel.rooms.map(r => Number(r.pricePerNight));
    return `$${Math.min(...prices)}`;
  };

  const getAverageRating = (hotel: HotelWithRelations) => {
      if (!hotel.reviews || hotel.reviews.length === 0) return 'New';
      const sum = hotel.reviews.reduce((acc, rev) => acc + rev.rating, 0);
      return (sum / hotel.reviews.length).toFixed(1);
  };
  
  const getReviewCount = (hotel: HotelWithRelations) => {
      return hotel.reviews?.length || 0;
  }

  const renderStars = (ratingStr: string) => {
    let count = 0;
    switch(ratingStr) {
        case 'FIVE_STAR': count = 5; break;
        case 'FOUR_STAR': count = 4; break;
        case 'THREE_STAR': count = 3; break;
        case 'TWO_STAR': count = 2; break;
        case 'ONE_STAR': count = 1; break;
    }
    
    return (
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-sm ${i < count ? 'filled' : 'text-hotel-text-muted'}`}>star</span>
          ))}
        </div>
    );
  };

  return (
    <div className="bg-hotel-bg text-white min-h-screen flex flex-col font-body pt-[73px]">
      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="hidden lg:flex flex-col w-80 border-r border-hotel-border bg-hotel-bg overflow-y-auto p-6 gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-lg font-bold">Filters</h1>
            <p className="text-hotel-text-muted text-sm">Refine your hotel search</p>
          </div>
          
          {/* Price Range */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Price Range</h3>
              <button 
                onClick={() => setPriceRange({ min: 0, max: 1500 })}
                className="text-xs text-primary hover:underline"
              >
                Reset
              </button>
            </div>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-hotel-text-muted uppercase font-bold">
                  <span>Min Price</span>
                  <span>${priceRange.min}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1500" 
                  step="50"
                  value={priceRange.min}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    setPriceRange(prev => ({ ...prev, min: Math.min(newMin, prev.max) }));
                  }}
                  className="w-full h-1.5 bg-hotel-surface rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-hotel-text-muted uppercase font-bold">
                  <span>Max Price</span>
                  <span>${priceRange.max}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1500" 
                  step="50"
                  value={priceRange.max}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    setPriceRange(prev => ({ ...prev, max: Math.max(newMax, prev.min) }));
                  }}
                  className="w-full h-1.5 bg-hotel-surface rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="flex justify-between text-xs text-hotel-text-muted font-mono mt-1">
                <span>$0</span>
                <span>$1500+</span>
              </div>
            </div>
          </div>
          
          <hr className="border-hotel-border"/>
          
          {/* Star Rating */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Star Rating</h3>
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <label key={star} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    checked={starRatings.includes(star)}
                    onChange={() => handleStarToggle(star)}
                    className="form-checkbox rounded border-hotel-border bg-hotel-surface text-primary focus:ring-primary/20" 
                    type="checkbox"
                  />
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                         <span key={i} className={`material-symbols-outlined text-sm ${i < star ? 'filled' : 'text-hotel-text-muted'}`}>star</span>
                    ))}
                  </div>
                  <span className="text-sm text-hotel-text-muted group-hover:text-white ml-auto">{star} Star</span>
                </label>
              ))}
            </div>
          </div>
          
          <hr className="border-hotel-border"/>
          
          {/* Amenities */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Amenities</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: 'wifi', label: 'Free Wifi' },
                { icon: 'pool', label: 'Pool' },
                { icon: 'spa', label: 'Spa & Wellness' },
                { icon: 'fitness_center', label: 'Gym' },
                { icon: 'restaurant', label: 'Restaurant' },
                { icon: 'local_bar', label: 'Bar' },
                { icon: 'local_parking', label: 'Parking' }
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    checked={amenities.includes(item.label)}
                    onChange={() => handleAmenityToggle(item.label)}
                    className="form-checkbox rounded border-hotel-border bg-hotel-surface text-primary focus:ring-primary/20" 
                    type="checkbox"
                  />
                  <span className="material-symbols-outlined text-hotel-text-muted group-hover:text-primary">{item.icon}</span>
                  <span className="text-sm text-hotel-text-muted group-hover:text-white transition-colors">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Listing Area */}
        <main className="flex-1 flex flex-col bg-hotel-bg relative">
          {/* Sticky Search Bar */}
          <div className="sticky top-0 z-40 bg-hotel-bg/95 backdrop-blur-sm border-b border-hotel-border px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4">
              {/* Destination */}
              <div className="flex flex-col flex-1 w-full">
                <label className="text-xs font-bold text-hotel-text-muted uppercase tracking-wider mb-1.5 ml-1">Destination</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-hotel-text-muted group-focus-within:text-primary transition-colors">location_on</span>
                  <input 
                    className="w-full bg-hotel-surface border border-hotel-border rounded-lg py-3 pl-10 pr-4 text-white placeholder-hotel-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                    placeholder="Where are you going?" 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
              {/* Dates */}
              <div className="flex flex-col flex-1 w-full">
                <label className="text-xs font-bold text-hotel-text-muted uppercase tracking-wider mb-1.5 ml-1">Dates</label>
                <div className="flex flex-col sm:flex-row gap-2 relative group">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-hotel-text-muted transition-colors z-10 text-sm">calendar_today</span>
                    <input 
                      className="w-full bg-hotel-surface border border-hotel-border rounded-lg py-3 pl-10 pr-4 text-white placeholder-hotel-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none [color-scheme:dark] text-sm" 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <div className="absolute -top-2 left-3 bg-[#111] px-1 text-[10px] text-hotel-text-muted uppercase font-bold tracking-tighter">Check-in</div>
                  </div>
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-hotel-text-muted transition-colors z-10 text-sm">calendar_month</span>
                    <input 
                      className="w-full bg-hotel-surface border border-hotel-border rounded-lg py-3 pl-10 pr-4 text-white placeholder-hotel-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none [color-scheme:dark] text-sm" 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <div className="absolute -top-2 left-3 bg-[#111] px-1 text-[10px] text-hotel-text-muted uppercase font-bold tracking-tighter">Check-out</div>
                  </div>
                </div>
              </div>
              {/* Guests */}
              <div className="flex flex-col flex-1 w-full">
                <label className="text-xs font-bold text-hotel-text-muted uppercase tracking-wider mb-1.5 ml-1">Guests</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-hotel-text-muted group-focus-within:text-primary transition-colors">group</span>
                  <input 
                    className="w-full bg-hotel-surface border border-hotel-border rounded-lg py-3 pl-10 pr-4 text-white placeholder-hotel-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                    placeholder="Guests" 
                    type="text" 
                    defaultValue="2 Adults, 1 Room"
                  />
                </div>
              </div>
              {/* Search Button */}
              <button 
                className="w-full lg:w-auto h-[46px] flex items-center justify-center bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-lg shadow-primary/20 font-bold"
                onClick={() => fetchHotels(destination)}
              >
                <span className="material-symbols-outlined mr-2">search</span>
                Search Hotels
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {/* Promoted Section - Can be made dynamic later */}
            <section className="mb-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Featured Luxury Stays</h2>
                  <p className="text-hotel-text-muted text-sm">Hand-picked premium hotels for your perfect vacation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Hero Cards Placeholder - Can populate from DB */}
                  <div className="group relative h-[400px] rounded-xl overflow-hidden">
                  <Link href="/hotels/the-royal-kyoto-resort" className="absolute inset-0">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3LboRjFRBURcDK81YS2v0nIq8kE4O6WyivnqM816-FjZ-s97NPdp8dah9YsazAcO07rSurdssBW7jYT2QlIQi6bwiQ-o7zsUxwW3X7nkYicZ7UBZ2xx2Tkklb62hCp1xzapDUFP9iB22Jkp4UpWUTwi38_zNpWBX0-zS1FX_EAWcnEqewSvnAmuGieRkgLu3IFAU4qHWcvlaniG3KsaGV0cZFiyqxHm7f785h3hu99hyIwUfNo02YzpR0wMxF9sF7lwNuEvHj9g')" }}></div>
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">Editor&apos;s Choice</div>
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-white">favorite</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                       <span className="material-symbols-outlined text-sm filled">star</span>
                       <span className="material-symbols-outlined text-sm filled">star</span>
                       <span className="material-symbols-outlined text-sm filled">star</span>
                       <span className="material-symbols-outlined text-sm filled">star</span>
                       <span className="material-symbols-outlined text-sm filled">star</span>
                       <span className="text-white text-xs ml-1 font-medium">5.0 (124 reviews)</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">The Royal Kyoto Resort</h3>
                    <p className="text-white/80 text-sm mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Higashiyama Ward, Kyoto
                    </p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-white/60">Price per night</span>
                        <span className="text-xl font-bold text-white">$850</span>
                      </div>
                      <Link href="/hotels/the-royal-kyoto-resort">
                        <button className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* List View & Map Layout */}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Hotel List */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-white">{hotels.length} Properties found</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-hotel-text-muted">Sort by:</span>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-hotel-surface text-white text-sm font-medium border border-hotel-border rounded focus:ring-primary focus:border-primary cursor-pointer px-2 py-1"
                    >
                      <option>Recommended</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Top Rated</option>
                    </select>
                  </div>
                </div>

                {/* Card Items */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                ) : hotels.length === 0 ? (
                     <div className="bg-hotel-surface border border-hotel-border rounded-xl p-10 text-center">
                        <span className="material-symbols-outlined text-4xl text-hotel-text-muted mb-3">search_off</span>
                        <h4 className="text-xl font-bold text-white mb-2">No hotels found</h4>
                        <p className="text-hotel-text-muted">Try adjusting your filters or destination.</p>
                     </div>
                ) : (
                    hotels.map((hotel) => (
                    <div key={hotel.id} className="bg-hotel-surface border border-hotel-border rounded-xl overflow-hidden flex flex-col sm:flex-row h-auto sm:h-56 group hover:border-primary/50 transition-colors relative">
                        <Link href={`/hotels/${hotel.slug}`} className="w-full sm:w-64 bg-cover bg-center shrink-0 relative h-48 sm:h-full block overflow-hidden">
                          <Image 
                            src={hotel.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                            alt={hotel.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <button className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-primary transition-colors z-10" onClick={(e) => { e.preventDefault(); /* wishlist logic */ }}>
                              <span className="material-symbols-outlined text-lg">favorite</span>
                          </button>
                        </Link>
                        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                            <div>
                                <Link href={`/hotels/${hotel.slug}`}>
                                  <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{hotel.name}</h4>
                                </Link>
                                <p className="text-sm text-hotel-text-muted flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-sm flex-shrink-0">location_on</span> 
                                <span className="line-clamp-1">{hotel.address}</span>
                                </p>
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0 ml-4">
                                {renderStars(hotel.starRating)}
                                <span className="text-xs text-hotel-text-muted mt-1">{getAverageRating(hotel)} ({getReviewCount(hotel)} reviews)</span>
                            </div>
                            </div>
                            <div className="flex gap-2 mt-4 flex-wrap max-h-16 overflow-hidden">
                            {hotel.amenities.slice(0, 4).map(amenity => (
                                <span key={amenity} className="px-2 py-1 bg-hotel-bg rounded text-xs text-hotel-text-muted border border-hotel-border whitespace-nowrap">{amenity}</span>
                            ))}
                            {hotel.amenities.length > 4 && (
                                <span className="px-2 py-1 bg-hotel-bg rounded text-xs text-hotel-text-muted border border-hotel-border">+{hotel.amenities.length - 4} more</span>
                            )}
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-auto pt-4 border-t border-hotel-border sm:border-t-0 sm:pt-0">
                            <div className={`text-xs text-green-400 font-medium flex items-center gap-1`}>
                                <span className="material-symbols-outlined text-sm">check_circle</span> Available
                            </div>
                            <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-white">{getLowestPrice(hotel)}</span>
                            <span className="text-xs text-hotel-text-muted">Avg/night</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))
                )}
              </div>

              {/* Map Placeholder */}
              <div className="w-full xl:w-[400px] shrink-0 hidden xl:block relative h-[calc(100vh-250px)] sticky top-24">
                <div className="w-full h-full rounded-xl overflow-hidden relative shadow-lg border border-hotel-border">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLjxD74aD-UYR1c_3fppC_-FyDCg_dRjNF8wwOcU1SJSuCgvkWfeKhBvp8uNl0z6YoJdTwESAz08FtNilT5pSC9Rs-sf-6vMRN2mXkVUb9mltqShF71VT8-N85BE6pO7_Gc6DfhUMuwKovxkoSZPHxa6V-5iP4aT8FOVtDF3kDWLhjgrI_Sp9DtLBlWU4sDAUXkjnsdJwUSC85Yv0dFAo_zmltiLauWcFE_h1r5i9gWzpl6pgTcy6N2kP_IQalgxzhZSrrf7NFRA')", opacity: 0.6 }}></div>
                  <div className="absolute inset-0 bg-[#242f3e]/80"></div>
                  
                  {/* Dynamic Map Pins could be added here based on hotels data */}
                  {hotels.slice(0, 5).map((hotel, idx) => (
                      <div key={idx} className="absolute group cursor-pointer" style={{ top: `${20 + (idx * 15)}%`, left: `${30 + (idx%3 * 20)}%`}}>    
                         <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-lg group-hover:scale-110 transition-transform">{getLowestPrice(hotel)}</div>
                         <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary mx-auto"></div>
                      </div>
                  ))}
                  
                  <div className="absolute bottom-4 left-4 bg-hotel-surface p-2 rounded-lg shadow-lg">
                    <button 
                      onClick={() => setIsMapModalOpen(true)}
                      className="bg-primary text-white text-sm font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-primary-dark transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">map</span> Show Map
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-12 py-10 border-t border-hotel-border text-center">
              <h3 className="text-xl font-bold text-white mb-2">Can&apos;t decide where to stay?</h3>
              <p className="text-hotel-text-muted mb-6">Let our premium concierge service help you find the perfect room.</p>
              <button className="bg-hotel-surface border border-hotel-border hover:border-primary text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Contact Concierge
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <header className="p-4 border-b border-white/10 flex justify-between items-center bg-[#141414]">
            <div>
              <h2 className="text-xl font-bold text-white">Interactive Map</h2>
              <p className="text-hotel-text-muted text-sm">{hotels.length} hotels found in this area</p>
            </div>
            <button 
              onClick={() => setIsMapModalOpen(false)}
              className="size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="material-symbols-outlined pb-1">close</span>
            </button>
          </header>
          
          <main className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
            {/* Full Screen Map Placeholder */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLjxD74aD-UYR1c_3fppC_-FyDCg_dRjNF8wwOcU1SJSuCgvkWfeKhBvp8uNl0z6YoJdTwESAz08FtNilT5pSC9Rs-sf-6vMRN2mXkVUb9mltqShF71VT8-N85BE6pO7_Gc6DfhUMuwKovxkoSZPHxa6V-5iP4aT8FOVtDF3kDWLhjgrI_Sp9DtLBlWU4sDAUXkjnsdJwUSC85Yv0dFAo_zmltiLauWcFE_h1r5i9gWzpl6pgTcy6N2kP_IQalgxzhZSrrf7NFRA')", opacity: 0.4 }}></div>
            
            {/* Map Interaction Layer */}
            <div className="absolute inset-0 z-10 p-10">
               {hotels.slice(0, 10).map((hotel, idx) => (
                   <div key={hotel.id} className="absolute group cursor-pointer" style={{ top: `${15 + (idx * 8)}%`, left: `${10 + (idx%5 * 18)}%`}}>    
                      <div className="bg-primary text-white text-sm font-bold px-3 py-1.5 rounded shadow-2xl group-hover:scale-110 transition-transform flex flex-col items-center">
                        <span className="text-[10px] opacity-70 uppercase tracking-tight font-black leading-none mb-1">{hotel.name}</span>
                        {getLowestPrice(hotel)}
                      </div>
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary mx-auto"></div>
                   </div>
               ))}
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-hotel-surface/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-hotel-text-muted font-bold uppercase">Grid View</span>
                <span className="text-white text-sm">{hotels.length} Properties</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <button 
                onClick={() => setIsMapModalOpen(false)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                Return to List
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
