import { useState, useCallback, useEffect } from 'react';
import {
  fetchNotificationPreferences,
  toggleNotificationPreference,
} from '../api/smartWorkflowsApi';

/**
 * useNotificationPreferences
 *
 * Custom hook to lazily fetch notification preferences on panel expand and handle instant toggles.
 * Implements caching (only fetches once per session) and optimistic UI updates with rollback.
 *
 * @returns {Object} { preferences, loading, error, isExpanded, toggleExpand, togglePreference }
 */
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadPreferences = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotificationPreferences(signal);
      setPreferences(data || []);
      setHasFetched(true);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[useNotificationPreferences] Fetch failed:', err);
      setError(err.message || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      const nextState = !prev;
      if (nextState && !hasFetched) {
        const controller = new AbortController();
        loadPreferences(controller.signal);
      }
      return nextState;
    });
  }, [hasFetched, loadPreferences]);

  const togglePreference = useCallback(async (key, currentState) => {
    const targetState = !currentState;
    setError(null);

    // Optimistically update local state
    setPreferences((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, enabled: targetState } : item
      )
    );

    try {
      const updated = await toggleNotificationPreference(key, targetState);
      setPreferences((prev) =>
        prev.map((item) => (item.key === key ? updated : item))
      );
    } catch (err) {
      console.error('[useNotificationPreferences] Preference toggle failed:', err);
      setError(`Failed to update preference: ${err.message}`);

      // Rollback to original state on error
      setPreferences((prev) =>
        prev.map((item) =>
          item.key === key ? { ...item, enabled: currentState } : item
        )
      );
    }
  }, []);

  return {
    preferences,
    loading,
    error,
    isExpanded,
    toggleExpand,
    togglePreference,
  };
}
