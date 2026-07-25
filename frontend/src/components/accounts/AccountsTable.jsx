import React from 'react';
import { Search, ListFilter, ArrowUpDown } from 'lucide-react';

const accountsData = [
  { 
    id: 1, 
    institution: 'Barclays Bank', 
    branch: 'London Branch',
    name: 'Everyday Spend',
    number: '4892',
    category: 'Current',
    balance: 4250.00,
    currency: 'GBP',
    status: 'Active'
  },
  { 
    id: 2, 
    institution: 'Monzo', 
    branch: 'Digital Branch',
    name: 'Holiday Fund',
    number: '9104',
    category: 'Savings',
    balance: 12000.00,
    currency: 'GBP',
    status: 'Active'
  },
  { 
    id: 3, 
    institution: 'Vanguard UK', 
    branch: 'London Office',
    name: 'Stocks & Shares ISA',
    number: '3321',
    category: 'Investment',
    balance: 126250.00,
    currency: 'GBP',
    status: 'Active'
  },
  { 
    id: 4, 
    institution: 'Lloyds Bank', 
    branch: 'Closed Account',
    name: 'Old Current Account',
    number: '1102',
    category: 'Current',
    balance: 0.00,
    currency: 'GBP',
    status: 'Inactive'
  }
];

export function AccountsTable() {
  return (
    <div className="card-panel">
      {/* Table Controls */}
      <div className="p-5 border-b border-wm-border flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-wm-border rounded-lg text-sm text-wm-textMain hover:bg-slate-50 transition-colors font-medium">
            <ListFilter className="w-4 h-4 text-wm-textMuted" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-wm-border rounded-lg text-sm text-wm-textMain hover:bg-slate-50 transition-colors font-medium">
            <ArrowUpDown className="w-4 h-4 text-wm-textMuted" />
            <span>Sort</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-wm-textMuted" />
          <input 
            type="text" 
            placeholder="Find an account..." 
            className="w-full pl-9 pr-4 py-2 border border-wm-border rounded-lg text-sm bg-white focus:outline-none focus:border-wm-blue text-wm-textMain"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-wm-border text-[11px] font-bold text-wm-textMuted uppercase tracking-wider bg-slate-50/30">
              <th className="py-4 px-6">Institution</th>
              <th className="py-4 px-6">Account Details</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Balance</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {accountsData.map((acc) => (
              <tr key={acc.id} className="border-b border-wm-border hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-wm-border bg-white flex items-center justify-center p-2 shadow-sm">
                      {/* Simple placeholder for bank logos */}
                      <div className="w-full h-full bg-slate-100 rounded-sm"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-wm-textMain">{acc.institution}</div>
                      <div className="text-xs text-wm-textMuted">{acc.branch}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-wm-textMain">{acc.name}</div>
                  <div className="text-xs text-wm-textMuted flex items-center gap-1">
                    <span className="tracking-widest">••••</span> {acc.number}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex px-2.5 py-1 rounded bg-slate-200/60 text-wm-textMain text-xs font-medium">
                    {acc.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="font-semibold text-wm-textMain">£{acc.balance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-wm-textMuted">{acc.currency}</div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                    acc.status === 'Active' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${acc.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    {acc.status}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="px-3 py-1.5 border border-wm-border rounded text-sm font-medium text-wm-textMuted hover:text-wm-textMain hover:border-wm-textMuted transition-colors bg-white shadow-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
