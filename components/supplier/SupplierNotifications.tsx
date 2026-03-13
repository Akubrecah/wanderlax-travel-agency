"use client";

import React, { useState } from 'react';

export function SupplierNotifications() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark transition-colors"
      >
        <span className="material-symbols-outlined">notifications</span>
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full ring-2 ring-surface-dark flex items-center justify-center">
          <span className="text-[10px] font-bold text-white leading-none">3</span>
        </span>
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-dark border border-border-dark rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-border-dark flex justify-between items-center bg-background-dark/50">
            <h3 className="text-white font-bold text-sm">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-border-dark hover:bg-white/5 cursor-pointer">
              <p className="text-sm text-white font-medium">New booking request for Mara Serena</p>
              <p className="text-xs text-slate-400 mt-1">10 minutes ago</p>
            </div>
            <div className="p-4 border-b border-border-dark hover:bg-white/5 cursor-pointer">
              <p className="text-sm text-white font-medium">Payout of $2,450 processed</p>
              <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
            </div>
            <div className="p-4 hover:bg-white/5 cursor-pointer">
              <p className="text-sm text-white font-medium">New 5-star review received!</p>
              <p className="text-xs text-slate-400 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
