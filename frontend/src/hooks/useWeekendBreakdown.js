/**
 * useWeekendBreakdown.js
 *
 * Purpose:
 * On-demand fetch hook for the "View Weekend Breakdown" modal.
 * Fetch is triggered by calling load(), not on mount.
 * AbortController ensures stale requests are cancelled when date range changes.
 */

import { useState, useRef } from 'react';
import { fetchWeekendBreakdown } from '../api/recommendationsApi';

/**
 * @returns {{ data, loading, error, load }}
 */
export function useWeekendBreakdown() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const abortRef              = useRef(null);

  /**
   * Initiates the fetch for the given date range.
   *
   * @param {string} startDate - ISO-8601 YYYY-MM-DD
   * @param {string} endDate   - ISO-8601 YYYY-MM-DD
   */
  async function load(startDate, endDate) {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeekendBreakdown(startDate, endDate, controller.signal);
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load weekend breakdown.');
      }
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, load };
}
