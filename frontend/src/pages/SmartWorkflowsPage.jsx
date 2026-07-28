import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useToggleBudgetAlert } from '../hooks/useToggleBudgetAlert';
import { useCreateBudgetCategory } from '../hooks/useCreateBudgetCategory';
import { ActiveBudgetsGrid } from '../components/smart-workflows/ActiveBudgetsGrid';
import { CommunicationPreferencesPanel } from '../components/smart-workflows/CommunicationPreferencesPanel';
import { AddCategoryModal } from '../components/smart-workflows/modals/AddCategoryModal';

/**
 * SmartWorkflowsPage
 *
 * Top-level page component for Smart Workflows ("Budget Alerts & Automation").
 * Manages grid data fetching, alert toggle mutations, category creation modal,
 * and toast notification feedback.
 */
export function SmartWorkflowsPage() {
  const { budgets, setBudgets, loading, error, refetchBudgets } = useBudgets();
  const { toggleAlert, error: toggleError } = useToggleBudgetAlert(setBudgets);
  const { createCategory, isCreating, error: createError } = useCreateBudgetCategory(setBudgets);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleCreateCategory = async (formData) => {
    try {
      const created = await createCategory(formData);
      setIsModalOpen(false);
      showToast(`Category "${created.categoryName}" created successfully!`);
    } catch (_) {
      // Error handled by custom hook state
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Smart Workflows
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Budget Alerts & Automation
          </p>
        </div>

        <button
          type="button"
          onClick={refetchBudgets}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Error Banners */}
      {(error || toggleError || createError) && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error || toggleError || createError}</span>
        </div>
      )}

      {/* Active Budgets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Active Budgets</h3>
          <span className="text-xs font-semibold text-slate-500">
            {budgets.length} {budgets.length === 1 ? 'category' : 'categories'} configured
          </span>
        </div>

        <ActiveBudgetsGrid
          budgets={budgets}
          loading={loading}
          onToggleAlert={toggleAlert}
          onOpenAddModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Communication Preferences Accordion Section */}
      <CommunicationPreferencesPanel />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
        isSubmitting={isCreating}
      />
    </div>
  );
}
