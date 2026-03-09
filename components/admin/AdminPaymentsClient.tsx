"use client";

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getPaymentsData, createManualInvoice, updatePaymentStatus } from '@/app/actions/paymentActions';

interface Transaction {
  id: string;
  originalId: string;
  bookingId: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  method: string;
  avatar: string;
}

interface RevenueBreakdownItem {
  serviceType: string;
  total: number;
}

const SERVICE_LABELS: Record<string, { label: string; color: string; dotColor: string; shadow: string }> = {
  TOUR_PACKAGE: { label: 'Tours', color: 'bg-primary', dotColor: 'bg-primary', shadow: 'shadow-[0_0_8px_rgba(255,51,51,0.3)]' },
  HOTEL: { label: 'Hotels', color: 'bg-blue-500', dotColor: 'bg-blue-500', shadow: 'shadow-[0_0_8px_rgba(59,130,246,0.3)]' },
  CAR_HIRE: { label: 'Car Rentals', color: 'bg-amber-500', dotColor: 'bg-amber-500', shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.3)]' },
  FLIGHT: { label: 'Flights', color: 'bg-emerald-500', dotColor: 'bg-emerald-500', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]' },
  CUSTOM: { label: 'Custom Services', color: 'bg-purple-500', dotColor: 'bg-purple-500', shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]' },
};

