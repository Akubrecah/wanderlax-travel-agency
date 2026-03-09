"use client";
 
 
import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    inquiry_type: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ first_name: '', last_name: '', email: '', inquiry_type: '', message: '' });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-[72px]">
      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row h-full">
        {/* Left Panel: Form */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 lg:py-20 relative">
          <div className="w-full max-w-xl space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Get in Touch
              </h1>
              <p className="text-lg text-text-muted font-sans font-light max-w-md">
                Connect with our Global Concierge for bespoke travel arrangements and inquiries.
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center space-y-4 animate-fade-in-up">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-slate-400">Thank you for reaching out. Our concierge team will respond within 2 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold text-sm hover:underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative z-0 w-full mb-2">
                    <input
                      className="block py-4 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-border-dark appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                      id="first_name" name="first_name" placeholder=" " required type="text"
                      value={formData.first_name} onChange={handleChange}
                    />
                    <label className="peer-focus:font-medium absolute text-base text-text-muted duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8" htmlFor="first_name">First Name</label>
                  </div>
                  <div className="group relative z-0 w-full mb-2">
                    <input
                      className="block py-4 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-border-dark appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                      id="last_name" name="last_name" placeholder=" " required type="text"
                      value={formData.last_name} onChange={handleChange}
                    />
                    <label className="peer-focus:font-medium absolute text-base text-text-muted duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8" htmlFor="last_name">Last Name</label>
                  </div>
                </div>
                <div className="group relative z-0 w-full mb-2">
                  <input
                    className="block py-4 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-border-dark appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                    id="email" name="email" placeholder=" " required type="email"
                    value={formData.email} onChange={handleChange}
                  />
                  <label className="peer-focus:font-medium absolute text-base text-text-muted duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8" htmlFor="email">Email Address</label>
                </div>
                <div className="group relative z-0 w-full mb-2">
                  <select
                    className="block py-4 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-border-dark appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors [&>option]:text-slate-900"
                    id="inquiry_type" name="inquiry_type"
                    value={formData.inquiry_type} onChange={handleChange}
                  >
                    <option className="hidden" disabled value="">Select inquiry type</option>
                    <option value="bespoke">Bespoke Travel Planning</option>
                    <option value="corporate">Corporate Events</option>
                    <option value="partnerships">Brand Partnerships</option>
                    <option value="press">Press &amp; Media</option>
                  </select>
                  <label className="peer-focus:font-medium absolute text-base text-text-muted duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8" htmlFor="inquiry_type">Inquiry Type</label>
                  <span className="material-symbols-outlined absolute right-0 top-4 text-text-muted pointer-events-none">expand_more</span>
                </div>
                <div className="group relative z-0 w-full mb-2">
                  <textarea
                    className="block py-4 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-border-dark appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none"
                    id="message" name="message" placeholder=" " required rows={4}
                    value={formData.message} onChange={handleChange}
                  ></textarea>
                  <label className="peer-focus:font-medium absolute text-base text-text-muted duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8" htmlFor="message">Your Message</label>
                </div>
                <div className="pt-6">
                  <button
                    className="glare-effect w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={submitting}
                  >
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                    <span className="material-symbols-outlined text-sm">
                      {submitting ? 'hourglass_empty' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Right Panel: Info */}
        <aside className="lg:w-[450px] xl:w-[500px] bg-surface-dark border-l border-border-dark/30 flex flex-col justify-center px-8 py-12 lg:px-12 relative overflow-hidden">
          {/* Decorative circle gradient behind text */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-20 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 space-y-12">
            {/* Contact Methods */}
            <div className="space-y-8">
              <div className="group">
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-text-muted mb-2 group-hover:text-primary transition-colors">Global Concierge</h3>
                <a className="text-2xl text-white font-display font-medium hover:text-primary transition-colors flex items-center gap-3" href="tel:+18005550199">
                  <span className="material-symbols-outlined text-3xl font-light">call</span>
                  +1 (800) 555-0199
                </a>
                <p className="text-sm text-text-muted mt-1 font-sans font-light">Available 24/7 for Platinum Members</p>
              </div>
              <div className="group">
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-text-muted mb-2 group-hover:text-primary transition-colors">Priority Support</h3>
                <a className="text-xl text-white font-display font-medium hover:text-primary transition-colors flex items-center gap-3 break-all" href="mailto:info@twendeafricatours.com">
                  <span className="material-symbols-outlined text-3xl font-light">mail</span>
                  info@twendeafricatours.com
                </a>
                <p className="text-sm text-text-muted mt-1 font-sans font-light">Response within 2 hours</p>
              </div>
            </div>
            <div className="w-full h-px bg-border-dark/50"></div>
            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-text-muted">Visit Our Atelier</h3>
              <div className="flex gap-4 items-start">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-lg text-white font-medium">Twende Africa Tours Headquarters</p>
                  <p className="text-text-muted font-sans font-light leading-relaxed mt-1">
                    45 Park Lane, Mayfair<br/>
                    London, W1K 1PN<br/>
                    United Kingdom
                  </p>
                  <a className="inline-flex items-center gap-2 text-primary text-sm font-bold mt-3 hover:underline" href="https://maps.google.com/?q=45+Park+Lane+Mayfair+London" target="_blank" rel="noopener noreferrer">
                    Get Directions <span className="material-symbols-outlined text-sm">north_east</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-border-dark/50"></div>
            {/* Socials */}
            <div>
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-text-muted mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                <a className="w-12 h-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
                <a className="w-12 h-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                  <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a className="w-12 h-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                </a>
              </div>
            </div>
            {/* Footer-like tiny text */}
            <div className="pt-8">
              <p className="text-xs text-text-muted/60 font-sans">
                © 2025 Twende Africa Tours. All rights reserved. <br/>
                <Link className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link> • <Link className="hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
