import React from 'react';
import { Plus } from 'lucide-react';
import { AccountsMetrics } from './AccountsMetrics';
import { AccountsTable } from './AccountsTable';

export function AccountsPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">My Accounts</h2>
          <p className="text-sm text-wm-textMuted mt-1">Manage and monitor all your connected financial accounts.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-wm-green hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>

      <AccountsMetrics />
      
      <AccountsTable />
    </div>
  );
}
