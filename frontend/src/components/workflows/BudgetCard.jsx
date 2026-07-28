import React, { useState } from 'react';

export function BudgetCard({ icon: Icon, title, spent, limit, percentage, isAlert }) {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="card-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-wm-textMain text-sm">{title}</h3>
        </div>
        
        {/* Toggle Switch */}
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? 'bg-wm-green' : 'bg-slate-200'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isActive ? 'left-5' : 'left-1'}`}>
            {isActive && (
              <svg className="w-2.5 h-2.5 text-wm-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </button>
      </div>

      <div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">£{spent}</span>
          <span className="text-[11px] font-semibold text-wm-textMuted pb-1">of £{limit} limit</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full ${isAlert ? 'bg-amber-700' : 'bg-wm-blue'}`} 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className={`text-[11px] font-semibold ${isAlert ? 'text-amber-700' : 'text-wm-textMuted'}`}>
          {percentage}% used {isAlert && '- Alert triggered'}
        </div>
      </div>
    </div>
  );
}
