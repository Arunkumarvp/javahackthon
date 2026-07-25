/**
 * useSpendingTrend.js
 *
 * Purpose:
 * Fetches spending trend chart data for the food delivery card.
 * Re-fetches automatically when category or months change.
 * Uses AbortController to cancel stale requests.
 */

import { useState, useEffect, useRef } from 'react';
import { fetchSpendingTrend } from '../api/recommendationsApi';

/**
 * @param {string} category - Spending category (default: "food_delivery")
 * @param {number} months   - Number of months to include (default: 4)
 * @returns {{ data, loading, error }}
 */
export function useSpendingTrend(category = 'food_delivery', months = 4) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const abortRef              = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchSpendingTrend(category, months, controller.signal)
      .then(result => {
        setData(result);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load spending trend.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, months]);

  return { data, loading, error };
}
