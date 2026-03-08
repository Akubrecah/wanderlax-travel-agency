"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEvent, getEventById, updateEvent } from '@/app/actions/eventActions';
import { toast } from 'react-hot-toast';

interface TicketType {
  name: string;
  basePrice: number;
  maxQuantity: number;
  earlyBirdEndDate?: string;
  earlyBirdPrice?: number;
  surgeThreshold?: number;
  surgeMultiplier?: number;
}

interface SeatingZone {
  sectionName: string;
  capacity: number;
  priceModifier?: number;
}

interface RefundPolicy {
  cancellationDeadlineDays: number;
  refundPercentageBeforeDeadline: number;
  refundPercentageAfterDeadline: number;
  refundPercentageAfterEvent: number;
}

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  category: "CONFERENCE" | "CONCERT" | "EXPERIENCE" | "WORKSHOP" | "OTHER";
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  totalCapacity: number;
  organizer: string | null;
  images: string[];
  highlights: string[];
  ticketTypes: TicketType[];
  seatingZones: SeatingZone[];
  refundPolicy: RefundPolicy | null;
}

interface EventResponse {
  success: boolean;
  event?: EventDetail;
  error?: string;
}

interface EventPayload extends Omit<EventDetail, 'id' | 'startDate' | 'endDate' | 'ticketTypes'> {
  startDate: Date;
  endDate: Date;
  ticketTypes: Array<Omit<TicketType, 'earlyBirdEndDate'> & { earlyBirdEndDate?: Date }>;
}

