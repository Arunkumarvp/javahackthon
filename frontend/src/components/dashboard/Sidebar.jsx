import React from 'react';
import { Home, BarChart2, Lightbulb, GitMerge, LayoutGrid, ShieldCheck, Sparkles, User } from 'lucide-react';

export function Sidebar({ currentView, onNavigate }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'ai-chat', icon: Sparkles, label: 'AI Financial Guardian', badge: 'LIVE' },
    { id: 'insights', icon: BarChart2, label: 'Insights' },
    { id: 'recommendations', icon: Lightbulb, label: 'Recommendations' },
    { id: 'workflows', icon: GitMerge, label: 'Smart Workflows' },
    { id: 'accounts', icon: LayoutGrid, label: 'Accounts' },
    { id: 'profile', icon: User, label: 'Profile & Security' }
  ];

  return (
    <aside className="w-64 bg-wm-background border-r border-wm-border flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Logo Section */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded bg-wm-blue-light flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-wm-blue" />
          </div>
          <h1 className="text-xl font-bold text-wm-blue font-sans tracking-tight">WealthManager</h1>
        </div>
        <p className="text-[11px] text-wm-textMuted font-medium uppercase tracking-wider ml-8">AI Protection Active</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button 
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-wm-blue-light text-wm-blue border-r-4 border-wm-blue font-semibold' 
                      : 'text-wm-textMuted hover:bg-slate-100 hover:text-wm-textMain border-r-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-wm-blue' : 'text-wm-textMuted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded border border-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
