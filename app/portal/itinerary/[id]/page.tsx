"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export default function ItineraryDetailCustomerViewPage() {
  return (
    <div className="stitch-screen">
      <div className="noise-overlay"></div>
<header className="fixed top-0 w-full z-40 bg-background-dark/80 backdrop-blur-md border-b border-border-dark">
<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="text-primary">
<svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
</svg>
</div>
<h2 className="text-xl font-extrabold tracking-tighter uppercase">Twende Africa Tours</h2>
</div>
<nav className="hidden md:flex items-center gap-10">
<Link className="text-sm font-semibold hover:text-primary transition-colors" href="/tours">Destinations</Link>
<Link className="text-sm font-semibold hover:text-primary transition-colors" href="/tours">Experiences</Link>
<Link className="text-sm font-semibold hover:text-primary transition-colors" href="/contact">Private Jet</Link>
<Link className="text-sm font-semibold hover:text-primary transition-colors" href="/about">Journal</Link>
</nav>
<div className="flex items-center gap-4">
<button className="p-2 hover:bg-white/5 rounded-full transition-colors">
<span className="material-symbols-outlined">search</span>
</button>
<button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all uppercase">
                    Inquire
                </button>
</div>
</div>
</header>
<main>
<section className="relative h-screen w-full flex flex-col justify-end overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000" data-alt="Dramatic high-angle view of Amalfi Coast village at sunset" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQxNSc6yTwVQTM1C6mk3mfrTqULXpTh6es9fCaGJbmjqZfhAcnl1eSPGQBWBlWTb6G1FcIBsvNJ-qxwp39kFMiTXDOHMYh3BhuBghZp5L9W9TYVJVeCK7kXaFEGynwXEuajV46qMdnxOEC_U6vezsLb2kphYTRi8bYMh_HTsIPRa2qgYx-BKF8jC_JicBCKBI4OXAt4-LTxuwBWYWKgBi0jRRSh63lm70aALbmM1-OulKR5bX3K5QeygIobgJibYLMviE8ZNSOVg')" }}></div>
<div className="absolute inset-0 hero-gradient"></div>
<div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
<div className="max-w-3xl">
<span className="inline-block px-4 py-1 bg-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 rounded-sm">Exclusive Journey</span>
<h1 className="text-6xl md:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tighter">The Eternal <br/><span className="text-primary">Amalfi</span> Coast</h1>
<div className="flex flex-wrap gap-8 items-center border-t border-white/20 pt-10">
<div className="flex flex-col">
<span className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Price from</span>
<span className="text-2xl font-bold">$14,500 <span className="text-sm font-normal text-white/50">/ pp</span></span>
</div>
<div className="h-10 w-px bg-white/20 hidden sm:block"></div>
<button className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-lg text-lg font-bold tracking-wide transition-all shadow-2xl flex items-center gap-3">
                            Book This Journey
                            <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>
<section className="bg-neutral-dark border-y border-border-dark py-12">
<div className="max-w-7xl mx-auto px-6">
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
<div className="flex items-center gap-4">
<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{ fontSize: "32px" }}>calendar_today</span>
</div>
<div>
<p className="text-xs text-white/40 uppercase tracking-widest font-bold">Duration</p>
<p className="text-lg font-bold">12 Days</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{ fontSize: "32px" }}>group</span>
</div>
<div>
<p className="text-xs text-white/40 uppercase tracking-widest font-bold">Group Size</p>
<p className="text-lg font-bold">Private / Max 6</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{ fontSize: "32px" }}>landscape</span>
</div>
<div>
<p className="text-xs text-white/40 uppercase tracking-widest font-bold">Difficulty</p>
<p className="text-lg font-bold">Moderate</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{ fontSize: "32px" }}>sunny</span>
</div>
<div>
<p className="text-xs text-white/40 uppercase tracking-widest font-bold">Best Season</p>
<p className="text-lg font-bold">May — Oct</p>
</div>
</div>
</div>
</div>
</section>
<section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
<div className="md:col-span-2 space-y-20">
<div>
<h2 className="text-4xl font-black mb-8 tracking-tighter uppercase border-l-4 border-primary pl-6">The Daily Narrative</h2>
<div className="space-y-12 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-border-dark">
<div className="relative pl-16">
<div className="absolute left-4 top-1 size-4 rounded-full bg-primary ring-8 ring-background-dark"></div>
<div className="mb-4">
<span className="text-primary font-bold text-sm tracking-widest uppercase">Day 01 — Arrival</span>
<h3 className="text-2xl font-bold mt-2">The Gateway to the South: Naples</h3>
</div>
<div className="rounded-xl overflow-hidden mb-6 h-64">
<img alt="Naples cityscape at golden hour" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Panoramic view of Naples city and Mount Vesuvius" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9673yrXe8_3Xcv5r7oQODo_fSyYSV7eT2S_gLJDpdjdlUVwP9XqI0qNWPjf-CGPFVRal_tLh-Krfe7SoFIPqb9NjehGmp2WLdCW5asEeZT_tqXekulLeTkHuplJ2dZIGNeAzxLdNMrRz5fPyWX6PfnG88aZbSx8TeTzWhiIrlzapWx-Z0MJwAS1NZcIAf3mQpWXCluCizczmdQkf0VzbE-MtsRXpNFan2lEPqm9XRcONiNgcAi9-D8lAuRxKWrHoAYvDlSBxfkA"/>
</div>
<p className="text-white/70 leading-relaxed text-lg italic">
                                Begin your odyssey in the shadow of Vesuvius. After a private limousine transfer, settle into your suite at the Grand Hotel Vesuvio. The evening unfolds with a private sunset tasting of volcanic wines and Neapolitan delicacies on a terrace overlooking the bay.
                            </p>
