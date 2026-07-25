/**
 * chatService.js
 * 
 * Purpose:
 * High-level business service encapsulating all financial chat, security scope,
 * authentication, action confirmation, and audit operations.
 * 
 * Responsibilities:
 * - Handle user login and account registration (username & password).
 * - Dispatch chat messages to the financial AI engine.
 * - Submit user action confirmations or cancellations.
 * - Query and manage AI data access scope state.
 * - Retrieve real-time financial metrics and security audit streams.
 * 
 * Dependencies:
 * - ./api.js
 */

import { apiRequest } from './api';

export const chatService = {
  /**
   * Authenticates a user with username and password.
   * 
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  /**
   * Registers a new user account with username and password.
   * 
   * @param {string} username
   * @param {string} password
   */
  async register(username, password) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  /**
   * Sends a user query to the AI Financial Guardian backend.
   * 
   * @param {string} message - User input text
   * @param {string} sessionId - User session identifier
   * @returns {Promise<object>} Chat response object containing message, tool calls, and pending actions
   */
  async sendMessage(message, sessionId = 'user-demo-123') {
    return apiRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        message,
        timestamp: new Date().toISOString()
      }),
    });
  },

  /**
   * Confirms or cancels a pending high-risk AI action.
   * 
   * @param {string} actionId - Target action ID
   * @param {boolean} confirmed - User decision
   * @returns {Promise<object>} Confirmation status and generated audit log
   */
  async confirmAction(actionId, confirmed) {
    return apiRequest('/actions/confirm', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'user-demo-123',
        actionId,
        confirmed,
        timestamp: new Date().toISOString()
      }),
    });
  },

  /**
   * Fetches current AI data access scope permissions.
   */
  async getScope() {
    return apiRequest('/scope?sessionId=user-demo-123');
  },

  /**
   * Emergency revocation of all AI data access scope.
   */
  async revokeScope() {
    return apiRequest('/scope/revoke', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'user-demo-123' })
    });
  },

  /**
   * Retrieves dashboard summary metrics (balance, recent transactions, flags).
   */
  async getSummary() {
    return apiRequest('/summary?sessionId=user-demo-123');
  }
};
