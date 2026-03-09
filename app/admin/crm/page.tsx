"use client";


import React, { useState, useMemo, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getCRMCustomers, updateCRMCustomer, deleteCRMCustomer, Customer } from '@/app/actions/crmActions';

// ─── Types & Derived Imports ──────────────────────────────────────────────────

type CustomerStatus = 'VIP' | 'Active' | 'Lead' | 'Inactive';

// Helper style maps remains below


// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<CustomerStatus, string> = {
  VIP: 'bg-primary/20 text-primary',
  Active: 'bg-blue-500/20 text-blue-400',
  Lead: 'bg-yellow-500/20 text-yellow-400',
  Inactive: 'bg-slate-500/20 text-slate-400',
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  Upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

// ─── Add / Edit Customer Modal ─────────────────────────────────────────────────

interface CustomerFormProps {
  title: string;
  initial?: Partial<Customer>;
  onClose: () => void;
  onSave: (data: Partial<Customer>) => void;
}

function CustomerFormModal({ title, initial = {}, onClose, onSave }: CustomerFormProps) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    email: initial.email ?? '',
    phone: initial.phone ?? '',
    location: initial.location ?? '',
    birthday: initial.birthday ?? '',
    status: (initial.status ?? 'Lead') as CustomerStatus,
    notes: initial.notes ?? '',
  });

  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const inputCls = "w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-surface-dark border border-border-dark rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Full Name</label>
              <input className={inputCls} value={form.name} onChange={handle('name')} placeholder="e.g. Alice Vanderbilt" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Email</label>
              <input className={inputCls} type="email" value={form.email} onChange={handle('email')} placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Phone</label>
              <input className={inputCls} value={form.phone} onChange={handle('phone')} placeholder="+1 212-555-0100" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Location</label>
              <input className={inputCls} value={form.location} onChange={handle('location')} placeholder="City, Country" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Birthday</label>
              <input className={inputCls} value={form.birthday} onChange={handle('birthday')} placeholder="Jan 01, 1990" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Status</label>
              <select className={inputCls} value={form.status} onChange={handle('status')}>
                <option value="VIP">VIP</option>
                <option value="Active">Active</option>
                <option value="Lead">Lead</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Notes</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.notes} onChange={handle('notes')} placeholder="Internal notes about this client..." />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-dark">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-white border border-border-dark hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Email Modal ───────────────────────────────────────────────────────────────

function EmailModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const inputCls = "w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all";

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-surface-dark border border-border-dark rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
          <h2 className="text-lg font-bold text-white">Send Email</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">To</label>
            <input className={inputCls} readOnly value={customer.email} />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Subject</label>
            <input className={inputCls} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject..." />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">Message</label>
            <textarea className={`${inputCls} resize-none`} rows={5} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message..." />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-dark">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-white border border-border-dark hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sent}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            {sent ? (
              <><span className="material-symbols-outlined text-[18px]">check_circle</span> Sent!</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">send</span> Send Email</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ───────────────────────────────────────────────────────

function DeleteConfirmModal({ customer, onClose, onConfirm }: { customer: Customer; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-surface-dark border border-border-dark rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-400">delete_forever</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Delete Customer?</h3>
        <p className="text-sm text-text-muted mb-6">Are you sure you want to remove <span className="text-white font-medium">{customer.name}</span> from your CRM? This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm text-text-muted hover:text-white border border-border-dark hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type FilterTab = 'All Clients' | 'VIP' | 'Active' | 'Lead' | 'Inactive';
const FILTER_TABS: FilterTab[] = ['All Clients', 'VIP', 'Active', 'Lead', 'Inactive'];

export default function TwendeAdminCustomerCrmPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All Clients');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCRMCustomers().then(data => {
      setCustomers(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setIsLoading(false);
    });
  }, []);

  // Modals
  const [showEdit, setShowEdit] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedId)!;

  // ── Filtered list ──
  const filtered = useMemo(() => {
    let list = customers;
    if (activeFilter !== 'All Clients') list = list.filter(c => c.status === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
    }
    return list;
  }, [customers, activeFilter, search]);

  // ── Handlers ──

  const handleEdit = async (data: Partial<Customer>) => {
    if (!selectedId) return;
    const res = await updateCRMCustomer(selectedId, data);
    if (res.success) {
      const updated = await getCRMCustomers();
      setCustomers(updated);
      setShowEdit(false);
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const res = await deleteCRMCustomer(selectedId);
    if (res.success) {
      const updated = await getCRMCustomers();
      setCustomers(updated);
      setSelectedId(updated[0]?.id || '');
      setShowDelete(false);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="stitch-screen h-screen overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
          {/* Header */}
          <AdminHeader title="Customer Management" description="Manage high-net-worth clients and interactions">
          </AdminHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-12 gap-6 h-full min-h-[800px]">

              {/* ── Left Column: Search & List ── */}
              <div className="col-span-12 xl:col-span-4 flex flex-col gap-4 h-full">

                {/* Search */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">search</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border-none rounded-lg leading-5 bg-surface-dark text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 sm:text-sm shadow-sm transition-all"
                    placeholder="Search clients..."
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {FILTER_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${
                        activeFilter === tab
                          ? 'bg-primary/20 text-primary border-primary/20'
                          : 'bg-surface-dark hover:bg-border-dark text-text-muted border-transparent'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Customer List */}
                <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden flex flex-col flex-1">
                  <div className="overflow-y-auto flex-1">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-sm text-text-muted">Loading clients...</p>
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                        <span className="material-symbols-outlined text-text-muted text-4xl mb-2">person_search</span>
                        <p className="text-sm text-text-muted">No clients match your search.</p>
                      </div>
                    ) : (
                      filtered.map(customer => {
                        const isActive = customer.id === selectedId;
                        return (
                          <div
                            key={customer.id}
                            onClick={() => setSelectedId(customer.id)}
                            className={`p-4 border-b border-border-dark hover:bg-white/5 cursor-pointer transition-colors border-l-2 ${
                              isActive ? 'bg-white/5 border-l-primary' : 'border-l-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div
                                  className="h-10 w-10 rounded-full bg-cover bg-center"
                                  style={{ backgroundImage: `url('${customer.avatar}')` }}
                                />
                                {customer.isOnline && (
                                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-surface-dark" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className={`text-sm truncate ${isActive ? 'font-bold text-white' : 'font-medium text-white'}`}>{customer.name}</h4>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ml-2 ${STATUS_STYLES[customer.status]}`}>{customer.status}</span>
                                </div>
                                <p className="text-xs text-text-muted truncate">{customer.email}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                {fmt(customer.totalSpent)}
                              </span>
                              <span>Last active: {customer.lastActive}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {/* List footer */}
                  <div className="p-3 border-t border-border-dark text-xs text-text-muted text-center">
                    {filtered.length} of {customers.length} clients
                  </div>
                </div>
              </div>

              {/* ── Right Column: Detail View ── */}
              {selectedCustomer ? (
                <div className="col-span-12 xl:col-span-8 h-full flex flex-col gap-6 overflow-y-auto pr-2">

                  {/* Profile Header */}
                  <div className="bg-surface-dark rounded-xl border border-border-dark p-6 relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none rounded-xl" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-5">
                      {/* Avatar with online dot */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="h-24 w-24 rounded-xl bg-cover bg-center shadow-xl ring-4 ring-surface-dark"
                          style={{ backgroundImage: `url('${selectedCustomer.avatar}')` }}
                        />
                        <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center bg-surface-dark">
                          <div className={`h-3.5 w-3.5 rounded-full border-2 border-surface-dark ${selectedCustomer.isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        </div>
                      </div>

                      {/* Info block */}
                      <div className="flex-1 min-w-0">
                        {/* Name row */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{selectedCustomer.name}</h2>
                          {selectedCustomer.status === 'VIP' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                              VIP Platinum
                            </span>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${STATUS_STYLES[selectedCustomer.status]}`}>
                              {selectedCustomer.status}
                            </span>
                          )}
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted mb-4">
                          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span>{selectedCustomer.location}</span>
                          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">cake</span>{selectedCustomer.birthday}</span>
                          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">call</span>{selectedCustomer.phone}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          <button
                            onClick={() => setShowEdit(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            Edit
                          </button>
                          <button
                            onClick={() => setShowEmail(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20"
                          >
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                            Email
                          </button>
                          <button
                            onClick={() => setShowDelete(true)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20"
                            title="Delete customer"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-background-dark border border-border-dark">
                            <p className="text-xs text-text-muted mb-1">Total Spent</p>
                            <p className="text-base sm:text-lg font-bold text-white">{fmt(selectedCustomer.totalSpent)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-background-dark border border-border-dark">
                            <p className="text-xs text-text-muted mb-1">Bookings</p>
                            <p className="text-base sm:text-lg font-bold text-white">{selectedCustomer.bookingsCount}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-background-dark border border-border-dark">
                            <p className="text-xs text-text-muted mb-1">Avg. Stay</p>
                            <p className="text-base sm:text-lg font-bold text-white">{selectedCustomer.avgStay > 0 ? `${selectedCustomer.avgStay}N` : '—'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats & Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preferences */}
                    <div className="bg-surface-dark rounded-xl border border-border-dark p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Travel Preferences</h3>
                        <span className="material-symbols-outlined text-text-muted">tune</span>
                      </div>
                      {selectedCustomer.preferences.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.preferences.map(pref => (
                            <span key={pref} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-text-muted border border-border-dark">
                              {pref}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-text-muted italic">No preferences recorded.</p>
                      )}
                      <div className="mt-6">
                        <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Notes</p>
                        <p className="text-sm text-white leading-relaxed">
                          {selectedCustomer.notes || 'No notes yet.'}
                        </p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-surface-dark rounded-xl border border-border-dark p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[220px]">
                        {selectedCustomer.recentActivity.length > 0 ? (
                          selectedCustomer.recentActivity.map((item, i) => (
                            <div key={i} className="flex gap-3">
                              <div className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full ${item.color}`} />
                              <div>
                                <p className="text-sm text-white font-medium">{item.title}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-text-muted italic">No recent activity.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking History */}
                  <div className="bg-surface-dark rounded-xl border border-border-dark p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Booking History</h3>
                      <span className="text-xs text-text-muted">{selectedCustomer.bookingHistory.length} bookings</span>
                    </div>
                    {selectedCustomer.bookingHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-border-dark">
                              <th className="pb-3 pl-2 font-medium">Destination</th>
                              <th className="pb-3 font-medium">Dates</th>
                              <th className="pb-3 font-medium">Type</th>
                              <th className="pb-3 font-medium">Status</th>
                              <th className="pb-3 font-medium text-right pr-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {selectedCustomer.bookingHistory.map((booking, i) => (
                              <tr key={i} className="border-b border-border-dark last:border-0 hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-2">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-14 rounded bg-cover bg-center" style={{ backgroundImage: `url('${booking.image}')` }} />
                                    <div>
                                      <p className="font-bold text-white">{booking.destination}</p>
                                      <p className="text-xs text-text-muted">{booking.hotel}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 text-text-muted">{booking.dates}</td>
                                <td className="py-4 text-text-muted">{booking.type}</td>
                                <td className="py-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${BOOKING_STATUS_STYLES[booking.status]}`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="py-4 text-right pr-2 font-medium text-white">{fmt(booking.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <span className="material-symbols-outlined text-text-muted text-4xl mb-2">flight_takeoff</span>
                        <p className="text-sm text-text-muted">No bookings yet for this client.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="col-span-12 xl:col-span-8 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-text-muted text-6xl mb-4 block">person_search</span>
                    <p className="text-text-muted">Select a client to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {showEdit && selectedCustomer && (
        <CustomerFormModal
          title="Edit Customer"
          initial={selectedCustomer}
          onClose={() => setShowEdit(false)}
          onSave={handleEdit}
        />
      )}
      {showEmail && selectedCustomer && (
        <EmailModal
          customer={selectedCustomer}
          onClose={() => setShowEmail(false)}
        />
      )}
      {showDelete && selectedCustomer && (
        <DeleteConfirmModal
          customer={selectedCustomer}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
