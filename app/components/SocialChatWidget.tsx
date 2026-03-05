"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface SocialChannel {
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverBg: string;
  url: string;
  label: string;
}

const socialChannels: SocialChannel[] = [
  {
    name: 'WhatsApp',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: '#25D366',
    hoverBg: 'hover:bg-[#25D366]/15 hover:border-[#25D366]/40',
    url: 'https://wa.me/18005550199',
    label: 'Chat on WhatsApp',
  },
  {
    name: 'Instagram',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: '#E4405F',
    hoverBg: 'hover:bg-[#E4405F]/15 hover:border-[#E4405F]/40',
    url: 'https://ig.me/m/wanderlux',
    label: 'Message on Instagram',
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2]/15 hover:border-[#1877F2]/40',
    url: 'https://m.me/wanderlux',
    label: 'Chat on Messenger',
  },
  {
    name: 'X',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: '#ffffff',
    hoverBg: 'hover:bg-white/10 hover:border-white/30',
    url: 'https://twitter.com/intent/user?screen_name=wanderlux',
    label: 'DM on X',
  },
  {
    name: 'Telegram',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color: '#0088cc',
    hoverBg: 'hover:bg-[#0088cc]/15 hover:border-[#0088cc]/40',
    url: 'https://t.me/wanderlux',
    label: 'Chat on Telegram',
  },
];

export default function SocialChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Hide on admin pages and checkout
  if (pathname?.startsWith('/admin') || pathname === '/portal/checkout') {
    return null;
  }

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-4">
      {/* Expanded Panel */}
      {isOpen && (
        <div className="social-chat-panel w-[320px] sm:w-[340px] rounded-2xl border border-white/10 bg-[#141414]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Panel Header */}
          <div className="relative p-5 pb-4 border-b border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">Chat With Us</h3>
                <p className="text-slate-400 text-xs mt-0.5">Pick your preferred platform</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close chat menu"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Channel List */}
          <div className="p-3 space-y-1.5">
            {socialChannels.map((channel, index) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-chat-item flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent bg-white/[0.02] transition-all duration-300 group ${channel.hoverBg}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 border border-white/10 group-hover:border-transparent group-hover:scale-110"
                  style={{
                    backgroundColor: `${channel.color}15`,
                    color: channel.color,
                  }}
                >
                  {channel.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:translate-x-0.5 transition-transform duration-300">
                    {channel.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">{channel.label}</p>
                </div>
                <span className="material-symbols-outlined text-slate-600 text-[18px] group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  arrow_forward
                </span>
              </a>
            ))}
          </div>

          {/* Panel Footer */}
          <div className="px-5 py-3 border-t border-white/5">
            <p className="text-[10px] text-slate-600 text-center">
              Typically replies within 15 minutes
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 rounded-full shadow-xl transition-all duration-500 flex items-center justify-center ${
          isOpen
            ? 'bg-white/10 border border-white/20 shadow-none rotate-0'
            : 'bg-primary border border-primary/60 shadow-primary/30 hover:shadow-primary/50 hover:scale-110'
        }`}
        aria-label={isOpen ? 'Close chat menu' : 'Open chat menu'}
      >
        {/* Pulse ring — only when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full border-2 border-primary/40 social-chat-pulse pointer-events-none" />
        )}

        <span className={`material-symbols-outlined text-white text-[26px] transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>
    </div>
  );
}
