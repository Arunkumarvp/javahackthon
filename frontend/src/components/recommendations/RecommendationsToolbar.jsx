import React, { useId } from 'react';
import { Search, ArrowUpDown, Calendar } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'priority', label: 'Priority' },
  { value: 'savings', label: 'Potential Savings' },
  { value: 'date', label: 'Date Added' },
];

const MONTH_OPTIONS = [
  { value: '',        label: 'All months' },
  { value: '2026-01', label: 'Jan 2026' },
  { value: '2025-12', label: 'Dec 2025' },
  { value: '2025-11', label: 'Nov 2025' },
  { value: '2025-10', label: 'Oct 2025' },
];

/**
 * RecommendationsToolbar
 *
 * Purpose:
 * Toolbar component rendering search input, sort dropdown, and month filter.
 * All state is lifted to the parent RecommendationsPage via callback props.
 *
 * Accessibility:
 * - All controls are keyboard-operable.
 * - Search input announces loading state via aria-busy.
 * - Labels for all form controls.
 *
 * @param {{ q, onQChange, sortBy, onSortByChange, sortDir, onSortDirChange, month, onMonthChange, loading }} props
 */
export function RecommendationsToolbar({
  q,
  onQChange,
  sortBy,
  onSortByChange,
  sortDir,
  onSortDirChange,
  month,
  onMonthChange,
  loading,
}) {
  const searchId = useId();
  const sortId   = useId();
  const monthId  = useId();

  const toggleSortDir = () => onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc');

  return (
    <div
      className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-wm-border bg-white/50 backdrop-blur-sm"
      role="search"
      aria-label="Recommendation filters"
    >
      {/* Search Input */}
      <div className="flex-1 relative">
        <label htmlFor={searchId} className="sr-only">Search recommendations</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wm-textMuted pointer-events-none" />
        <input
          id={searchId}
          type="search"
          value={q}
          onChange={e => onQChange(e.target.value)}
          placeholder="Search recommendations…"
          aria-busy={loading}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue transition-all placeholder:text-slate-400"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="inline-block w-3 h-3 border-2 border-wm-blue/30 border-t-wm-blue rounded-full animate-spin" aria-hidden="true" />
          </span>
        )}
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-2">
        <label htmlFor={sortId} className="text-xs font-semibold text-wm-textMuted whitespace-nowrap">Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={e => onSortByChange(e.target.value)}
          className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Sort Direction Toggle */}
        <button
          onClick={toggleSortDir}
          aria-label={`Sort direction: ${sortDir === 'asc' ? 'Ascending (click for descending)' : 'Descending (click for ascending)'}`}
          title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
          className={`p-2 rounded-lg border transition-all ${sortDir === 'desc' ? 'bg-wm-blue text-white border-wm-blue' : 'bg-white text-slate-500 border-slate-200 hover:border-wm-blue hover:text-wm-blue'}`}
        >
          <ArrowUpDown className={`w-4 h-4 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Month Filter */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-wm-textMuted" aria-hidden="true" />
        <label htmlFor={monthId} className="sr-only">Filter by month</label>
        <select
          id={monthId}
          value={month}
          onChange={e => onMonthChange(e.target.value)}
          className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wm-blue/30 focus:border-wm-blue transition-all cursor-pointer"
        >
          {MONTH_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
