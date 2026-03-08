"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminEvents } from '@/app/actions/eventActions';

export default function TicketsDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const result = await getAdminEvents();
        if (result.success && result.events) {
          setEvents(result.events);
          if (result.events.length > 0) {
            setSelectedEventId(result.events[0].id);
          }
        } else {
          console.error('Failed to load admin events:', result.error);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const calculateRevenue = () => {
    if (!selectedEvent) return 0;
    return selectedEvent.ticketTypes.reduce((total: number, type: any) => {
      return total + (type.basePrice * type.quantitySold);
    }, 0);
  };

  const handleExportTickets = () => {
    if (!selectedEvent) return;

    const headers = [
      'Attendee Name',
      'Email',
      'Ticket Type',
      'Price Paid',
      'Status',
      'QR Code',
      'Issued Date',
    ];

    // Simplified - in real app would iterate through actual tickets
    const rows = selectedEvent.ticketTypes.map((type: any) => [
      'Sample Attendee',
      'attendee@example.com',
      type.name,
      type.basePrice,
      'ISSUED',
      'QR-CODE-123',
      new Date().toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row: any[]) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-${selectedEvent.slug}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Ticket Sales Dashboard</h1>

        {/* Event Selector */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-semibold mb-3">Select Event</label>
          <select
            value={selectedEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <>
            {/* Revenue Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-green-400">
                  ${calculateRevenue().toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Tickets Sold</p>
                <p className="text-3xl font-bold">{selectedEvent.ticketsSold}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Capacity Used</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    (selectedEvent.ticketsSold / selectedEvent.totalCapacity) * 100
                  )}
                  %
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Remaining</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {selectedEvent.totalCapacity - selectedEvent.ticketsSold}
                </p>
              </div>
            </div>

            {/* Ticket Types Breakdown */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Ticket Types Breakdown</h2>
                <button
                  onClick={handleExportTickets}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                >
                  Export Tickets
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3">Ticket Type</th>
                      <th className="text-right px-4 py-3">Base Price</th>
                      <th className="text-right px-4 py-3">Sold</th>
                      <th className="text-right px-4 py-3">Available</th>
                      <th className="text-right px-4 py-3">Revenue</th>
                      <th className="text-right px-4 py-3">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {selectedEvent.ticketTypes.map((type: any) => {
                      const revenue = type.basePrice * type.quantitySold;
                      const totalRevenue = calculateRevenue();
                      const percentage =
                        totalRevenue > 0
                          ? ((revenue / totalRevenue) * 100).toFixed(1)
                          : '0';

                      return (
                        <tr key={type.id} className="hover:bg-gray-700">
                          <td className="px-4 py-3 font-semibold">{type.name}</td>
                          <td className="text-right px-4 py-3">
                            ${Number(type.basePrice).toFixed(2)}
                          </td>
                          <td className="text-right px-4 py-3">{type.quantitySold}</td>
                          <td className="text-right px-4 py-3">
                            {type.maxQuantity - type.quantitySold}
                          </td>
                          <td className="text-right px-4 py-3 text-green-400">
                            ${revenue.toFixed(2)}
                          </td>
                          <td className="text-right px-4 py-3">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Features */}
            <div className="grid grid-cols-2 gap-4">
              {/* Early Bird */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Early Bird Pricing</h3>
                <div className="space-y-3">
                  {selectedEvent.ticketTypes.filter((t: any) => t.earlyBirdPrice).length >
                  0 ? (
                    selectedEvent.ticketTypes
                      .filter((t: any) => t.earlyBirdPrice)
                      .map((type: any) => (
                        <div
                          key={type.id}
                          className="flex justify-between bg-gray-700 p-3 rounded"
                        >
                          <span>{type.name}</span>
                          <span className="text-blue-400">
                            ${Number(type.earlyBirdPrice).toFixed(2)} until{' '}
                            {new Date(type.earlyBirdEndDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-400">No early bird pricing configured</p>
                  )}
                </div>
              </div>

              {/* Capacity Chart */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Capacity Utilization</h3>
                <div className="space-y-4">
                  {selectedEvent.ticketTypes.map((type: any) => {
                    const used =
                      (type.quantitySold / type.maxQuantity) * 100;

                    return (
                      <div key={type.id}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{type.name}</span>
                          <span className="text-gray-400">
                            {type.quantitySold} / {type.maxQuantity}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-red-500"
                            style={{ width: `${Math.min(used, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
