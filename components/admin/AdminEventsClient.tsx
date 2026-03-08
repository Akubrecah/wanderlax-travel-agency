"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  publishEvent,
  cancelEvent,
  deleteEvent,
} from '@/app/actions/eventActions';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { toast } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  startDate: Date | string;
  endDate: Date | string;
  category: string;
  status: string;
  totalCapacity: number;
  organizer?: string | null;
  images: string[];
  createdAt: Date | string;
  ticketsSold: number;
  ticketTypes: Array<{ 
    id: string; 
    name: string; 
    basePrice: number;
    quantitySold: number;
    maxQuantity: number;
  }>;
}

export function AdminEventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  const handlePublish = async (id: string) => {
    setLoading(true);
    try {
      const result = await publishEvent(id);
      if (result.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: 'PUBLISHED' } : e))
        );
        toast.success('Event published successfully');
      } else {
        toast.error(result.error || 'Failed to publish event');
      }
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error('Error publishing event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    setLoading(true);
    try {
      const result = await cancelEvent(id);
      if (result.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: 'CANCELLED' } : e))
        );
        toast.success('Event cancelled');
      } else {
        toast.error(result.error || 'Failed to cancel event');
      }
    } catch (error) {
      console.error('Error cancelling event:', error);
      toast.error('Error cancelling event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const result = await deleteEvent(id);
      if (result.success) {
        setEvents(events.filter(e => e.id !== id));
        setSelectedEventId(null);
        setShowDeleteConfirm(null);
        toast.success('Event deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error deleting event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#180a0a]">
      <AdminHeader
        title="Event Management"
        description="Oversee and manage your ticketed events."
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/events/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-bold text-sm shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Event
          </Link>
        </div>
      </AdminHeader>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-dark p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm font-medium">Total Events</span>
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">event</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{events.length}</h3>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm font-medium">Active</span>
              <span className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <span className="material-symbols-outlined">check_circle</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {events.filter(e => ['PUBLISHED', 'UPCOMING', 'ONGOING'].includes(e.status)).length}
            </h3>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm font-medium">Drafts</span>
              <span className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <span className="material-symbols-outlined">edit_note</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {events.filter(e => e.status === 'DRAFT').length}
            </h3>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm font-medium">Tickets Sold</span>
              <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <span className="material-symbols-outlined">local_activity</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {events.reduce((acc, e) => acc + (e.ticketsSold || 0), 0)}
            </h3>
          </div>
        </div>

        {/* Filters & Content */}
        <div className="bg-surface-dark rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
          <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20">
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                placeholder="Search events or destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'PUBLISHED', 'UPCOMING', 'ONGOING', 'DRAFT', 'CANCELLED'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === s
                    ? 'bg-primary text-white'
                    : 'bg-background-dark text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-bold">Event & Organizer</th>
                  <th className="px-6 py-4 font-bold">Location & Category</th>
                  <th className="px-6 py-4 font-bold">Date & Time</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-30 block">event_busy</span>
                      No events found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => {
                    const statusClass = {
                      PUBLISHED: 'bg-green-500/10 text-green-500 border-green-500/20',
                      UPCOMING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                      ONGOING: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                      COMPLETED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                      DRAFT: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                      CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
                    }[event.status as string] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';

                    return (
                      <tr 
                        key={event.id} 
                        className={`hover:bg-white/5 transition-colors group cursor-pointer ${selectedEventId === event.id ? 'bg-primary/5' : ''}`} 
                        onClick={() => setSelectedEventId(event.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="size-12 rounded-lg bg-background-dark bg-cover bg-center border border-white/10 shadow-lg" 
                              style={{ backgroundImage: `url('${event.images?.[0] || 'https://via.placeholder.com/150'}')` }}
                            ></div>
                            <div>
                              <p className="text-white font-bold group-hover:text-primary transition-colors">{event.title}</p>
                              <p className="text-xs text-slate-500">{event.organizer || 'Internal Team'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                            {event.destination}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-[14px]">category</span>
                            {event.category}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-white font-medium">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusClass}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/admin/events/${event.id}`}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </Link>
                            {event.status === 'DRAFT' && (
                              <button
                                onClick={() => handlePublish(event.id)}
                                className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                title="Publish"
                              >
                                <span className="material-symbols-outlined text-[20px]">publish</span>
                              </button>
                            )}
                            {event.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleCancel(event.id)}
                                className="p-1.5 text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                                title="Cancel"
                              >
                                <span className="material-symbols-outlined text-[20px]">block</span>
                              </button>
                            )}
                            <button
                              onClick={() => setShowDeleteConfirm(event.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Panel - Shows when event is selected */}
        {selectedEvent && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 bg-surface-dark rounded-xl border border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div 
                  className="size-20 rounded-xl bg-cover bg-center border-2 border-primary/20" 
                  style={{ backgroundImage: `url('${selectedEvent.images?.[0]}')` }}
                ></div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedEvent.title}</h2>
                  <div className="flex gap-3 text-xs">
                    <span className="text-slate-400">ID: {selectedEvent.id}</span>
                    <span className="text-slate-400">Slug: {selectedEvent.slug}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedEventId(null)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Sales Overview</h4>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-sm text-slate-400">Total Capacity</span>
                  <span className="text-sm font-bold text-white">{selectedEvent.totalCapacity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-sm text-slate-400">Tickets Sold</span>
                  <span className="text-sm font-bold text-white">{selectedEvent.ticketsSold || 0}</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Availability</span>
                    <span>{Math.round(((selectedEvent.ticketsSold || 0) / (selectedEvent.totalCapacity || 1)) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, ((selectedEvent.ticketsSold || 0) / (selectedEvent.totalCapacity || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Ticket Tiers</h4>
                <div className="space-y-2">
                  {selectedEvent.ticketTypes?.map((tt) => (
                    <div key={tt.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{tt.name}</p>
                        <p className="text-[10px] text-slate-500">{tt.quantitySold}/{tt.maxQuantity} Sold</p>
                      </div>
                      <span className="text-sm font-bold text-primary">${Number(tt.basePrice).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/admin/events/${selectedEvent.id}`}
                    className="flex flex-col items-center justify-center p-4 bg-background-dark rounded-xl border border-white/5 hover:border-primary/50 transition-all text-slate-400 hover:text-white"
                  >
                    <span className="material-symbols-outlined mb-1 text-primary">edit_square</span>
                    <span className="text-[10px] font-bold">Edit Details</span>
                  </Link>
                  <Link
                    href={`/events/${selectedEvent.slug}`}
                    target="_blank"
                    className="flex flex-col items-center justify-center p-4 bg-background-dark rounded-xl border border-white/5 hover:border-primary/50 transition-all text-slate-400 hover:text-white"
                  >
                    <span className="material-symbols-outlined mb-1 text-primary">visibility</span>
                    <span className="text-[10px] font-bold">Public View</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">delete_forever</span>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Event?</h3>
            <p className="text-slate-400 text-center mb-8 text-sm">
              This action cannot be undone. You can only delete events with no active ticket sales.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
