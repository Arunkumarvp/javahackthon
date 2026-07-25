/**
 * AuditLogStream.jsx
 * 
 * Purpose:
 * Live compliance stream widget rendering real-time audit entries for security verification,
 * data access checks, and explicit user confirmation events.
 * 
 * Responsibilities:
 * - Render chronological audit log stream.
 * - Format event severity badges (INFO, WARNING, SUCCESS, CRITICAL).
 * - Allow collapsible toggle to minimize/expand audit panel.
 * 
 * Dependencies:
 * - lucide-react (ScrollText, ChevronUp, ChevronDown, ShieldCheck, AlertCircle)
 */

import React, { useState } from 'react';
import { ScrollText, ChevronUp, ChevronDown, ShieldCheck, AlertCircle } from 'lucide-react';

export function AuditLogStream({ logs = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'SUCCESS':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">SUCCESS</span>;
      case 'WARNING':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">WARNING</span>;
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">INFO</span>;
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden transition-all">
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-emerald-400" />
          <span>Live Compliance Audit Stream ({logs.length} events)</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
      </button>

      {/* Expandable Logs List */}
      {isOpen && (
        <div className="p-3 bg-slate-950/90 max-h-48 overflow-y-auto space-y-1.5 border-t border-slate-800 font-mono text-[11px]">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start justify-between py-1 border-b border-slate-900 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                <span className="text-slate-200">{log.event}</span>
              </div>
              <div>{getSeverityBadge(log.severity)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
