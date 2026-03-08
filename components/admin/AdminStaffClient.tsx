"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { toggleStaffStatus, deleteStaff, createStaff, updateStaffRole } from '@/app/actions/staffActions';

interface StaffMember {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
  staffProfile: {
    id: string;
    jobTitle: string | null;
    isActive: boolean;
    department: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminStaffClient() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjusted to match design

  // New Staff Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/admin/staff');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.details || errorData.error || 'Failed to fetch staff');
        }
        const data = await res.json();
        setStaff(data);
      } catch (e: unknown) {
        console.error('Staff fetch error:', e instanceof Error ? e.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staff.filter(s =>
      `${s.firstName ?? ''} ${s.lastName ?? ''}`.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }, [staff, search]);

  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter(s => s.staffProfile?.isActive).length,
      admins: staff.filter(s => ['ADMIN', 'SUPER_ADMIN'].includes(s.role)).length,
      managers: staff.filter(s => s.role === 'MANAGER' || s.staffProfile?.jobTitle?.toLowerCase().includes('manager')).length,
      consultants: staff.filter(s => s.role === 'CONSULTANT').length,
    };
  }, [staff]);

  // Paginated data
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleRoleChange = async (id: string, role: string) => {
    const prev = staff.find(s => s.id === id);
    if (!prev) return;
    // Optimistic update
    setStaff(st => st.map(s => s.id === id ? { ...s, role } : s));
    const res = await updateStaffRole(id, role);
    if (!res.success) {
      // Revert on failure
      setStaff(st => st.map(s => s.id === id ? prev : s));
      alert('Failed to update role: ' + (res.error || 'Unknown error'));
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    const prev = staff.find(s => s.id === id);
    if (!prev) return;
    
    // Optimistic update
    setStaff(st => st.map(s => s.id === id ? { ...s, staffProfile: s.staffProfile ? { ...s.staffProfile, isActive } : { id: 'temp', userId: id, isActive, department: null, jobTitle: 'Staff Member' } } : s));
    
    const res = await toggleStaffStatus(id, isActive);
    if (!res.success) {
      setStaff(st => st.map(s => s.id === id ? prev : s));
      alert('Failed to toggle status: ' + (res.error || 'Unknown error'));
    } else if (res.profile) {
      setStaff(st => st.map(s => s.id === id ? { ...s, staffProfile: res.profile } : s));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this staff member?')) return;
    const prev = staff;
    setStaff(st => st.filter(s => s.id !== id));
    const res = await deleteStaff(id);
    if (!res.success) {
      setStaff(prev);
      alert('Failed to delete staff: ' + (res.error || 'Unknown error'));
    }
  };

  const handleCreateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
    };

    const res = await createStaff(data);
    if (res.success) {
      setStaff(prev => [res.user, ...prev]);
      setIsModalOpen(false);
    } else {
      alert('Failed to create staff member: ' + res.error);
    }
    setIsSubmitting(false);
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <AdminSidebar />
      
      <main className="flex-1 min-h-screen flex flex-col relative overflow-y-auto">
        <header className="h-16 border-b border-border-light dark:border-border-dark bg-surface-light/80 dark:bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">Staff Management</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background-light dark:ring-background-dark"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center ring-2 ring-border-light dark:ring-border-dark" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfuKqcOkunrnvb9BkHNojuFUo4dWnDHGES5vcNX30EC2LWpQcTQG9mnVTKsJUQpVbi9RXkP8cs65vbiv4aYNE-OAI644VpovzXS0t5BONnmx8CTtZ9-fy87PpL8LDqbEVjVN7wIJN9KtENt6FWwvGMFKheOAfsikxOQOcdhZsER3G3pCTlzXFqaJmI8NlDF0eysXM3OvpU1TIZ-A0J4-9HpGgm9tl2luDVj1MB5xN9xNeotKGxD-HKE7gMEpI6PvcDOl-7CXYl6A')" }}></div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Team Overview</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage team members, roles, and access permissions.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input 
                  className="pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-[#141414] text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none w-64 transition-all" 
                  placeholder="Search staff..." 
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-primary/25 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add New Staff
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-light dark:bg-[#141414] border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col gap-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-primary">groups</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Staff</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">+2 this month</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-auto">{stats.total}</p>
            </div>
            {/* Additional stat cards */}
            <div className="bg-surface-light dark:bg-[#141414] border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col gap-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-purple-500">admin_panel_settings</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Admins</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-auto">{stats.admins}</p>
            </div>
            <div className="bg-surface-light dark:bg-[#141414] border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col gap-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-blue-500">supervisor_account</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Managers</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-auto">{stats.managers}</p>
            </div>
            <div className="bg-surface-light dark:bg-[#141414] border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col gap-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-orange-500">support_agent</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Consultants</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">+1 this month</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-auto">{stats.consultants}</p>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-[#141414] border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-[#1a1a1a]">
                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff Member</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Active</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-6"><div className="flex gap-4"><div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800"></div><div className="space-y-2"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div><div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></div></div></td>
                        <td className="py-4 px-6"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div></td>
                        <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                        <td className="py-4 px-6"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                        <td className="py-4 px-6 text-right"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                      </tr>
                    ))
                  ) : paginatedStaff.map(s => (
                    <tr key={s.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {s.avatarUrl ? (
                            <div className="h-10 w-10 rounded-full bg-cover bg-center ring-1 ring-border-light dark:border-border-dark" style={{ backgroundImage: `url('${s.avatarUrl}')` }} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary border border-primary/20 uppercase">
                              {s.firstName?.charAt(0) ?? 'U'}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.firstName} {s.lastName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={s.role}
                          onChange={e => handleRoleChange(s.id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-md border cursor-pointer outline-none transition-all ${
                            s.role === 'SUPER_ADMIN'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : s.role === 'ADMIN'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : s.role === 'CONSULTANT'
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          <option value="CUSTOMER">Staff Member</option>
                          <option value="CONSULTANT">Consultant</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => handleToggleStatus(s.id, !(s.staffProfile?.isActive ?? false))}
                          className="flex items-center gap-2 group/status"
                        >
                          <div className={`h-2 w-2 rounded-full ${s.staffProfile?.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                          <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/status:text-primary transition-colors">
                            {s.staffProfile?.isActive ? 'Active' : 'Offline'}
                          </span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                        {getTimeAgo(s.updatedAt)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            href={`/admin/staff/${s.id}/permissions`}
                            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                          >
                            Permissions
                          </Link>
                          <button 
                            onClick={() => handleDelete(s.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border-light dark:border-border-dark bg-slate-50 dark:bg-[#1a1a1a]">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filtered.length}</span> staff members
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal matching createStaff from original but with new styling */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-surface-light dark:bg-[#141414] border border-border-light dark:border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50 dark:bg-background-dark/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person_add</span>
                  Add Team Member
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateStaff} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                    <input required name="firstName" type="text" placeholder="John" className="w-full bg-slate-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-3 text-slate-900 dark:text-white text-sm focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                    <input required name="lastName" type="text" placeholder="Doe" className="w-full bg-slate-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-3 text-slate-900 dark:text-white text-sm focus:border-primary outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input required name="email" type="email" placeholder="john@wanderlux.com" className="w-full bg-slate-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-3 text-slate-900 dark:text-white text-sm focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Role</label>
                  <select required name="role" className="w-full bg-slate-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-3 text-slate-900 dark:text-white text-sm focus:border-primary outline-none transition-all cursor-pointer">
                    <option value="STAFF">Staff Member</option>
                    <option value="CONSULTANT">Travel Consultant</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl transition-all">Cancel</button>
                  <button 
                    disabled={isSubmitting} 
                    type="submit" 
                    className="flex-1 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl disabled:opacity-50 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Creating...' : 'Confirm Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
