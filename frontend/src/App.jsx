import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

// Pages & Components
import { DashboardPage } from './components/dashboard/DashboardPage';
import { AccountsPage } from './components/accounts/AccountsPage';
import { InsightsPage } from './components/insights/InsightsPage';
import { RecommendationsPage } from './components/recommendations/RecommendationsPage';
import { WorkflowsPage } from './components/workflows/WorkflowsPage';
import { ChatPanel } from './components/ChatPanel';
import { ConfirmActionModal } from './components/ConfirmActionModal';
import { ProfilePage } from './components/profile/ProfilePage';
import { chatService } from './services/chatService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'ai-chat' | 'insights' | 'recommendations' | 'workflows' | 'accounts' | 'profile'

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your AI Financial Guardian. I can monitor your Open Banking transactions, check balances, or initiate transfers with mandatory security gates.',
      timestamp: 'Just now',
      securityFlags: []
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');
  const [activePendingAction, setActivePendingAction] = useState(null);

  // Restore user session from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('wealthmanager_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('wealthmanager_user');
      }
    }
  }, []);

  const handleAuthSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('wealthmanager_user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wealthmanager_user');
    setAuthView('login');
    setCurrentView('home');
  };

  // AI Chat Handler
  const handleSendMessage = async (userText, agentType = 'GENERAL') => {
    const userMsgId = `usr-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setThinkingStep(`Agent '${agentType}' reasoning with MCP tools...`);

    try {
      const response = await chatService.sendMessage(userText, agentType);
      
      const assistantMsg = {
        id: response.messageId || `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.aiResponse || response.message || 'Action processed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: response.toolCalls || [],
        pendingAction: response.pendingAction,
        securityFlags: response.securityFlags || []
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      if (response.pendingAction) {
        setActivePendingAction(response.pendingAction);
      }
    } catch (err) {
      console.error('[AI Chat] Request failed:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered a connection error. Powered by backup intelligent simulation layer.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          securityFlags: ['network_fallback']
        }
      ]);
    } finally {
      setIsThinking(false);
      setThinkingStep('');
    }
  };

  const handleConfirmAction = async (actionId, confirmed) => {
    try {
      const res = await chatService.confirmAction(actionId, confirmed);
      setActivePendingAction(null);

      const confirmNotice = {
        id: `conf-${Date.now()}`,
        sender: 'assistant',
        text: res.message || (confirmed ? 'Transaction executed successfully via Open Banking Gateway.' : 'Transaction explicitly cancelled by user.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityFlags: confirmed ? ['action_executed'] : ['action_cancelled']
      };

      setChatMessages((prev) => [...prev, confirmNotice]);
    } catch (err) {
      console.error('[Action Confirm] Failed:', err);
      setActivePendingAction(null);
    }
  };

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

  // Render main application shell
  return (
    <div className="min-h-screen bg-wm-background flex">
      {/* Left Sidebar */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-[1200px] w-full mx-auto px-8 pb-8">
          <Header user={currentUser} onLogout={handleLogout} onOpenProfile={() => setCurrentView('profile')} />

          {/* Router Outlet */}
          {currentView === 'home' && (
            <DashboardPage onOpenAiChat={() => setCurrentView('ai-chat')} />
          )}

          {currentView === 'ai-chat' && (
            <ChatPanel
              messages={chatMessages}
              isThinking={isThinking}
              thinkingStep={thinkingStep}
              onSendMessage={handleSendMessage}
              onConfirmAction={(actionId) => handleConfirmAction(actionId, true)}
              onCancelAction={(actionId) => handleConfirmAction(actionId, false)}
            />
          )}

          {currentView === 'insights' && <InsightsPage />}
          {currentView === 'recommendations' && <RecommendationsPage />}
          {currentView === 'workflows' && <WorkflowsPage />}
          {currentView === 'accounts' && <AccountsPage />}
          {currentView === 'profile' && <ProfilePage />}
          
          {/* Fallback for un-implemented views */}
          {currentView !== 'home' && currentView !== 'ai-chat' && currentView !== 'insights' && currentView !== 'recommendations' && currentView !== 'workflows' && currentView !== 'accounts' && currentView !== 'profile' && (
            <div className="flex items-center justify-center h-64 text-wm-textMuted border-2 border-dashed border-wm-border rounded-xl">
              <p>This view ({currentView}) is under construction.</p>
            </div>
          )}
        </div>
      </main>

      {/* High-Risk Action Modal */}
      {activePendingAction && (
        <ConfirmActionModal
          action={activePendingAction}
          onConfirm={() => handleConfirmAction(activePendingAction.actionId, true)}
          onCancel={() => handleConfirmAction(activePendingAction.actionId, false)}
        />
      )}
    </div>
  );
}
