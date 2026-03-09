import React from 'react';

export default function PackingEssentialsPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-slate-100 font-display selection:bg-primary selection:text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                .noise-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    content: "";
                    opacity: 0.05;
                    z-index: 50;
                    pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                .editorial-border {
                    border-left: 1px solid rgba(197, 17, 16, 0.3);
                }
                .font-display {
                    font-family: 'Public Sans', sans-serif;
                }
            `}} />
            <div className="noise-overlay"></div>
            <div className="layout-container flex h-full grow flex-col z-10 relative">
                <header className="flex items-center justify-between px-8 md:px-20 py-8 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="size-6 text-primary">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-[0.2em] uppercase">Twende Africa Tours</h2>
                    </div>
                    <div className="text-xs tracking-[0.3em] uppercase opacity-50 hidden md:block">
                        Itinerary No. 842 / Amalfi
                    </div>
                </header>
                <main className="flex-1 px-8 md:px-20 py-12 max-w-7xl mx-auto w-full">
                    <section className="mb-16">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl mb-10">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="Cinematic view of the Amalfi Coast cliffs and ocean" className="w-full h-full object-cover grayscale-[20%] contrast-[110%]" data-alt="Cinematic view of Amalfi Coast cliffs and ocean" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl_JCrV7oI0C2iPYYE3D0VWgLUSj1VysF1q-E9MLtR7X4VGwYFigu1TYWpMWLDtWrWOTZTHVpMAJg3DHjQKM6YO-yb9eLMiG6vxD5QFXDP3hqLrUAzc4YCUJw2JcSXe-2GG0FdTq4IWdDqMft2KqA83pSjDAlyPupKIWm45WSxR4iztDq5Rx8g0reHqHkc9auvLmNoCGa8diYHrX4auc8iDNh5O4tr4nZft9vjABjGy7wHje8ymdOwMtuTjhxZU_AMX30kkfOnzg"/>
                            <div className="absolute bottom-8 left-8 z-20">
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2">Packing Essentials</h1>
                                <p className="text-primary text-lg md:text-xl font-light tracking-widest uppercase">Curated for the Amalfi Coast</p>
                            </div>
                        </div>
                    </section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">apparel</span>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Apparel &amp; Style</h3>
                            </div>
                            <ul className="space-y-4 text-slate-400 font-light editorial-border pl-6">
                                <li className="hover:text-white transition-colors">Linen Shirts</li>
                                <li className="hover:text-white transition-colors">Silk Sundresses</li>
                                <li className="hover:text-white transition-colors">Designer Swimwear</li>
                                <li className="hover:text-white transition-colors">Evening Resort Wear</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">eyeglasses</span>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Accessories</h3>
                            </div>
                            <ul className="space-y-4 text-slate-400 font-light editorial-border pl-6">
                                <li className="hover:text-white transition-colors">Polarized Sunglasses</li>
                                <li className="hover:text-white transition-colors">Wide-Brimmed Straw Hat</li>
                                <li className="hover:text-white transition-colors">Leather Walking Shoes</li>
                                <li className="hover:text-white transition-colors">Evening Clutch</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">devices</span>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Travel Tech</h3>
                            </div>
                            <ul className="space-y-4 text-slate-400 font-light editorial-border pl-6">
                                <li className="hover:text-white transition-colors">Universal Adapter</li>
                                <li className="hover:text-white transition-colors">Slim Portable Charger</li>
                                <li className="hover:text-white transition-colors">Leica or High-end Camera</li>
                                <li className="hover:text-white transition-colors">Noise-Cancelling Headphones</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Essentials</h3>
                            </div>
                            <ul className="space-y-4 text-slate-400 font-light editorial-border pl-6">
                                <li className="hover:text-white transition-colors">Mineral Sunscreen</li>
                                <li className="hover:text-white transition-colors">Travel Documents</li>
                                <li className="hover:text-white transition-colors">Local Currency (Euro)</li>
                                <li className="hover:text-white transition-colors">Private Medical Kit</li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative p-8 border border-primary/40 rounded-xl bg-primary/5">
                            <div className="absolute -top-3 left-8 bg-background-dark px-4">
                                <span className="text-primary text-xs font-bold uppercase tracking-[0.3em]">Travel Tip</span>
                            </div>
                            <p className="text-lg italic font-light leading-relaxed text-slate-200">
                                &quot;The cobblestone paths of Positano are as unforgiving as they are beautiful. We recommend prioritizing high-quality leather sandals for the daytime and reserving your stiletto heels strictly for dinner service at La Sponda.&quot;
                            </p>
                        </div>
                    </div>
                </main>
                <footer className="mt-auto px-8 md:px-20 py-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">014</span>
                        <span className="w-12 h-[1px] bg-primary/30"></span>
                        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">Uncompromising Luxury</p>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.4em] opacity-40">
                        © 2024 Twende Africa Tours
                    </div>
                </footer>
            </div>
        </div>
    );
}
