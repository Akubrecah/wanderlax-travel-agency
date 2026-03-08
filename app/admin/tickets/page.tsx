"use client";

import React, { useState, useEffect } from 'react';
import { getAllEventTickets, markTicketUsed, cancelTicket } from '@/app/actions/eventBookingActions';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const { success, tickets: fetchedTickets } = await getAllEventTickets();
      if (success && fetchedTickets) {
        setTickets(fetchedTickets);
      }
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const handleMarkUsed = async (ticketId: string) => {
    const { success } = await markTicketUsed(ticketId);
    if (success) {
      // Optimistic update
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'USED' } : t));
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    const { success } = await cancelTicket(ticketId);
    if (success) {
      // Optimistic update
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'CANCELLED' } : t));
    }
  };

  if (loading) return <div className="p-8 text-white text-center">Loading tickets...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sold Tickets</h1>
          <p className="text-slate-400">Manage attendee tickets and scan entry statuses.</p>
        </div>
      </div>

      <div className="bg-surface-dark border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 uppercase text-xs tracking-wider text-slate-400">
                <th className="p-4 font-medium">Ticket ID</th>
                <th className="p-4 font-medium">Event</th>
                <th className="p-4 font-medium">Attendee</th>
                <th className="p-4 font-medium">Purchaser</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {tickets.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-mono font-medium text-white">{ticket.id.substring(0, 8).toUpperCase()}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{ticket.event?.title || 'Unknown Event'}</p>
                    {ticket.event?.startDate && (
                      <p className="text-xs text-slate-500">{new Date(ticket.event.startDate).toLocaleDateString()}</p>
                    )}
                  </td>
                  <td className="p-4 text-white">
                    {ticket.attendeeName || 'Not Specified'}
                  </td>
                  <td className="p-4">
                    <p>{ticket.user?.email || 'Unknown'}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                      ticket.status === 'AVAILABLE' || ticket.status === 'VALID' || ticket.status === 'ISSUED' ? 'bg-green-500/20 text-green-400' :
                      ticket.status === 'USED' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(ticket.status === 'AVAILABLE' || ticket.status === 'VALID' || ticket.status === 'ISSUED') && (
                        <>
                          <button 
                            onClick={() => handleMarkUsed(ticket.id)}
                            className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded text-xs font-bold border border-green-500/20 transition-colors"
                          >
                           Mark Used
                          </button>
                          <button 
                            onClick={() => handleCancelTicket(ticket.id)}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-xs font-bold border border-red-500/20 transition-colors"
                          >
                           Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No tickets sold yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
