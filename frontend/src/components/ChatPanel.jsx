import React, { useState, useRef, useEffect } from 'react';
import { Send, Clock, Sparkles, Shield, Loader2, Plus, Check } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

const AGENTS = [
  { id: 'GENERAL', label: 'General', icon: '🛡️' },
  { id: 'BUDGET', label: 'Budget Analyst', icon: '💰' },
  { id: 'TRIP', label: 'Trip Budget', icon: '✈️' },
  { id: 'INVESTMENT', label: 'Investment Advisor', icon: '📉' },
  { id: 'TAX', label: 'Tax Helper', icon: '📑' },
  { id: 'SHOPPING', label: 'Shopping & Subs', icon: '🛍️' }
];

export function ChatPanel({
  messages = [],
  isThinking = false,
  thinkingStep = '',
  onSendMessage,
  onConfirmAction,
  onCancelAction
}) {
  const [inputText, setInputText] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('GENERAL');
  const [showHistory, setShowHistory] = useState(false);
  const [historySessions, setHistorySessions] = useState([
    { id: 'sess-today-1', label: 'Today 11:30 AM — Open Banking Balance & VoP Transfer' },
    { id: 'sess-yesterday-1', label: 'Yesterday 4:15 PM — Food Delivery Budget Optimization' },
    { id: 'sess-prev-1', label: '23 Jul 2:00 PM — HMRC Tax Allowance Inquiry' }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText, selectedAgent);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] min-h-[580px] bg-slate-50/50 rounded-2xl border border-wm-border overflow-hidden relative font-sans">
      {/* Top Header Bar with History Toggle */}
      <div className="px-6 py-3 border-b border-wm-border bg-white flex items-center justify-between">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-wm-border hover:bg-slate-50 text-xs font-semibold text-wm-textMain transition-colors"
        >
          <Clock className="w-3.5 h-3.5 text-wm-textMuted" />
          <span>History</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>June AI Engine Active</span>
          </span>
        </div>
      </div>

      {/* History Drawer Overlay */}
      {showHistory && (
        <div className="absolute top-12 left-6 z-20 w-80 bg-white border border-wm-border rounded-xl shadow-xl p-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <span className="text-xs font-bold text-wm-textMain uppercase tracking-wider">Conversation History</span>
            <button onClick={() => setShowHistory(false)} className="text-xs text-wm-textMuted hover:text-wm-textMain">Close</button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {historySessions.map((sess) => (
              <div key={sess.id} className="p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer text-xs text-wm-textMain font-medium transition-all">
                {sess.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Divider */}
      <div className="flex justify-center my-3">
        <span className="px-3 py-0.5 rounded-full bg-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
          Today
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onConfirmAction={onConfirmAction}
            onCancelAction={onCancelAction}
          />
        ))}

        {isThinking && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-wm-border text-xs text-wm-textMain font-medium shadow-sm">
              <span>{thinkingStep || 'June AI is reasoning with MCP tools...'}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Agent Selector Bar */}
      <div className="px-6 py-2 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-wm-textMuted mr-1">Agent:</span>
        {AGENTS.map((agent) => {
          const isSelected = selectedAgent === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-blue-100 text-wm-blue border border-blue-300 shadow-sm'
                  : 'bg-white border border-wm-border text-wm-textMain hover:bg-slate-50'
              }`}
            >
              <span>{agent.icon}</span>
              <span>{agent.label}</span>
            </button>
          );
        })}
        <button className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-dashed border-wm-border text-wm-textMuted hover:bg-slate-50 flex items-center gap-1">
          <Plus className="w-3 h-3" />
          <span>More</span>
        </button>
      </div>

      {/* Input Box Shell */}
      <div className="p-4 bg-white border-t border-wm-border flex flex-col items-center gap-2">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask June anything about your finances..."
            disabled={isThinking}
            className="w-full bg-white border border-wm-border focus:border-wm-blue rounded-full pl-5 pr-14 py-3 text-sm text-wm-textMain placeholder-slate-400 outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-full bg-wm-blue hover:bg-wm-blue-hover disabled:opacity-40 text-white font-medium transition-all flex items-center justify-center shadow-sm"
          >
            <Send className="w-4 h-4 fill-white" />
          </button>
        </form>

        <span className="text-[11px] text-wm-textMuted">
          June AI can make mistakes. Consider verifying important information.
        </span>
      </div>
    </div>
  );
}
