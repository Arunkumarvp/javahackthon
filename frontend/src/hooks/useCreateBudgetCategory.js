import { useState, useCallback } from 'react';
import { createBudgetCategory } from '../api/smartWorkflowsApi';

/**
 * useCreateBudgetCategory
 *
 * Custom hook to handle budget category creation.
 * Calls POST /api/budgets and updates parent state upon success.
 *
 * @param {Function} setBudgets - State setter from useBudgets hook
 * @returns {Object} { createCategory, isCreating, error, clearError }
 */
export function useCreateBudgetCategory(setBudgets) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createCategory = useCallback(
    async (formData, onSuccess) => {
      setIsCreating(true);
      setError(null);
      try {
        const newCategory = await createBudgetCategory(formData);
        setBudgets((prev) => [...prev, newCategory]);
        if (onSuccess) onSuccess(newCategory);
        return newCategory;
      } catch (err) {
        console.error('[useCreateBudgetCategory] Creation failed:', err);
        setError(err.message || 'Failed to create budget category');
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [setBudgets]
  );

  return {
    createCategory,
    isCreating,
    error,
    clearError: () => setError(null),
  };
}
