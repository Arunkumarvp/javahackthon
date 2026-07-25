/**
 * App.jsx
 * 
 * Purpose:
 * Main Application Shell integrating authentication (Login & Sign Up), conversational AI chat,
 * financial summary metrics, AI access scope management, anomaly flags, and compliance audit streams.
 * 
 * Responsibilities:
 * - Manage user authentication state (Username & Password login/signup).
 * - Render Login and Sign Up screens when unauthenticated.
 * - Render master cockpit dashboard when authenticated, including logout controls.
 * - Orchestrate state via custom useChat hook.
 * 
 * Dependencies:
 * - ./hooks/useChat
 * - ./components/LoginPage
 * - ./components/SignupPage
 * - ./components/ChatPanel
 * - ./components/SummaryPanel
 * - ./components/AccessScopeIndicator
 * - ./components/AnomalyFlagCard
 * - ./components/AuditLogStream
 * - ./components/ConfirmActionModal
 * - lucide-react (Shield, Lock, LogOut, User)
 */

import React, { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ChatPanel } from './components/ChatPanel';
import { SummaryPanel } from './components/SummaryPanel';
import { AccessScopeIndicator } from './components/AccessScopeIndicator';
import { AnomalyFlagCard } from './components/AnomalyFlagCard';
import { AuditLogStream } from './components/AuditLogStream';
import { ConfirmActionModal } from './components/ConfirmActionModal';
import { Shield, Lock, LogOut, User } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  // Restore user session from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('guardian_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('guardian_user');
      }
    }
  }, []);

  const handleAuthSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('guardian_user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('guardian_user');
    setAuthView('login');
  };

  const {
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
  } = useChat();

  // If user is not authenticated, render Login or Sign Up page
  if (!currentUser) {
    if (authView === 'signup') {
      return (
        <SignupPage
          onSignupSuccess={handleAuthSuccess}
          switchToLogin={() => setAuthView('login')}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={handleAuthSuccess}
        switchToSignup={() => setAuthView('signup')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-100 flex items-center gap-2">
                AI FINANCIAL GUARDIAN
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  TRUST-FIRST v1.0
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Transparent Open Banking Guardrails • Explicit Confirmations • Scoped Consent
              </p>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">{currentUser.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Cockpit Layout */}
      <main className="max-w-7xl mx-auto px-4 py-4 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left / Main Column: Conversational Interface (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          <ChatPanel
            messages={messages}
            isThinking={isThinking}
            thinkingStep={thinkingStep}
            onSendMessage={sendMessage}
            onConfirmAction={(id) => handleConfirmAction(id, true)}
            onCancelAction={(id) => handleConfirmAction(id, false)}
          />
        </section>

        {/* Right Sidebar: Security & Financial Overview (5 Cols) */}
        <aside className="lg:col-span-5 space-y-4">
          {/* Anomaly Alerts */}
          <AnomalyFlagCard flags={['payee_close_match']} />

          {/* Dashboard Summary */}
          <SummaryPanel summary={summary} />

          {/* AI Access Scope Indicator */}
          <AccessScopeIndicator
            scope={scope}
            onRevokeScope={handleRevokeScope}
          />

          {/* Live Audit Stream */}
          <AuditLogStream logs={auditLogs} />
        </aside>
      </main>

      {/* Modal Overlay for Pending High-Risk Action (if applicable) */}
      {pendingAction && (
        <ConfirmActionModal
          action={pendingAction}
          onConfirm={(id) => handleConfirmAction(id, true)}
          onCancel={(id) => handleConfirmAction(id, false)}
          isModal={true}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-900/40 py-3 px-4 text-center text-xs text-slate-500">
        AI Financial Guardian &copy; 2026 • Secure Open Banking Demo • Built with React, Vite & Tailwind CSS
      </footer>
    </div>
  );
}