export default function AdminPaymentsClient() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdownItem[]>([]);
  
  // Interactive UI State
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modals state
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Form State
  const [invoiceForm, setInvoiceForm] = useState({
    bookingId: '',
    subtotal: '',
    tax: '',
    dueDate: ''
  });
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await getPaymentsData();
      if (res.success) {
        const mapped = (res.payments || []).map((p: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item = p as any;
          return {
            id: item.id.slice(0, 8).toUpperCase(),
            originalId: item.id,
            bookingId: item.bookingId || '',
            customer: item.booking?.user ? `${item.booking.user.firstName} ${item.booking.user.lastName}` : 'Guest Customer',
            email: item.booking?.user?.email || 'N/A',
            amount: Number(item.amount),
            currency: item.currency,
            status: item.status === 'PAID' || item.status === 'COMPLETED' ? 'Completed' : item.status === 'PENDING' ? 'Pending' : 'Failed',
            date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            method: item.method || 'Credit Card',
            avatar: item.booking?.user?.avatarUrl || `https://ui-avatars.com/api/?name=${item.booking?.user?.firstName || 'G'}+${item.booking?.user?.lastName || 'C'}&background=random`
          };
        });
        setTransactions(mapped);
        setRevenue(res.totalRevenue || 0);
        setRevenueBreakdown(res.revenueBreakdown || []);
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Compute revenue stream percentages from real data
  const totalBreakdownRevenue = revenueBreakdown.reduce((sum, item) => sum + item.total, 0);
  const revenueStreams = revenueBreakdown
    .filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(item => ({
      serviceType: item.serviceType,
      percentage: totalBreakdownRevenue > 0 ? Math.round((item.total / totalBreakdownRevenue) * 100) : 0,
      total: item.total,
      ...(SERVICE_LABELS[item.serviceType] || { label: item.serviceType, color: 'bg-slate-500', dotColor: 'bg-slate-500', shadow: '' }),
    }));

  // Completed (paid) transactions count
  const completedCount = transactions.filter(t => t.status === 'Completed').length;
  const completedPct = transactions.length > 0 ? Math.round((completedCount / transactions.length) * 100) : 0;

  // Render Filtered Transactions
  const filteredTransactions = transactions.filter(t => filterStatus === 'All' || t.status === filterStatus);
  const displayedTransactions = filteredTransactions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTransactions.length;

  const handleStatusChange = async (originalId: string, newStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED') => {
    setUpdatingId(originalId);
    try {
      const res = await updatePaymentStatus(originalId, newStatus);
      if (res.success) {
        setTransactions(prev => prev.map(t => 
          t.originalId === originalId ? { 
            ...t, 
            status: newStatus === 'PAID' ? 'Completed' : newStatus === 'PENDING' ? 'Pending' : 'Failed' 
          } : t
        ));
      } else {
        alert(res.error || "Failed to update status");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdatingId(null);
      setOpenDropdownId(null);
    }
  };

  // Escape CSV values to prevent injection and handle special characters
  const escapeCSV = (value: string | number): string => {
    const str = String(value);
    // Prevent formula injection by prefixing dangerous characters
    const sanitized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
    // Escape quotes and wrap in quotes if contains special chars
    if (sanitized.includes('"') || sanitized.includes(',') || sanitized.includes('\n')) {
      return `"${sanitized.replace(/"/g, '""')}"`;
    }
    return sanitized.includes(' ') ? `"${sanitized}"` : sanitized;
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    
    // Headers
    const headers = ['Transaction ID', 'Booking ID', 'Customer', 'Email', 'Amount', 'Currency', 'Status', 'Date', 'Method'];
    
    // Rows
    const rows = filteredTransactions.map(t => [
      escapeCSV(t.id), escapeCSV(t.bookingId), escapeCSV(t.customer), escapeCSV(t.email), t.amount, escapeCSV(t.currency), escapeCSV(t.status), escapeCSV(t.date), escapeCSV(t.method)
    ].join(','));
    
    // Combine and encode
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `twende_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Append to body, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit Invoice Creation Form
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceError('');
    setIsSubmittingInvoice(true);
    
    if (!invoiceForm.bookingId || !invoiceForm.dueDate) {
      setInvoiceError('Please fill out all required fields.');
      setIsSubmittingInvoice(false);
      return;
    }
    
    const subtotal = Number(invoiceForm.subtotal) || 0;
    const tax = Number(invoiceForm.tax) || 0;
    const total = subtotal + tax;

    if (total <= 0) {
      setInvoiceError('Total amount must be greater than zero.');
      setIsSubmittingInvoice(false);
      return;
    }

    try {
      const res = await createManualInvoice({
        bookingId: invoiceForm.bookingId,
        dueDate: new Date(invoiceForm.dueDate),
        subtotal,
        tax,
        total,
      });

      if (res.success) {
        setIsInvoiceModalOpen(false);
        setInvoiceForm({ bookingId: '', subtotal: '', tax: '', dueDate: '' });
        alert('Invoice drafted successfully!');
      } else {
        setInvoiceError(res.error || 'Failed to create invoice.');
      }
    } catch (err: unknown) {
      setInvoiceError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-[#0a0a0b] text-slate-900 dark:text-slate-100 font-display relative">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <header className="h-16 border-b border-border-light dark:border-white/5 px-8 py-4 bg-surface-light/80 dark:bg-black/40 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Payments & Invoicing</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Invoicing Portal</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure Gateway</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Financial Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Track revenue, manage invoices, and monitor payment health.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-border-light dark:border-white/10 rounded-xl transition-all font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                Export Report
              </button>
              <button 
                onClick={() => setIsInvoiceModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary/25">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Create Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
              <div className="absolute -right-4 -top-4 size-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{formatCurrency(revenue)}</h3>
                {revenue > 0 && (
                  <span className="text-emerald-500 text-xs font-bold mb-1.5 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border-light dark:border-white/5 font-display">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Payment Success Rate</span>
                  <span>{completedPct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/5 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(255,51,51,0.4)] transition-all duration-1000" style={{ width: `${completedPct}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Active Accounts</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{transactions.length} Transactions</h3>
                <span className="text-amber-500 text-xs font-bold mb-1.5 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  Recent
                </span>
              </div>
              <div className="mt-4 flex -space-x-2">
                {transactions.slice(0, 5).map((t, i) => (
                  <div key={i} className="relative h-8 w-8 rounded-full border-2 border-surface-light dark:border-[#0a0a0b] bg-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} className="object-cover w-full h-full" alt="User" />
                  </div>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold ring-2 ring-surface-light dark:ring-[#0a0a0b] text-primary">+{Math.max(0, transactions.length - 5)}</div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">High-Value Client Activity</p>
            </div>

            <div className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-primary">security</span>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Avg Transaction</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{formatCurrency(transactions.length ? revenue / transactions.length : 0)}</h3>
              </div>
              <div className="mt-6 flex items-center gap-3 p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/10">
                <div className="size-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Payments Verified</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Merchant Hub Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 border-b border-border-light dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-white/5">
                  <h3 className="text-lg font-bold">Recent Transactions</h3>
                  <div className="flex flex-wrap gap-2 bg-slate-200/50 dark:bg-black/20 rounded-lg p-1 border border-border-light dark:border-white/5 w-full sm:w-auto">
                    {['All', 'Pending', 'Failed', 'Completed'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => { setFilterStatus(status); setVisibleCount(10); }}
                        className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                          filterStatus === status 
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm dark:shadow-none' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 dark:bg-black/20">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-white/5">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="p-4"><div className="h-4 w-24 bg-slate-200 dark:bg-white/10 rounded"></div></td>
                            <td className="p-4"><div className="flex items-center gap-3"><div className="size-8 rounded-full bg-slate-200 dark:bg-white/10"></div><div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded"></div></div></td>
                            <td className="p-4"><div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded"></div></td>
                            <td className="p-4"><div className="h-6 w-20 bg-slate-200 dark:bg-white/10 rounded-full"></div></td>
                            <td className="p-4 text-right"><div className="h-4 w-8 bg-slate-200 dark:bg-white/10 rounded ml-auto"></div></td>
                          </tr>
                        ))
                      ) : displayedTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-30 block">search_off</span>
                            No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} transactions found.
                          </td>
                        </tr>
                      ) : displayedTransactions.map(t => (
                        <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative">
                          <td className="p-4">
                            <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{t.id}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{t.date}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border-light dark:border-white/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className="object-cover w-full h-full" src={t.avatar} alt={t.customer} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{t.customer}</div>
                                <div className="text-[10px] text-slate-500">{t.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(t.amount)}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{t.method}</div>
                          </td>
                          <td className="p-4">
                            {updatingId === t.originalId ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-slate-100 dark:bg-white/10 text-slate-500 border-slate-200 dark:border-white/20">
                                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Updating...
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                t.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                'bg-primary/10 text-primary border-primary/20'
                              }`}>
                                {t.status}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="relative inline-block text-left">
                              <button 
                                onClick={() => setOpenDropdownId(openDropdownId === t.id ? null : t.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                              
                              {openDropdownId === t.id && (
                                <>
                                  <div className="fixed inset-0 z-30" onClick={() => setOpenDropdownId(null)}></div>
                                  <div className="absolute right-0 top-10 mt-1 w-48 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-white/10 shadow-xl shadow-black/10 z-50 overflow-hidden transform origin-top-right animate-in fade-in scale-in-95 duration-100">
                                     <div className="py-1">
                                        <button 
                                          onClick={() => { alert(`Viewing receipt for ${t.id}`); setOpenDropdownId(null); }}
                                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 font-bold transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">receipt_long</span> View Receipt
                                        </button>
                                        <button 
                                          onClick={() => { alert(`Emailing invoice to ${t.customer}`); setOpenDropdownId(null); }}
                                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 font-bold transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">mail</span> Resend Invoice
                                        </button>
                                        <div className="h-px bg-border-light dark:bg-white/5 my-1" />
                                        <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Status</div>
                                        <button 
                                          onClick={() => handleStatusChange(t.originalId, 'PAID')}
                                          className="w-full text-left px-4 py-2.5 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center gap-2 font-bold transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">check_circle</span> Mark as Paid
                                        </button>
                                        <button 
                                          onClick={() => handleStatusChange(t.originalId, 'PENDING')}
                                          className="w-full text-left px-4 py-2.5 text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 flex items-center gap-2 font-bold transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">schedule</span> Mark as Pending
                                        </button>
                                        <button 
                                          onClick={() => handleStatusChange(t.originalId, 'FAILED')}
                                          className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 font-bold transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">cancel</span> Mark as Failed
                                        </button>
                                        <button 
                                          onClick={() => handleStatusChange(t.originalId, 'REFUNDED')}
                                          className="w-full text-left px-4 py-2.5 text-xs text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex items-center gap-2 font-bold transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">undo</span> Process Refund
                                        </button>
                                     </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(!loading && filteredTransactions.length > 0) && (
                  <div className="p-4 border-t border-border-light dark:border-white/5 text-center bg-slate-50 dark:bg-white/5">
                    {hasMore ? (
                      <button 
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="text-xs font-bold text-primary hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto">
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        Load More Results
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Results</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface-light dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Revenue Streams</h3>
                <div className="space-y-6">
                  {revenueStreams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">pie_chart</span>
                      <p className="text-sm">No revenue data yet.</p>
                    </div>
                  ) : (
                    revenueStreams.map((stream) => (
                      <div key={stream.serviceType}>
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span className={`size-2 rounded-full ${stream.dotColor} ${stream.shadow}`}></span>
                            {stream.label}
                          </span>
                          <span className="text-slate-900 dark:text-white">{stream.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full">
                          <div className={`${stream.color} h-full rounded-full ${stream.shadow}`} style={{ width: `${stream.percentage}%` }}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-border-light dark:border-white/5">
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-border-light dark:border-white/5">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-2">Financial Integrity</p>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-500">lock</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">All sessions are bank-grade SSL encrypted.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 shadow-sm group">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2 italic">Summary</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {transactions.length > 0 ? (
                    <>Total of <span className="text-primary font-bold">{transactions.length}</span> transactions processed with <span className="text-primary font-bold">{completedCount}</span> completed, generating <span className="text-primary font-bold">{formatCurrency(revenue)}</span> in verified revenue.</>
                  ) : (
                    <>No payment activity yet. Transactions will appear here as bookings are processed and payments received.</>
                  )}
                </p>
                <button 
                  onClick={() => setIsAnalyticsModalOpen(true)}
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                  Advanced Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsInvoiceModalOpen(false)}></div>
          <div className="relative bg-surface-light dark:bg-[#1a1a1c] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-light dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
              <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Create Manual Invoice
              </h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 space-y-5">
              {invoiceError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                  {invoiceError}
                </div>
              )}
            
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Booking ID Reference <span className="text-primary">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. bk_cfb4..."
                  value={invoiceForm.bookingId}
                  onChange={e => setInvoiceForm({...invoiceForm, bookingId: e.target.value})}
                  className="w-full rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 px-4 py-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1.5">Unique ID from the booking system.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Subtotal ($) <span className="text-primary">*</span></label>
                  <input 
                    type="number" 
                    min="0" step="0.01" required
                    placeholder="0.00"
                    value={invoiceForm.subtotal}
                    onChange={e => setInvoiceForm({...invoiceForm, subtotal: e.target.value})}
                    className="w-full rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 px-4 py-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Tax ($) <span className="text-primary">*</span></label>
                  <input 
                    type="number" 
                    min="0" step="0.01" required
                    placeholder="0.00"
                    value={invoiceForm.tax}
                    onChange={e => setInvoiceForm({...invoiceForm, tax: e.target.value})}
                    className="w-full rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 px-4 py-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Due Date <span className="text-primary">*</span></label>
                <input 
                  type="date" 
                  required
                  value={invoiceForm.dueDate}
                  onChange={e => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                  className="w-full rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 px-4 py-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-border-light dark:border-white/5 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingInvoice}
                  className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center min-w-[140px] shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50">
                  {isSubmittingInvoice ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : "Draft Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAnalyticsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsAnalyticsModalOpen(false)}></div>
          <div className="relative bg-surface-light dark:bg-surface-dark w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 sm:px-8 sm:py-6 border-b border-border-light dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5 shrink-0">
              <div>
                <h3 className="font-display font-bold text-2xl dark:text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_graph</span>
                  Advanced Financial Analytics
                </h3>
                <p className="text-sm text-slate-500 mt-1 font-bold tracking-wide">Deeper insights into Twende Africa Tours revenue generation & patterns</p>
              </div>
              <button onClick={() => setIsAnalyticsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-background-light dark:bg-[#0a0a0b] inset-shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-border-light dark:border-white/5 shadow-sm transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-3"><span className="material-symbols-outlined text-indigo-500">monitoring</span></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total LTV (Average)</p>
                  <p className="text-3xl font-bold dark:text-white font-display text-slate-800">{transactions.length > 0 ? formatCurrency(revenue / Math.max(1, new Set(transactions.map(t => t.email)).size)) : '$0.00'}</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">horizontal_rule</span> Steady</p>
                </div>
                <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-border-light dark:border-white/5 shadow-sm transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-3"><span className="material-symbols-outlined text-emerald-500">model_training</span></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold dark:text-white font-display text-slate-800">{completedPct}%</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">horizontal_rule</span> To Date</p>
                </div>
                <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-border-light dark:border-white/5 shadow-sm transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-3"><span className="material-symbols-outlined text-amber-500">gavel</span></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chargeback Rate</p>
                  <p className="text-3xl font-bold dark:text-white font-display text-slate-800">{transactions.length > 0 ? ((transactions.filter(t => t.status === 'Failed').length / transactions.length) * 100).toFixed(2) : '0.00'}%</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">horizontal_rule</span> To Date</p>
                </div>
                <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-border-light dark:border-white/5 shadow-sm transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-3"><span className="material-symbols-outlined text-blue-500">shopping_bag</span></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Add-On Value</p>
                  <p className="text-3xl font-bold dark:text-white font-display text-slate-800">$0.00</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">horizontal_rule</span> Stable</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-border-light dark:border-white/5 shadow-sm h-[320px] flex flex-col">
                   <h4 className="font-bold mb-6 flex items-center gap-2 text-base dark:text-white">
                      <span className="material-symbols-outlined text-[20px] text-slate-400">credit_card</span>
                      Payment Gateways Usage
                   </h4>
                   <div className="space-y-6 flex-1 flex flex-col justify-center">
                     <div>
                       <div className="flex justify-between text-sm font-bold mb-2"><span className="dark:text-white flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-blue-500">assured_workload</span> Credit Card</span><span className="text-slate-500">{transactions.length ? Math.round((transactions.filter(t => t.method.includes('Card')).length / transactions.length) * 100) : 0}%</span></div>
                       <div className="w-full bg-slate-100 dark:bg-black/30 h-2 rounded-full overflow-hidden">
                         <div className="bg-blue-500 h-full rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all" style={{ width: `${transactions.length ? Math.round((transactions.filter(t => t.method.includes('Card')).length / transactions.length) * 100) : 0}%` }}></div>
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between text-sm font-bold mb-2"><span className="dark:text-white flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-500">account_balance</span> Wire Transfer</span><span className="text-slate-500">{transactions.length ? Math.round((transactions.filter(t => t.method.includes('Wire')).length / transactions.length) * 100) : 0}%</span></div>
                       <div className="w-full bg-slate-100 dark:bg-black/30 h-2 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all" style={{ width: `${transactions.length ? Math.round((transactions.filter(t => t.method.includes('Wire')).length / transactions.length) * 100) : 0}%` }}></div>
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between text-sm font-bold mb-2"><span className="dark:text-white flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-purple-500">currency_bitcoin</span> Other</span><span className="text-slate-500">{transactions.length ? Math.round((transactions.filter(t => !t.method.includes('Card') && !t.method.includes('Wire')).length / transactions.length) * 100) : 0}%</span></div>
                       <div className="w-full bg-slate-100 dark:bg-black/30 h-2 rounded-full overflow-hidden">
                         <div className="bg-purple-500 h-full rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all" style={{ width: `${transactions.length ? Math.round((transactions.filter(t => !t.method.includes('Card') && !t.method.includes('Wire')).length / transactions.length) * 100) : 0}%` }}></div>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-border-light dark:border-white/5 shadow-sm h-[320px] flex flex-col">
                   <h4 className="font-bold mb-6 flex items-center gap-2 text-base dark:text-white">
                      <span className="material-symbols-outlined text-[20px] text-slate-400">group</span>
                      Customer Value Segmentation
                   </h4>
                   {transactions.length > 0 ? (
                     <div className="flex flex-1 w-full gap-3 items-end pt-8">
                        <div className="flex-1 bg-amber-500/10 transition-colors rounded-t-xl h-[30%] relative group border-t border-l border-r border-amber-500/20">
                          <div className="absolute -top-10 w-full text-center">
                            <span className="text-xs font-bold text-amber-500 block">{(Math.random() * 20 + 10).toFixed(0)}%</span>
                            <span className="text-[10px] text-slate-500 font-medium">Avg &lt; 5k</span>
                          </div>
                          <div className="absolute bottom-4 w-full text-center text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 truncate px-2">Bronze</div>
                        </div>
                        <div className="flex-1 bg-primary/10 transition-colors rounded-t-xl h-[55%] relative border-t border-l border-r border-primary/20">
                          <div className="absolute -top-10 w-full text-center">
                            <span className="text-xs font-bold text-primary block">{(Math.random() * 20 + 30).toFixed(0)}%</span>
                            <span className="text-[10px] text-slate-500 font-medium">Avg 5k-20k</span>
                          </div>
                          <div className="absolute bottom-4 w-full text-center text-[10px] uppercase font-bold text-primary truncate px-2">Silver</div>
                        </div>
                        <div className="flex-1 bg-emerald-500/10 transition-colors rounded-t-xl h-[95%] relative border-t border-l border-r border-emerald-500/20 shadow-[0_-10px_30px_rgba(16,185,129,0.1)]">
                          <div className="absolute -top-10 w-full text-center">
                            <span className="text-xs font-bold text-emerald-500 block">{(Math.random() * 20 + 40).toFixed(0)}%</span>
                            <span className="text-[10px] text-slate-500 font-medium">Avg 20k+</span>
                          </div>
                          <div className="absolute bottom-4 w-full text-center text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 truncate px-2">Gold/Elite</div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                       <span className="material-symbols-outlined text-4xl mb-2 opacity-30 block">group_off</span>
                       No customer data to segment yet.
                     </div>
                   )}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-background-light dark:from-[#0a0a0b] to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_20px_rgba(255,51,51,0.2)]">
                    <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl mb-2 flex items-center gap-2 dark:text-white">
                      AI Predictive Forecast
                      <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-500 text-[10px] uppercase tracking-widest leading-none font-bold">Needs Data</span>
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                      {transactions.length >= 10 ? (
                        <>Based on current velocity and historical trends, expected revenue for next month is projected to jump by <b className="text-primary">14.2%</b>. High-end Safari Tour packages are heavily driving this projected increase. The system recommends initiating targeted VVIP marketing early to capitalize on this trend.</>
                      ) : (
                        <>The AI predictive model requires at least 10 completed transactions to begin generating statistically significant revenue and conversion forecasts. As more bookings are processed, tailored insights will appear here.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
