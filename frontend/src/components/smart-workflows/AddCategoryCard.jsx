import React from 'react';
import { Plus } from 'lucide-react';

/**
 * AddCategoryCard
 *
 * Placeholder grid card with '+' button to open Add Category Modal.
 */
export function AddCategoryCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-panel border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 flex flex-col items-center justify-center hover:bg-slate-100/70 hover:border-slate-400 transition-all rounded-2xl min-h-[190px] w-full text-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-wm-blue"
      aria-label="Add new budget category"
    >
      <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center mb-3 transition-colors text-slate-600">
        <Plus className="w-6 h-6" />
      </div>
      <span className="text-sm font-bold text-slate-900">Add Category</span>
      <span className="text-[11px] text-wm-blue font-semibold mt-1">
        Create a new budget limit
      </span>
    </button>
  );
}
