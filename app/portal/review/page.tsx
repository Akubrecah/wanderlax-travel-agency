"use client";

import React from 'react';
import Link from 'next/link';

export default function ReviewPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative">
            <style dangerouslySetInnerHTML={{ __html: `
                .noise-overlay {
                    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuA6jCE7QlYNg6Ai2DnCpYkQi401q8Y-xc6_3ndWiJJ2O2v9KL--ndeI8WQmqRRcjfp3ffrh9q2HrMhfD2LuVkPJ2MAcUIBPrXygzGS4NXPlMqKM3qPjuYBcgCVAChrtapCDTVPSCv6sJztNp5EZ_b4-PGScruzFd3KT0eEp--adhhcrMqjHNbN3koyXLb9ClhR0s6_58j3eFUvIhHJSh0Nj2yvC2yH6N_aazvuv4WA8Skk1LN_ImroZQlJBle4Cx0ZnniVlevpmeA);
                    opacity: 0.03
                }
                .glass-panel {
                    background: rgba(40, 20, 20, 0.4);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(198, 16, 16, 0.1)
                }
                .glare-button {
                    position: relative;
                    overflow: hidden
                }
                .glare-button::after {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transform: rotate(45deg);
                    transition: 0.5s
                }
                .glare-button:hover::after {
                    left: 100%;
                    top: 100%
                }
            `}} />
            
            <div className="fixed inset-0 noise-overlay pointer-events-none z-50"></div>
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 py-4 lg:px-20">
                        <div className="flex items-center gap-4 text-primary">
                            <div className="size-6">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                                </svg>
                            </div>
                            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight uppercase">Twende Africa Tours</h2>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/portal/dashboard" className="flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </Link>
                        </div>
                    </header>
                    <main className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-20">
                        <div className="max-w-4xl w-full flex flex-col gap-8">
                            <section className="relative rounded-xl overflow-hidden min-h-[320px] flex flex-col justify-end group">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Cinematic aerial view of Amalfi Coast cliffs and turquoise water" style={{ backgroundImage: "linear-gradient(0deg, rgba(10, 5, 5, 0.9) 0%, rgba(10, 5, 5, 0.2) 60%, rgba(10, 5, 5, 0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1pW0rI-U19Cyf60GVmYA8A4E4bpcpvuIkRZ54rN48qPoRwKnDrlThoVBHp9QShr_Scs5ppDj3lGxOQpBs4cAJUDjgMtGpi8w89LCOh6EdxuDGaxgxPcsQ0L02ODV5pEz5s9LpbF7r-rhoF8kmZEflsRk_5j4hpBgKtCA3McP4pmudgkB1xABQWsUx_4TjdjVgYUkTSRu0C4WgF-vS9lUDe-iL4ZHeAB3uPGMQAVWBYNwaYetvbtMq1ATTUoy9XjNN4v9d0MXTjw')" }}>
                                </div>
                                <div className="relative p-8 lg:p-12">
                                    <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded mb-4">Past Experience</span>
                                    <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-2">Amalfi Coast Discovery</h1>
                                    <p className="text-slate-300 text-lg flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                                        September 12 - September 24, 2023
                                    </p>
                                </div>
                            </section>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="glass-panel rounded-xl p-8 space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Detailed Review</h3>
                                            <p className="text-slate-400 text-sm mb-4">Describe the most memorable moments of your journey</p>
                                            <div className="relative group">
                                                <textarea className="w-full bg-primary/5 border border-primary/20 rounded-lg p-4 text-slate-100 focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[200px] resize-none transition-all placeholder:text-slate-600" placeholder="The cliffside villas in Positano were breathtaking..."></textarea>
                                                <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase">Minimum 50 words</div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Travel Gallery</h3>
                                            <div className="border-2 border-dashed border-primary/20 rounded-lg p-10 flex flex-col items-center justify-center gap-3 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium">Drag and drop high-res travel shots</p>
                                                    <p className="text-xs text-slate-500 mt-1">Maximum file size 25MB (JPG, RAW, PNG)</p>
                                                </div>
                                                <button className="mt-2 px-4 py-2 border border-primary/40 rounded text-xs font-bold uppercase tracking-tighter hover:bg-primary hover:text-white transition-all">Browse Files</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="glass-panel rounded-xl p-6 space-y-8">
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold mb-4">Overall Experience</h3>
                                            <div className="flex justify-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                                            </div>
                                            <p className="text-primary text-xs font-bold uppercase mt-3 tracking-widest">Excellent</p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-primary/10 pb-2">Category Ratings</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium uppercase tracking-tight">
                                                    <span>Service</span>
                                                    <span className="text-primary">4.8</span>
                                                </div>
                                                <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: "95%" }}></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium uppercase tracking-tight">
                                                    <span>Lodging</span>
                                                    <span className="text-primary">5.0</span>
                                                </div>
                                                <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: "100%" }}></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium uppercase tracking-tight">
                                                    <span>Transport</span>
                                                    <span className="text-primary">4.2</span>
                                                </div>
                                                <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: "84%" }}></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium uppercase tracking-tight">
                                                    <span>Activities</span>
                                                    <span className="text-primary">4.9</span>
                                                </div>
                                                <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: "98%" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex items-center justify-between border-t border-primary/10">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">Recommend trip</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">To other travelers</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input defaultChecked className="sr-only peer" type="checkbox" />
                                                <div className="w-11 h-6 bg-primary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-6 rounded-xl border-t border-primary/20">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                        <span className="material-symbols-outlined text-primary">security</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold uppercase tracking-tight">Twende Verified</p>
                                        <p className="text-[10px] text-slate-500 uppercase">Secure submission process</p>
                                    </div>
                                </div>
                                <div className="flex w-full sm:w-auto gap-4">
                                    <button className="flex-1 sm:flex-none px-8 py-3 rounded-lg bg-transparent border border-primary/40 text-slate-100 text-sm font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">
                                        Save Draft
                                    </button>
                                    <button className="glare-button flex-1 sm:flex-none px-8 py-3 rounded-lg bg-primary text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className="px-6 lg:px-20 py-10 border-t border-primary/10 text-center">
                        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
                            © 2024 Twende Africa Tours • All Rights Reserved
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
