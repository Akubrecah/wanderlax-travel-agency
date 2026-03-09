import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Twende Africa Tours',
  description: 'Twende Africa Tours Privacy Policy. Learn about how we handle your personal data across our services.',
};

export default function PrivacyPage() {
  const lastUpdated = "March 4, 2026";

  const sections = [
    {
      icon: "account_circle",
      title: "1. Information We Collect",
      content: [
        "To provide you with our travel services, Twende Africa Tours may collect personal information such as your name, contact details, payment information, dietary preferences, passport details, and travel history.",
        "This information is gathered when you request a quote, make a booking, subscribe to our newsletter, or communicate with our concierge team."
      ]
    },
    {
      icon: "settings_suggest",
      title: "2. How We Use Your Information",
      content: [
        "We utilize your personal data primarily to execute our travel services, personalizing your itineraries, and ensuring seamless communication with our partners (airlines, hotels, local guides).",
        "Additionally, we might use your information to send marketing communications, if you have opted in, or to improve the quality of our services."
      ]
    },
    {
      icon: "share",
      title: "3. Data Sharing and Disclosure",
      content: [
        "Twende Africa Tours does not sell, rent, or trade your personal information. We may share necessary details with trusted third-party service providers and travel partners worldwide (such as hotels and transport companies) strictly for fulfilling your travel arrangements.",
        "In certain circumstances, we may also disclose data if required by law."
      ]
    },
    {
      icon: "shield_lock",
      title: "4. Data Security",
      content: [
        "We employ industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        "However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
      ]
    },
    {
      icon: "accessibility_new",
      title: "5. Your Rights",
      content: [
        "You have the right to access, correct, or delete your personal information held by us. You can also object to our processing of your data or withdraw your consent for marketing communications at any time.",
        "To exercise these rights, please contact our privacy team."
      ]
    },
    {
      icon: "cookie",
      title: "6. Cookies and Tracking Technologies",
      content: [
        "Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user behavior.",
        "You can manage your cookie preferences through your browser settings."
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
              <span className="material-symbols-outlined text-primary text-3xl">privacy_tip</span>
            </div>
            <span className="text-primary tracking-[0.2em] text-sm font-bold uppercase mb-4">Legal</span>
            <h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6">
              Privacy <span className="italic text-slate-200">Policy</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              Your privacy is our utmost priority. Learn how Twende Africa Tours safeguards and handles your personal information.
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
            {sections.map((section) => (
              <a
                key={section.title}
                href={`#section-${section.title.split('.')[0].replace(/\D/g, '')}`}
                className="text-slate-400 hover:text-primary text-sm whitespace-nowrap transition-colors"
              >
                {section.title.split('. ')[1]}
              </a>
            ))}
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16 md:py-24 px-6 lg:px-10 bg-background-dark">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                  <span className="material-symbols-outlined text-xl">security</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Our Commitment</h3>
                  <p className="text-slate-300 leading-relaxed">
                    At Twende Africa Tours, we are committed to protecting your privacy and ensuring your personal data is handled safely, responsibly, and in accordance with applicable data protection laws. 
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
              <span className="material-symbols-outlined text-white text-2xl">mail</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Contact Data Protection Officer</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection Officer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@twendeafricatours.com"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-primary rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span className="mr-2">Email Privacy Team</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
