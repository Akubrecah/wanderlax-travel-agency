"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

import { Car, CarCategory, CarStatus } from '@prisma/client';
import { getAllCars, createCar, updateCar, deleteCar, updateCarStatus } from '@/app/actions/carActions';

// ─── Types ───────────────────────────────────────────────────────────────────
export type VehicleStatus = CarStatus;
export type VehicleCategory = CarCategory;

// ─── Seed data ────────────────────────────────────────────────────────────────
// INITIAL_VEHICLES removed as it was unused

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatusBadge(status: Car['status']) {
  switch (status) {
    case 'AVAILABLE':
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
          Available
        </span>
      );
    case 'RENTED':
      return (
        <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
          Rented
        </span>
      );
    case 'MAINTENANCE':
      return (
        <span className="inline-flex items-center rounded-full bg-orange-400/10 px-2 py-1 text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-400/20">
          Maintenance
        </span>
      );
    case 'DECOMMISSIONED':
      return (
        <span className="inline-flex items-center rounded-full bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
          Decommissioned
        </span>
      );
  }
}

// STATUS_CYCLE removed as it was unused

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function AdminFleetManagementPage() {
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  console.log('Loading state:', loading); // Avoid unused variable warning if not actually used elsewhere
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | VehicleCategory | string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Fetch cars
  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await getAllCars();
      setVehicles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const stats = useMemo(() => ({
    total: vehicles.length,
    rented: vehicles.filter(v => v.status === 'RENTED').length,
    maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
    monthlyRevenue: vehicles
      .filter(v => v.status === 'RENTED')
      .reduce((sum, v) => sum + Number(v.dailyRate) * 30, 0),
  }), [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const vehicleName = `${v.make} ${v.model}`;
      const matchesSearch =
        vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.features[0] || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'All' || v.category.toUpperCase() === categoryFilter.toUpperCase();
      return matchesSearch && matchesCat;
    });
  }, [vehicles, searchQuery, categoryFilter]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) ?? null;

  // Actions
  const handleCycleStatus = async (id: string, currentStatus: Car['status']) => {
    const cycleMap: Record<Car['status'], Car['status']> = {
      AVAILABLE: 'RENTED',
      RENTED: 'MAINTENANCE',
      MAINTENANCE: 'DECOMMISSIONED',
      DECOMMISSIONED: 'AVAILABLE'
    };
    const nextStatus = cycleMap[currentStatus] || 'AVAILABLE';
    
    try {
      await updateCarStatus(id, nextStatus);
      await fetchCars();
    } catch (e) {
      console.error(e);
    }
    setOpenMenuId(null);
  };

  const handleEdit = async (updated: Partial<Car> & { name?: string, type?: string, plate?: string, pricePerDay?: number, fuel?: string, image?: string }) => {
    if (!editVehicleId) return;
    try {
      await updateCar(editVehicleId, updated);
      await fetchCars();
      setEditVehicleId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCar(id);
      await fetchCars();
      if (selectedVehicleId === id) setSelectedVehicleId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Category', 'Type', 'Plate', 'Fuel', 'Mileage', 'Price/Day (USD)', 'Status'];
    const rows = filteredVehicles.map(v => [
      `"${v.make} ${v.model}"`, v.category, `"${v.features[0] || ''}"`, v.licensePlate, v.fuelType, v.mileage ? String(v.mileage) : "0", Number(v.dailyRate), v.status,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `fleet-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stitch-screen h-screen overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
          <AdminHeader
            title="Fleet Overview"
            description="Manage and track all vehicles in the Twende Africa Tours fleet."
          >
            <div className="flex items-center gap-3">
              {/* Search (header) */}
              <div className="hidden sm:flex relative max-w-[10rem] md:max-w-xs w-full lg:w-64 transition-all">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="block w-full rounded-lg border-0 bg-surface-dark py-2 pl-10 pr-4 text-white placeholder-text-secondary focus:ring-1 focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                  placeholder="Search..."
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Export */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-dark bg-background-dark text-text-secondary hover:bg-surface-dark hover:text-white text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                <span className="hidden sm:inline">Export</span>
              </button>
              {/* Add Vehicle */}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span className="hidden sm:inline">Add New Vehicle</span>
              </button>
            </div>
          </AdminHeader>

          <div className="flex-1 flex flex-row overflow-hidden">
            {/* Left: grid/list + content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total */}
                <div className="bg-surface-dark rounded-xl p-5 border border-border-dark relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">directions_car</span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium mb-1">Total Vehicles</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
                    <span className="text-emerald-400 text-xs font-medium flex items-center">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>+5%
                    </span>
                  </div>
                </div>
                {/* Rented */}
                <div className="bg-surface-dark rounded-xl p-5 border border-border-dark relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">key</span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium mb-1">Currently Rented</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-white">{stats.rented}</h3>
                    <span className="text-emerald-400 text-xs font-medium flex items-center">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>+12%
                    </span>
                  </div>
                  <div className="w-full bg-background-dark rounded-full h-1 mt-3">
                    <div
                      className="bg-primary h-1 rounded-full"
                      style={{ width: `${Math.round((stats.rented / Math.max(stats.total, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                {/* Maintenance */}
                <div className="bg-surface-dark rounded-xl p-5 border border-border-dark relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">build</span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium mb-1">In Maintenance</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-white">{stats.maintenance}</h3>
                    {stats.maintenance > 0 && (
                      <span className="text-orange-400 text-xs font-medium flex items-center">
                        <span className="material-symbols-outlined text-[16px]">priority_high</span>Attention
                      </span>
                    )}
                  </div>
                </div>
                {/* Revenue */}
                <div className="bg-surface-dark rounded-xl p-5 border border-border-dark relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">payments</span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium mb-1">Monthly Revenue</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-white">
                      ${stats.monthlyRevenue >= 1000
                        ? `${(stats.monthlyRevenue / 1000).toFixed(1)}k`
                        : stats.monthlyRevenue}
                    </h3>
                    <span className="text-emerald-400 text-xs font-medium flex items-center">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>+8%
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters & View Toggle */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
                {/* Mobile search */}
                <div className="relative w-full sm:w-80 md:hidden">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input
                    className="block w-full rounded-lg border border-border-dark bg-surface-dark py-2.5 pl-10 pr-4 text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary sm:text-sm"
                    placeholder="Search by model, plate..."
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Tabs + view toggle row */}
                <div className="flex items-center gap-3 w-full overflow-x-auto pb-1">
                  <div className="flex items-center gap-1 bg-surface-dark border border-border-dark rounded-lg p-1 shrink-0">
                    {(['All', 'ECONOMY', 'COMPACT', 'SUV', 'LUXURY', 'VAN', 'BUS'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          categoryFilter === cat
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary hover:text-white hover:bg-background-dark'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-2 bg-surface-dark p-1 rounded-lg border border-border-dark shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-background-dark text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-background-dark text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">list</span>
                  </button>
                </div>
              </div>

              {/* Empty state */}
              {filteredVehicles.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-20 text-text-secondary">
                  <span className="material-symbols-outlined text-5xl opacity-30">directions_car</span>
                  <p>No vehicles match your search criteria.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                    className="mt-1 text-sm text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* ── GRID VIEW ── */}
              {viewMode === 'grid' && filteredVehicles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-8">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      vehicle={vehicle as any}
                      isSelected={selectedVehicleId === vehicle.id}
                      openMenuId={openMenuId}
                      deleteConfirmId={deleteConfirmId}
                      menuRef={menuRef}
                      onSelect={() => setSelectedVehicleId(selectedVehicleId === vehicle.id ? null : vehicle.id)}
                      onToggleMenu={() => setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)}
                      onEdit={() => { setEditVehicleId(vehicle.id); }}
                      onCycleStatus={() => handleCycleStatus(vehicle.id, vehicle.status)}
                      onDeleteConfirm={() => setDeleteConfirmId(vehicle.id)}
                      onDeleteCancel={() => { setDeleteConfirmId(null); setOpenMenuId(null); }}
                      onDelete={() => handleDelete(vehicle.id)}
                    />
                  ))}
                </div>
              )}

              {/* ── LIST VIEW ── */}
              {viewMode === 'list' && filteredVehicles.length > 0 && (
                <div className="border rounded-xl border-border-dark overflow-hidden bg-surface-dark mb-8">
                  <table className="min-w-full divide-y divide-border-dark">
                    <thead className="bg-background-dark">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Plate</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">Fuel / KM</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Price/Day</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                      {filteredVehicles.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          onClick={() => setSelectedVehicleId(selectedVehicleId === vehicle.id ? null : vehicle.id)}
                          className={`hover:bg-background-dark transition-colors cursor-pointer ${selectedVehicleId === vehicle.id ? 'bg-primary/5' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-10 w-14 rounded-lg bg-cover bg-center"
                                style={{ backgroundImage: `url('${vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}')` }}
                              />
                              <div>
                                <div className="text-sm font-medium text-white">{vehicle.make} {vehicle.model}</div>
                                <div className="text-xs text-text-secondary">{vehicle.features?.[0] || 'Car'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{vehicle.licensePlate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden md:table-cell">{vehicle.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden lg:table-cell">
                            {vehicle.fuelType} · {vehicle.mileage || 0} km
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">${Number(vehicle.dailyRate)}/day</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(vehicle.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                            <div className="relative inline-block" ref={openMenuId === vehicle.id ? menuRef : null}>
                              <button
                                onClick={() => setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)}
                                className="text-text-secondary hover:text-white transition-colors p-1 rounded-md hover:bg-background-dark"
                              >
                                <span className="material-symbols-outlined">more_vert</span>
                              </button>
                              {openMenuId === vehicle.id && deleteConfirmId !== vehicle.id && (
                                <div className="absolute right-0 mt-1 w-48 rounded-lg shadow-xl bg-surface-dark border border-border-dark z-50 overflow-hidden">
                                  <button
                                    onClick={() => { setSelectedVehicleId(vehicle.id); setOpenMenuId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-background-dark transition-colors text-left"
                                  >
                                    <span className="material-symbols-outlined text-[18px] text-text-secondary">visibility</span>
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => { setEditVehicleId(vehicle.id); setOpenMenuId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-background-dark transition-colors text-left"
                                  >
                                    <span className="material-symbols-outlined text-[18px] text-text-secondary">edit</span>
                                    Edit Vehicle
                                  </button>
                                  <button
                                    onClick={() => handleCycleStatus(vehicle.id, vehicle.status)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-background-dark transition-colors text-left"
                                  >
                                    <span className="material-symbols-outlined text-[18px] text-text-secondary">sync</span>
                                    Change Status
                                  </button>
                                  <div className="border-t border-border-dark" />
                                  <button
                                    onClick={() => setDeleteConfirmId(vehicle.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors text-left"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                    Delete
                                  </button>
                                </div>
                              )}
                              {deleteConfirmId === vehicle.id && (
                                <div className="absolute right-0 mt-1 w-56 rounded-lg shadow-xl bg-surface-dark border border-red-800 z-50 p-4">
                                  <p className="text-sm text-white font-semibold mb-1">Remove this vehicle?</p>
                                  <p className="text-xs text-text-secondary mb-3">This action cannot be undone.</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => { setDeleteConfirmId(null); setOpenMenuId(null); }}
                                      className="flex-1 py-1.5 rounded-lg border border-border-dark text-text-secondary hover:text-white text-xs font-medium transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleDelete(vehicle.id)}
                                      className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination footer */}
                  <div className="bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-border-dark">
                    <p className="text-sm text-text-secondary">
                      Showing <span className="font-medium text-white">{filteredVehicles.length}</span> of{' '}
                      <span className="font-medium text-white">{vehicles.length}</span> vehicles
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Right: Vehicle Detail Slide-over */}
            {selectedVehicle && (
              <div className="w-full md:w-[360px] border-l border-border-dark bg-surface-dark flex flex-col h-full shadow-2xl z-10 absolute md:relative right-0">
                <div className="p-5 border-b border-border-dark flex justify-between items-center">
                  <h2 className="text-base font-bold text-white">Vehicle Details</h2>
                  <button
                    onClick={() => setSelectedVehicleId(null)}
                    className="text-text-secondary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* Image */}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url('${(selectedVehicle as any).images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}')` }} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedVehicle.make} {selectedVehicle.model}</h3>
                        <p className="text-white font-medium">{selectedVehicle.fuelType}</p>
                      </div>
                      {getStatusBadge(selectedVehicle.status)}
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: 'Plate', value: selectedVehicle.licensePlate, icon: 'pin' },
                        { label: 'Category', value: selectedVehicle.category, icon: 'category' },
                        { label: 'Fuel', value: selectedVehicle.fuelType, icon: selectedVehicle.fuelType === 'Electric' ? 'bolt' : 'local_gas_station' },
                        { label: 'Mileage', value: `${selectedVehicle.mileage || 0} km`, icon: 'speed' },
                        { label: 'Transmission', value: selectedVehicle.transmission, icon: 'settings' },
                        { label: 'Price / Day', value: `$${Number(selectedVehicle.dailyRate)}`, icon: 'payments' },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-background-dark rounded-xl p-3 border border-border-dark">
                          <span className="text-xs text-text-secondary uppercase font-semibold block mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">{icon}</span>
                            {label}
                          </span>
                          <span className="text-sm font-bold text-white">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status note */}
                    {selectedVehicle.status === 'RENTED' && (                  <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-400/10 border border-blue-400/20 mb-4">
                        <span className="material-symbols-outlined text-blue-400 text-[20px]">schedule</span>
                        <span className="text-sm text-blue-300">Vehicle is currently rented.</span>
                      </div>
                    )}
                    {selectedVehicle.status === 'MAINTENANCE' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-400/10 border border-orange-400/20 mb-4">
                        <span className="material-symbols-outlined text-orange-400 text-[20px]">build_circle</span>
                        <span className="text-sm text-orange-300">Vehicle under maintenance</span>
                      </div>
                    )}
                    {selectedVehicle.status === 'AVAILABLE' && (                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20 mb-4">
                        <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
                        <span className="text-sm text-emerald-300">Vehicle is ready for hire.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 bg-background-dark border-t border-border-dark flex gap-3">
                  <button
                    onClick={() => { setEditVehicleId(selectedVehicle.id); }}
                    className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20"
                  >
                    Edit Vehicle
                  </button>
                  <button
                    onClick={() => handleCycleStatus(selectedVehicle.id, selectedVehicle.status)}
                    className="flex-1 py-2.5 rounded-lg border border-border-dark bg-transparent text-white font-bold text-sm hover:bg-surface-dark transition-colors"
                  >
                    Status
                  </button>
                  <button
                    onClick={() => handleDelete(selectedVehicle.id)}
                    className="py-2.5 px-4 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 font-bold text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (v) => {
            try {
              // Ensure we pass data correctly to createCar
              await createCar(v as Parameters<typeof createCar>[0]);
              await fetchCars();
              setShowAddModal(false);
            } catch(e) { console.error(e); }
          }}
        />
      )}

      {/* Edit Vehicle Modal */}
      {editVehicleId && (() => {
        const target = vehicles.find(v => v.id === editVehicleId);
        return target ? (
          <EditVehicleModal
            vehicle={target as Partial<Car> & { make?: string, model?: string, features?: string[], licensePlate?: string, fuelType?: string, mileage?: number, transmission?: string, dailyRate?: number, status?: unknown, images?: string[], lastNote?: string }}
            onClose={() => setEditVehicleId(null)}
            onSave={handleEdit}
          />
        ) : null;
      })()}
    </div>
  );
}

