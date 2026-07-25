import { useState, useEffect, useCallback } from 'react';
import { fetchBudgets } from '../api/smartWorkflowsApi';

/**
 * useBudgets
 *
 * Custom hook to fetch and manage budget list state.
 * Uses AbortController for request cancellation.
 *
 * @returns {Object} { budgets, setBudgets, loading, error, refetchBudgets }
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBudgets = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBudgets(signal);
      setBudgets(data || []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[useBudgets] Failed to load budgets:', err);
      setError(err.message || 'Failed to load budget categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadBudgets(controller.signal);
    return () => controller.abort();
  }, [loadBudgets]);

  const refetchBudgets = useCallback(() => {
    const controller = new AbortController();
    loadBudgets(controller.signal);
  }, [loadBudgets]);

  return {
    budgets,
    setBudgets,
    loading,
    error,
    refetchBudgets,
  };
}
