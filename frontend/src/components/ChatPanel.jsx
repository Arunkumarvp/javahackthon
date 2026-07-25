/**
 * ChatPanel.jsx
 * 
 * Purpose:
 * Main conversational interface component providing the primary interaction surface for
 * AI Financial Guardian.
 * 
 * Responsibilities:
 * - Render stream of chat message bubbles with auto-scroll to latest.
 * - Display thinking states ("🔍 Fetching transactions", "🔒 Verifying payee").
 * - Provide prompt suggestions for quick interactive testing.
 * - Capture user input and submit queries.
 * 
 * Dependencies:
 * - lucide-react (Send, Sparkles, Shield, Loader2)
 * - ./MessageBubble
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Shield, Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

export function ChatPanel({
  messages = [],
  isThinking = false,
  thinkingStep = '',
  onSendMessage,
  onConfirmAction,
  onCancelAction
}) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // Auto scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (promptText) => {
    if (isThinking) return;
    onSendMessage(promptText);
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[calc(100vh-7rem)] min-h-[550px] glow-border-emerald relative overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              Guardian Assistant
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Zero-Trust Security & Open Banking Protected</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Guardian</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onConfirmAction={onConfirmAction}
            onCancelAction={onCancelAction}
          />
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="font-medium text-cyan-300">{thinkingStep || 'AI is reasoning securely...'}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Suggestions */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">Prompts:</span>
        <button
          onClick={() => handleQuickPrompt("Pay John Smith £200 for consulting")}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 text-xs shrink-0 transition-colors"
        >
          💳 Pay John Smith £200
        </button>
        <button
          onClick={() => handleQuickPrompt("What is my total balance across accounts?")}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 text-xs shrink-0 transition-colors"
        >
          📊 What is my balance?
        </button>
        <button
          onClick={() => handleQuickPrompt("Check recent transactions for anomalies")}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 text-xs shrink-0 transition-colors"
        >
          🛡️ Check anomalies
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask financial question or request transfer (e.g. Pay John Smith £200)..."
          disabled={isThinking}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isThinking || !inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium shadow-glow transition-all active:scale-[0.97]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
