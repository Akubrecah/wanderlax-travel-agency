import React from 'react';
import Link from 'next/link';
import { useSupplierSidebar } from './SupplierSidebarContext';

interface SupplierHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function SupplierHeader({ title, description, children }: SupplierHeaderProps) {
  const { toggleMobileSidebar } = useSupplierSidebar();

  return (
    <header className="h-16 sm:h-20 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white transition-colors border border-white/10"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="size-2 rounded-full bg-primary animate-pulse shrink-0"></div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{title}</h1>
          </div>
          {description && (
            <p className="text-slate-500 text-[10px] sm:text-xs font-medium tracking-wide uppercase opacity-70 truncate hidden md:block">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-5 min-w-0">
        <div className="flex items-center gap-3">
          {children}
        </div>
        
        <Link 
          href="/portal/profile"
          className="group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:rotate-12 transition-transform">auto_awesome_motion</span>
          <span className="hidden sm:inline">Portal</span>
        </Link>
        <div className="h-8 w-px bg-white/10 hidden sm:block shrink-0" />
      </div>
    </header>
  );
}
