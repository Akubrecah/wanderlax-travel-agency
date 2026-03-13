"use client";

import React, { createContext, useContext, useState } from 'react';

interface SupplierSidebarContextType {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

const SupplierSidebarContext = createContext<SupplierSidebarContextType | undefined>(undefined);

export function SupplierSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => setIsMobileOpen(prev => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <SupplierSidebarContext.Provider value={{ isMobileOpen, toggleMobileSidebar, closeMobileSidebar }}>
      {children}
    </SupplierSidebarContext.Provider>
  );
}

export function useSupplierSidebar() {
  const context = useContext(SupplierSidebarContext);
  if (context === undefined) {
    throw new Error('useSupplierSidebar must be used within a SupplierSidebarProvider');
  }
  return context;
}
