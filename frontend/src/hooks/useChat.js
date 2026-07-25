/**
 * useChat.js
 * 
 * Purpose:
 * Central React hook managing application state for AI Financial Guardian:
 * conversational message history, thinking state indicators, high-risk pending actions,
 * access scope permissions, security flag counts, and live audit streams.
 * 
 * Responsibilities:
 * - Maintain reactive state for messages, pending action cards, and audit events.
 * - Provide handlers for sending messages, confirming/cancelling actions, and revoking scope.
 * - Append live compliance audit entries for every security-sensitive user/AI event.
 * 
 * Dependencies:
 * - react (useState, useEffect, useCallback)
 * - ../services/chatService
 */

import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chatService';

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Hello! I am your **AI Financial Guardian**. Every action I take is strictly scoped and high-risk operations (such as payments or transfers) require your explicit confirmation before execution.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolCalls: [],
      securityFlags: []
    }
  ]);

  const [pendingAction, setPendingAction] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');
  const [scope, setScope] = useState(null);
  const [summary, setSummary] = useState(null);
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'audit-0',
      timestamp: new Date().toLocaleTimeString(),
      event: 'Session initialized with zero-trust AI scope guardrails',
      severity: 'INFO'
    }
  ]);

  // Load initial scope & dashboard metrics
  useEffect(() => {
    async function loadData() {
      try {
        const [scopeData, summaryData] = await Promise.all([
          chatService.getScope(),
          chatService.getSummary()
        ]);
        setScope(scopeData);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load initial guardian data', err);
      }
    }
    loadData();
  }, []);

  const addAuditEntry = useCallback((event, severity = 'INFO') => {
    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
        event,
        severity
      },
      ...prev
    ]);
  }, []);

  /**
   * Handles user sending a message to the guardian.
   */
  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    // Dynamic thinking sequence simulation
    const isPayment = /pay|transfer|send/i.test(userText);
    if (isPayment) {
      setThinkingStep('🔒 Running Verification of Payee against Open Banking...');
    } else {
      setThinkingStep('🔍 Evaluating query against AI Access Scope...');
    }

    addAuditEntry(`User message sent: "${userText.substring(0, 35)}..."`, 'INFO');

    try {
      if (isPayment) {
        await new Promise((r) => setTimeout(r, 600));
        setThinkingStep('🛡️ Checking anti-fraud anomaly flags...');
        await new Promise((r) => setTimeout(r, 600));
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }

      const response = await chatService.sendMessage(userText);

      const aiMessage = {
        id: response.messageId || `ai-${Date.now()}`,
        role: 'assistant',
        content: response.aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: response.toolCalls || [],
        pendingAction: response.pendingAction || null,
        securityFlags: response.securityFlags || []
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (response.pendingAction) {
        setPendingAction(response.pendingAction);
        addAuditEntry(`High-risk pending action generated: ${response.pendingAction.type.toUpperCase()} (${response.pendingAction.actionId})`, 'WARNING');
      }

      if (response.securityFlags && response.securityFlags.length > 0) {
        addAuditEntry(`Security flags detected: ${response.securityFlags.join(', ')}`, 'WARNING');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ I encountered an issue processing your request securely. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          securityFlags: ['error']
        }
      ]);
    } finally {
      setIsThinking(false);
      setThinkingStep('');
    }
  }, [addAuditEntry]);

  /**
   * Confirms or rejects a pending action card.
   */
  const handleConfirmAction = useCallback(async (actionId, confirmed) => {
    try {
      const result = await chatService.confirmAction(actionId, confirmed);

      setPendingAction(null);

      const systemMsg = {
        id: `sys-${Date.now()}`,
        role: 'system',
        content: confirmed 
          ? `✅ **Action Confirmed & Executed**: ${result.message || 'Payment successfully processed.'}`
          : `🚫 **Action Cancelled**: User aborted transaction ${actionId}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, systemMsg]);

      addAuditEntry(
        confirmed ? `User confirmed and authorized action ${actionId}` : `User rejected and aborted action ${actionId}`,
        confirmed ? 'SUCCESS' : 'WARNING'
      );

      // Refresh dashboard summary
      const updatedSummary = await chatService.getSummary();
      setSummary(updatedSummary);
    } catch (err) {
      console.error('Action confirmation failed', err);
    }
  }, [addAuditEntry]);

  /**
   * Immediately revokes all active AI scope permissions.
   */
  const handleRevokeScope = useCallback(async () => {
    try {
      await chatService.revokeScope();
      setScope((prev) => prev ? {
        ...prev,
        status: 'REVOKED',
        permissions: prev.permissions.map((p) => ({ ...p, granted: false }))
      } : null);

      addAuditEntry('EMERGENCY: User revoked all AI access permissions', 'CRITICAL');

      setMessages((prev) => [
        ...prev,
        {
          id: `revoke-${Date.now()}`,
          role: 'system',
          content: '🔒 **AI Scope Revoked**: All data reading and transaction capabilities have been blocked.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Revoke scope failed', err);
    }
  }, [addAuditEntry]);

  return {
    messages,
    pendingAction,
    isThinking,
    thinkingStep,
    scope,
    summary,
    auditLogs,
    sendMessage,
    handleConfirmAction,
    handleRevokeScope
  };
}