export default function EventForm({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const isEditing = !!eventId;
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    destination: '',
    category: 'OTHER' as "CONFERENCE" | "CONCERT" | "EXPERIENCE" | "WORKSHOP" | "OTHER",
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    totalCapacity: 0,
    organizer: '',
    images: [''],
    highlights: [''],
    ticketTypes: [] as TicketType[],
    seatingZones: [] as SeatingZone[],
    refundPolicy: {
      cancellationDeadlineDays: 7,
      refundPercentageBeforeDeadline: 100,
      refundPercentageAfterDeadline: 50,
      refundPercentageAfterEvent: 0,
    } as RefundPolicy
  });

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const result = await getEventById(eventId as string) as EventResponse;
          if (result.success && result.event) {
            const event = result.event;
            setFormData({
              title: event.title || '',
              slug: event.slug || '',
              description: event.description || '',
              destination: event.destination || '',
              category: event.category || 'OTHER',
              status: event.status || 'DRAFT',
              startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
              endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
              totalCapacity: event.totalCapacity || 0,
              organizer: event.organizer || '',
              images: event.images?.length ? event.images : [''],
              highlights: event.highlights?.length ? event.highlights : [''],
              ticketTypes: event.ticketTypes?.map((tt) => ({
                name: tt.name,
                basePrice: Number(tt.basePrice),
                maxQuantity: tt.maxQuantity,
                earlyBirdEndDate: tt.earlyBirdEndDate ? new Date(tt.earlyBirdEndDate).toISOString().slice(0, 16) : undefined,
                earlyBirdPrice: tt.earlyBirdPrice ? Number(tt.earlyBirdPrice) : undefined,
                surgeThreshold: tt.surgeThreshold || undefined,
                surgeMultiplier: tt.surgeMultiplier ? Number(tt.surgeMultiplier) : undefined,
              })) || [],
              seatingZones: event.seatingZones?.map((sz) => ({
                sectionName: sz.sectionName,
                capacity: sz.capacity,
                priceModifier: sz.priceModifier ? Number(sz.priceModifier) : undefined,
              })) || [],
              refundPolicy: event.refundPolicy ? {
                cancellationDeadlineDays: event.refundPolicy.cancellationDeadlineDays,
                refundPercentageBeforeDeadline: event.refundPolicy.refundPercentageBeforeDeadline,
                refundPercentageAfterDeadline: event.refundPolicy.refundPercentageAfterDeadline,
                refundPercentageAfterEvent: event.refundPolicy.refundPercentageAfterEvent,
              } : {
                cancellationDeadlineDays: 7,
                refundPercentageBeforeDeadline: 100,
                refundPercentageAfterDeadline: 50,
                refundPercentageAfterEvent: 0,
              }
            });
          } else {
            setError('Failed to load event details.');
          }
        } catch (err) {
          console.error(err);
          setError('An error occurred while loading the event.');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'title' && !isEditing && !formData.slug) {
       const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
       setFormData(prev => ({ ...prev, title: value, slug }));
       return;
    }
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number | undefined) => {
    const newTypes = [...formData.ticketTypes];
    newTypes[index] = { ...newTypes[index], [field]: value };
    setFormData(prev => ({ ...prev, ticketTypes: newTypes }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', basePrice: 0, maxQuantity: 0 }]
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const handleSeatingZoneChange = (index: number, field: keyof SeatingZone, value: string | number | undefined) => {
    const newZones = [...formData.seatingZones];
    newZones[index] = { ...newZones[index], [field]: value };
    setFormData(prev => ({ ...prev, seatingZones: newZones }));
  };

  const addSeatingZone = () => {
    setFormData(prev => ({
      ...prev,
      seatingZones: [...prev.seatingZones, { sectionName: '', capacity: 0, priceModifier: 1.0 }]
    }));
  };

  const removeSeatingZone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seatingZones: prev.seatingZones.filter((_, i) => i !== index)
    }));
  };

  const handleRefundPolicyChange = (field: keyof RefundPolicy, value: number) => {
    setFormData(prev => ({
      ...prev,
      refundPolicy: { ...prev.refundPolicy, [field]: value }
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlightField = () => {
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlightField = (index: number) => {
    setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate
    if (formData.ticketTypes.length === 0) {
      setError('At least one ticket type is required.');
      setSubmitting(false);
      return;
    }

    const payload: EventPayload = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      images: formData.images.filter(img => img.trim() !== ''),
      highlights: formData.highlights.filter(h => h.trim() !== ''),
      ticketTypes: formData.ticketTypes.map(tt => ({
        ...tt,
        earlyBirdEndDate: tt.earlyBirdEndDate ? new Date(tt.earlyBirdEndDate) : undefined,
      })),
    };

    try {
      const action = isEditing ? updateEvent.bind(null, eventId as string) : createEvent;
      const result = await (action as (data: EventPayload) => Promise<EventResponse>)(payload);

      if (result.success) {
        toast.success(isEditing ? 'Event updated!' : 'Event created!');
        router.push('/admin/events');
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()} 
          className="size-10 flex items-center justify-center bg-surface-dark border border-white/10 rounded-full text-slate-400 hover:text-white hover:border-primary transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isEditing ? 'Update Event' : 'Create New Event'}
          </h1>
          <p className="text-slate-400 text-sm">Configure your event, ticket tiers, and seating plans.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined">error</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                General Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Wanderlax Summer Music Festival"
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL Slug</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-slate-400 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="CONCERT">Concert</option>
                      <option value="EXPERIENCE">Experience</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="CONFERENCE">Conference</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about the event..."
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      required
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">confirmation_number</span>
                  Ticket Tiers
                </h2>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Tier
                </button>
              </div>

              <div className="space-y-4">
                {formData.ticketTypes.map((tt, index) => (
                  <div key={index} className="bg-background-dark/30 border border-white/5 rounded-xl p-4 space-y-4 relative group">
                    <button 
                      type="button" 
                      onClick={() => removeTicketType(index)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tier Name</label>
                        <input
                          type="text"
                          required
                          value={tt.name}
                          onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                          placeholder="VIP, General Admission, etc."
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Base Price ($)</label>
                        <input
                          type="number"
                          required
                          value={tt.basePrice}
                          onChange={(e) => handleTicketTypeChange(index, 'basePrice', parseFloat(e.target.value))}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantity</label>
                        <input
                          type="number"
                          required
                          value={tt.maxQuantity}
                          onChange={(e) => handleTicketTypeChange(index, 'maxQuantity', parseInt(e.target.value))}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Early Bird End</label>
                        <input
                          type="datetime-local"
                          value={tt.earlyBirdEndDate}
                          onChange={(e) => handleTicketTypeChange(index, 'earlyBirdEndDate', e.target.value)}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:border-primary focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Early Price</label>
                        <input
                          type="number"
                          value={tt.earlyBirdPrice}
                          onChange={(e) => handleTicketTypeChange(index, 'earlyBirdPrice', parseFloat(e.target.value))}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">chair_alt</span>
                  Seating Zones (Optional)
                </h2>
                <button
                  type="button"
                  onClick={addSeatingZone}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Zone
                </button>
              </div>

              <div className="space-y-4">
                {formData.seatingZones.map((sz, index) => (
                  <div key={index} className="bg-background-dark/30 border border-white/5 rounded-xl p-4 space-y-4 relative group">
                    <button 
                      type="button" 
                      onClick={() => removeSeatingZone(index)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Section Name</label>
                        <input
                          type="text"
                          required
                          value={sz.sectionName}
                          onChange={(e) => handleSeatingZoneChange(index, 'sectionName', e.target.value)}
                          placeholder="VIP Section, Balcony, etc."
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Capacity</label>
                        <input
                          type="number"
                          required
                          value={sz.capacity}
                          onChange={(e) => handleSeatingZoneChange(index, 'capacity', parseInt(e.target.value))}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price Modifier (x)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={sz.priceModifier}
                          onChange={(e) => handleSeatingZoneChange(index, 'priceModifier', parseFloat(e.target.value))}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formData.seatingZones.length === 0 && (
                  <p className="text-slate-500 text-xs text-center py-4 bg-background-dark/20 border border-dashed border-white/5 rounded-xl italic">
                    No custom seating zones defined. Event will use general admission seating.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                Venue & Capacity
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Venue Location</label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Total Capacity</label>
                  <input
                    type="number"
                    name="totalCapacity"
                    required
                    value={formData.totalCapacity}
                    onChange={handleChange}
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Organizer</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

             <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">undo</span>
                Refund Policy
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Days Before Deadline</label>
                  <input
                    type="number"
                    value={formData.refundPolicy.cancellationDeadlineDays}
                    onChange={(e) => handleRefundPolicyChange('cancellationDeadlineDays', parseInt(e.target.value))}
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Before %</label>
                    <input
                      type="number"
                      value={formData.refundPolicy.refundPercentageBeforeDeadline}
                      onChange={(e) => handleRefundPolicyChange('refundPercentageBeforeDeadline', parseInt(e.target.value))}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">After %</label>
                    <input
                      type="number"
                      value={formData.refundPolicy.refundPercentageAfterDeadline}
                      onChange={(e) => handleRefundPolicyChange('refundPercentageAfterDeadline', parseInt(e.target.value))}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
                  Highlights
                </h2>
                <button type="button" onClick={addHighlightField} className="text-primary text-[10px] font-bold hover:underline">Add New</button>
              </div>
              <div className="space-y-2">
                {formData.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange(i, e.target.value)}
                      placeholder="E.g., Refreshments included"
                      className="flex-1 bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button type="button" onClick={() => removeHighlightField(i)} className="text-red-500 opacity-50 hover:opacity-100">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">image</span>
                  Event Images
                </h2>
                <button type="button" onClick={addImageField} className="text-primary text-[10px] font-bold hover:underline">Add New</button>
              </div>
              <div className="space-y-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button type="button" onClick={() => removeImageField(i)} className="text-red-500 opacity-50 hover:opacity-100">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-dark border border-white/10 p-6 rounded-2xl shadow-xl">
           <div className="flex gap-4">
             <Link 
              href="/admin/events"
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
             >
               Cancel Changes
             </Link>
           </div>
           <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
            {!submitting && <span className="material-symbols-outlined text-[20px]">check_circle</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
