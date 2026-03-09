"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Hide global footer on admin and checkout pages
  if (pathname?.startsWith('/admin') || pathname === '/portal/checkout') return null;

  return (
    <footer className="bg-black border-t border-white/5 pt-12 pb-8 px-6 lg:px-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
          <div className="space-y-8">
            {/* Footer logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all text-sm font-bold">
                <span className="material-symbols-outlined text-2xl">diamond</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-white text-xl font-bold tracking-tight leading-none group-hover:text-primary transition-colors">Twende Africa Tours</h2>
                <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] leading-none mt-1">Explore Africa and the World</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A professional tour &amp; travel agency connecting you with the beauty of Africa and destinations across the world. Reliable, affordable, and unforgettable.
            </p>
            <div className="flex gap-5">
              {[
                { name: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'Instagram', icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.944 2.013 9.278 2 12 2h.315zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-8.67a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z' },
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' }
              ].map((social) => (
                <a 
                  key={social.name}
                  className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300" 
                  href={`https://${social.name.toLowerCase()}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.name}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}></path></svg>
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:pl-8">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Exclusives</h3>
            <ul className="space-y-4">
              {['Private Jet Charters', 'Secret Islands', 'Luxury Safaris', 'Alpine Getaways'].map(item => (
                <li key={item}><Link className="text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/tours">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className="lg:pl-8">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">The Agency</h3>
            <ul className="space-y-4">
              {['Our Legacy', 'Concierge Service', 'Contact Concierge', 'Privacy Standards'].map(item => (
                <li key={item}><Link className="text-slate-400 hover:text-primary transition-colors text-sm font-medium" href={item.includes('Contact') ? '/contact' : '/about'}>{item}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-8">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 group">
                <span className="material-symbols-outlined text-primary text-xl font-light group-hover:scale-110 transition-transform">location_on</span>
                <span className="text-slate-400 text-sm leading-relaxed">Mayfair Luxury District,<br />London, W1J 7BR</span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-primary text-xl font-light group-hover:scale-110 transition-transform">call</span>
                <a href="tel:+18001234567" className="text-slate-400 text-sm hover:text-white transition-colors">+1 (800) WANDERLUX</a>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-primary text-xl font-light group-hover:scale-110 transition-transform">mail</span>
                <a href="mailto:concierge@wanderlux.com" className="text-slate-400 text-sm hover:text-white transition-colors">concierge@wanderlux.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs tracking-wide">
            &copy; 2026 Twende Africa Tours. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors" href="/privacy">Privacy</Link>
            <Link className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors" href="/terms">Terms</Link>
            <Link className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors" href="/tours">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
