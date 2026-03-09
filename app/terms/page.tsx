"use client";

import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const lastUpdated = "March 1, 2026";

  const sections = [
    {
      icon: "gavel",
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using the Twende Africa Tours website, mobile applications, or any services provided by Twende Africa Tours (\"Company\", \"we\", \"us\", or \"our\"), you agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, you must not access or use our services. These terms apply to all visitors, users, clients, and others who access or use our services.",
        "We reserve the right to update or modify these terms at any time. Continued use of our services after any such changes constitutes your acceptance of the new terms."
      ]
    },
    {
      icon: "travel_explore",
      title: "2. Booking & Reservations",
      content: [
        "All bookings made through Twende Africa Tours are subject to availability and confirmation. A booking is only confirmed once you receive a written confirmation from our team and the required deposit has been processed.",
        "Prices quoted are in USD unless otherwise specified and are subject to change until a booking is confirmed. All prices include applicable taxes unless stated otherwise.",
        "Special requests (dietary requirements, room preferences, accessibility needs) will be communicated to service providers but cannot be guaranteed. We will make every reasonable effort to accommodate such requests."
      ]
    },
    {
      icon: "payments",
      title: "3. Payment Terms",
      content: [
        "A non-refundable deposit of 30% of the total booking value is required at the time of booking confirmation. The remaining balance is due 60 days prior to the departure date.",
        "We accept major credit cards (Visa, Mastercard, American Express), bank transfers, and select digital payment methods. All transactions are processed through secure, PCI-DSS compliant payment gateways.",
        "Late payments may result in the cancellation of your booking. In such cases, the deposit and any payments made will be subject to our cancellation policy outlined below."
      ]
    },
    {
      icon: "event_busy",
      title: "4. Cancellation & Refund Policy",
      content: [
        "Cancellations made more than 90 days before departure: Full refund minus the non-refundable deposit (30%). Cancellations 60–90 days before departure: 50% refund of the total booking value.",
        "Cancellations 30–59 days before departure: 25% refund. Cancellations less than 30 days before departure: No refund will be issued.",
        "We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen cancellations. Twende Africa Tours can assist in arranging travel insurance upon request.",
        "Force Majeure: In the event of circumstances beyond our control (natural disasters, pandemics, political unrest, etc.), we will work with you to reschedule your trip or provide credit toward a future booking."
      ]
    },
    {
      icon: "verified_user",
      title: "5. Traveler Responsibilities",
      content: [
        "You are responsible for ensuring that all travel documents (passports, visas, health certificates) are valid and in order. Twende Africa Tours is not liable for any issues arising from inadequate documentation.",
        "You must comply with all local laws, regulations, and customs of the destinations visited. Any illegal activity during your trip may result in immediate termination of services without refund.",
        "You agree to follow the safety guidelines and instructions provided by local guides, tour operators, and accommodation providers. Participation in adventure activities is at your own risk."
      ]
    },
    {
      icon: "shield",
      title: "6. Liability & Insurance",
      content: [
        "Twende Africa Tours acts as an intermediary between you and third-party service providers (airlines, hotels, tour operators, transportation companies). We are not liable for the acts, errors, omissions, or negligence of any third-party providers.",
        "Our total liability for any claim arising from the use of our services shall not exceed the total amount paid by you for the booking in question.",
        "We are not responsible for personal injury, property damage, or financial loss arising from circumstances beyond our reasonable control, including but not limited to travel delays, lost luggage, or natural events."
      ]
    },
    {
      icon: "privacy_tip",
      title: "7. Privacy & Data Protection",
      content: [
        "We collect and process your personal data in accordance with our Privacy Policy and applicable data protection laws, including GDPR where applicable.",
        "Your personal information (name, contact details, payment information, travel preferences) is used solely to provide and improve our services, process bookings, and communicate with you about your travel arrangements.",
        "We do not sell or share your personal data with third parties for marketing purposes. Data shared with travel service providers is limited to what is necessary to fulfill your booking."
      ]
    },
    {
      icon: "copyright",
      title: "8. Intellectual Property",
      content: [
        "All content on the Twende Africa Tours website, including text, graphics, logos, images, and software, is the property of Twende Africa Tours and is protected by international copyright and trademark laws.",
        "You may not reproduce, distribute, modify, or create derivative works from any content on our platform without prior written consent. Limited personal, non-commercial use is permitted for trip planning purposes.",
        "User-generated content (reviews, photos uploaded to our platform) grants Twende Africa Tours a non-exclusive, royalty-free license to use, display, and distribute such content for promotional purposes."
      ]
    },
    {
      icon: "balance",
      title: "9. Dispute Resolution",
      content: [
        "Any disputes arising from or relating to these terms or our services shall be resolved through good-faith negotiation between the parties.",
        "If a dispute cannot be resolved through negotiation, it shall be submitted to binding arbitration in accordance with the rules of the International Chamber of Commerce (ICC).",
        "These terms shall be governed by and construed in accordance with the laws of Kenya. The courts of Nairobi shall have exclusive jurisdiction."
      ]
    },
    {
      icon: "contact_support",
      title: "10. Contact Information",
      content: [
        "If you have any questions about these Terms of Service, please contact our legal team at legal@twendeafricatours.com or call our concierge line at +254 700 000000.",
        "For urgent matters related to active bookings, please reach out to your dedicated travel concierge directly or contact our 24/7 support line.",
        "Twende Africa Tours | Westlands, Nairobi, Kenya, 00100."
      ]
    }
  ];

  return (
    <div className="stitch-screen">
      <div className="grain-overlay"></div>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        {/* Hero Section */}
        <div className="relative w-full flex items-center justify-center overflow-hidden pt-[72px]">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-background-dark via-surface-dark to-background-dark"></div>
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/3 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto py-24 md:py-32">
            <div className="mb-6 p-3 rounded-full border border-white/10 bg-white/5">
              <span className="material-symbols-outlined text-primary text-3xl">description</span>
            </div>
            <span className="text-primary tracking-[0.2em] text-sm font-bold uppercase mb-4">Legal</span>
            <h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6">
              Terms of <span className="italic text-slate-200">Service</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              Please read these terms carefully before using our services. Your journey with Twende Africa Tours is governed by these conditions.
            </p>
            <p className="text-slate-500 text-sm mt-6 font-medium">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <section className="sticky top-[72px] z-30 bg-background-dark/80 backdrop-blur-xl border-y border-border-dark">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider whitespace-nowrap">Jump to:</span>
            {sections.slice(0, 6).map((section) => (
              <a
                key={section.title}
                href={`#section-${section.title.split('.')[0].replace(/\D/g, '')}`}
                className="text-slate-400 hover:text-primary text-sm whitespace-nowrap transition-colors"
              >
                {section.title.split('. ')[1]}
              </a>
            ))}
            <a href="#section-7" className="text-slate-400 hover:text-primary text-sm whitespace-nowrap transition-colors">
              More...
            </a>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 md:py-24 px-6 lg:px-10 bg-background-dark">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                  <span className="material-symbols-outlined text-xl">info</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Important Notice</h3>
                  <p className="text-slate-300 leading-relaxed">
                    These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and Twende Africa Tours. 
                    By booking a trip, creating an account, or using any of our services, you acknowledge that you have read, understood, 
                    and agree to be bound by these Terms. For questions, contact us at{' '}
                    <a href="mailto:legal@twendeafricatours.com" className="text-primary hover:underline">legal@twendeafricatours.com</a>.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  id={`section-${index + 1}`}
                  className="group scroll-mt-32"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                      <span className="material-symbols-outlined">{section.icon}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 group-hover:text-primary/90 transition-colors">
                        {section.title}
                      </h2>
                      <div className="space-y-4">
                        {section.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-slate-300 leading-relaxed text-[15px]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  {index < sections.length - 1 && (
                    <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-6 lg:px-10 flex items-center justify-center bg-background-dark overflow-hidden border-t border-border-dark">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-dark via-background-dark to-black opacity-80"></div>
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
            <div className="mb-6 p-3 rounded-full border border-white/10 bg-white/5">
              <span className="material-symbols-outlined text-white text-2xl">help_center</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Have Questions?</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Our legal team is here to help clarify any aspect of these terms. Don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-primary rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span className="mr-2">Contact Us</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
              <Link
                href="/about"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-300 transition-all duration-200 bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm hover:bg-white/10 hover:text-white hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="mr-2">About Us</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">info</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
