import { useState, useCallback } from 'react';
import { toggleBudgetAlert } from '../api/smartWorkflowsApi';

/**
 * useToggleBudgetAlert
 *
 * Custom hook for toggling alert status on a budget card.
 * Implements optimistic UI update with automatic error rollback.
 *
 * @param {Function} setBudgets - State setter from parent useBudgets hook
 * @returns {Object} { toggleAlert, isUpdating, error, clearError }
 */
export function useToggleBudgetAlert(setBudgets) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const toggleAlert = useCallback(
    async (budgetId, currentAlertState) => {
      const targetState = !currentAlertState;
      setError(null);

      // Optimistically flip toggle in parent state
      setBudgets((prevBudgets) =>
        prevBudgets.map((item) => {
          if (item.id === budgetId) {
            const updatedPercent = item.percentUsed ?? 0;
            const threshold = item.alertThreshold ?? 80;
            const alertTriggered = targetState && updatedPercent >= threshold;
            return {
              ...item,
              alertsEnabled: targetState,
              alertTriggered,
            };
          }
          return item;
        })
      );

      setIsUpdating(true);
      try {
        const updatedItem = await toggleBudgetAlert(budgetId, targetState);
        // Replace with actual server response
        setBudgets((prevBudgets) =>
          prevBudgets.map((item) => (item.id === budgetId ? updatedItem : item))
        );
      } catch (err) {
        console.error('[useToggleBudgetAlert] Failed to toggle alert:', err);
        setError(`Failed to update alert setting for this category: ${err.message}`);

        // Rollback optimistic update
        setBudgets((prevBudgets) =>
          prevBudgets.map((item) => {
            if (item.id === budgetId) {
              const updatedPercent = item.percentUsed ?? 0;
              const threshold = item.alertThreshold ?? 80;
              const alertTriggered = currentAlertState && updatedPercent >= threshold;
              return {
                ...item,
                alertsEnabled: currentAlertState,
                alertTriggered,
              };
            }
            return item;
          })
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [setBudgets]
  );

  return {
    toggleAlert,
    isUpdating,
    error,
    clearError: () => setError(null),
  };
}
