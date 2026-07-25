/**
 * recommendationsApi.js
 *
 * Purpose:
 * Dedicated API client for all Recommendations feature endpoints.
 * All fetch calls use AbortController signals for request cancellation
 * when filter changes supersede in-flight requests.
 *
 * Design:
 * - One exported function per endpoint.
 * - Every function accepts an optional AbortSignal for cancellation.
 * - All functions throw on non-2xx responses (caller handles error state).
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
 * @param {string}      path     - API path (without base URL)
 * @param {RequestInit} options  - Fetch options (method, body, signal, etc.)
 * @returns {Promise<any>}        - Parsed JSON response body
 * @throws  {Error}               - On non-2xx status or network failure
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
      // Ignore JSON parse error on error response
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// ─── List & Detail ────────────────────────────────────────────────────────────

/**
 * Fetches the paginated, filtered list of recommendations.
 *
 * @param {Object}      params
 * @param {string}      params.q        - Free-text search query
 * @param {string}      params.sortBy   - "priority" | "savings" | "date"
 * @param {string}      params.sortDir  - "asc" | "desc"
 * @param {string}      params.month    - "YYYY-MM"
 * @param {number}      params.page     - Zero-based page index
 * @param {number}      params.size     - Page size
 * @param {AbortSignal} signal          - Optional cancellation signal
 * @returns {Promise<RecommendationsPageDto>}
 */
export async function fetchRecommendations(
  { q = '', sortBy = 'priority', sortDir = 'asc', month = '', page = 0, size = 10 } = {},
  signal
) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  params.set('sortBy', sortBy);
  params.set('sortDir', sortDir);
  if (month) params.set('month', month);
  params.set('page', String(page));
  params.set('size', String(size));

  return apiFetch(`/recommendations?${params.toString()}`, { signal });
}

/**
 * Fetches full detail for a single recommendation card.
 *
 * @param {string}      id     - Recommendation identifier
 * @param {AbortSignal} signal - Optional cancellation signal
 * @returns {Promise<RecommendationDto>}
 */
export async function fetchRecommendationById(id, signal) {
  return apiFetch(`/recommendations/${id}`, { signal });
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

/**
 * Fetches spending trend chart data for a category.
 *
 * @param {string}      category - e.g. "food_delivery"
 * @param {number}      months   - Number of months to include
 * @param {AbortSignal} signal   - Optional cancellation signal
 * @returns {Promise<SpendingTrendDto>}
 */
export async function fetchSpendingTrend(category = 'food_delivery', months = 4, signal) {
  const params = new URLSearchParams({ category, months: String(months) });
  return apiFetch(`/recommendations/spending-trend?${params.toString()}`, { signal });
}

/**
 * Fetches weekend spending breakdown data.
 *
 * @param {string}      startDate - ISO-8601 date: YYYY-MM-DD (optional)
 * @param {string}      endDate   - ISO-8601 date: YYYY-MM-DD (optional)
 * @param {AbortSignal} signal    - Optional cancellation signal
 * @returns {Promise<WeekendBreakdownDto>}
 */
export async function fetchWeekendBreakdown(startDate, endDate, signal) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  return apiFetch(`/recommendations/weekend-spike/breakdown?${params.toString()}`, { signal });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Posts a new spending limit for a recommendation.
 *
 * @param {string}      recommendationId
 * @param {Object}      body - { category: string, monthlyLimit: number }
 * @returns {Promise<Object>} - Confirmation payload
 */
export async function postSpendingLimit(recommendationId, body) {
  return apiFetch(`/recommendations/${recommendationId}/spending-limit`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Fetches the list of subscriptions filtered by status.
 *
 * @param {string}      status - "unused" | "active" | "all"
 * @param {AbortSignal} signal - Optional cancellation signal
 * @returns {Promise<SubscriptionDto[]>}
 */
export async function fetchSubscriptions(status = 'unused', signal) {
  return apiFetch(`/subscriptions?status=${status}`, { signal });
}

/**
 * Cancels a subscription.
 *
 * @param {string} subscriptionId - Subscription identifier
 * @returns {Promise<Object>} - Confirmation payload
 */
export async function cancelSubscription(subscriptionId) {
  return apiFetch(`/subscriptions/${subscriptionId}/cancel`, { method: 'POST' });
}

/**
 * Fetches savings account offers for the given surplus amount.
 *
 * @param {number}      surplusAmount - User's surplus
 * @param {AbortSignal} signal        - Optional cancellation signal
 * @returns {Promise<SavingsOfferDto[]>}
 */
export async function fetchSavingsOffers(surplusAmount, signal) {
  const params = surplusAmount ? `?surplusAmount=${surplusAmount}` : '';
  return apiFetch(`/accounts/savings-offers${params}`, { signal });
}

/**
 * Posts a new auto-transfer rule.
 *
 * @param {Object} body - { fromCategory: string, amount: number, frequency: string }
 * @returns {Promise<Object>} - Created rule confirmation
 */
export async function postAutoTransfer(body) {
  return apiFetch('/auto-transfers', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
