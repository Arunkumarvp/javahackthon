/**
 * useSubscriptions.js
 *
 * Purpose:
 * Fetches subscriptions list on demand and provides a cancel mutation.
 * Optimistically removes cancelled subscriptions from the displayed list.
 */

import { useState, useRef } from 'react';
import { fetchSubscriptions, cancelSubscription } from '../api/recommendationsApi';

/**
 * @param {string} initialStatus - Initial status filter (default: "unused")
 * @returns {{ subscriptions, loading, error, load, cancel, cancelling }}
 */
export function useSubscriptions(initialStatus = 'unused') {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [cancelling, setCancelling]       = useState(null); // ID of sub being cancelled
  const abortRef                          = useRef(null);

  /**
   * Initiates the subscriptions fetch for the given status filter.
   *
   * @param {string} status - "unused" | "active" | "all"
   */
  async function load(status = initialStatus) {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchSubscriptions(status, controller.signal);
      setSubscriptions(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load subscriptions.');
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Cancels a subscription and optimistically removes it from the list.
   *
   * @param {string} subscriptionId - Subscription to cancel
   */
  async function cancel(subscriptionId) {
    setCancelling(subscriptionId);
    // Optimistic update: remove from displayed list immediately
    setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));

    try {
      await cancelSubscription(subscriptionId);
    } catch (err) {
      // Rollback on failure by reloading the full list
      setError(err.message || 'Failed to cancel subscription. Please retry.');
      await load();
    } finally {
      setCancelling(null);
    }
  }

  return { subscriptions, loading, error, load, cancel, cancelling };
}
