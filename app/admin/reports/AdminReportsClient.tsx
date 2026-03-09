"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { RangeDataset, DateRange, DestinationRow, getCustomDataset } from '@/app/actions/reportsActions';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FilterState {
  status: string[];
  minRating: number;
  minBookings: number;
}

// ─── Static config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  DestinationRow['status'],
  { bg: string; dot: string; text: string }
> = {
  Trending: { bg: 'bg-green-500/10',  dot: 'bg-green-500',  text: 'text-green-500 border-green-500/20'  },
  Stable:   { bg: 'bg-blue-500/10',   dot: 'bg-blue-500',   text: 'text-blue-500 border-blue-500/20'    },
  Hot:      { bg: 'bg-primary/10',    dot: 'bg-primary',    text: 'text-primary border-primary/20'      },
  Review:   { bg: 'bg-orange-500/10', dot: 'bg-orange-500', text: 'text-orange-500 border-orange-500/20'},
};



function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  if (n === 0)        return '—';
  return `$${n}`;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

function downloadCSV(filename: string, content: string) {
  const encoded = encodeURIComponent(content);
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encoded);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: 'success' | 'info' | 'error' }) {
  const cls = { success: 'bg-green-900/80 border-green-500/40 text-green-300', info: 'bg-sky-900/80 border-sky-500/40 text-sky-300', error: 'bg-red-900/80 border-red-500/40 text-red-300' };
  const ico = { success: 'check_circle', info: 'info', error: 'cancel' };
  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium ${cls[type]}`}>
      <span className="material-symbols-outlined !text-[18px]">{ico[type]}</span>
      {message}
    </div>
  );
}

function ChartMenu({ onExport }: { onExport: (f: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xl bg-surface-darker border border-surface-dark shadow-2xl overflow-hidden">
          {[{ label: 'Export as PNG', icon: 'image', f: 'PNG' }, { label: 'Export as CSV', icon: 'table_chart', f: 'CSV' }, { label: 'Export as PDF', icon: 'picture_as_pdf', f: 'PDF' }].map(item => (
            <button key={item.f} onClick={() => { setOpen(false); onExport(item.f); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left">
              <span className="material-symbols-outlined text-sm">{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RowMenu({ row, onView, onExportRow, onChangeStatus }: {
  row: DestinationRow; onView: (r: DestinationRow) => void; onExportRow: (r: DestinationRow) => void; onChangeStatus: (r: DestinationRow, s: DestinationRow['status']) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[190px] rounded-xl bg-surface-darker border border-surface-dark shadow-2xl overflow-hidden">
          <button onClick={() => { setOpen(false); onView(row); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left">
            <span className="material-symbols-outlined text-sm">visibility</span> View Details
          </button>
          <button onClick={() => { setOpen(false); onExportRow(row); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left">
            <span className="material-symbols-outlined text-sm">download</span> Export Row
          </button>
          <div className="border-t border-surface-dark mx-3 my-1" />
          <p className="px-4 py-1.5 text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Status</p>
          {(['Trending', 'Stable', 'Hot', 'Review'] as DestinationRow['status'][]).map(s => (
            <button key={s} onClick={() => { setOpen(false); onChangeStatus(row, s); }} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left ${row.status === s ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
              <span className={`size-2 rounded-full ${STATUS_CFG[s].dot}`} />{s}
              {row.status === s && <span className="material-symbols-outlined text-sm text-primary ml-auto">check</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPanel({ filter, onChange, onClose, onReset }: { filter: FilterState; onChange: (f: FilterState) => void; onClose: () => void; onReset: () => void; }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4 sm:pr-8">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} className="relative z-10 w-72 rounded-2xl bg-surface-darker border border-surface-dark shadow-2xl p-5 flex flex-col gap-5">
        <h3 className="text-white font-bold text-base">Filter Results</h3>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Status</p>
          <div className="flex flex-wrap gap-2">
            {(['Trending', 'Stable', 'Hot', 'Review'] as const).map(s => (
              <button key={s} onClick={() => { const next = filter.status.includes(s) ? filter.status.filter(x => x !== s) : [...filter.status, s]; onChange({ ...filter, status: next }); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${filter.status.includes(s) ? `${STATUS_CFG[s].bg} ${STATUS_CFG[s].text} border-current` : 'bg-transparent text-text-secondary border-surface-dark opacity-50'}`}>
                <span className={`size-1.5 rounded-full ${STATUS_CFG[s].dot}`} />{s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Rating: <span className="text-white">{filter.minRating.toFixed(1)}</span></p>
          <input type="range" min="0" max="5" step="0.1" value={filter.minRating} onChange={e => onChange({ ...filter, minRating: parseFloat(e.target.value) })} className="w-full accent-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Bookings: <span className="text-white">{filter.minBookings}</span></p>
          <input type="range" min="0" max="200" step="1" value={filter.minBookings} onChange={e => onChange({ ...filter, minBookings: parseInt(e.target.value) })} className="w-full accent-primary" />
        </div>
        <div className="flex gap-3 pt-2 border-t border-surface-dark">
          <button onClick={onReset} className="flex-1 px-4 py-2 text-sm text-text-secondary hover:text-white border border-surface-dark rounded-lg transition-colors">Reset</button>
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm bg-primary text-white font-bold rounded-lg transition-colors">Apply</button>
        </div>
      </div>
    </div>
  );
}

