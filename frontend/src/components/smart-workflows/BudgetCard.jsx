import React from 'react';
import {
  ShoppingCart,
  Utensils,
  Car,
  Film,
  Plane,
  ShoppingBag,
  Dumbbell,
  AlertTriangle,
  Folder,
} from 'lucide-react';

/**
 * Icon resolver mapping API string names to Lucide icons.
 */
const ICON_MAP = {
  shopping_cart: ShoppingCart,
  restaurant: Utensils,
  utensils: Utensils,
  directions_car: Car,
  car: Car,
  theaters: Film,
  film: Film,
  flight: Plane,
  plane: Plane,
  shopping_bag: ShoppingBag,
  fitness_center: Dumbbell,
  dumbbell: Dumbbell,
};

/**
 * BudgetCard
 *
 * Renders an active budget category card with spending progress bar,
 * alert switch toggle, and dynamic threshold alert badge.
 *
 * Accessibility:
 * - Switch button uses role="switch" and aria-checked.
 */
export function BudgetCard({ budget, onToggleAlert }) {
  if (!budget) return null;

  const {
    id,
    categoryName,
    icon,
    alertsEnabled,
    spentAmount,
    limitAmount,
    percentUsed = 0,
    alertTriggered,
  } = budget;

  const IconComponent = ICON_MAP[icon] || Folder;
  const formattedSpent = Number(spentAmount || 0).toLocaleString('en-GB', {
    maximumFractionDigits: 2,
  });
  const formattedLimit = Number(limitAmount || 0).toLocaleString('en-GB', {
    maximumFractionDigits: 2,
  });

  const progressPercentage = Math.min(100, Math.max(0, percentUsed));

  return (
    <div
      className={`card-panel bg-white p-6 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between min-h-[190px] relative ${
        alertTriggered
          ? 'border-rose-200 bg-gradient-to-b from-rose-50/20 to-white'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Header: Icon, Category Name, and Toggle Switch */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              alertTriggered
                ? 'bg-rose-100 text-rose-600'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <IconComponent className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {categoryName}
            </h4>
            {alertTriggered ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-0.5">
                <AlertTriangle className="w-3 h-3" /> Alert triggered
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {alertsEnabled ? 'Alerts active' : 'Alerts paused'}
              </span>
            )}
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={alertsEnabled}
          aria-label={`Toggle alerts for ${categoryName}`}
          onClick={() => onToggleAlert(id, alertsEnabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-wm-blue focus:ring-offset-2 ${
            alertsEnabled ? 'bg-wm-blue' : 'bg-slate-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              alertsEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Spend Amount & Limit Display */}
      <div className="mt-auto">
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-sm text-slate-600">
            <span className="font-bold text-slate-900 text-base">
              £{formattedSpent}
            </span>{' '}
            of £{formattedLimit} limit
          </div>
          <span
            className={`text-xs font-bold ${
              alertTriggered ? 'text-rose-600' : 'text-slate-600'
            }`}
          >
            {percentUsed}%
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              alertTriggered
                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                : 'bg-gradient-to-r from-blue-500 to-wm-blue'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
