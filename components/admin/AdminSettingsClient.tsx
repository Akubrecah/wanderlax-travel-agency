"use client";

import React, { useState } from 'react';
import { updateGeneralSettings } from '@/app/actions/settingsActions';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminSettingsClient({ initialSettings }: { initialSettings: Record<string, string | null | undefined> }) {
  const [settings, setSettings] = useState({
    siteName: initialSettings?.siteName || 'Wanderlax',
    siteImage: initialSettings?.siteImage || '',
    language: initialSettings?.language || 'en',
    timeZone: initialSettings?.timeZone || 'UTC',
    currency: initialSettings?.currency || 'USD',
    contactEmail: initialSettings?.contactEmail || '',
    contactPhone: initialSettings?.contactPhone || '',
    whatsappUrl: initialSettings?.whatsappUrl || '',
    instagramUrl: initialSettings?.instagramUrl || '',
    facebookUrl: initialSettings?.facebookUrl || '',
    xUrl: initialSettings?.xUrl || '',
    telegramUrl: initialSettings?.telegramUrl || '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
    // Clear message when editing
    if (message) setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateGeneralSettings(settings);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Global settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update settings.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-[#120d0d] overflow-hidden relative">
      <AdminHeader 
        title="Web Settings" 
        description="Manage the global configuration for your travel agency."
      >
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white shadow-lg shadow-primary/30 hover:bg-red-700 text-sm font-bold transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </AdminHeader>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              <span className="material-symbols-outlined">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl shadow-black/20">
            <div className="p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">web</span>
                General Information
              </h2>
              <p className="text-sm text-text-secondary mt-1">Configure the main identity parameters of your website.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Website Name</label>
                  <input 
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g. Wanderlax Travels"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Brand Logo URL (Image)</label>
                  <input 
                    type="text"
                    name="siteImage"
                    value={settings.siteImage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://example.com/logo.png"
                  />
                  {settings.siteImage && (
                    <div className="mt-2 h-16 w-auto inline-block rounded border border-border-dark bg-background-dark overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={settings.siteImage} alt="Logo Preview" className="h-full w-auto object-contain mx-auto mix-blend-screen bg-black/50" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl shadow-black/20">
            <div className="p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">public</span>
                Regional & Localization
              </h2>
              <p className="text-sm text-text-secondary mt-1">Set defaults for your users globally.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Default Language</label>
                  <div className="relative">
                    <select 
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="en">English (US)</option>
                      <option value="en-gb">English (UK)</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ar">Arabic</option>
                      <option value="zh">Chinese</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Time Zone</label>
                  <div className="relative">
                    <select 
                      name="timeZone"
                      value={settings.timeZone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="UTC">UTC / GMT</option>
                      <option value="EST">Eastern Time (EST/EDT)</option>
                      <option value="CST">Central Time (CST/CDT)</option>
                      <option value="PST">Pacific Time (PST/PDT)</option>
                      <option value="Europe/London">London (GBP)</option>
                      <option value="Europe/Paris">Central Europe (CET)</option>
                      <option value="Asia/Dubai">Dubai (GST)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Australia/Sydney">Sydney (AEST)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Currency</label>
                  <div className="relative">
                    <select 
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="AED">Emirati Dirham (AED)</option>
                      <option value="CAD">Canadian Dollar (C$)</option>
                      <option value="AUD">Australian Dollar (A$)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl shadow-black/20">
            <div className="p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contact_mail</span>
                Contact Information
              </h2>
              <p className="text-sm text-text-secondary mt-1">Details shown in footer and email templates.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Public Contact Email</label>
                  <input 
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="support@wanderlax.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Support Phone Number</label>
                  <input 
                    type="tel"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+1 800 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl shadow-black/20">
            <div className="p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat</span>
                Social Media Chat Links
              </h2>
              <p className="text-sm text-text-secondary mt-1">URLs for the floating social chat widget shown to visitors.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#25D366]"></span>
                    WhatsApp Link
                  </label>
                  <input 
                    type="text"
                    name="whatsappUrl"
                    value={settings.whatsappUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://wa.me/18005550199"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#E4405F]"></span>
                    Instagram Link
                  </label>
                  <input 
                    type="text"
                    name="instagramUrl"
                    value={settings.instagramUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://ig.me/m/wanderlux"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#1877F2]"></span>
                    Facebook Messenger Link
                  </label>
                  <input 
                    type="text"
                    name="facebookUrl"
                    value={settings.facebookUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://m.me/wanderlux"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-white"></span>
                    X (Twitter) Link
                  </label>
                  <input 
                    type="text"
                    name="xUrl"
                    value={settings.xUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://twitter.com/messages/compose?recipient_id=wanderlux"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#0088cc]"></span>
                    Telegram Link
                  </label>
                  <input 
                    type="text"
                    name="telegramUrl"
                    value={settings.telegramUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-dark bg-background-dark text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://t.me/wanderlux"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
