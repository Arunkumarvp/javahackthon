import React, { useEffect } from 'react';
import { X, PlaySquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSubscriptions } from '../../../hooks/useSubscriptions';

/**
 * SubscriptionsListModal
 *
 * Purpose: Modal displaying a live list of subscriptions.
 * Loads on open via useSubscriptions hook with status filter.
 * Each subscription row has a Cancel button that optimistically removes it.
 *
 * @param {{ onClose: Function }} props
 */
export function SubscriptionsListModal({ onClose }) {
  const { subscriptions, loading, error, load, cancel, cancelling } = useSubscriptions('unused');

  // Load unused subscriptions on mount
  useEffect(() => {
    load('unused');
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Review Subscriptions"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <PlaySquare className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Unused Subscriptions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Not used in 60+ days</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3" aria-live="polite">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
              <span className="w-5 h-5 border-2 border-slate-200 border-t-wm-blue rounded-full animate-spin" aria-hidden="true" />
              <span className="text-sm">Loading subscriptions…</span>
            </div>
          )}

          {error && !loading && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex gap-2 items-center text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              <button onClick={() => load('unused')} className="ml-auto text-xs font-semibold underline">Retry</button>
            </div>
          )}

          {!loading && !error && subscriptions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">No unused subscriptions found!</p>
              <p className="text-xs text-slate-500">All your active subscriptions are being used regularly.</p>
            </div>
          )}

          {subscriptions.map(sub => (
            <div
              key={sub.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-sm transition-all"
            >
              {/* Emoji logo */}
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                {sub.logoEmoji || '📦'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{sub.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sub.category} · Last used: {sub.lastUsedDate ? new Date(sub.lastUsedDate).toLocaleDateString('en-GB') : 'Unknown'}
                </p>
              </div>

              {/* Cost */}
              <div className="text-right shrink-0">
                <p className="font-bold text-slate-800 text-sm">£{parseFloat(sub.monthlyCost).toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">/month</p>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => cancel(sub.id)}
                disabled={cancelling === sub.id}
                aria-label={`Cancel ${sub.name} subscription`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors shrink-0 flex items-center gap-1.5"
              >
                {cancelling === sub.id && (
                  <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" aria-hidden="true" />
                )}
                Cancel
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {subscriptions.length > 0 && !loading && (
          <div className="px-6 py-3 border-t border-slate-100 bg-emerald-50 shrink-0">
            <p className="text-xs text-emerald-700 font-medium text-center">
              Cancelling all unused subscriptions could save £{subscriptions.reduce((sum, s) => sum + parseFloat(s.monthlyCost || 0), 0).toFixed(2)}/month
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
