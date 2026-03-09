"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useRef, useCallback } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import Link from 'next/link';

// --- Types ---
interface Testimonial {
  id: string;
  name: string;
  destination: string;
  text: string;
  rating: number;
  avatar: string;
  featured: boolean;
  date: string;
  tourName?: string;
}

// --- Initial Data ---
const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'TST-842',
    name: 'Sarah Jenkins',
    destination: 'Paris, France',
    text: 'Twende Africa Tours made our honeymoon absolutely magical. The itinerary was perfectly balanced between sightseeing and relaxation. Every detail was taken care of.',
    rating: 5,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=SarahJenkins&backgroundColor=b6e3f4',
    featured: true,
    date: '2024-11-15',
    tourName: 'Paris Romance Package',
  },
  {
    id: 'TST-901',
    name: 'Michael Chen',
    destination: 'Kyoto, Japan',
    text: "I've never experienced such attention to detail. The private tea ceremony in Kyoto was a highlight of my life. Unforgettable.",
    rating: 5,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=MichaelChen&backgroundColor=ffdfbf',
    featured: true,
    date: '2024-10-22',
    tourName: 'Japan Cultural Immersion',
  },
  {
    id: 'TST-334',
    name: 'Emma & Tom Thompson',
    destination: 'Santorini, Greece',
    text: 'Watching the sunset from our private villa was breathtaking. Everything was arranged flawlessly. Highly recommend! Will definitely be back for more adventures.',
    rating: 5,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=EmmaThompson&backgroundColor=d1f7d1',
    featured: true,
    date: '2024-09-30',
    tourName: 'Greek Islands Luxury',
  },
  {
    id: 'TST-112',
    name: 'Isabella Rodriguez',
    destination: 'Machu Picchu, Peru',
    text: 'The hike was challenging but the guides were supportive and knowledgeable. Reaching the sun gate was a spiritual moment I will never forget.',
    rating: 4,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=IsabellaRodriguez&backgroundColor=ffd5e5',
    featured: true,
    date: '2024-08-14',
    tourName: 'Inca Trail Adventure',
  },
  {
    id: 'TST-559',
    name: 'David Kim',
    destination: 'Reykjavik, Iceland',
    text: 'Seeing the northern lights was a bucket list item checked off in style. The glass igloo hotel was simply out of this world.',
    rating: 5,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=DavidKim&backgroundColor=c7e8f4',
    featured: true,
    date: '2024-07-01',
    tourName: 'Iceland Aurora Chase',
  },
  {
    id: 'TST-478',
    name: 'Priya Sharma',
    destination: 'Bali, Indonesia',
    text: 'The rice terrace tours and temple visits were organized perfectly. The private beach dinner was the absolute highlight. Pure magic!',
    rating: 4,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=PriyaSharma&backgroundColor=fce4d6',
    featured: false,
    date: '2024-06-12',
    tourName: 'Bali Serenity Retreat',
  },
  {
    id: 'TST-623',
    name: 'James O\'Brien',
    destination: 'Safari, Kenya',
    text: 'The Big Five in one trip! Our guide was exceptional and the luxury camp under the stars was an experience unlike any other.',
    rating: 5,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=JamesOBrien&backgroundColor=e8f4d6',
    featured: false,
    date: '2024-05-05',
    tourName: 'Kenya Wildlife Safari',
  },
];

// --- Sub-components ---

