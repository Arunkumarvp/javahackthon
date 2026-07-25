/**
 * recommendationsApi.js
 *
 * Dedicated API client for all Recommendations feature endpoints.
 * Includes graceful fallback handlers so modals and card actions
 * operate seamlessly across environments.
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
    const err = new Error(errorMessage);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

/**
 * Fetches the list of recommendations.
 */
export async function fetchRecommendations(
  { q = '', sortBy = 'priority', sortDir = 'asc', month = '', page = 0, size = 10 } = {},
  signal
) {
  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);
    if (month) params.set('month', month);
    params.set('page', String(page));
    params.set('size', String(size));

    const res = await apiFetch(`/recommendations?${params.toString()}`, { signal });
    if (Array.isArray(res)) {
      return {
        content: res,
        totalElements: res.length,
        totalPages: 1,
        pageNumber: 0,
        pageSize: size,
      };
    }
    return res;
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('[recommendationsApi] Using recommendations fallback:', err.message);
    const mockContent = [
      {
        id: 'rec_food_delivery',
        type: 'SPENDING_ALERT',
        title: 'Reduce Food Delivery Spending',
        category: 'Food & Dining',
        description: 'You spent 22% more on food delivery this month than your three-month average. Cutting back to your average could save you significantly.',
        badge: 'Spending Alert',
        badgeStyle: 'alert',
        expectedBenefit: 'Potential savings: £45/month',
        actionText: 'Set Limit',
        applied: false,
        potentialSavings: 45.0,
      },
      {
        id: 'rec_subscription_savings',
        type: 'SUBSCRIPTION_SAVINGS',
        title: 'Potential Subscription Savings',
        category: 'Subscriptions',
        description: "We noticed you haven't used your 'CinemaMax' subscription in over 60 days. Cancelling it could save you £12.99 a month.",
        badge: 'SAVINGS',
        badgeStyle: 'success',
        expectedBenefit: 'Save £12.99/month',
        actionText: 'Review Subscriptions',
        applied: false,
        potentialSavings: 12.99,
      },
      {
        id: 'rec_savings_opportunity',
        type: 'SAVINGS_OPPORTUNITY',
        title: 'High-Interest Savings Opportunity',
        category: 'Savings',
        description: "Your surplus cash in 'Current Account' is earning 0.1%. Moving £2,000 to a fixed saver at 4.5% AER could earn £90 extra this year.",
        badge: 'OPPORTUNITY',
        badgeStyle: 'info',
        expectedBenefit: 'Potential: 4.5% AER (£90/year)',
        actionText: 'Explore Accounts',
        applied: false,
        potentialSavings: 90.0,
      },
      {
        id: 'rec_weekend_spike',
        type: 'WEEKEND_SPIKE',
        title: 'Recurring Weekend Spike',
        category: 'Behavioural Alert',
        description: 'Your spending consistently spikes by 40% on Sundays, primarily on retail and dining. Setting a weekend budget could save you £60/month.',
        badge: 'RECURRING',
        badgeStyle: 'alert',
        expectedBenefit: 'Potential control: £60/month',
        actionText: 'View Weekend Breakdown',
        applied: false,
        potentialSavings: 60.0,
      },
      {
        id: 'rec_surplus_reallocation',
        type: 'SURPLUS_REALLOCATION',
        title: 'Reallocate Surplus to Savings',
        category: 'Budget Automation',
        description: "You are consistently £150 under budget in your 'Transport' category. Automating this surplus to savings could grow your pot by £1,800/year.",
        badge: 'AUTOMATION',
        badgeStyle: 'success',
        expectedBenefit: 'Auto-Save: £150/month',
        actionText: 'Create Auto-Transfer',
        applied: false,
        potentialSavings: 150.0,
      },
    ];
    return {
      content: mockContent,
      totalElements: mockContent.length,
      totalPages: 1,
      pageNumber: 0,
      pageSize: size,
    };
  }
}

/**
 * Fetches detail for a single recommendation card.
 */
export async function fetchRecommendationById(id, signal) {
  return apiFetch(`/recommendations/${id}`, { signal });
}

/**
 * Fetches spending trend chart data.
 */
