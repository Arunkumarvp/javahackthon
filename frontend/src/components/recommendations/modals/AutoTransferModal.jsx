import React, { useState, useId } from 'react';
import { X, Landmark, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCreateAutoTransfer } from '../../../hooks/useCreateAutoTransfer';

const CATEGORIES = [
  { value: 'transport',    label: 'Transport' },
  { value: 'food_delivery', label: 'Food Delivery' },
  { value: 'dining',       label: 'Dining & Restaurants' },
  { value: 'retail',       label: 'Retail & Shopping' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities',    label: 'Utilities' },
];

const FREQUENCIES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'WEEKLY',  label: 'Weekly' },
  { value: 'DAILY',   label: 'Daily' },
];

/**
 * AutoTransferModal
 *
 * Purpose: Modal form for the "Create Auto-Transfer" action on the surplus reallocation card.
 * Defaults amount and category from the recommendation, allows user override.
 * On submit, posts to /api/auto-transfers.
 *
 * @param {{ defaultCategory?: string, defaultAmount?: number, onSuccess?: Function, onClose: Function }} props
 */
export function AutoTransferModal({ defaultCategory = 'transport', defaultAmount = 150, onSuccess, onClose }) {
  const [category, setCategory]   = useState(defaultCategory);
  const [amount, setAmount]       = useState(String(defaultAmount));
  const [frequency, setFrequency] = useState('MONTHLY');
  const [validationErr, setValErr] = useState('');

  const { submit, loading, error, success, result, reset } = useCreateAutoTransfer();

  const formId     = useId();
  const amountId   = useId();
  const categoryId = useId();
  const freqId     = useId();

  const handleSubmit = async e => {
    e.preventDefault();
    setValErr('');

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setValErr('Please enter a valid transfer amount greater than £0.');
      return;
    }

    const res = await submit(category, parsed, frequency);
    if (res) {
      onSuccess?.(res);
      setTimeout(onClose, 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 id={`${formId}-title`} className="font-bold text-slate-800">Create Auto-Transfer Rule</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" id={formId} noValidate>
          {/* Info banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700">
            Surplus funds under budget will be automatically moved to your savings account.
          </div>

          {/* Source Category */}
          <div>
            <label htmlFor={categoryId} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              From Budget Category
            </label>
            <select
              id={categoryId}
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor={amountId} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Transfer Amount (£)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">£</span>
              <input
                id={amountId}
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={e => { setAmount(e.target.value); setValErr(''); }}
                required
                className="w-full pl-8 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue transition-all"
                aria-describedby={validationErr ? `${amountId}-err` : undefined}
              />
            </div>
            {validationErr && (
              <p id={`${amountId}-err`} role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validationErr}
              </p>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label htmlFor={freqId} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Frequency
            </label>
            <div className="flex gap-2" role="group" aria-labelledby={freqId}>
              {FREQUENCIES.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFrequency(f.value)}
                  aria-pressed={frequency === f.value}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    frequency === f.value
                      ? 'bg-wm-blue text-white border-wm-blue shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-wm-blue hover:text-wm-blue'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Error */}
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Success */}
          {success && result && (
            <div role="status" aria-live="polite" className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Auto-transfer rule created! £{parseFloat(result.amount).toFixed(2)} will be transferred {(result.frequency || frequency).toLowerCase()}.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />}
              {loading ? 'Creating…' : 'Create Auto-Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