</div>
<div className="relative pl-16">
<div className="absolute left-4 top-1 size-4 rounded-full bg-border-dark ring-8 ring-background-dark"></div>
<div className="mb-4">
<span className="text-primary font-bold text-sm tracking-widest uppercase">Day 02 — Heritage</span>
<h3 className="text-2xl font-bold mt-2">Silent Echoes of Pompeii</h3>
</div>
<div className="rounded-xl overflow-hidden mb-6 h-64">
<img alt="Ancient ruins of Pompeii" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Archaeological site of Pompeii with pillars and ruins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFgglqkoqfC8FXYB4QK9zK_bQXCI0qrgfWu5xmRFoZNKiUBaZOxgwrBdu3w0e32hmI73G40mqHD3hrHQAZMs0W9V_7UkCXFSvLKINOsm5rEH1GLHqFY5l8j1x8-cIdmZ-iszk17msehrjCQ4nh5IlyxMQZIHM1DZdrNamEvFDzKhCdRDjnujpZr_zY-DaTaXSuApkBOBuKC2-1AJmZFvFcC84gat2eB3moce2cGohYN4BiW_iQjGVjKK2EcL7KiEtJHG6QZ7A96Q"/>
</div>
<p className="text-white/70 leading-relaxed text-lg">
                                Walk through history with our resident archaeologist for a private after-hours tour of Pompeii's most exclusive villas. Witness preserved frescos and mosaic floors that are typically closed to the public. Lunch is served in a vineyard nestled among the ruins.
                            </p>
