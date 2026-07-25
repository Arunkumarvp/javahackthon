/**
 * AnomalyFlagCard.jsx
 * 
 * Purpose:
 * Renders security anomaly notifications and payee verification risk flags detected
 * during transactions or AI tool executions.
 * 
 * Responsibilities:
 * - Highlight detected risk factors (e.g. payee close-match name mismatch, high frequency wire).
 * - Offer immediate user review actions.
 * 
 * Dependencies:
 * - lucide-react (AlertTriangle, Eye, ShieldAlert, Check)
 */

import React, { useState } from 'react';
import { AlertTriangle, Eye, ShieldAlert, Check } from 'lucide-react';

export function AnomalyFlagCard({ flags = [], onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || flags.length === 0) return null;

  return (
    <div className="glass-panel glow-border-amber rounded-xl p-4 bg-amber-950/20 text-slate-200 mb-4 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-amber-300 uppercase tracking-wider">
              Security Anomaly Flagged
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              1 transaction flagged for Verification of Payee review.
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-200 p-1 text-xs"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/20 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Payee Name Mismatch (Close Match)</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Account registered name <strong className="text-slate-200">"John Anthony Smith"</strong> slightly differs from entered payee <strong className="text-slate-200">"John Smith"</strong>.
        </p>
      </div>
    </div>
  );
}
