/**
 * AccessScopeIndicator.jsx
 * 
 * Purpose:
 * Component making AI data access scope and consent visible and revocable to the user,
 * fulfilling the "Trust-First" architecture principle.
 * 
 * Responsibilities:
 * - Render active AI permission scope badges.
 * - Show explicit timestamps for permission grant and expiration.
 * - Provide immediate "Revoke AI Access" emergency control.
 * 
 * Dependencies:
 * - lucide-react (ShieldCheck, ShieldOff, Check, X, Clock, AlertOctagon)
 */

import React from 'react';
import { ShieldCheck, ShieldOff, Check, X, Clock, AlertOctagon } from 'lucide-react';

export function AccessScopeIndicator({ scope, onRevokeScope }) {
  if (!scope) {
    return (
      <div className="glass-panel rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-800 rounded w-3/4"></div>
      </div>
    );
  }

  const isRevoked = scope.status === 'REVOKED';

  return (
    <div className={`glass-panel rounded-xl p-4 transition-all ${
      isRevoked ? 'glow-border-rose bg-rose-950/20' : 'glow-border-emerald bg-slate-900/60'
    }`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isRevoked ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isRevoked ? <ShieldOff className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">AI Access Scope</h3>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
              isRevoked 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {isRevoked ? 'REVOKED' : 'ACTIVE & SCOPED'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="space-y-2 mb-4 text-xs">
        <span className="text-[11px] text-slate-400 font-medium block">Active Consents:</span>
        {scope.permissions?.map((perm) => (
          <div key={perm.id} className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-300 text-xs">{perm.label}</span>
            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
              perm.granted && !isRevoked
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {perm.granted && !isRevoked ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {perm.granted && !isRevoked ? 'GRANTED' : 'DENIED'}
            </span>
          </div>
        ))}
      </div>

      {/* Explicit Denied Restrictions */}
      {scope.denied && scope.denied.length > 0 && (
        <div className="mb-4">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Enforced Boundary Protections:</span>
          <div className="space-y-1">
            {scope.denied.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <AlertOctagon className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="font-mono text-[10px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiration Info */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-2.5 mb-3">
        <Clock className="w-3 h-3 text-slate-500" />
        <span>Granted 24h window • Auto-expires in 18h</span>
      </div>

      {/* Revoke Access Button */}
      {!isRevoked && (
        <button
          onClick={onRevokeScope}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs font-semibold transition-all active:scale-[0.98]"
        >
          <ShieldOff className="w-4 h-4" />
          <span>Revoke AI Access</span>
        </button>
      )}
    </div>
  );
}