</div>
<div className="relative pl-16">
<div className="absolute left-4 top-1 size-4 rounded-full bg-border-dark ring-8 ring-background-dark"></div>
<div className="mb-4">
<span className="text-primary font-bold text-sm tracking-widest uppercase">Day 03 — The Coastline</span>
<h3 className="text-2xl font-bold mt-2">Positano by Riva</h3>
</div>
<div className="rounded-xl overflow-hidden mb-6 h-64">
<img alt="Positano coastline with colorful houses" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Vertical town of Positano with pastel houses clinging to the cliff" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA0l6vnnAXUc8iRHRa8KCPetW_ilcnx3j92RvkQaeV6PLAzBeLjCZnAf0UUkKYC9t5Izi8E5mcxIYrIST12-imhfOj91V3nKeY3lYrT2r3caWzhryIMP_NRTcXirGRvdcP985c_2__R966gsH9gEnF-UjTBetwtTR-RDvl___DXA-rxNeIcG-ynLg2Sci-xfyOIcvJza2UJFaCHs22TX2NKtVYLKnVcPjpJGFzjnu8W-sTPZfZyta_yY2G5OvHimACuedunOsqJQ"/>
</div>
<p className="text-white/70 leading-relaxed text-lg">
                                Board a vintage Riva Aquarama for a coastal cruise to Positano. Navigate through the hidden grottos and emerald waters, stopping for a swim at Li Galli islands. Afternoon at leisure for boutique shopping or relaxation at Le Sirenuse.
                            </p>
</div>
</div>
</div>
<div className="bg-neutral-dark p-12 rounded-2xl border border-border-dark">
<h2 className="text-3xl font-black mb-10 tracking-tighter uppercase">Inclusions &amp; Exclusions</h2>
<div className="grid sm:grid-cols-2 gap-12">
<div className="space-y-6">
<h4 className="text-primary font-bold tracking-widest uppercase flex items-center gap-2">
<span className="material-symbols-outlined">check_circle</span>
                                What's Included
                            </h4>
<ul className="space-y-4 text-white/70">
<li className="flex gap-3"><span className="material-symbols-outlined text-primary text-sm">circle</span> Luxury boutique hotel accommodations</li>
<li className="flex gap-3"><span className="material-symbols-outlined text-primary text-sm">circle</span> Private Riva boat transfers &amp; tours</li>
<li className="flex gap-3"><span className="material-symbols-outlined text-primary text-sm">circle</span> Daily breakfast and curated dining</li>
<li className="flex gap-3"><span className="material-symbols-outlined text-primary text-sm">circle</span> All entrance fees and private guides</li>
<li className="flex gap-3"><span className="material-symbols-outlined text-primary text-sm">circle</span> Chauffeur-driven Mercedes S-Class</li>
</ul>
</div>
<div className="space-y-6">
<h4 className="text-white/40 font-bold tracking-widest uppercase flex items-center gap-2">
<span className="material-symbols-outlined">cancel</span>
                                Not Included
                            </h4>
<ul className="space-y-4 text-white/40">
<li className="flex gap-3"><span className="material-symbols-outlined text-sm">circle</span> International airfare</li>
<li className="flex gap-3"><span className="material-symbols-outlined text-sm">circle</span> Personal travel insurance</li>
<li className="flex gap-3"><span className="material-symbols-outlined text-sm">circle</span> Items of a personal nature</li>
</ul>
</div>
</div>
</div>
</div>
<aside className="space-y-12">
<div className="sticky top-28 space-y-12">
<div className="bg-background-dark border border-border-dark p-8 rounded-2xl">
<h3 className="text-xl font-bold mb-6 italic">"A journey of this caliber isn't just about the places you visit, but the moments of profound connection and silence between them."</h3>
<div className="flex items-center gap-4">
<div className="size-12 rounded-full overflow-hidden bg-zinc-800">
<img alt="Travel Specialist" className="w-full h-full object-cover" data-alt="Portrait of a sophisticated travel concierge" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVBtS2Ojkc_gSQTPfod6WaDrEZ2UNQcaE1pMjm2uNwN4seN3cF_v_58Q2J2S8XAiBItPrmB-D4djScBwdAdbJ-ruArkVOqS5piQMr8J0EUo4a5wwHCmbZmbt0Q84G8ARK8gouYeEM_xYW8rGeQeC-n44FJGsUCVRZF8nSuNAWJXS8lgHBKlMSr5_1BcA7rr09Dd19W_hDmB5BeIRoG1Vb-kLp59p6JyEvwAaDrdo1FdQNo4YhfJWaXpF0mZioltdne8xHc4-xMCA"/>
</div>
<div>
<p className="font-bold text-sm">Marco Valenti</p>
<p className="text-xs text-white/50 uppercase font-bold tracking-widest">Lead Destination Architect</p>
</div>
</div>
</div>
<div className="space-y-6">
<h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">What to Expect</h4>
<p className="text-white/70 leading-loose">
                            Expect an uncompromising level of service. Every detail of your Amalfi odyssey is meticulously curated to ensure seamless transitions between activities. From private villa access to tables at Michelin-starred restaurants that are impossible to book, we handle the logistics so you can immerse yourself in the spirit of <i>la dolce vita</i>.
                        </p>