function DetailsPanel({ row, onClose }: { row: DestinationRow; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/60 shadow-2xl transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      <div ref={ref} className="relative z-10 w-full max-w-md h-full bg-surface-darker border-l border-surface-dark p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right duration-500 ease-out">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-secondary hover:text-white transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="h-64 -mx-8 -mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${row.imageUrl}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-darker via-transparent" />
          <div className="absolute bottom-6 left-8"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border mb-2 ${STATUS_CFG[row.status].bg} ${STATUS_CFG[row.status].text}`}><span className={`size-1.5 rounded-full ${STATUS_CFG[row.status].dot}`} />{row.status}</span><h2 className="text-3xl font-black text-white">{row.name.split(',')[0]}</h2><p className="text-text-secondary font-medium">{row.region}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5"><p className="text-[10px] text-text-secondary uppercase tracking-widest font-black mb-1">Total Bookings</p><p className="text-2xl font-black text-white">{row.bookings}</p></div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5"><p className="text-[10px] text-text-secondary uppercase tracking-widest font-black mb-1">Total Revenue</p><p className="text-2xl font-black text-white">{fmt(row.revenue)}</p></div>
        </div>
        <div className="space-y-4">
          <p className="text-xs text-text-secondary uppercase tracking-widest font-black">Performance Rating</p>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`material-symbols-outlined ${i < Math.floor(row.rating) ? 'text-primary' : 'text-surface-dark'}`}>star</span>
            ))}
            <span className="text-xl font-black text-white ml-2">{row.rating}</span>
          </div>
        </div>
        <div className="mt-auto flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-surface-dark text-white rounded-xl font-black border border-white/5 hover:bg-white/5 transition-all">Close Panel</button>
          <button onClick={() => downloadCSV(`${row.name}.csv`, row.revenue.toString())} className="flex-1 py-4 bg-primary text-white rounded-xl font-black hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all">Export Stats</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AdminReportsClient({ initialDatasets }: { initialDatasets: Record<string, RangeDataset> }) {
  const [datasets, setDatasets] = useState<Record<string, RangeDataset>>(initialDatasets);
  const [activeRange, setActiveRange]     = useState<DateRange>('30d');
  const [customOpen, setCustomOpen]       = useState(false);
  const [customMode, setCustomMode]       = useState<'period' | 'range'>('period');
  const [startDate, setStartDate]         = useState('');
  const [endDate, setEndDate]             = useState('');
  const [customApplied, setCustomApplied] = useState(false);
  const [isFetchingCustom, setIsFetchingCustom] = useState(false);
  
  const [statusOverrides, setStatusOverrides] = useState<Record<string, DestinationRow['status']>>({});
  const [filter, setFilter]         = useState<FilterState>({ status: [], minRating: 0, minBookings: 0 });
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewRow, setViewRow]       = useState<DestinationRow | null>(null);
  const [activeDonut, setActiveDonut] = useState(0);
  const [hoveredBar, setHoveredBar]   = useState<string | null>(null);
  const [toast, setToast]             = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [animKey, setAnimKey]         = useState(0);

  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, () => setCustomOpen(false));

  function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const activeDataset = datasets[activeRange] || datasets['30d'];
  const revenueMixData = activeDataset.revenueMix?.length > 0 ? activeDataset.revenueMix : [{ label: 'No Data', pct: 100, color: '#555' }];
  const currentDonutIndex = Math.min(activeDonut, Math.max(0, revenueMixData.length - 1));

  const liveRows = activeDataset.rows.map(r => ({ ...r, status: statusOverrides[r.id] ?? r.status }));
  const filteredRows = liveRows.filter(r => (filter.status.length === 0 || filter.status.includes(r.status)) && r.rating >= filter.minRating && r.bookings >= filter.minBookings);
  const hasActiveFilter = filter.status.length > 0 || filter.minRating > 0 || filter.minBookings > 0;

  function selectRange(r: DateRange) {
    setActiveRange(r);
    setCustomApplied(false);
    setAnimKey(k => k + 1);
    setCustomOpen(false);
  }

  async function applyCustomRange() {
    if (!startDate || !endDate) { showToast('Pick both dates', 'error'); return; }
    setIsFetchingCustom(true);
    
    try {
      const liveCustomData = await getCustomDataset(startDate, endDate);
      
      setDatasets(prev => ({
        ...prev,
        custom: liveCustomData
      }));
      
      setActiveRange('custom');
      setCustomApplied(true);
      setCustomOpen(false);
      setAnimKey(k => k + 1);
      showToast(`Range: ${startDate} to ${endDate}`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Error loading custom range', 'error');
    } finally {
      setIsFetchingCustom(false);
    }
  }

  function handleExportCSV(format?: string) {
    const csv = ['Destination,Region,Bookings,Revenue,Rating,Status', ...filteredRows.map(r => `"${r.name}","${r.region}",${r.bookings},${r.revenue},${r.rating},${r.status}`)].join('\n');
    downloadCSV(`twende-${activeRange}.csv`, csv);
    showToast(`Exported ${format || 'CSV'} ✓`, 'success');
  }

  const rangeLabel = activeRange === 'custom' && customApplied ? `${startDate} to ${endDate}` 
    : activeRange === '7d' ? 'Last 7 Days' 
    : activeRange === '30d' ? 'Last 30 Days'
    : activeRange === 'month' ? 'This Month'
    : activeRange === 'quarter' ? 'Last Quarter'
    : activeRange === '6m' ? 'Last 6 Months'
    : activeRange === 'ytd' ? 'Year to Date'
    : activeRange === 'year' ? 'Last Year'
    : 'Select Range';

  return (
    <div className="stitch-screen h-screen overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {filterOpen && <FilterPanel filter={filter} onChange={setFilter} onClose={() => setFilterOpen(false)} onReset={() => setFilter({ status: [], minRating: 0, minBookings: 0 })} />}
      {viewRow && <DetailsPanel row={viewRow} onClose={() => setViewRow(null)} />}

      <div className="flex h-full w-full overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
          <AdminHeader title="Reports & Analytics" description="Advanced performance metrics and custom reporting">
            {/* Range Selector Bar */}
            <div className="flex bg-surface-darker p-1 rounded-lg relative overflow-visible" ref={popoverRef}>
              {(['7d', '30d', 'month', 'quarter'] as DateRange[]).map(r => (
                <button key={r} onClick={() => selectRange(r)} className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${activeRange === r && !customOpen ? 'text-white bg-background-dark shadow-sm' : 'text-text-secondary hover:text-white'}`}>
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === 'month' ? 'Month' : 'Quarter'}
                </button>
              ))}
              <div className="w-px h-5 bg-text-secondary/20 mx-1 my-auto" />
              <button onClick={() => setCustomOpen(!customOpen)} className={`px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-all ${customOpen || activeRange === '6m' || activeRange === 'ytd' || activeRange === 'year' || customApplied ? 'text-white bg-background-dark shadow-sm' : 'text-primary hover:text-primary/80'}`}>
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                {activeRange === 'custom' && customApplied ? `${startDate} - ${endDate}` : 'Custom'}
              </button>

              {/* Enhanced Custom Popover */}
              {customOpen && (
                <div className="absolute top-full right-0 mt-2 z-50 rounded-2xl bg-surface-darker border border-surface-dark shadow-2xl p-4 w-80 flex flex-col gap-4">
                  {/* Tabs */}
                  <div className="flex bg-surface-dark p-1 rounded-lg">
                    <button onClick={() => setCustomMode('period')} className={`flex-1 py-1 text-xs font-bold rounded transition-all ${customMode === 'period' ? 'bg-surface-darker text-white shadow' : 'text-text-secondary hover:text-white'}`}>Quick Period</button>
                    <button onClick={() => setCustomMode('range')} className={`flex-1 py-1 text-xs font-bold rounded transition-all ${customMode === 'range' ? 'bg-surface-darker text-white shadow' : 'text-text-secondary hover:text-white'}`}>Date Range</button>
                  </div>

                  {customMode === 'period' ? (
                    <div className="flex flex-col gap-1">
                      {([
                        { k: '6m', l: 'Last 6 Months' },
                        { k: 'ytd', l: 'Year to Date' },
                        { k: 'year', l: 'Last 12 Months' },
                      ] as { k: DateRange, l: string }[]).map(p => (
                        <button key={p.k} onClick={() => selectRange(p.k)} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between">
                          {p.l} {activeRange === p.k && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] text-text-secondary font-bold uppercase">From</span>
                          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-surface-dark border border-surface-dark text-white rounded px-2 py-1 text-xs focus:border-primary outline-none" />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] text-text-secondary font-bold uppercase">To</span>
                          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="bg-surface-dark border border-surface-dark text-white rounded px-2 py-1 text-xs focus:border-primary outline-none" />
                        </label>
                      </div>
                      <button disabled={isFetchingCustom} onClick={applyCustomRange} className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center">
                        {isFetchingCustom ? <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span> : 'Apply Selection'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8 gap-8 flex flex-col">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { l: 'Total Revenue', v: activeDataset.metrics.revenue, c: activeDataset.metrics.revenueChange, u: activeDataset.metrics.revenueUp, i: 'payments' },
                { l: 'Active Bookings', v: activeDataset.metrics.bookings || '0', c: activeDataset.metrics.bookingsChange, u: activeDataset.metrics.bookingsUp, i: 'confirmation_number' },
                { l: 'Avg. Order Value', v: activeDataset.metrics.avgOrder, c: activeDataset.metrics.avgOrderChange, u: activeDataset.metrics.avgOrderUp, i: 'shopping_bag' },
                { l: 'Satisfaction', v: activeDataset.metrics.satisfaction, c: activeDataset.metrics.satisfactionChange, u: null, i: 'star' },
              ].map(card => (
                <div key={card.l} className="flex flex-col gap-1 rounded-xl p-6 bg-surface-darker border border-surface-darker">
                  <div className="flex items-center justify-between text-text-secondary"><span className="text-sm font-medium">{card.l}</span><span className="material-symbols-outlined text-lg">{card.i}</span></div>
                  <p className="text-white text-3xl font-bold mt-1">{String(card.v)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {card.u === true && <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>}
                    {card.u === false && <span className="material-symbols-outlined text-primary text-sm">trending_down</span>}
                    <span className={`text-sm font-bold ${card.u === true ? 'text-green-500' : card.u === false ? 'text-primary' : 'text-text-secondary'}`}>{card.c}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl bg-surface-darker p-6 border border-surface-darker">
                <div className="flex items-center justify-between mb-8">
                  <div><h3 className="text-white text-lg font-bold">Destination Performance</h3><p className="text-text-secondary text-xs">{rangeLabel}</p></div>
                  <ChartMenu onExport={handleExportCSV} />
                </div>
                <div className="h-64 flex items-end justify-around relative px-4" key={animKey}>
                  <div className="absolute inset-x-0 bottom-4 top-0 flex flex-col justify-between pointer-events-none opacity-10">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-white" />)}
                  </div>
                  {liveRows.length > 0 ? liveRows.map(r => (
                    <div key={r.id} className="group relative flex flex-col items-center gap-2 w-16 h-full justify-end" onMouseEnter={() => setHoveredBar(r.id)} onMouseLeave={() => setHoveredBar(null)}>
                      {hoveredBar === r.id && r.barHeight > 0 && (
                        <div className="absolute bottom-full mb-3 z-30 bg-surface-dark border border-white/10 p-2 rounded-lg shadow-2xl text-center pointer-events-none min-w-[100px]">
                          <p className="text-white text-[10px] font-bold">{r.name.split(',')[0]}</p>
                          <p className="text-primary text-sm font-black">{fmt(r.revenue)}</p>
                        </div>
                      )}
                      <div className="w-full relative rounded-sm transition-all duration-700 overflow-hidden" style={{ height: r.barHeight ? `${r.barHeight}%` : '4px' }}>
                        <div className={`absolute inset-0 bg-primary/20 transition-all ${hoveredBar === r.id ? 'bg-primary/40' : ''}`} />
                        <div className={`absolute bottom-0 w-full bg-primary transition-all rounded-t-sm shadow-[0_-4px_12px_rgba(198,16,16,0.2)] ${hoveredBar === r.id ? 'brightness-125' : ''}`} style={{ height: '70%' }} />
                      </div>
                      <span className="text-[10px] text-text-secondary font-bold truncate group-hover:text-white transition-colors">{r.name.split(',')[0]}</span>
                    </div>
                  )) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-text-secondary text-sm">No destination data for this period</p>
                    </div>
                  )}
                  {activeRange === 'custom' && !customApplied && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-darker/60 backdrop-blur-[2px] rounded-lg z-10">
                      <p className="text-text-secondary text-sm font-medium">Please select a valid date range</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pie Section */}
              <div className="rounded-xl bg-surface-darker p-6 border border-surface-darker flex flex-col items-center gap-6">
                <div className="text-left w-full"><h3 className="text-white text-lg font-bold">Revenue Mix</h3><p className="text-text-secondary text-xs">By service category</p></div>
                <div className="size-44 rounded-full relative transition-all duration-500 hover:scale-105 shadow-2xl" style={{ background: `conic-gradient(${revenueMixData.map((s, i) => `${i === currentDonutIndex ? s.color : s.color + '44'} ${revenueMixData.slice(0, i).reduce((a, b) => a + b.pct, 0)}% ${revenueMixData.slice(0, i + 1).reduce((a, b) => a + b.pct, 0)}%`).join(', ')})` }}>
                  <div className="absolute inset-5 rounded-full bg-surface-darker flex flex-col items-center justify-center">
                    <p className="text-3xl font-black text-white">{revenueMixData[currentDonutIndex].pct}%</p>
                    <p className="text-[10px] text-text-secondary uppercase font-bold text-center px-2">{revenueMixData[currentDonutIndex].label}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {revenueMixData.map((s, i) => (
                    <button key={s.label} onClick={() => setActiveDonut(i)} className={`p-2 rounded-lg border transition-all text-left ${currentDonutIndex === i ? 'bg-white/5 border-primary/40' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <div className="flex items-center gap-1.5 mb-0.5"><div className="size-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-[10px] text-text-secondary font-bold truncate">{s.label}</span></div>
                      <p className="text-xs text-white font-black pl-3.5">{s.pct}%</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl bg-surface-darker border border-surface-darker overflow-hidden">
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-white text-lg font-bold">Performance Breakdown</h3>
                <div className="flex gap-2">
                  <button onClick={() => setFilterOpen(true)} className={`px-4 py-1.5 rounded-lg border text-sm flex items-center gap-2 transition-all ${hasActiveFilter ? 'border-primary bg-primary/10 text-primary' : 'border-surface-dark text-text-secondary hover:text-white'}`}>
                    <span className="material-symbols-outlined text-sm">filter_alt</span>Filter {hasActiveFilter && '(!)'}
                  </button>
                  <button onClick={() => handleExportCSV()} className="px-4 py-1.5 rounded-lg border border-surface-dark text-text-secondary text-sm hover:text-white flex items-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-sm">download</span>CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto min-h-[150px]">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] text-text-secondary uppercase font-bold tracking-widest border-b border-white/5">
                    <tr><th className="p-4">Destination</th><th className="p-4">Bookings</th><th className="p-4">Revenue</th><th className="p-4">Rating</th><th className="p-4" style={{ minWidth: '120px' }}>Status</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-white/5">
                    {filteredRows.map(r => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setViewRow(r)}>
                        <td className="p-4 flex items-center gap-3"><div className="size-10 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url('${r.imageUrl}')` }} /><div className="flex flex-col"><p className="text-white font-bold">{r.name.split(',')[0]}</p><p className="text-xs text-text-secondary">{r.region}</p></div></td>
                        <td className="p-4 font-bold text-white">{r.bookings || '—'}</td>
                        <td className="p-4 font-bold text-white">{fmt(r.revenue)}</td>
                        <td className="p-4"><div className="flex items-center gap-1 text-yellow-500"><span className="material-symbols-outlined text-xs">star</span><span className="text-white font-bold">{r.rating}</span></div></td>
                        <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${STATUS_CFG[r.status].bg} ${STATUS_CFG[r.status].text}`}><span className={`size-1.5 rounded-full ${STATUS_CFG[r.status].dot}`} />{r.status}</span></td>
                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}><RowMenu row={r} onView={setViewRow} onExportRow={row => downloadCSV(`${row.name}.csv`, row.revenue.toString())} onChangeStatus={(row, s) => setStatusOverrides(prev => ({ ...prev, [row.id]: s }))} /></td>
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={6} className="text-center p-8 text-text-secondary">No destinations match the current criteria for this date range.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
