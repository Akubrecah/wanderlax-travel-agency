"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';

export default function AmalfiPrintableItineraryPage() {
    
    useEffect(() => {
        // Optional: Trigger print automatically after load if desired,
        // but for now relying on the floating action button.
    }, []);

    return (
        <div className="bg-[#ffffff] text-slate-900 font-display min-h-screen printable-pdf-page pb-12">
             <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;700;900&display=swap');
                
                .printable-pdf-page {
                    font-family: 'Public Sans', sans-serif !important;
                }
                
                @media print {
                    @page { margin: 0; size: auto; }
                    body, html { margin: 0; padding: 0; background-color: white !important; }
                    .no-print { display: none !important; }
                    .print-break { page-break-before: always; }
                    .print-break-avoid { page-break-inside: avoid; }
                    /* Tailwind color mapping fixes for print */
                    .bg-primary { background-color: #c51110 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .text-primary { color: #c51110 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .border-primary { border-color: #c51110 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
            
            <div className="max-w-[1000px] mx-auto bg-white min-h-screen shadow-2xl md:my-10 my-0 overflow-hidden relative border-t-8 border-[#c51110]">
                
                {/* Header Section */}
                <header className="pt-12 px-8 md:px-16 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[#c51110] font-black text-4xl tracking-tighter uppercase">Twende Africa Tours</span>
                        <span className="text-slate-500 text-sm tracking-[0.2em] uppercase font-medium">Luxury Travel Reimagined</span>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none">The Eternal <br/><span className="text-[#c51110]">Amalfi Coast</span></h1>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="px-8 md:px-16 mt-10">
                    <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-slate-200 shadow-lg" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5zq7PHMMOISVAeAOxxUZ0zjJDPOL6Cr0DVkGzVONkdXR_h9uQpXTf1gaEALWKPCoHDMr54x6PZ449NBTD6b6NUDMvNRNOegikYbcAJqC5veJwsFu1CJbCY9sLIJ5TGX6jCvW4ads7xgEvaznDDgkbV_mILcrzorYknH_yMkp7gi6P6QxkHWOccfcRdOQzPmHI2jfcmCGSda4dj0ded-zIZxVomCTUikbzUk5gH5PdNQp7an1cDR4uq2yh4oVGpVqizZo3OHRFWA')"}}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8">
                            <div className="flex items-center gap-2 text-white/90 mb-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Southern Italy</span>
                            </div>
                            <p className="text-white text-2xl font-bold">An 8-Day Curated Experience</p>
                        </div>
                    </div>
                </div>

                {/* Trip at a Glance */}
                <div className="px-8 md:px-16 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-xl divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        <div className="p-8 flex flex-col gap-1 items-center md:items-start">
                            <span className="text-[#c51110] text-xs font-bold uppercase tracking-widest">Duration</span>
                            <span className="text-2xl font-black text-slate-900">8 Days / 7 Nights</span>
                        </div>
                        <div className="p-8 flex flex-col gap-1 items-center md:items-start">
                            <span className="text-[#c51110] text-xs font-bold uppercase tracking-widest">Group Size</span>
                            <span className="text-2xl font-black text-slate-900">Max 12 Guests</span>
                        </div>
                        <div className="p-8 flex flex-col gap-1 items-center md:items-start">
                            <span className="text-[#c51110] text-xs font-bold uppercase tracking-widest">Available Dates</span>
                            <span className="text-2xl font-black text-slate-900">Sept 12 - 19, 2024</span>
                        </div>
                    </div>
                </div>

                {/* Itinerary Content */}
                <div className="px-8 md:px-16 mt-16">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-[2px] bg-[#c51110] flex-1"></div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Daily Itinerary</h2>
                        <div className="h-[2px] bg-slate-200 flex-[4]"></div>
                    </div>
                    
                    <div className="space-y-12">
                        {/* Day 01 */}
                        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 print-break-avoid">
                            <div className="flex flex-col">
                                <span className="text-[#c51110] font-black text-2xl leading-none">DAY 01</span>
                                <span className="text-slate-400 text-xs font-bold uppercase mt-1">Arrival</span>
                            </div>
                            <div className="border-l-2 border-slate-100 pl-8 pb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Private Arrival & Naples Sojourn</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">Welcome to Italy. Your private chauffeur awaits at Naples Capodichino Airport for a transfer to the historic Hotel Excelsior. Enjoy a welcome aperitivo on the terrace overlooking Vesuvius before our group orientation dinner at a Michelin-starred local trattoria.</p>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-sm text-[#c51110]">restaurant</span> Dinner Included
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-sm text-[#c51110]">bed</span> Hotel Excelsior
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Day 02 */}
                        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 print-break-avoid">
                            <div className="flex flex-col">
                                <span className="text-[#c51110] font-black text-2xl leading-none">DAY 02</span>
                                <span className="text-slate-400 text-xs font-bold uppercase mt-1">The Sea</span>
                            </div>
                            <div className="border-l-2 border-slate-100 pl-8 pb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Private Riva Charter to Capri</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">Board a private wooden Riva boat for a full-day exploration of the coastline. Navigate through the Faraglioni rocks, visit the Blue Grotto during low tide, and enjoy a swim in the turquoise waters of the Emerald Grotto. Lunch is served seaside at a private beach club in Nerano.</p>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-sm text-[#c51110]">restaurant</span> Breakfast & Lunch
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Day 03 */}
                        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 print-break-avoid">
                            <div className="flex flex-col">
                                <span className="text-[#c51110] font-black text-2xl leading-none">DAY 03</span>
                                <span className="text-slate-400 text-xs font-bold uppercase mt-1">Flavors</span>
                            </div>
                            <div className="border-l-2 border-slate-100 pl-8 pb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">The Lemon Groves of Sorrento</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">Walk through historic lemon pergolas for a hands-on culinary masterclass. Learn the art of authentic Gnocchi alla Sorrentina and artisanal Limoncello production. Afternoon at leisure to explore the boutiques of Positano.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inclusions & Details Section */}
                <div className="px-8 md:px-16 mt-16 pt-16 border-t border-slate-100 pb-20 print-break">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column: Inclusions */}
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-[#c51110] mb-6">What&apos;s Included</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#c51110] text-xl">check_circle</span>
                                    <span className="text-slate-700 text-sm">7 nights in 5-star boutique accommodations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#c51110] text-xl">check_circle</span>
                                    <span className="text-slate-700 text-sm">Private airport transfers and ground transport</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#c51110] text-xl">check_circle</span>
                                    <span className="text-slate-700 text-sm">Daily gourmet breakfast & selected fine dining experiences</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#c51110] text-xl">check_circle</span>
                                    <span className="text-slate-700 text-sm">Full-time Twende Africa Tours concierge & expert local guides</span>
                                </li>
                            </ul>

                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 mt-10">Exclusions</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-slate-300 text-xl">cancel</span>
                                    <span className="text-slate-500 text-sm">International airfare to/from Naples</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-slate-300 text-xl">cancel</span>
                                    <span className="text-slate-500 text-sm">Personal travel insurance (mandatory)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Right Column: Important Info */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined">info</span> Important Information
                            </h4>
                            <div className="space-y-6">
                                <div>
                                    <span className="block text-xs font-bold text-[#c51110] uppercase mb-1">Visas & Documents</span>
                                    <p className="text-slate-600 text-xs leading-relaxed">EU/US/UK citizens do not require a visa for stays under 90 days. Ensure your passport has 6 months validity from departure date.</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-[#c51110] uppercase mb-1">Packing Essentials</span>
                                    <p className="text-slate-600 text-xs leading-relaxed">Smart casual attire for evenings, comfortable walking shoes for cobblestone streets, and swimwear for boat excursions.</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-[#c51110] uppercase mb-1">Activity Level</span>
                                    <p className="text-slate-600 text-xs leading-relaxed">Moderate. Includes significant walking on uneven terrain and staircases common in coastal villages.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-slate-900 text-white p-12 mt-12 block" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', backgroundColor: '#0f172a' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col gap-1 items-center md:items-start text-white">
                            <span className="text-2xl font-black uppercase tracking-tighter">Twende Africa Tours</span>
                            <span className="text-slate-400 text-[10px] uppercase tracking-widest">Global Luxury Concierge</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8 text-center md:text-left text-white">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#c51110] uppercase tracking-widest mb-2">Connect</span>
                                <span className="text-sm text-slate-300">info@twendeafricatours.com</span>
                                <span className="text-sm text-slate-300">+1 (888) LUX-TRIP</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#c51110] uppercase tracking-widest mb-2">Visit</span>
                                <span className="text-sm text-slate-300 w-48 leading-tight">721 Fifth Avenue, New York, NY 10022</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Digital Viewing</span>
                            <div className="bg-white p-2 rounded-lg">
                                <Image alt="QR Code for digital itinerary" className="w-12 h-12" width={48} height={48} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgUT1ZXQ1WPSGzTbSoXKRaePxboXYzi05Q1T1zTO164yDrCKttba3VnvWYtHtvORq4q_YETTnIfJgk5GzsgLPh3UTapXn2goVTFNujWm1UKi5vVfHe_EHVDdy7nu4-6gAHlogkdv_R37jVroQP9kCphA6KRPGQ_XEctCtOlW6dkhUm7ConGYVZcQFRcE9mG9GSGjEgdqzIGZBg40OtGA-TOOLge7fR_OqFti6QDJPSb1h7NApWYHzsO6KBbw-kkMY8oma4P1k96w" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">© {new Date().getFullYear()} Twende Africa Tours. All rights reserved.</p>
                    </div>
                </footer>

                {/* Print Action Floating Button */}
                <button 
                    className="no-print fixed bottom-8 right-8 bg-[#c51110] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center cursor-pointer border-none z-50" 
                    onClick={() => window.print()}
                    title="Print Document"
                >
                    <span className="material-symbols-outlined">print</span>
                </button>
            </div>
        </div>
    );
}