<div className="grid grid-cols-2 gap-4">
<div className="bg-neutral-dark p-4 border border-border-dark rounded-xl">
<span className="material-symbols-outlined text-primary mb-2">hotel_class</span>
<p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Stay</p>
<p className="text-xs font-bold">5-Star Luxury</p>
</div>
<div className="bg-neutral-dark p-4 border border-border-dark rounded-xl">
<span className="material-symbols-outlined text-primary mb-2">restaurant</span>
<p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Dining</p>
<p className="text-xs font-bold">Gastronomic</p>
</div>
</div>
</div>
</div>
</aside>
</section>
<section className="py-24 bg-neutral-dark/30">
<div className="max-w-7xl mx-auto px-6">
<div className="flex justify-between items-end mb-12">
<div>
<span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Expand Your Horizons</span>
<h2 className="text-4xl font-black tracking-tighter uppercase">You Might Also Like</h2>
</div>
<div className="flex gap-3">
<button className="size-12 rounded-full border border-border-dark flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="size-12 rounded-full border border-border-dark flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
<div className="grid md:grid-cols-3 gap-8">
<div className="group cursor-pointer">
<div className="aspect-[4/5] overflow-hidden rounded-2xl relative mb-6">
<img alt="Iceland landscape" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Dramatic waterfall in Iceland under northern lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhW-OdqzIMU2BYXfD0K6fr71A-7Bye9GT4DRvsrw-xbkdb3DZT4jCZEK790En_X9ZRQB2gOg0lIz_ez90WUN0ZQsA65aQnfiI3bIrWf1WzTKg0isWgNwWDKS0Pgi6EOXllTFOWARlhyUKNIAStqebEXSf4tWq8wcJBJbQJy0v69CcbLrUDPyHDJEB5-_qMewGehm1tNYw1TG8hU8oCU1vAmlVSV2o1fNUKZGBuVtpnbnU812062e32Ed25cdbhYG-uJmgr-Ek2AQ"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6">
<span className="text-[10px] font-bold bg-white text-black px-2 py-1 uppercase rounded-sm mb-2 inline-block">Northern Lights</span>
<h4 className="text-xl font-bold">Icelandic Wilderness</h4>
</div>
</div>
<div className="flex justify-between items-center px-2">
<span className="text-white/50 text-sm">8 Days • Private</span>
<span className="font-bold text-primary">From $9,200</span>
</div>
</div>
<div className="group cursor-pointer">
<div className="aspect-[4/5] overflow-hidden rounded-2xl relative mb-6">
<img alt="Japanese garden" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Serene Japanese temple and cherry blossoms" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADiY8ZQOZZ5s1erLtjFlQD2-4hm9MbhdlgLweyjJt6fYYufypWSidRhxVylLfg6LCVIOVvewErHupLMnJ1jfG21oAwujjvT2-R4WhwNj9z7VBq-2fBgec9kG8LCLp_ozQQ52f3mzFhzXEN3t6K_GSXV5s6E-8lWK69ViP8GU3v48jZSqiwxFB5_DBDiwGT964vy2lIyDcCxIVRhGp_23f2_II4TTehCkW7PNBHJ2AECGIsZGkWE14SkCcYBJptjufn2q9tS5yD1g"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6">
<span className="text-[10px] font-bold bg-white text-black px-2 py-1 uppercase rounded-sm mb-2 inline-block">Heritage</span>
<h4 className="text-xl font-bold">Zen &amp; Shogun Heritage</h4>
</div>
</div>
<div className="flex justify-between items-center px-2">
<span className="text-white/50 text-sm">14 Days • Private</span>
<span className="font-bold text-primary">From $18,400</span>
</div>
</div>
<div className="group cursor-pointer">
<div className="aspect-[4/5] overflow-hidden rounded-2xl relative mb-6">
<img alt="Bora Bora aerial" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Overwater bungalows in crystal clear turquoise water" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOg2GQOYtZfA2sCpK3mZtgopdOph-i5Kh2068BXRM0K268h89_iYbwOFhdD5pkTPcGV-IL4-dGpa5SSbYzYaZqcaiZ2u_fq7xUo09_NGNWtLucKIO-K1ErRso_Un-5ECeDTVgpzsb60OZGznLiHOcJXSHZPzkjQJPSrnMZl73900BKIG8fY1ZrUFOtQK22CnLYG_mg0mTLmK2uASyiQnMR2KZ_CLo186ZHnwRoGe_uoo-EkFiaoEW78cF7bS8TxFGQc8PKs1fAug"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6">
<span className="text-[10px] font-bold bg-white text-black px-2 py-1 uppercase rounded-sm mb-2 inline-block">Island Paradise</span>
<h4 className="text-xl font-bold">Polynesian Private Islands</h4>
</div>
</div>
<div className="flex justify-between items-center px-2">
<span className="text-white/50 text-sm">10 Days • Private</span>
<span className="font-bold text-primary">From $22,000</span>
</div>
</div>
</div>
</div>
</section>
</main>
<footer className="bg-background-dark border-t border-border-dark pt-20 pb-10">
<div className="max-w-7xl mx-auto px-6">
<div className="grid md:grid-cols-4 gap-12 mb-20">
<div className="col-span-2 space-y-8">
<div className="flex items-center gap-3">
<div className="text-primary">
<svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
</svg>
</div>
<h2 className="text-2xl font-black tracking-tighter uppercase">Twende Africa Tours</h2>
</div>
<p className="text-white/50 text-lg max-w-sm">
                        Curating the world's most extraordinary travel experiences for the discerning explorer.
                    </p>
