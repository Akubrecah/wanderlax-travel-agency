"use client";

import React from 'react';

export default function WeatherAndSeasonalTipsPage() {
    return (
        <div className="bg-[#0a0a0a] text-slate-100 font-sans selection:bg-primary/30 min-h-screen pt-24 pb-12">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                
                .noise-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    opacity: 0.035;
                    z-index: 50;
                    background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGECgG7M3MGBTtCejKoeqNwJKmvd04CwKk9b7l-x9LIn-j5q5uBfVODgCIJQQP20RXkFrGcN3z0xHxjIMLkBy-w1gZN8vQweXNAwroX-xZk0CsBhmrHglLXhvUspxXW1ybzXEpFM-PkgThsDyDjtUTkjCfvy5zlJ6oDDn4ED9l6dpGMGpSRJJUsG9EJJRSapQONOTbGvhH1RpQuysqVzYeBKoE0yR1u5D7pFZYm-QQku5_S_3mj-48HE4jI0HE00Sfcu9NECr90Q');
                }
                .grainy-gradient {
                    background: linear-gradient(to bottom, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.9) 80%, rgba(10, 10, 10, 1) 100%);
                }
                .border-crimson-subtle {
                    border-color: rgba(197, 17, 16, 0.2);
                }
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
            `}</style>

            <div className="noise-overlay"></div>
            
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <header className="relative h-[45vh] w-full overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-cover bg-center" 
                            aria-hidden="true"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5-n3ZFEu9cTurbNv4I5jyNU-hLBN3_pnnUDj5HPb6jEpqlpOzXErvqjNRNLh-FjTv9UC_JQU-C7mN8_TiuerZ5DpNjS5_Sk0es2Z2512w7yQ-KypYrixpIZKtifpixjibebOeoMN_RLTI514GJ-deXVReOeHw_b02Ix9sOL6V1Hppt0j4lW7SeTB9A54FLK_R5ph1l8L8S9E3JzW3EhyYvsBwPtTceV44Kd1xu98FhEn7d0bYKff5YCJJWRgPKujRb3C0XEfswQ')" }}
                        >
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="absolute inset-0 grainy-gradient"></div>
                        </div>
                        <div className="relative z-10 px-6 md:px-20 py-8 flex justify-between items-start h-full flex-col">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#c51110] p-1.5 rounded-sm">
                                    <span className="material-symbols-outlined text-white text-xl">diamond</span>
                                </div>
                                <span className="text-white tracking-[0.3em] uppercase text-xs font-bold">Twende Africa Tours</span>
                            </div>
                            <div className="mb-12">
                                <div className="h-1 w-12 bg-[#c51110] mb-6"></div>
                                <h1 className="font-serif text-5xl md:text-7xl text-white italic leading-tight">
                                    Weather &amp; <br /><span className="not-italic">Seasonal Tips</span>
                                </h1>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-6 md:px-20 py-16 max-w-7xl mx-auto w-full">
                        <section className="mb-20">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div className="md:col-span-4">
                                    <h2 className="text-[#c51110] text-sm font-bold uppercase tracking-widest mb-4">When to Visit</h2>
                                    <p className="font-serif text-3xl text-white leading-snug">The shifting moods of the Mediterranean.</p>
                                </div>
                                <div className="md:col-span-8 flex flex-col gap-8 text-slate-300 font-light leading-relaxed text-lg">
                                    <p>
                                        Selecting the perfect moment for your Amalfi Coast escape is a matter of personal resonance. The coastline transforms with the calendar, offering distinct atmospheres that cater to different desires, from the vibrant social pulse of peak summer to the contemplative stillness of the shoulder months.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                                        <div>
                                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-tighter">Spring (Apr - May)</h4>
                                            <p className="text-sm">Fragrant lemon blossoms, mild temperatures, and fewer crowds. The landscape is at its most lush.</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-tighter">Summer (Jun - Aug)</h4>
                                            <p className="text-sm">Golden sunlight, azure waters, and an electric atmosphere. Ideal for beach clubs and late-night dining.</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-tighter">Autumn (Sep - Oct)</h4>
                                            <p className="text-sm">The &apos;Golden Hour&apos; of the year. Warm sea temperatures, harvest festivals, and a relaxed luxury pace.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-24">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-crimson-subtle pb-4">
                                <h2 className="text-white text-3xl font-serif">Monthly Climate Chart</h2>
                                <span className="text-[#c51110] text-xs uppercase tracking-[0.2em] font-bold pb-1">Regional Statistics</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                                            <th className="py-4 font-medium">Month</th>
                                            <th className="py-4 font-medium">Avg High (°C/°F)</th>
                                            <th className="py-4 font-medium">Avg Low (°C/°F)</th>
                                            <th className="py-4 font-medium text-center">Rainy Days</th>
                                            <th className="py-4 font-medium text-right">Crowd Level</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-5 font-semibold text-white">May</td>
                                            <td className="py-5">22°C / 72°F</td>
                                            <td className="py-5">13°C / 55°F</td>
                                            <td className="py-5 text-center"><span className="text-[#c51110]">6</span></td>
                                            <td className="py-5 text-right">
                                                <span className="sr-only">Low</span>
                                                <div className="flex justify-end gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-5 font-semibold text-white">June</td>
                                            <td className="py-5">26°C / 79°F</td>
                                            <td className="py-5">17°C / 63°F</td>
                                            <td className="py-5 text-center"><span className="text-[#c51110]">3</span></td>
                                            <td className="py-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-[#c51110]/5">
                                            <td className="py-5 font-semibold text-white">July</td>
                                            <td className="py-5">29°C / 84°F</td>
                                            <td className="py-5">20°C / 68°F</td>
                                            <td className="py-5 text-center"><span className="text-[#c51110] font-bold">1</span></td>
                                            <td className="py-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-5 font-semibold text-white">September</td>
                                            <td className="py-5">26°C / 79°F</td>
                                            <td className="py-5">18°C / 64°F</td>
                                            <td className="py-5 text-center"><span className="text-[#c51110]">5</span></td>
                                            <td className="py-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-[#c51110]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <div className="mb-10">
                                <h2 className="text-[#c51110] text-sm font-bold uppercase tracking-widest mb-2">Packing Essentials</h2>
                                <h3 className="font-serif text-3xl text-white">The Amalfi Aesthetic</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-[#121212] p-8 border-l-2 border-[#c51110]/30">
                                    <span className="material-symbols-outlined text-[#c51110] mb-4">layers</span>
                                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Spring &amp; Autumn</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed italic">The Shoulder Seasons</p>
                                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Lightweight cashmere layers</li>
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Elegant trench or light jacket</li>
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Silk scarves for evening breeze</li>
                                    </ul>
                                </div>
                                <div className="bg-[#121212] p-8 border-l-2 border-[#c51110]">
                                    <span className="material-symbols-outlined text-[#c51110] mb-4">sunny</span>
                                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Summer Peak</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed italic">The Italian Riviera Style</p>
                                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Breathable Italian linens</li>
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Premium UV protection eyewear</li>
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Wide-brimmed straw hats</li>
                                    </ul>
                                </div>
                                <div className="bg-[#121212] p-8 border-l-2 border-[#c51110]/30">
                                    <span className="material-symbols-outlined text-[#c51110] mb-4">footprint</span>
                                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Year-Round</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed italic">Essential Foundations</p>
                                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Cobblestone-ready luxury flats</li>
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> Evening cocktail attire</li>
                                        <li className="flex items-start gap-2"><span className="text-[#c51110]">•</span> High-SPF skin nourishment</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </main>

                    {/* Footer is already part of the global layout, so we can omit the explicit footer from the HTML */}
                </div>
            </div>
        </div>
    );
}
