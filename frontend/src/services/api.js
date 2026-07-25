/**
 * api.js
 * 
 * Purpose:
 * Core HTTP client service providing a unified interface for API calls with built-in
 * mock fallbacks for standalone hackathon demonstrations when the backend is offline.
 * 
 * Responsibilities:
 * - Make HTTP requests to Spring Boot backend API endpoints (/api/*).
 * - Gracefully detect connection errors and fallback to intelligent mock simulation.
 * - Log non-sensitive request lifecycle events.
 * 
 * Dependencies:
 * - Native browser fetch API
 */

const BASE_URL = '/api';

/**
 * Executes a JSON HTTP request with automatic mock fallback on network failure.
 * 
 * @param {string} endpoint - API path (e.g. '/chat')
 * @param {object} options - Fetch request configuration
 * @returns {Promise<any>} Parsed JSON response
 */
export async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[API] Remote call failed to ${endpoint}. Utilizing intelligent mock response layer.`, err.message);
    return handleMockFallback(endpoint, options);
  }
}

/**
 * Simulates intelligent backend responses for demonstration when backend is unavailable.
 */
function handleMockFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Auth: POST /api/auth/login
  if (endpoint.startsWith('/auth/login') && method === 'POST') {
    return {
      status: "SUCCESS",
      user: { username: body.username || "demoUser" },
      token: "jwt-guardian-mock-token-9892",
      message: "Authentication successful."
    };
  }

  // Auth: POST /api/auth/register
  if (endpoint.startsWith('/auth/register') && method === 'POST') {
    return {
      status: "SUCCESS",
      user: { username: body.username || "newUser" },
      token: "jwt-guardian-mock-token-9892",
      message: "Account registered successfully."
    };
  }

  // Endpoint: POST /api/chat
  if (endpoint.startsWith('/chat') && method === 'POST') {
    const query = (body.message || '').toLowerCase();
    
    // Payment / Transfer simulation
    if (query.includes('pay') || query.includes('transfer') || query.includes('send')) {
      return {
        messageId: `msg-${Date.now()}`,
        aiResponse: "I have analyzed your payment request. Before executing the transaction, I ran a Verification of Payee check against Open Banking registries.",
        toolCalls: ["verify_payee", "check_risk_score"],
        pendingAction: {
          actionId: `action-${Date.now()}`,
          type: "payment",
          title: "Authorize GBP Transfer",
          details: {
            payeeName: extractName(query) || "John Smith",
            accountNumber: "12345678",
            sortCode: "12-34-56",
            amount: extractAmount(query) || 200.00,
            currency: "GBP",
            bankName: "Barclays Bank UK"
          },
          payeeVerification: {
            status: "CLOSE_MATCH",
            providedName: extractName(query) || "John Smith",
            registeredName: "John Anthony Smith",
            matchConfidence: 89,
            notes: "Middle initial present in registered account record."
          },
          reasoning: "Action confirmation required: High-value outbound transfer to external payee requires explicit user authorization."
        },
        securityFlags: ["payee_close_match", "outbound_transfer_review"],
        timestamp: new Date().toISOString()
      };
    }

    // Balance query simulation
    if (query.includes('balance') || query.includes('money') || query.includes('account')) {
      return {
        messageId: `msg-${Date.now()}`,
        aiResponse: "Your current total liquid balance across checking and high-yield savings is £14,850.40. I verified this using read-only access scope.",
        toolCalls: ["get_balance"],
        pendingAction: null,
        securityFlags: [],
        timestamp: new Date().toISOString()
      };
    }

    // Default assistant response
    return {
      messageId: `msg-${Date.now()}`,
      aiResponse: "I am your AI Financial Guardian. I can help you monitor transactions, check balances, or initiate transfers with mandatory security confirmation.",
      toolCalls: ["rag_lookup"],
      pendingAction: null,
      securityFlags: [],
      timestamp: new Date().toISOString()
    };
  }

  // Endpoint: POST /api/actions/confirm
  if (endpoint.startsWith('/actions/confirm') && method === 'POST') {
    const isConfirmed = body.confirmed;
    return {
      status: isConfirmed ? "EXECUTED" : "CANCELLED",
      actionId: body.actionId,
      message: isConfirmed ? "Transaction executed successfully via Open Banking Gateway." : "Transaction explicitly cancelled by user.",
      auditEntry: {
        timestamp: new Date().toISOString(),
        event: isConfirmed ? `User confirmed action ${body.actionId}` : `User rejected action ${body.actionId}`,
        severity: isConfirmed ? "INFO" : "WARNING"
      }
    };
  }

  // Endpoint: GET /api/scope
  if (endpoint.startsWith('/scope')) {
    return {
      scopeId: "scope-guard-991",
      status: "ACTIVE",
      permissions: [
        { id: "read_transactions_90d", label: "Read Transactions (Last 90 days)", granted: true },
        { id: "read_balances", label: "Read Account Balances", granted: true },
        { id: "verify_payee_registry", label: "Verification of Payee (VOP)", granted: true },
        { id: "execute_transfers", label: "Execute Direct Payments", granted: false }
      ],
      denied: ["execute_transfers_without_2fa", "access_full_pan_cards"],
      grantedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      expiresAt: new Date(Date.now() + 3600000 * 48).toISOString()
    };
  }

  // Endpoint: POST /api/scope/revoke
  if (endpoint.startsWith('/scope/revoke')) {
    return {
      status: "REVOKED",
      scopeId: "scope-guard-991",
      message: "AI Data Access permissions have been immediately revoked."
    };
  }

  // Endpoint: GET /api/summary
  if (endpoint.startsWith('/summary')) {
    return {
      totalBalance: 14850.40,
      currency: "GBP",
      monthlySpending: 2340.10,
      securityFlagsCount: 1,
      recentTransactions: [
        { id: "tx-1", merchant: "Amazon UK", amount: 45.99, date: "Today, 14:20", category: "Shopping", flagged: false },
        { id: "tx-2", merchant: "CryptoExchange Ltd", amount: 1250.00, date: "Yesterday, 09:15", category: "Transfer", flagged: true, flagReason: "Unusual high amount transfer" },
        { id: "tx-3", merchant: "Sainsbury's", amount: 68.40, date: "22 Jul, 18:30", category: "Groceries", flagged: false }
      ]
    };
  }

  // Fallback default
  return { status: "OK", timestamp: new Date().toISOString() };
}

function extractName(text) {
  const match = text.match(/(?:pay|send|transfer\s+to)\s+([A-Za-z\s]+?)(?=\s+\$|\s+£|\s+\d|$)/i);
  return match ? match[1].trim() : null;
}

function extractAmount(text) {
  const match = text.match(/[$£]?\s*(\d+(?:\.\d{1,2})?)/);
  return match ? parseFloat(match[1]) : null;
}