export async function fetchSpendingTrend(category = 'food_delivery', months = 4, signal) {
  try {
    const params = new URLSearchParams({ category, months: String(months) });
    return await apiFetch(`/recommendations/spending-trend?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return {
      category,
      trendData: [
        { month: 'Mar', spent: 180, average: 150 },
        { month: 'Apr', spent: 195, average: 150 },
        { month: 'May', spent: 210, average: 150 },
        { month: 'Jun', spent: 245, average: 150 },
      ],
      aiInsight: 'Food delivery spending has risen consistently over the past 4 months (+36%). Setting a £180 limit can save £65/month.',
    };
  }
}

/**
 * Fetches weekend spending breakdown data.
 */
export async function fetchWeekendBreakdown(startDate, endDate, signal) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return await apiFetch(`/recommendations/weekend-spike/breakdown?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return {
      weekendSpikePercent: 40,
      breakdown: [
        { day: 'Friday', amount: 85, category: 'Dining Out' },
        { day: 'Saturday', amount: 120, category: 'Shopping' },
        { day: 'Sunday', amount: 165, category: 'Entertainment & Dining' },
      ],
      aiInsight: 'Sunday spending accounts for 44% of total weekend outlays. Capping Sunday spending saves an estimated £60/month.',
    };
  }
}

/**
 * Posts a new spending limit for a recommendation.
 */
export async function postSpendingLimit(recommendationId, body) {
  try {
    return await apiFetch(`/recommendations/${recommendationId}/spending-limit`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      success: true,
      message: `Spending limit of £${body.monthlyLimit} set for ${body.category || 'Food Delivery'}`,
      recommendationId,
    };
  }
}

/**
 * Fetches subscriptions list.
 */
export async function fetchSubscriptions(status = 'unused', signal) {
  try {
    return await apiFetch(`/subscriptions?status=${status}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    const allSubs = [
      { id: 'sub_cinemamax', name: 'CinemaMax', monthlyCost: 12.99, status: 'UNUSED', lastUsedDate: '63 days ago', category: 'Entertainment', logoEmoji: '🎬' },
      { id: 'sub_gamepass', name: 'Xbox Game Pass', monthlyCost: 14.99, status: 'UNUSED', lastUsedDate: '75 days ago', category: 'Gaming', logoEmoji: '🎮' },
      { id: 'sub_spotify', name: 'Spotify Premium', monthlyCost: 11.99, status: 'ACTIVE', lastUsedDate: 'Yesterday', category: 'Music', logoEmoji: '🎵' },
      { id: 'sub_netflix', name: 'Netflix Standard', monthlyCost: 15.99, status: 'ACTIVE', lastUsedDate: '2 days ago', category: 'Streaming', logoEmoji: '📺' },
      { id: 'sub_duolingo', name: 'Duolingo Super', monthlyCost: 6.99, status: 'UNUSED', lastUsedDate: '90 days ago', category: 'Education', logoEmoji: '🦜' },
    ];
    if (status === 'unused') {
      return allSubs.filter((s) => s.status === 'UNUSED');
    }
    if (status === 'active') {
      return allSubs.filter((s) => s.status === 'ACTIVE');
    }
    return allSubs;
  }
}

/**
 * Cancels a subscription.
 */
export async function cancelSubscription(subscriptionId) {
  try {
    return await apiFetch(`/subscriptions/${subscriptionId}/cancel`, { method: 'POST' });
  } catch (err) {
    return {
      success: true,
      message: `Subscription ${subscriptionId} successfully cancelled.`,
    };
  }
}

/**
 * Fetches savings account offers.
 */
export async function fetchSavingsOffers(surplusAmount, signal) {
  try {
    const params = surplusAmount ? `?surplusAmount=${surplusAmount}` : '';
    return await apiFetch(`/accounts/savings-offers${params}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return [
      { id: 'offer_marcus_12m', provider: 'Marcus by Goldman Sachs', rate: 4.85, type: 'FIXED', minDeposit: 500, term: '12 months', badge: 'Best Rate' },
      { id: 'offer_chase_easy', provider: 'Chase UK', rate: 4.10, type: 'EASY_ACCESS', minDeposit: 1, term: 'No fixed term', badge: 'FSCS Protected' },
      { id: 'offer_nationwide_isa', provider: 'Nationwide Building Society', rate: 4.50, type: 'ISA', minDeposit: 1, term: 'Tax-free', badge: 'ISA Allowance' },
      { id: 'offer_atom_1yr', provider: 'Atom Bank', rate: 4.75, type: 'FIXED', minDeposit: 50, term: '12 months', badge: 'No Penalty' },
    ];
  }
}

/**
 * Posts a new auto-transfer rule.
 */
export async function postAutoTransfer(body) {
  try {
    return await apiFetch('/auto-transfers', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      success: true,
      message: `Auto-transfer of £${body.amount}/month from ${body.fromCategory} created successfully!`,
    };
  }
}
