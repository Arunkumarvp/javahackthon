/**
 * smartWorkflowsApi.js
 *
 * Dedicated API client for Smart Workflows (Budget Alerts & Automation) endpoints.
 * Supports AbortController signals on fetch calls for request cancellation.
 */

const getBaseUrl = () => {
  if (
    typeof window !== 'undefined' &&
    (window.location.port === '3000' ||
      window.location.port === '5173' ||
      window.location.port === '4173')
  ) {
    return 'http://localhost:8080/api';
  }
  return '/api';
};

const BASE_URL = getBaseUrl();

/**
 * Core fetch wrapper with Authorization header injection and error handling.
 *
 * @param {string}      path     - API endpoint path
 * @param {RequestInit} options  - Fetch options
 * @returns {Promise<any>}        - Response payload JSON
 */
async function apiFetch(path, options = {}) {
  const token =
    localStorage.getItem('wealthmanager_token') || 'jwt-guardian-demo-token';

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `API error ${response.status}`;
    try {
      const body = await response.json();
      errorMessage = body.message || errorMessage;
    } catch (_) {
      // Ignore JSON parsing failure for error response
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Fetches all active budget categories.
 *
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<Array>} List of BudgetDto objects
 */
export async function fetchBudgets(signal) {
  return apiFetch('/budgets', { signal });
}

/**
 * Creates a new budget category.
 *
 * @param {Object}      data - { categoryName, icon, monthlyLimit }
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<Object>} Created BudgetDto
 */
export async function createBudgetCategory(data, signal) {
  return apiFetch('/budgets', {
    method: 'POST',
    body: JSON.stringify(data),
    signal,
  });
}

/**
 * Toggles alert status for a budget category.
 *
 * @param {string}      id - Budget category ID
 * @param {boolean}     alertsEnabled - Target alert status
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<Object>} Updated BudgetDto
 */
export async function toggleBudgetAlert(id, alertsEnabled, signal) {
  return apiFetch(`/budgets/${id}/alert-status`, {
    method: 'PATCH',
    body: JSON.stringify({ alertsEnabled }),
    signal,
  });
}

/**
 * Updates monthly limit for a budget category.
 *
 * @param {string}      id - Budget category ID
 * @param {number}      monthlyLimit - New monthly limit
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<Object>} Updated BudgetDto
 */
export async function updateBudgetLimit(id, monthlyLimit, signal) {
  return apiFetch(`/budgets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ monthlyLimit }),
    signal,
  });
}

/**
 * Removes a budget category.
 *
 * @param {string}      id - Budget category ID
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<null>}
 */
export async function deleteBudgetCategory(id, signal) {
  return apiFetch(`/budgets/${id}`, {
    method: 'DELETE',
    signal,
  });
}

/**
 * Fetches communication notification preferences.
 *
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<Array>} List of NotificationPreferenceDto objects
 */
export async function fetchNotificationPreferences(signal) {
  return apiFetch('/notification-preferences', { signal });
}

/**
 * Toggles a notification preference channel state.
 *
 * @param {string}      key - Preference key
 * @param {boolean}     enabled - Target toggle state
 * @param {AbortSignal} [signal] - Optional cancellation signal
 * @returns {Promise<Object>} Updated NotificationPreferenceDto
 */
export async function toggleNotificationPreference(key, enabled, signal) {
  return apiFetch(`/notification-preferences/${key}`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
    signal,
  });
}
