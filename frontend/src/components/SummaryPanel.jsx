/**
 * SummaryPanel.jsx
 * 
 * Purpose:
 * Dashboard financial overview widget presenting balance, spending metrics, security flag counts,
 * and recent transaction history with embedded anomaly badges.
 * 
 * Responsibilities:
 * - Render liquid balance card with trend indicators.
 * - Display security anomaly count.
 * - Render recent transactions with risk flag status.
 * 
 * Dependencies:
 * - lucide-react (Wallet, TrendingUp, AlertTriangle, ArrowUpRight, ShoppingBag, CreditCard)
 */

import React from 'react';
import { Wallet, TrendingUp, AlertTriangle, ArrowUpRight, ShoppingBag, CreditCard } from 'lucide-react';

export function SummaryPanel({ summary }) {
  if (!summary) {
    return (
      <div className="glass-panel rounded-xl p-4 animate-pulse space-y-3">
        <div className="h-16 bg-slate-800 rounded-lg"></div>
        <div className="h-24 bg-slate-800 rounded-lg"></div>
      </div>
    );
  }

  const { totalBalance, currency = 'GBP', monthlySpending, securityFlagsCount, recentTransactions = [] } = summary;

  return (
    <div className="space-y-4">
      {/* Balance & Security Card */}
      <div className="glass-panel rounded-xl p-4 glow-border-emerald relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Liquid Balance</span>
              <div className="text-xl font-bold text-slate-100 font-sans">
                {currency === 'GBP' ? '£' : '$'} {totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.2%</span>
          </div>
        </div>

        {/* Sub-metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Monthly Outflow</span>
            <span className="font-semibold text-slate-200">£{monthlySpending?.toFixed(2)}</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            securityFlagsCount > 0 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] block">Security Alerts</span>
              <AlertTriangle className={`w-3.5 h-3.5 ${securityFlagsCount > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
            </div>
            <span className="font-semibold">{securityFlagsCount} Active Flag</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Widget */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">Recent Activity</h4>
          <span className="text-[10px] text-slate-500">Live Sync</span>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${tx.flagged ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  {tx.category === 'Transfer' ? <CreditCard className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-medium text-xs text-slate-200 flex items-center gap-1.5">
                    {tx.merchant}
                    {tx.flagged && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        FLAGGED
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{tx.date} • {tx.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold text-xs ${tx.flagged ? 'text-amber-400' : 'text-slate-200'}`}>
                  -£{tx.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
