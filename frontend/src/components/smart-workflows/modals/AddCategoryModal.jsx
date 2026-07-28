import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'shopping_cart', label: '🛒 Grocery' },
  { value: 'restaurant', label: '🍽️ Dining Out' },
  { value: 'directions_car', label: '🚗 Transport' },
  { value: 'theaters', label: '🎬 Entertainment' },
  { value: 'flight', label: '✈️ Travel' },
  { value: 'shopping_bag', label: '🛍️ Shopping' },
  { value: 'fitness_center', label: '🏋️ Health & Fitness' },
];

/**
 * AddCategoryModal
 *
 * Accessible modal form dialog for creating a new budget category.
 */
export function AddCategoryModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [categoryName, setCategoryName] = useState('');
  const [icon, setIcon] = useState('shopping_cart');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategoryName('');
      setIcon('shopping_cart');
      setMonthlyLimit('');
      setValidationError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!categoryName.trim()) {
      setValidationError('Category name is required.');
      return;
    }

    const limitNum = parseFloat(monthlyLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setValidationError('Monthly limit must be greater than 0.');
      return;
    }

    onSubmit({
      categoryName: categoryName.trim(),
      icon,
      monthlyLimit: limitNum,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-category-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3
              id="add-category-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              Add Budget Category
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="categoryName"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              placeholder="e.g. Health & Fitness"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-wm-blue focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="iconSelect"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Category Icon
            </label>
            <select
              id="iconSelect"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-wm-blue focus:border-transparent bg-white transition-all"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="monthlyLimit"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Monthly Limit (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                £
              </span>
              <input
                id="monthlyLimit"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="200.00"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-wm-blue focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-wm-blue hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
