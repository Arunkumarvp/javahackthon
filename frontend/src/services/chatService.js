/**
 * chatService.js
 * 
 * Purpose:
 * High-level business service encapsulating all financial chat, security scope,
 * profile, insights analytics, recommendations, authentication, action confirmation, and audit operations.
 */

import { apiRequest } from './api';

export const chatService = {
  async login(username, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  async register(username, password) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  async sendMessage(message, agentType = 'GENERAL', sessionId = 'user-demo-123') {
    return apiRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        message,
        agentType,
        timestamp: new Date().toISOString()
      }),
    });
  },

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

  async getScope() {
    return apiRequest('/scope?sessionId=user-demo-123');
  },

  async revokeScope() {
    return apiRequest('/scope/revoke', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'user-demo-123' })
    });
  },

  async getSummary() {
    return apiRequest('/summary?sessionId=user-demo-123');
  },

  async getProfile() {
    return apiRequest('/user/profile');
  },

  async updateProfile(profileData) {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async getInsights(timeframe = 'MONTH', month = '2026-06', category = 'ALL') {
    let url = `/insights/cashflow?timeframe=${timeframe}`;
    if (month) url += `&month=${encodeURIComponent(month)}`;
    if (category && category !== 'ALL') url += `&category=${encodeURIComponent(category)}`;
    return apiRequest(url);
  },

  async getRecommendations() {
    return apiRequest('/recommendations');
  },

  async applyRecommendation(id) {
    return apiRequest(`/recommendations/${id}/apply`, {
      method: 'POST'
    });
  }
};
