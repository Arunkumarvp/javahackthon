import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useWeekendBreakdown } from '../../../hooks/useWeekendBreakdown';

const formatDate = d => d ? d.replace(/-/g, '/') : '';

/**
 * WeekendBreakdownModal
 *
 * Purpose: Modal showing daily spending data with weekend spike analysis.
 * Loads data on open via useWeekendBreakdown hook.
 * Renders a dynamic bar chart of daily spending colored by weekend/weekday.
 *
 * @param {{ startDate?: string, endDate?: string, onClose: Function }} props
 */
export function WeekendBreakdownModal({ startDate, endDate, onClose }) {
  const defaultStart = (() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  })();
  const defaultEnd = new Date().toISOString().split('T')[0];

  const [rangeStart, setRangeStart] = useState(startDate || defaultStart);
  const [rangeEnd, setRangeEnd]     = useState(endDate   || defaultEnd);

  const { data, loading, error, load } = useWeekendBreakdown();

  // Auto-load on mount and whenever date range changes
  useEffect(() => {
    load(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  // Compute max amount for chart scaling
  const maxAmount = data?.daily?.length
    ? Math.max(...data.daily.map(d => parseFloat(d.amount)))
    : 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Weekend Spending Breakdown"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Weekend Spending Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily spending analysis — weekends highlighted
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date Range Pickers */}
        <div className="flex gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">From</label>
            <input
              type="date"
              value={rangeStart}
              onChange={e => setRangeStart(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-wm-blue/30"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">To</label>
            <input
              type="date"
              value={rangeEnd}
              onChange={e => setRangeEnd(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-wm-blue/30"
            />
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5" aria-live="polite">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
              <span className="w-5 h-5 border-2 border-slate-200 border-t-wm-blue rounded-full animate-spin" aria-hidden="true" />
              <span className="text-sm">Loading breakdown data…</span>
            </div>
          )}

          {error && !loading && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex gap-2 items-center text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              <button onClick={() => load(rangeStart, rangeEnd)} className="ml-auto text-xs font-semibold underline">Retry</button>
            </div>
          )}

          {data && !loading && (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-amber-700">{data.spikePercent}%</div>
                  <div className="text-xs text-amber-600 mt-0.5">Weekend Spike</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-slate-700">£{parseFloat(data.totalWeekendSpend || 0).toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Weekend Total</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-slate-700">£{parseFloat(data.totalWeekdaySpend || 0).toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Weekday Total</div>
                </div>
              </div>

              {/* Top Categories */}
              {data.topCategories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-slate-500 self-center">Top categories:</span>
                  {data.topCategories.map(cat => (
                    <span key={cat} className="px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">{cat}</span>
                  ))}
                </div>
              )}

              {/* Daily Bar Chart */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Daily Spending</p>
                <div className="flex items-end gap-1 h-28 overflow-x-auto pb-2" role="img" aria-label="Daily spending bar chart">
                  {data.daily?.map(pt => {
                    const pct = (parseFloat(pt.amount) / maxAmount) * 100;
                    return (
                      <div key={pt.date} className="flex flex-col items-center gap-1 shrink-0" title={`${pt.date}: £${pt.amount}`}>
                        <div
                          className={`w-5 rounded-t transition-all ${pt.isWeekend ? 'bg-amber-500' : 'bg-slate-300'}`}
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                        <span className="text-[8px] text-slate-400 -rotate-45 origin-top-left w-4 overflow-hidden whitespace-nowrap">
                          {pt.date?.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded bg-amber-500" /> Weekend</span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded bg-slate-300" /> Weekday</span>
                </div>
              </div>

              {/* AI Insight */}
              {data.aiInsight && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">AI Insight</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">{data.aiInsight}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
