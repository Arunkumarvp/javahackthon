import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, CreditCard, Lock, Bell, CheckCircle2, AlertTriangle, Key, Save, RefreshCw, Slash } from 'lucide-react';
import { chatService } from '../../services/chatService';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await chatService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('[Profile] Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleTogglePii = () => {
    setProfile(prev => ({ ...prev, piiMaskingActive: !prev.piiMaskingActive }));
  };

  const handleToggleVop = () => {
    setProfile(prev => ({ ...prev, vopRequired: !prev.vopRequired }));
  };

  const handleThresholdChange = (val) => {
    setProfile(prev => ({ ...prev, gateThreshold: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      await chatService.updateProfile(profile);
      setSaveMessage('Profile and security preferences updated successfully!');
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      console.error('[Profile] Save failed:', err);
      setSaveMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeConsent = async () => {
    if (!window.confirm('Are you sure you want to revoke all AI Open Banking data permissions immediately?')) return;
    try {
      await chatService.revokeScope();
      setRevoked(true);
      setProfile(prev => ({ ...prev, consentStatus: 'REVOKED' }));
    } catch (err) {
      console.error('[Profile] Revoke failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-wm-textMuted animate-pulse">
        <p>Loading Customer Banking Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-8">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-wm-border pb-4">
        <div>
          <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">Customer Profile & Security</h2>
          <p className="text-sm text-wm-textMuted mt-1">Manage your Open Banking connections, FCA KYC verification, and AI Guardian preferences.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FCA Verified Customer</span>
          </span>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <span>{saveMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Identity & KYC */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-panel p-6 text-center relative overflow-hidden">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 border-2 border-wm-blue/20 overflow-hidden mb-4 shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Alex'}&backgroundColor=e6f0f5`}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-wm-textMain">{profile?.fullName || 'Alex Morgan'}</h3>
            <p className="text-xs text-wm-textMuted font-mono mt-0.5">{profile?.customerRef || 'CUST-8839201'}</p>

            <div className="mt-4 pt-4 border-t border-wm-border space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-wm-textMuted">KYC Level:</span>
                <span className="font-semibold text-emerald-700">Tier 2 Passport Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wm-textMuted">Account Status:</span>
                <span className="font-semibold text-wm-blue">Active Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wm-textMuted">Open Banking Consent:</span>
                <span className={`font-semibold ${revoked ? 'text-red-600' : 'text-emerald-600'}`}>
                  {revoked ? 'REVOKED' : 'ACTIVE (89 Days)'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Revocation Widget */}
          <div className="card-panel p-6 border-red-200 bg-red-50/30">
            <h4 className="text-sm font-bold text-red-900 flex items-center gap-2 mb-2">
              <Slash className="w-4 h-4 text-red-600" />
              Emergency Kill-Switch
            </h4>
            <p className="text-xs text-red-700 mb-4">
              Instantly revoke all AI data access scope and halt active payment execution permissions.
            </p>
            <button
              onClick={handleRevokeConsent}
              disabled={revoked}
              className="w-full py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-medium text-xs shadow-sm transition-all"
            >
              {revoked ? 'Consent Revoked' : 'Revoke All AI Access'}
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Preferences Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Contact Information Section */}
            <div className="card-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-wm-textMain flex items-center gap-2">
                <User className="w-4 h-4 text-wm-blue" />
                Personal & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-wm-textMuted mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={profile?.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-wm-border rounded-lg focus:outline-none focus:border-wm-blue text-wm-textMain"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wm-textMuted mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-wm-border rounded-lg focus:outline-none focus:border-wm-blue text-wm-textMain"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wm-textMuted mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile?.phoneNumber || ''}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-wm-border rounded-lg focus:outline-none focus:border-wm-blue text-wm-textMain"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wm-textMuted mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={profile?.address || ''}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-3 py-2 border border-wm-border rounded-lg focus:outline-none focus:border-wm-blue text-wm-textMain"
                  />
                </div>
              </div>
            </div>

            {/* Linked Open Banking Account Section */}
            <div className="card-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-wm-textMain flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-wm-blue" />
                Linked Open Banking Account
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-wm-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-wm-textMuted block">Bank Institution</span>
                  <span className="font-bold text-wm-textMain">{profile?.linkedBankName || 'Banfico OBIE Bank'}</span>
                </div>
                <div>
                  <span className="text-wm-textMuted block">Sort Code</span>
                  <span className="font-bold text-wm-textMain">{profile?.maskedSortCode || '12-34-**'}</span>
                </div>
                <div>
                  <span className="text-wm-textMuted block">Account Number</span>
                  <span className="font-bold text-wm-textMain">{profile?.maskedAccountNumber || '****5678'}</span>
                </div>
              </div>
            </div>

            {/* AI Financial Guardian Security Controls */}
            <div className="card-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-wm-textMain flex items-center gap-2">
                <Lock className="w-4 h-4 text-wm-blue" />
                AI Guardian Security Controls
              </h3>

              <div className="space-y-3 text-xs">
                {/* PII Masking Switch */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-wm-border">
                  <div>
                    <span className="font-bold text-wm-textMain block">Zero-Trust PII Masking</span>
                    <span className="text-wm-textMuted">Sanitizes card numbers, sort codes, and emails before LLM dispatch.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile?.piiMaskingActive ?? true}
                    onChange={handleTogglePii}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* VoP Requirement Switch */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-wm-border">
                  <div>
                    <span className="font-bold text-wm-textMain block">Verification of Payee (VoP) Gate</span>
                    <span className="text-wm-textMuted">Mandates payee registry matching before proposing outbound transfers.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile?.vopRequired ?? true}
                    onChange={handleToggleVop}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* Gate Threshold Selector */}
                <div className="p-3 rounded-lg border border-wm-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-wm-textMain">Step-up Payment Gate Threshold</span>
                    <span className="font-bold text-emerald-700">£{profile?.gateThreshold || '100.00'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {[50, 100, 250, 500].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => handleThresholdChange(val)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          profile?.gateThreshold == val
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white border-wm-border text-wm-textMain hover:bg-slate-50'
                        }`}
                      >
                        £{val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-wm-blue hover:bg-wm-blue-hover text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Preferences...' : 'Save Profile Changes'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
