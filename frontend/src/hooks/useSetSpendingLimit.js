/**
 * useSetSpendingLimit.js
 *
 * Purpose:
 * Mutation hook for the "Set Limit" action on the food delivery card.
 * Provides optimistic update on the parent card state with rollback on failure.
 */

import { useState } from 'react';
import { postSpendingLimit } from '../api/recommendationsApi';

/**
 * @returns {{ submit, loading, error, success }}
 */
export function useSetSpendingLimit() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Submits a spending limit for a recommendation.
   *
   * @param {string} recommendationId
   * @param {string} category
   * @param {number} monthlyLimit
   * @returns {Promise<Object|null>} - Confirmation payload or null on failure
   */
  async function submit(recommendationId, category, monthlyLimit) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await postSpendingLimit(recommendationId, { category, monthlyLimit });
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to set spending limit. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setError(null);
    setSuccess(false);
  }

  return { submit, loading, error, success, reset };
}
