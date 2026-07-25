import React from 'react';
import { BudgetCard } from './BudgetCard';
import { AddCategoryCard } from './AddCategoryCard';

/**
 * ActiveBudgetsGrid
 *
 * Renders grid of BudgetCard items loaded dynamically from API,
 * skeleton cards during initial load, and the AddCategoryCard.
 */
export function ActiveBudgetsGrid({
  budgets,
  loading,
  onToggleAlert,
  onOpenAddModal,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="card-panel bg-white p-6 rounded-2xl border border-slate-200/80 animate-pulse min-h-[190px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
              </div>
              <div className="w-11 h-6 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-36" />
              <div className="h-2.5 bg-slate-200 rounded-full w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onToggleAlert={onToggleAlert}
        />
      ))}

      {/* Add Category Card Placeholder */}
      <AddCategoryCard onClick={onOpenAddModal} />
    </div>
  );
}
