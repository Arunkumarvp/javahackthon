import React, { useState, useEffect, useId } from 'react';
import { X, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSetSpendingLimit } from '../../../hooks/useSetSpendingLimit';

/**
 * SetLimitModal
 *
 * Purpose: Modal form for the "Set Limit" action on the food delivery card.
 * On submission, posts to /api/recommendations/{id}/spending-limit and
 * calls onSuccess with the confirmation payload for optimistic card update.
 *
 * @param {{ recommendationId: string, currentCategory: string, onSuccess: Function, onClose: Function }} props
 */
export function SetLimitModal({ recommendationId, currentCategory = 'food_delivery', onSuccess, onClose }) {
  const [category, setCategory]     = useState(currentCategory);
  const [limit, setLimit]           = useState('');
  const [validationErr, setValErr]  = useState('');
  const { submit, loading, error, success, reset } = useSetSpendingLimit();

  const formId    = useId();
  const limitId   = useId();
  const categoryId = useId();

  // Reset state on close
  useEffect(() => {
    if (!recommendationId) reset();
  }, [recommendationId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setValErr('');

    const parsed = parseFloat(limit);
    if (isNaN(parsed) || parsed <= 0) {
      setValErr('Please enter a valid limit greater than £0.');
      return;
    }

    const result = await submit(recommendationId, category, parsed);
    if (result) {
      onSuccess?.(result);
      setTimeout(onClose, 1500);
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Utensils className="w-4 h-4 text-amber-700" />
            </div>
            <h2 id={`${formId}-title`} className="font-bold text-slate-800">Set Monthly Spending Limit</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" id={formId} noValidate>
          {/* Category */}
          <div>
            <label htmlFor={categoryId} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <select
              id={categoryId}
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue"
            >
              <option value="food_delivery">Food Delivery</option>
              <option value="dining">Dining & Restaurants</option>
              <option value="groceries">Groceries</option>
              <option value="transport">Transport</option>
              <option value="retail">Retail & Shopping</option>
            </select>
          </div>

          {/* Monthly Limit */}
          <div>
            <label htmlFor={limitId} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Monthly Limit (£)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">£</span>
              <input
                id={limitId}
                type="number"
                min="1"
                step="0.01"
                value={limit}
                onChange={e => { setLimit(e.target.value); setValErr(''); }}
                placeholder="e.g. 150.00"
                required
                className="w-full pl-8 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue transition-all"
                aria-describedby={validationErr ? `${limitId}-err` : undefined}
              />
            </div>
            {validationErr && (
              <p id={`${limitId}-err`} role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validationErr}
              </p>
            )}
          </div>

          {/* Hint */}
          <p className="text-xs text-slate-500 leading-relaxed">
            You'll receive an alert when you reach 80% of this limit, and the AI Guardian will pause automated suggestions above it.
          </p>

          {/* API Error */}
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div role="status" aria-live="polite" className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Spending limit set successfully!
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
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-wm-blue hover:bg-wm-blue-hover text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />}
              {loading ? 'Setting limit…' : 'Set Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