function StarRating({ rating, max = 5, onRate }: { rating: number; max?: number; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < (hovered || rating);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onRate?.(i + 1)}
            onMouseEnter={() => onRate && setHovered(i + 1)}
            onMouseLeave={() => onRate && setHovered(0)}
            className={`transition-colors ${onRate ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`}
          >
            <span className={`material-symbols-outlined !text-[16px] ${filled ? 'text-yellow-400' : 'text-white/20'}`}>
              {filled ? 'star' : 'star'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface ModalProps {
  onClose: () => void;
  initial?: Partial<Testimonial>;
  onSave: (t: Testimonial) => void;
}

function TestimonialModal({ onClose, initial, onSave }: ModalProps) {
  const isEdit = !!initial?.id;
  const [name, setName] = useState(initial?.name ?? '');
  const [destination, setDestination] = useState(initial?.destination ?? '');
  const [text, setText] = useState(initial?.text ?? '');
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [tourName, setTourName] = useState(initial?.tourName ?? '');
  const [featured, setFeatured] = useState(initial?.featured ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onSave({
      id: initial?.id ?? `TST-${Math.floor(Math.random() * 999) + 100}`,
      name: name.trim(),
      destination: destination.trim(),
      text: text.trim(),
      rating,
      avatar: initial?.avatar ?? `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
      featured,
      date: initial?.date ?? new Date().toISOString().split('T')[0],
      tourName: tourName.trim() || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 shadow-2xl border border-white/10 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-xl">{isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Full Name *</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="rounded-lg border border-border-dark bg-surface-dark py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="e.g. Sarah Jenkins"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Destination</span>
              <input
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="rounded-lg border border-border-dark bg-surface-dark py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="e.g. Paris, France"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Tour / Package</span>
            <input
              value={tourName}
              onChange={e => setTourName(e.target.value)}
              className="rounded-lg border border-border-dark bg-surface-dark py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              placeholder="e.g. Paris Romance Package"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Testimonial Text *</span>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              required
              rows={4}
              className="rounded-lg border border-border-dark bg-surface-dark py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
              placeholder="Write the testimonial text here..."
            />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Rating</span>
              <StarRating rating={rating} onRate={setRating} />
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setFeatured(f => !f)}
                className={`relative w-10 h-5 rounded-full transition-colors ${featured ? 'bg-primary' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${featured ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-slate-300">Featured on homepage</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white glass-card rounded-lg transition-all">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary/20">
              {isEdit ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteDialogProps {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteDialog({ name, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 shadow-2xl border border-white/10 z-10 text-center">
        <div className="mx-auto size-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
          <span className="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Delete Testimonial?</h3>
          <p className="text-slate-400 text-sm mt-1">
            You are about to permanently delete <span className="text-white font-semibold">{name}</span>'s testimonial. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={onClose} className="px-5 py-2 text-sm text-slate-300 hover:text-white glass-card rounded-lg transition-all">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function FeaturedTestimonialsManagerPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'unfeatured'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Filtered list
  const filtered = testimonials.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q) || t.text.toLowerCase().includes(q) || (t.tourName ?? '').toLowerCase().includes(q);
    const matchRating = filterRating === 'all' || t.rating === filterRating;
    const matchFeatured = filterFeatured === 'all' || (filterFeatured === 'featured' ? t.featured : !t.featured);
    return matchSearch && matchRating && matchFeatured;
  });

  function handleSave(t: Testimonial) {
    setTestimonials(prev => {
      const idx = prev.findIndex(x => x.id === t.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = t;
        showToast('Testimonial updated successfully');
        return updated;
      }
      showToast('Testimonial added successfully');
      return [...prev, t];
    });
  }

  function handleDelete(id: string) {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    showToast('Testimonial deleted', 'error');
  }

  function toggleFeatured(id: string) {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, featured: !t.featured } : t));
  }

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number, id: string) => {
    dragIndex.current = index;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndex.current;
    if (fromIndex === null || fromIndex === toIndex) return;
    setTestimonials(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
    dragIndex.current = null;
    setDraggingId(null);
    setDragOverId(null);
    showToast('Order updated');
  }, []);

  const handleDragEnd = useCallback(() => {
    dragIndex.current = null;
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const stats = {
    total: testimonials.length,
    featured: testimonials.filter(t => t.featured).length,
    fiveStars: testimonials.filter(t => t.rating === 5).length,
    avgRating: (testimonials.reduce((s, t) => s + t.rating, 0) / (testimonials.length || 1)).toFixed(1),
  };

  return (
    <div className="stitch-screen">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-noise mix-blend-overlay"></div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-slide-in ${
          toast.type === 'success' ? 'bg-green-900/80 border-green-500/40 text-green-300' : 'bg-red-900/80 border-red-500/40 text-red-300'
        }`}>
          <span className="material-symbols-outlined !text-[18px]">{toast.type === 'success' ? 'check_circle' : 'cancel'}</span>
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {(modalOpen || editItem) && (
        <TestimonialModal
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          initial={editItem ?? undefined}
          onSave={handleSave}
        />
      )}
      {deleteItem && (
        <DeleteDialog
          name={deleteItem.name}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => handleDelete(deleteItem.id)}
        />
      )}

      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
          <AdminHeader
            title="Featured Testimonials"
            description="Manage client testimonials. Drag cards to reorder the homepage marquee."
          >
            {/* Search */}
            <div className="hidden md:flex relative group w-60">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="block w-full rounded-lg border border-border-dark bg-surface-dark py-2 pl-10 pr-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="Search testimonials..."
                type="text"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">
                  <span className="material-symbols-outlined !text-[16px]">close</span>
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setEditItem(null); setModalOpen(true); }}
                className="glass-card flex items-center justify-center gap-2 h-10 px-4 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined !text-[18px]">add</span>
                <span className="hidden sm:block">Add New</span>
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined !text-[18px]">visibility</span>
                <span className="hidden sm:block">Preview</span>
              </a>
            </div>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="flex flex-col w-full max-w-6xl mx-auto gap-8">

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Testimonials', value: stats.total, icon: 'format_quote', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Featured on Site', value: stats.featured, icon: 'star', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  { label: '5-Star Reviews', value: stats.fiveStars, icon: 'grade', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Avg. Rating', value: `${stats.avgRating} / 5`, icon: 'analytics', color: 'text-primary', bg: 'bg-primary/10' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
                    <div className={`size-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${stat.color} !text-[22px]`}>{stat.icon}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Filter:</span>
                <div className="flex gap-2">
                  {(['all', 'featured', 'unfeatured'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterFeatured(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filterFeatured === f ? 'bg-primary text-white' : 'glass-card text-slate-400 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'featured' ? '⭐ Featured' : 'Unfeatured'}
                    </button>
                  ))}
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterRating('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterRating === 'all' ? 'bg-primary text-white' : 'glass-card text-slate-400 hover:text-white'}`}
                  >
                    All Ratings
                  </button>
                  {[5, 4, 3].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilterRating(filterRating === r ? 'all' : r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${filterRating === r ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'glass-card text-slate-400 hover:text-yellow-400'}`}
                    >
                      <span className="material-symbols-outlined !text-[12px]">star</span>{r}
                    </button>
                  ))}
                </div>
                {(search || filterRating !== 'all' || filterFeatured !== 'all') && (
                  <button
                    onClick={() => { setSearch(''); setFilterRating('all'); setFilterFeatured('all'); }}
                    className="ml-auto text-xs text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined !text-[14px]">filter_alt_off</span>
                    Clear filters
                  </button>
                )}
              </div>

              {/* Count */}
              <div className="flex items-center justify-between -mt-4">
                <p className="text-sm text-slate-500">
                  Showing <span className="text-white font-semibold">{filtered.length}</span> of {testimonials.length} testimonials
                  {search && <span className="text-primary"> · "{search}"</span>}
                </p>
                <p className="text-xs text-slate-600 hidden md:block">
                  <span className="material-symbols-outlined !text-[12px] mr-1 align-middle">drag_indicator</span>
                  Drag cards to reorder
                </p>
              </div>

              {/* Grid */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                  </div>
                  <p className="text-slate-400 font-semibold text-lg">No testimonials found</p>
                  <p className="text-slate-600 text-sm">Try adjusting your search or filters</p>
                  <button onClick={() => { setSearch(''); setFilterRating('all'); setFilterFeatured('all'); }} className="text-sm text-primary hover:underline">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((t, idx) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={e => handleDragStart(e, idx, t.id)}
                      onDragOver={e => handleDragOver(e, t.id)}
                      onDrop={e => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`group relative glass-card p-5 rounded-xl flex flex-col gap-4 transition-all duration-200 ${
                        draggingId === t.id ? 'opacity-40 scale-95' : 'hover:border-primary/50 hover:shadow-2xl hover:shadow-black/20'
                      } ${dragOverId === t.id && draggingId !== t.id ? 'border-primary/70 shadow-lg shadow-primary/10 scale-[1.02]' : ''} cursor-grab active:cursor-grabbing`}
                    >
                      {/* Featured badge */}
                      {t.featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                          <span className="material-symbols-outlined !text-[11px] text-yellow-400">star</span>
                          <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wide">Featured</span>
                        </div>
                      )}

                      {/* Drag Handle */}
                      <div className="absolute top-3.5 right-3.5 text-white/20 group-hover:text-white/50 transition-colors">
                        <span className="material-symbols-outlined !text-[20px]">drag_indicator</span>
                      </div>

                      {/* Avatar + Name */}
                      <div className={`flex items-center gap-4 ${t.featured ? 'mt-5' : ''}`}>
                        <div className="relative shrink-0">
                          <img
                            src={t.avatar}
                            alt={`Portrait of ${t.name}`}
                            className="w-14 h-14 rounded-full border-2 border-white/10 bg-surface-dark"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-surface-dark border border-white/10 rounded-full p-0.5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-400 !text-[13px]">star</span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-bold text-base leading-tight truncate">{t.name}</h3>
                          {t.destination && (
                            <div className="flex items-center gap-1 text-primary text-xs font-medium uppercase tracking-wide mt-0.5">
                              <span className="material-symbols-outlined !text-[13px]">location_on</span>
                              <span className="truncate">{t.destination}</span>
                            </div>
                          )}
                          <StarRating rating={t.rating} />
                        </div>
                      </div>

                      {/* Tour badge */}
                      {t.tourName && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="material-symbols-outlined !text-[13px]">explore</span>
                          <span className="truncate">{t.tourName}</span>
                        </div>
                      )}

                      {/* Text */}
                      <div className="relative flex-1">
                        <span className="absolute -top-2 -left-1 text-4xl text-white/10 font-serif leading-none select-none">"</span>
                        <p className="text-slate-300 text-sm leading-relaxed relative z-10 pl-2 line-clamp-3">
                          {t.text}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs text-slate-600 font-mono">ID: #{t.id}</span>
                          <span className="block text-[10px] text-slate-700 mt-0.5">
                            {new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleFeatured(t.id)}
                            title={t.featured ? 'Remove from featured' : 'Add to featured'}
                            className={`p-1.5 rounded-lg transition-colors ${t.featured ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-white/5 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10'}`}
                          >
                            <span className="material-symbols-outlined !text-[15px]">{t.featured ? 'star' : 'star_border'}</span>
                          </button>
                          <button
                            onClick={() => { setEditItem(t); setModalOpen(false); }}
                            title="Edit testimonial"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined !text-[15px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteItem(t)}
                            title="Delete testimonial"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <span className="material-symbols-outlined !text-[15px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Placeholder */}
                  <button
                    onClick={() => { setEditItem(null); setModalOpen(true); }}
                    className="group relative rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 flex flex-col items-center justify-center gap-3 p-8 transition-all bg-white/[0.02] hover:bg-white/[0.05] min-h-[220px]"
                  >
                    <div className="size-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary text-white/40 group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined">add_circle</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold group-hover:text-primary transition-colors">Add Testimonial</p>
                      <p className="text-sm text-slate-500 mt-1">Click to create new</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Footer / Status Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 border-t border-white/5 pt-6 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>All changes saved automatically</span>
                </div>
                <div className="flex gap-6">
                  <Link className="hover:text-slate-300 transition-colors" href="/contact">Support</Link>
                  <Link className="hover:text-slate-300 transition-colors" href="/contact">Documentation</Link>
                  <span className="text-slate-700">|</span>
                  <span>Version 2.4.0</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
