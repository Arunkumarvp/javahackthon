/**
 * useCreateAutoTransfer.js
 *
 * Purpose:
 * Mutation hook for the "Create Auto-Transfer" form modal.
 * Manages submission loading, error, and success states.
 */

import { useState } from 'react';
import { postAutoTransfer } from '../api/recommendationsApi';

/**
 * @returns {{ submit, loading, error, success, reset }}
 */
export function useCreateAutoTransfer() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult]   = useState(null);

  /**
   * Submits the auto-transfer creation request.
   *
   * @param {string} fromCategory - Source budget category
   * @param {number} amount       - Monthly transfer amount
   * @param {string} frequency    - "MONTHLY" | "WEEKLY" | "DAILY"
   * @returns {Promise<Object|null>} - Confirmation payload or null on failure
   */
  async function submit(fromCategory, amount, frequency) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await postAutoTransfer({ fromCategory, amount, frequency });
      setResult(data);
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create auto-transfer. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setError(null);
    setSuccess(false);
    setResult(null);
  }

  return { submit, loading, error, success, result, reset };
}
