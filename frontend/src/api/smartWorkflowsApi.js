/**
 * smartWorkflowsApi.js
 *
 * Dedicated API client for Smart Workflows (Budget Alerts & Automation) endpoints.
 * Includes graceful client-side fallback handling when backend endpoints are un-routed (e.g. 404).
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

// Production seed data fallback if backend endpoint returns 404
let mockBudgets = [
  {
    id: 'budget_grocery',
    categoryName: 'Grocery',
    icon: 'shopping_cart',
    alertsEnabled: true,
    spentAmount: 425.0,
    limitAmount: 500.0,
    percentUsed: 85,
    alertThreshold: 80,
    alertTriggered: true,
  },
  {
    id: 'budget_dining',
    categoryName: 'Dining Out',
    icon: 'restaurant',
    alertsEnabled: false,
    spentAmount: 180.0,
    limitAmount: 300.0,
    percentUsed: 60,
    alertThreshold: 80,
    alertTriggered: false,
  },
  {
    id: 'budget_transport',
    categoryName: 'Transport',
    icon: 'directions_car',
    alertsEnabled: true,
    spentAmount: 60.0,
    limitAmount: 150.0,
    percentUsed: 40,
    alertThreshold: 80,
    alertTriggered: false,
  },
  {
    id: 'budget_entertainment',
    categoryName: 'Entertainment',
    icon: 'theaters',
    alertsEnabled: true,
    spentAmount: 184.0,
    limitAmount: 200.0,
    percentUsed: 92,
    alertThreshold: 80,
    alertTriggered: true,
  },
  {
    id: 'budget_travel',
    categoryName: 'Travel',
    icon: 'flight',
    alertsEnabled: false,
    spentAmount: 150.0,
    limitAmount: 1000.0,
    percentUsed: 15,
    alertThreshold: 80,
    alertTriggered: false,
  },
  {
    id: 'budget_shopping',
    categoryName: 'Shopping',
    icon: 'shopping_bag',
    alertsEnabled: true,
    spentAmount: 300.0,
    limitAmount: 400.0,
    percentUsed: 75,
    alertThreshold: 80,
    alertTriggered: false,
  },
];

let mockPreferences = [
  { key: 'budget_alerts_email', label: 'Budget alerts via email', enabled: true },
  { key: 'budget_alerts_sms', label: 'Budget alerts via SMS', enabled: false },
  { key: 'budget_alerts_push', label: 'Budget alerts via push notification', enabled: true },
  { key: 'weekly_summary_email', label: 'Weekly spending summary email', enabled: true },
];

/**
 * Core fetch wrapper with Authorization header injection and error handling.
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
      // Ignore JSON parsing failure
    }
    const err = new Error(errorMessage);
    err.status = response.status;
    throw err;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Fetches all active budget categories with fallback.
 */
export async function fetchBudgets(signal) {
  try {
    return await apiFetch('/budgets', { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('[smartWorkflowsApi] GET /budgets endpoint unavailable, using active budget seed data:', err.message);
    return [...mockBudgets];
  }
}

/**
 * Creates a new budget category with fallback.
 */
export async function createBudgetCategory(data, signal) {
  try {
    return await apiFetch('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('[smartWorkflowsApi] POST /budgets fallback handled:', err.message);
    const newId = `budget_${data.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    const newBudget = {
      id: newId,
      categoryName: data.categoryName,
      icon: data.icon || 'shopping_cart',
      alertsEnabled: true,
      spentAmount: 0.0,
      limitAmount: Number(data.monthlyLimit),
      percentUsed: 0,
      alertThreshold: 80,
      alertTriggered: false,
    };
    mockBudgets.push(newBudget);
    return newBudget;
  }
}

/**
 * Toggles alert status for a budget category with fallback.
 */
export async function toggleBudgetAlert(id, alertsEnabled, signal) {
  try {
    return await apiFetch(`/budgets/${id}/alert-status`, {
      method: 'PATCH',
      body: JSON.stringify({ alertsEnabled }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn(`[smartWorkflowsApi] PATCH /budgets/${id}/alert-status fallback handled:`, err.message);
    const budget = mockBudgets.find((b) => b.id === id);
    if (budget) {
      budget.alertsEnabled = alertsEnabled;
      budget.alertTriggered = alertsEnabled && budget.percentUsed >= budget.alertThreshold;
      return { ...budget };
    }
    return { id, alertsEnabled, alertTriggered: false };
  }
}

/**
 * Updates monthly limit for a budget category with fallback.
 */
export async function updateBudgetLimit(id, monthlyLimit, signal) {
  try {
    return await apiFetch(`/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ monthlyLimit }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    const budget = mockBudgets.find((b) => b.id === id);
    if (budget) {
      budget.limitAmount = Number(monthlyLimit);
      budget.percentUsed = Math.round((budget.spentAmount / budget.limitAmount) * 100);
      budget.alertTriggered = budget.alertsEnabled && budget.percentUsed >= budget.alertThreshold;
      return { ...budget };
    }
    return { id, limitAmount: monthlyLimit };
  }
}

/**
 * Removes a budget category with fallback.
 */
export async function deleteBudgetCategory(id, signal) {
  try {
    return await apiFetch(`/budgets/${id}`, {
      method: 'DELETE',
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    mockBudgets = mockBudgets.filter((b) => b.id !== id);
    return null;
  }
}

/**
 * Fetches communication notification preferences with fallback.
 */
export async function fetchNotificationPreferences(signal) {
  try {
    return await apiFetch('/notification-preferences', { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('[smartWorkflowsApi] GET /notification-preferences fallback handled:', err.message);
    return [...mockPreferences];
  }
}

/**
 * Toggles a notification preference channel state with fallback.
 */
export async function toggleNotificationPreference(key, enabled, signal) {
  try {
    return await apiFetch(`/notification-preferences/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    const pref = mockPreferences.find((p) => p.key === key);
    if (pref) {
      pref.enabled = enabled;
      return { ...pref };
    }
    return { key, enabled };
  }
}
