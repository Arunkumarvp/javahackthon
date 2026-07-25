/**
 * useRecommendations.js
 *
 * Purpose:
 * Fetches the paginated recommendations list with debounced search (300ms),
 * AbortController cancellation on superseded requests, and session-level
 * caching to avoid redundant API calls for identical filter states.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRecommendations } from '../api/recommendationsApi';

// In-session cache keyed by serialized query params
const queryCache = new Map();

/**
 * @param {Object} params - { q, sortBy, sortDir, month, page, size }
 * @returns {{ data, loading, error, retry }}
 */
export function useRecommendations({ q = '', sortBy = 'priority', sortDir = 'asc', month = '', page = 0, size = 10 } = {}) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Hold reference to the current AbortController
  const abortRef = useRef(null);

  // Debounce the search query by 300ms
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  const buildCacheKey = useCallback(() =>
    JSON.stringify({ q: debouncedQ, sortBy, sortDir, month, page, size }),
    [debouncedQ, sortBy, sortDir, month, page, size]
  );

  const load = useCallback(async () => {
    // Abort any previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const cacheKey = buildCacheKey();

    // Return cached data immediately if available
    if (queryCache.has(cacheKey)) {
      setData(queryCache.get(cacheKey));
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchRecommendations(
        { q: debouncedQ, sortBy, sortDir, month, page, size },
        controller.signal
      );

      // Cache the result for this query combination
      queryCache.set(cacheKey, result);
      setData(result);
    } catch (err) {
      // AbortError is expected on cancellation — suppress it
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load recommendations.');
      }
    } finally {
      setLoading(false);
    }
  }, [buildCacheKey, debouncedQ, sortBy, sortDir, month, page, size]);

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [load]);

  return { data, loading, error, retry: load };
}
