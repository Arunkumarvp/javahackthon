/**
 * useSavingsOffers.js
 *
 * Purpose:
 * On-demand fetch hook for the "Explore Accounts" savings offers modal.
 * Triggered by calling load(), not on mount.
 */

import { useState, useRef } from 'react';
import { fetchSavingsOffers } from '../api/recommendationsApi';

/**
 * @returns {{ offers, loading, error, load }}
 */
export function useSavingsOffers() {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const abortRef              = useRef(null);

  /**
   * Fetches savings offers for the given surplus amount.
   *
   * @param {number} surplusAmount - User's available surplus
   */
  async function load(surplusAmount) {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchSavingsOffers(surplusAmount, controller.signal);
      setOffers(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load savings offers.');
      }
    } finally {
      setLoading(false);
    }
  }

  return { offers, loading, error, load };
}