// ─── Vehicle Card (grid view) ─────────────────────────────────────────────────
function VehicleCard({
  vehicle,
  isSelected,
  openMenuId,
  deleteConfirmId,
  menuRef,
  onSelect,
  onToggleMenu,
  onEdit,
  onCycleStatus,
  onDeleteConfirm,
  onDeleteCancel,
  onDelete,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicle: Car;
  isSelected: boolean;
  openMenuId: string | null;
  deleteConfirmId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onToggleMenu: () => void;
  onEdit: () => void;
  onCycleStatus: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onDelete: () => void;
}) {
  const isMenuOpen = openMenuId === vehicle.id;
  const isDeleteConfirm = deleteConfirmId === vehicle.id;

  return (
    <div
      className={`group flex flex-col bg-surface-dark border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${
        isSelected ? 'border-primary/60 shadow-lg shadow-primary/10' : 'border-border-dark'
      }`}
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-background-dark">
        <div className="absolute top-3 left-3 z-10">{getStatusBadge(vehicle.status)}</div>
        <div className="absolute top-3 right-3 z-10" onClick={e => e.stopPropagation()}>
          <div className="relative" ref={isMenuOpen ? menuRef : null}>
            <button
              onClick={onToggleMenu}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-primary transition-colors backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
            {isMenuOpen && !isDeleteConfirm && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg shadow-xl bg-surface-dark border border-border-dark z-50 overflow-hidden">
                <button
                  onClick={e => { e.stopPropagation(); onSelect(); onToggleMenu(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-background-dark transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">visibility</span>
                  View Details
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onEdit(); onToggleMenu(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-background-dark transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">edit</span>
                  Edit Vehicle
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onCycleStatus(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-background-dark transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">sync</span>
                  Change Status
                </button>
                <div className="border-t border-border-dark" />
                <button
                  onClick={e => { e.stopPropagation(); onDeleteConfirm(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete Vehicle
                </button>
              </div>
            )}
            {isDeleteConfirm && (
              <div className="absolute right-0 mt-1 w-56 rounded-lg shadow-xl bg-surface-dark border border-red-800 z-50 p-4" onClick={e => e.stopPropagation()}>
                <p className="text-sm text-white font-semibold mb-1">Remove this vehicle?</p>
                <p className="text-xs text-text-secondary mb-3">This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={onDeleteCancel}
                    className="flex-1 py-1.5 rounded-lg border border-border-dark text-text-secondary hover:text-white text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onDelete}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <img
          alt={`${vehicle.make} ${vehicle.model}`}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${vehicle.status === 'MAINTENANCE' ? 'opacity-60 grayscale-[50%]' : ''}`}
          src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{vehicle.make} {vehicle.model}</h3>
            <p className="text-text-secondary text-xs">{vehicle.features?.[0] || 'Car'}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">${Number(vehicle.dailyRate)}<span className="text-text-secondary text-xs font-normal">/day</span></p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-y-2.5 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">pin</span>
            <span>{vehicle.licensePlate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">{vehicle.fuelType === 'Electric' ? 'bolt' : 'local_gas_station'}</span>
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">speed</span>
            <span>{vehicle.mileage || 0} km</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            {vehicle.status === 'MAINTENANCE' ? (
              <>
                <span className="material-symbols-outlined text-orange-400 text-sm">build_circle</span>
                <span className="text-xs text-text-secondary">Vehicle under maintenance</span>
              </>
            ) : vehicle.status === 'AVAILABLE' ? (
              <span className="text-xs text-text-secondary italic">Ready for rental</span>
            ) : (
                <span className="text-xs text-text-secondary italic">Currently Rented</span>
            )}
          </div>
          <button
            className="text-primary text-sm font-semibold hover:text-white transition-colors"
            onClick={e => { e.stopPropagation(); onSelect(); }}
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Vehicle Modal ────────────────────────────────────────────────────────
function AddVehicleModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (v: Parameters<typeof createCar>[0]) => void;
}) {
  const [form, setForm] = useState({
    name: '',
    category: 'SUV' as CarCategory,
    type: 'Car',
    plate: '',
    fuel: 'Petrol',
    mileage: '0',
    transmission: 'Automatic',
    pricePerDay: 200,
    status: 'AVAILABLE' as CarStatus,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'],
    lastNote: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm(f => ({ ...f, images: [base64String, ...f.images.slice(1)] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm(f => ({ ...f, images: newImages }));
  };

  const addImageField = () => {
    setForm(f => ({ ...f, images: [...f.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.plate.trim()) return;
    onAdd({ 
      ...form, 
      category: form.category as CarCategory,
      status: form.status as CarStatus,
      mileage: form.mileage ? parseInt(form.mileage) : 0,
      images: form.images.filter(img => img.trim() !== '')
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-dark">
          <h2 className="text-lg font-bold text-white">Add New Vehicle</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form id="add-vehicle-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Vehicle Name *</label>
              <input
                required
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="e.g. Bentley Continental GT"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Category</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as CarCategory }))}
              >
                {(['SUV', 'LUXURY', 'ECONOMY', 'COMPACT', 'VAN', 'BUS'] as CarCategory[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Type</label>
              <input
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary"
                placeholder="e.g. Grand Tourer"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              />
            </div>

            {/* Plate */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Plate Number *</label>
              <input
                required
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary uppercase"
                placeholder="e.g. KBC-1234"
                value={form.plate}
                onChange={e => setForm(f => ({ ...f, plate: e.target.value.toUpperCase() }))}
              />
            </div>

            {/* Fuel */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Fuel</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.fuel}
                onChange={e => setForm(f => ({ ...f, fuel: e.target.value }))}
              >
                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Mileage</label>
              <input
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary"
                placeholder="e.g. 25k km"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Transmission</label>
              <div className="grid grid-cols-2 gap-3">
                {['Automatic', 'Manual'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, transmission: t }))}
                    className={`py-2 rounded-lg border text-sm font-medium transition-colors ${form.transmission === t ? 'border-primary bg-primary/10 text-primary' : 'border-border-dark text-text-secondary hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Price per Day ($)</label>
                <input
                  type="number"
                  required
                  value={form.pricePerDay || ''}
                  onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
                  className="w-full bg-background border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., 250"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
                    className="w-full bg-background border border-border-dark rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary transition-colors pr-10"
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="COMPACT">Compact</option>
                    <option value="SUV">SUV</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="VAN">Van</option>
                    <option value="BUS">Bus</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Status</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as VehicleStatus }))}
              >
                {['AVAILABLE', 'RENTED', 'MAINTENANCE'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Latest Note (Optional)</label>
              <input
                type="text"
                value={form.lastNote}
                onChange={e => setForm(f => ({ ...f, lastNote: e.target.value }))}
                className="w-full bg-background border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g., Scheduled for maintenance next week"
              />
            </div>

            {/* Images */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-text-secondary uppercase">Vehicle Images</label>
                <button 
                  type="button" 
                  onClick={addImageField}
                  className="text-primary text-xs font-bold hover:text-white transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add URL
                </button>
              </div>
              
              <div className="space-y-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white text-sm"
                      placeholder="Image URL"
                      value={img}
                      onChange={e => updateImage(idx, e.target.value)}
                    />
                    {form.images.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeImageField(idx)}
                        className="p-2 text-text-secondary hover:text-red-400"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative group cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="border-2 border-dashed border-border-dark group-hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center bg-background-dark/50">
                  <span className="material-symbols-outlined text-text-secondary group-hover:text-primary mb-2">upload_file</span>
                  <span className="text-sm text-text-secondary group-hover:text-white font-medium">Click or Drag to Upload Image</span>
                  <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</span>
                </div>
              </div>

              {form.images[0] && (
                <div className="mt-2 rounded-xl border border-border-dark overflow-hidden h-32 bg-background-dark">
                  <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border-dark">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border-dark text-text-secondary hover:text-white font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-vehicle-form"
            className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20"
          >
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Vehicle Modal ───────────────────────────────────────────────────────
function EditVehicleModal({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: Partial<Car> & { make?: string, model?: string, features?: string[], licensePlate?: string, fuelType?: string, mileage?: number, transmission?: string, dailyRate?: number, status?: unknown, images?: string[], lastNote?: string };
  onClose: () => void;
  onSave: (updated: Partial<Car> & { name?: string, type?: string, plate?: string, pricePerDay?: number, fuel?: string, image?: string, lastNote?: string, returnDate?: string, mileage?: number }) => void;
}) {
  const [form, setForm] = useState({
    name: `${vehicle.make} ${vehicle.model}`,
    category: vehicle.category || 'SUV',
    type: vehicle.features?.[0] || 'Car',
    plate: vehicle.licensePlate || '',
    fuel: vehicle.fuelType || 'Petrol',
    mileage: vehicle.mileage ? String(vehicle.mileage) : '0',
    transmission: vehicle.transmission || 'Automatic',
    pricePerDay: Number(vehicle.dailyRate),
    status: (vehicle.status as string) || 'AVAILABLE',
    images: vehicle.images && vehicle.images.length > 0 ? [...vehicle.images] : ['https://via.placeholder.com/400x300?text=No+Image'],
    lastNote: '',
    returnDate: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm(f => ({ ...f, images: [base64String, ...f.images.slice(1)] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm(f => ({ ...f, images: newImages }));
  };

  const addImageField = () => {
    setForm(f => ({ ...f, images: [...f.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.plate?.trim()) return;
    onSave({ 
      ...form, 
      status: form.status as CarStatus,
      mileage: parseInt(form.mileage) || 0,
      images: form.images.filter(img => img.trim() !== '')
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-dark">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Vehicle</h2>
            <p className="text-xs text-text-secondary mt-0.5">{vehicle.make} {vehicle.model}</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form id="edit-vehicle-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Vehicle Name *</label>
              <input
                required
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary focus:border-primary"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Category</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as CarCategory }))}
              >
                {(['SUV', 'LUXURY', 'ECONOMY', 'COMPACT', 'VAN', 'BUS'] as CarCategory[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Type</label>
              <input
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary"
                placeholder="e.g. Grand Tourer"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              />
            </div>

            {/* Plate */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Plate Number *</label>
              <input
                required
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary uppercase"
                value={form.plate}
                onChange={e => setForm(f => ({ ...f, plate: e.target.value.toUpperCase() }))}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Price / Day (USD)</label>
              <input
                type="number"
                min={1}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.pricePerDay}
                onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
              />
            </div>

            {/* Fuel */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Fuel</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.fuel}
                onChange={e => setForm(f => ({ ...f, fuel: e.target.value }))}
              >
                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Mileage</label>
              <input
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary"
                placeholder="e.g. 25k km"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Transmission</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.transmission}
                onChange={e => setForm(f => ({ ...f, transmission: e.target.value }))}
              >
                {['Auto', 'Manual'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Status</label>
              <select
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as CarStatus }))}
              >
                {(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'DECOMMISSIONED'] as CarStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Return date (shown only when Rented) */}
            {form.status === 'Rented' && (
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Return Date</label>
                <input
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Tomorrow, in 3 days"
                  value={form.returnDate ?? ''}
                  onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))}
                />
              </div>
            )}

            {/* Note */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Note</label>
              <input
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary focus:ring-1 focus:ring-primary"
                placeholder="e.g. Last cleaned: today"
                value={form.lastNote}
                onChange={e => setForm(f => ({ ...f, lastNote: e.target.value }))}
              />
            </div>

            {/* Images */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-text-secondary uppercase">Vehicle Images</label>
                <button 
                  type="button" 
                  onClick={addImageField}
                  className="text-primary text-xs font-bold hover:text-white transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add URL
                </button>
              </div>
              
              <div className="space-y-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white text-sm"
                      placeholder="Image URL"
                      value={img}
                      onChange={e => updateImage(idx, e.target.value)}
                    />
                    {form.images.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeImageField(idx)}
                        className="p-2 text-text-secondary hover:text-red-400"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative group cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="border-2 border-dashed border-border-dark group-hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center bg-background-dark/50">
                  <span className="material-symbols-outlined text-text-secondary group-hover:text-primary mb-2">upload_file</span>
                  <span className="text-sm text-text-secondary group-hover:text-white font-medium">Click or Drag to Upload Image</span>
                  <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</span>
                </div>
              </div>

              {form.images[0] && (
                <div className="mt-2 rounded-xl border border-border-dark overflow-hidden h-32 bg-background-dark">
                  <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border-dark">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border-dark text-text-secondary hover:text-white font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-vehicle-form"
            className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
