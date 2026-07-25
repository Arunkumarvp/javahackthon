import React from 'react';

export function RecommendationCard({ icon: Icon, title, badge, badgeStyle, children }) {
  return (
    <div className="card-panel p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3 className="font-bold text-wm-textMain">{title}</h3>
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            badgeStyle === 'alert' ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function BenefitBox({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mt-6 mb-4">
      <div className="text-[11px] font-semibold text-wm-textMuted uppercase tracking-wide mb-1">{label}</div>
      <div className="text-lg font-bold text-wm-blue">{value}</div>
    </div>
  );
}
