import React from 'react';
import { Landmark, CreditCard, Clock, TrendingUp } from 'lucide-react';

export function AccountsMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Net Balance */}
      <div className="card-panel p-6 flex flex-col justify-between">
        <div className="flex items-start gap-2 mb-4 text-wm-textMuted uppercase tracking-wide">
          <Landmark className="w-4 h-4" />
          <h3 className="text-[11px] font-semibold">Total Net Balance</h3>
        </div>
        
        <div>
          <div className="text-[32px] font-bold text-wm-textMain mb-1.5 font-sans tracking-tight">£142,500.00</div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-wm-green" />
            <span className="text-wm-green">+2.4% this month</span>
          </div>
        </div>
      </div>

      {/* Active Accounts */}
      <div className="card-panel p-6 flex flex-col justify-between">
        <div className="flex items-start gap-2 mb-4 text-wm-textMuted uppercase tracking-wide">
          <CreditCard className="w-4 h-4" />
          <h3 className="text-[11px] font-semibold">Active Accounts</h3>
        </div>
        
        <div>
          <div className="text-[32px] font-bold text-wm-textMain mb-1.5 font-sans tracking-tight">4</div>
          <div className="text-sm font-medium text-wm-textMuted">
            Across 3 institutions
          </div>
        </div>
      </div>

      {/* Pending Sync */}
      <div className="card-panel p-6 flex flex-col justify-between">
        <div className="flex items-start gap-2 mb-4 text-wm-textMuted uppercase tracking-wide">
          <Clock className="w-4 h-4" />
          <h3 className="text-[11px] font-semibold">Pending Sync</h3>
        </div>
        
        <div>
          <div className="text-[32px] font-bold text-wm-textMain mb-1.5 font-sans tracking-tight">0</div>
          <div className="text-sm font-medium text-wm-textMuted">
            All accounts up to date
          </div>
        </div>
      </div>
    </div>
  );
}
