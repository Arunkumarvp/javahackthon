/**
 * MessageBubble.jsx
 * 
 * Purpose:
 * Renders individual chat message bubbles with role avatars, tool execution badges,
 * PII masking indicators, security flags, and inline action cards.
 * 
 * Responsibilities:
 * - Render user, assistant, and system messages with distinct visual styling.
 * - Display tool calls executed during AI response generation.
 * - Render inline ConfirmActionModal when a message contains a pending action.
 * 
 * Dependencies:
 * - lucide-react (Bot, User, ShieldCheck, Wrench, AlertTriangle)
 * - ./ConfirmActionModal
 */

import React from 'react';
import { Bot, User, ShieldCheck, Wrench, AlertTriangle } from 'lucide-react';
import { ConfirmActionModal } from './ConfirmActionModal';

export function MessageBubble({ message, onConfirmAction, onCancelAction }) {
  const { role, content, timestamp, toolCalls = [], pendingAction, securityFlags = [] } = message;

  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="max-w-xl text-center px-4 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Role Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-md ${
        isUser 
          ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400' 
          : 'bg-cyan-600/20 border-cyan-500/40 text-cyan-400'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Main Text Bubble */}
        <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-lg ${
          isUser
            ? 'bg-emerald-600 text-white rounded-tr-none border-emerald-500/30'
            : 'bg-slate-900/90 text-slate-200 rounded-tl-none border-slate-800 backdrop-blur-md'
        }`}>
          {/* Formatted Text Content */}
          <div className="whitespace-pre-wrap font-sans">
            {content.split('**').map((part, index) => 
              index % 2 === 1 ? <strong key={index} className="font-semibold text-emerald-300">{part}</strong> : part
            )}
          </div>

          {/* Tool Calls Badges */}
          {!isUser && toolCalls.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Wrench className="w-3 h-3 text-cyan-400" /> Tools Executed:
              </span>
              {toolCalls.map((tool, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  {tool}
                </span>
              ))}
            </div>
          )}

          {/* Security Flags */}
          {securityFlags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {securityFlags.map((flag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-[10px] text-slate-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
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
