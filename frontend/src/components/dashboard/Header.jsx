import React from 'react';
import { Bell, Search, Settings, LogOut, User } from 'lucide-react';

export function Header({ user, onLogout, onOpenProfile }) {
  return (
    <header className="flex items-center justify-between py-4 border-b border-wm-border bg-white px-8 -mx-8 mb-8 sticky top-0 z-30">
      
      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-wm-textMuted" />
        <input 
          type="text" 
          placeholder="Search accounts or features..." 
          className="w-full pl-10 pr-4 py-2 border border-wm-border rounded-full text-sm bg-slate-50 focus:outline-none focus:border-wm-blue focus:bg-white transition-colors text-wm-textMain placeholder-slate-400"
        />
      </div>

      <div className="flex items-center gap-5 ml-4">
        
        <div className="flex items-center gap-3 text-wm-textMuted">
          <button className="hover:text-wm-textMain transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenProfile}
            className="hover:text-wm-textMain transition-colors"
            title="Profile & Security Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Controls */}
        <div className="flex items-center gap-3 pl-5 border-l border-wm-border">
          <button 
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-wm-blue transition-all"
            title="View Profile"
          >
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Felix'}&backgroundColor=e6f0f5`} 
              alt="User avatar" 
              className="w-full h-full object-cover"
            />
          </button>

          <button 
            onClick={onLogout}
            className="p-1.5 rounded-lg text-wm-textMuted hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