<div className="flex gap-6">
<a className="text-white/50 hover:text-primary transition-colors" href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
<a className="text-white/50 hover:text-primary transition-colors" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
<a className="text-white/50 hover:text-primary transition-colors" href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
</div>
</div>
<div>
<h5 className="font-bold uppercase tracking-widest text-xs mb-8 text-primary">Navigation</h5>
<ul className="space-y-4 text-white/50 font-medium">
<li><Link className="hover:text-white transition-colors" href="/tours">Destinations</Link></li>
<li><Link className="hover:text-white transition-colors" href="/contact">Private Jet</Link></li>
<li><Link className="hover:text-white transition-colors" href="/about">Our Story</Link></li>
<li><Link className="hover:text-white transition-colors" href="/contact">Contact</Link></li>
</ul>
</div>
<div>
<h5 className="font-bold uppercase tracking-widest text-xs mb-8 text-primary">Legal</h5>
<ul className="space-y-4 text-white/50 font-medium">
<li><Link className="hover:text-white transition-colors" href="/terms">Terms of Service</Link></li>
<li><Link className="hover:text-white transition-colors" href="/privacy">Privacy Policy</Link></li>
<li><Link className="hover:text-white transition-colors" href="/about">Booking Conditions</Link></li>
</ul>
</div>
</div>
<div className="pt-10 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
<p className="text-white/30 text-xs uppercase tracking-widest font-bold">© 2024 Twende Africa Tours. All rights reserved.</p>
<p className="text-white/30 text-xs uppercase tracking-widest font-bold">Crafted for Excellence</p>
</div>
</div>
</footer>
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%]">
<button className="w-full bg-primary text-white py-4 rounded-xl font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(195,9,9,0.3)] flex items-center justify-center gap-3">
            Book Now — $14,500
            <span className="material-symbols-outlined">bolt</span>
</button>
</div>
    </div>
  );
}
