import React from 'react';

/**
 * SkeletonCard
 *
 * Purpose: Reusable pulsing skeleton placeholder for recommendation cards.
 * Shown while card data is loading to prevent blank flashes.
 *
 * @param {{ tall?: boolean }} props - tall=true for the wider food delivery card
 */
export function SkeletonCard({ tall = false }) {
  return (
    <div className={`card-panel p-6 animate-pulse ${tall ? 'h-80' : 'h-64'}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="w-40 h-4 rounded bg-slate-200" />
        </div>
        <div className="w-20 h-5 rounded-full bg-slate-200" />
      </div>

      {/* Body lines */}
      <div className="space-y-2 mb-4">
        <div className="w-full h-3 rounded bg-slate-200" />
        <div className="w-5/6 h-3 rounded bg-slate-200" />
        <div className="w-4/6 h-3 rounded bg-slate-200" />
      </div>

      {/* Chart placeholder */}
      <div className="w-full h-16 rounded-lg bg-slate-200 mb-4" />

      {/* CTA placeholder */}
      <div className="w-full h-9 rounded-lg bg-slate-200 mt-auto" />
    </div>
  );
}

/**
 * ErrorCard
 *
 * Purpose: Error state card shown when a recommendation fetch fails.
 * Includes a retry button to trigger a fresh fetch.
 *
 * @param {{ message: string, onRetry: Function }} props
 */
export function ErrorCard({ message, onRetry }) {
  return (
    <div className="card-panel p-6 flex flex-col items-center justify-center min-h-[200px] text-center gap-3">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-red-600 text-lg">!</span>
      </div>
      <p className="text-sm text-red-600 font-medium">
        {message || 'Failed to load. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          aria-label="Retry loading"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Toast
 *
 * Purpose: Slide-in toast notification for success/error feedback.
 *
 * @param {{ message: string, type: 'success' | 'error', onDismiss: Function }} props
 */
export function Toast({ message, type = 'success', onDismiss }) {
  const base = type === 'success'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
    : 'bg-red-50 border-red-200 text-red-800';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg text-sm font-semibold animate-in slide-in-from-bottom-2 duration-300 ${base}`}
    >
      <span>{type === 'success' ? '✓' : '✗'}</span>
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
