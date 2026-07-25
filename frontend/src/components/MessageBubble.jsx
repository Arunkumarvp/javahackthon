import React from 'react';
import { Bot, User, ShieldCheck, Wrench, AlertTriangle, Cpu, BookOpen } from 'lucide-react';
import { ConfirmActionModal } from './ConfirmActionModal';

export function MessageBubble({ message, onConfirmAction, onCancelAction }) {
  const { sender, text, timestamp, toolCalls = [], pendingAction, securityFlags = [] } = message;

  const isUser = sender === 'user';
  const isSystem = sender === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="max-w-xl text-center px-4 py-2 rounded-lg bg-slate-100 border border-wm-border text-xs text-wm-textMuted shadow-sm leading-relaxed font-medium">
          {text}
        </div>
      </div>
    );
  }

  const hasSourceCitation = !isUser && text?.includes('Source:');

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Role Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
        isUser 
          ? 'bg-wm-blue-light border-wm-blue/30 text-wm-blue' 
          : 'bg-emerald-100 border-emerald-300 text-emerald-700'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[80%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Main Text Bubble */}
        <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-sm ${
          isUser
            ? 'bg-wm-blue text-white rounded-tr-none border-wm-blue'
            : 'bg-white text-wm-textMain rounded-tl-none border-wm-border'
        }`}>
          {/* Formatted Text Content */}
          <div className="whitespace-pre-wrap font-sans">
            {text}
          </div>

          {/* Source Document Citation Badge */}
          {hasSourceCitation && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50/60 p-2 rounded-lg border border-blue-100">
              <BookOpen className="w-3.5 h-3.5 text-wm-blue shrink-0" />
              <span>Grounded in Reference Documentation</span>
            </div>
          )}

          {/* MCP Tool Execution Badges */}
          {!isUser && toolCalls.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-wm-textMuted font-bold uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-600" /> MCP Executed:
              </span>
              {toolCalls.map((tool, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">
                  {tool}
                </span>
              ))}
            </div>
          )}

          {/* Security Flags */}
          {securityFlags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {securityFlags.map((flag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-[10px] text-wm-textMuted px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </div>

        {/* Inline Pending Action Confirmation Card */}
        {pendingAction && (
          <div className="mt-3 max-w-lg">
            <ConfirmActionModal
              action={pendingAction}
              onConfirm={onConfirmAction}
              onCancel={onCancelAction}
              isModal={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
