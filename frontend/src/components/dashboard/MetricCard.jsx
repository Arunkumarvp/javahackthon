import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

export function MetricCard({ title, amount, trend, trendIcon: TrendIcon, trendColor, icon: Icon }) {
  return (
    <div className="card-panel p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xs font-semibold text-wm-textMuted uppercase tracking-wide">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-wm-textMain" />}
      </div>
      
      <div>
        <div className="text-2xl font-bold text-wm-textMain mb-2 font-sans">{amount}</div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {TrendIcon ? (
            <TrendIcon className={`w-3.5 h-3.5 ${trendColor || 'text-wm-textMuted'}`} />
          ) : (
            <TrendingUp className={`w-3.5 h-3.5 ${trendColor || 'text-wm-textMuted'}`} />
          )}
          <span className={trendColor || 'text-wm-textMuted'}>{trend}</span>
        </div>
      </div>
    </div>
  );
}
