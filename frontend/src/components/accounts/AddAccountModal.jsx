import React, { useState } from 'react';
import { X, Landmark, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';

export function AddAccountModal({ onClose, onAccountAdded }) {
  const [nickname, setNickname] = useState('Rainy Day Fund');
  const [accountType, setAccountType] = useState('Personal');
  const [subType, setSubType] = useState('CurrentAccount');
  const [balance, setBalance] = useState('2500.00');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        Nickname: nickname,
        AccountCategory: accountType,
        AccountTypeCode: subType === 'SavingsAccount' ? 'SVGG' : 'CACC',
        Balance: balance,
        Currency: 'GBP'
      };

      const res = await fetch('/api/obie-aisp/v4.0/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg('OBIE Open Banking account successfully created!');
        setTimeout(() => {
          if (onAccountAdded) onAccountAdded();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('[OBIE Add Account] Failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-wm-border shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-wm-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-wm-textMain">Add Open Banking Account</h3>
              <p className="text-xs text-wm-textMuted mt-0.5">POST /api/obie-aisp/v4.0/accounts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-wm-border flex items-center justify-center text-wm-textMuted hover:text-wm-textMain hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-wm-textMuted mb-1">Account Nickname</label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 border border-wm-border rounded-lg text-sm focus:outline-none focus:border-wm-blue text-wm-textMain"
              placeholder="e.g. Rainy Day Fund"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-wm-textMuted mb-1">Category</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-3 py-2 border border-wm-border rounded-lg text-sm bg-white focus:outline-none focus:border-wm-blue text-wm-textMain"
              >
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-wm-textMuted mb-1">Type</label>
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="w-full px-3 py-2 border border-wm-border rounded-lg text-sm bg-white focus:outline-none focus:border-wm-blue text-wm-textMain"
              >
                <option value="CurrentAccount">Current</option>
                <option value="SavingsAccount">Savings</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-wm-textMuted mb-1">Initial Balance (GBP)</label>
            <input
              type="number"
              step="0.01"
              required
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3 py-2 border border-wm-border rounded-lg text-sm focus:outline-none focus:border-wm-blue text-wm-textMain"
              placeholder="2500.00"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-wm-border rounded-xl text-xs font-semibold text-wm-textMuted hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-wm-blue hover:bg-wm-blue-hover text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              {submitting ? 'Connecting...' : 'Connect OBIE Account'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
