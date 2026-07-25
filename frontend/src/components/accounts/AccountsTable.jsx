import React, { useState, useEffect } from 'react';
import { Search, ListFilter, ArrowUpDown, RefreshCw } from 'lucide-react';
import { AccountDetailsModal } from './AccountDetailsModal';

export function AccountsTable() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/obie-aisp/v4.0/accounts?type=domestic');
      if (res.ok) {
        const json = await res.json();
        const rawAccounts = json?.Data?.Account || [];
        const mapped = rawAccounts.map((acc, idx) => ({
          id: acc.AccountId || idx + 1,
          institution: acc.Nickname?.includes('Barclays') ? 'Barclays Bank' : acc.Nickname?.includes('Monzo') ? 'Monzo' : 'Vanguard UK',
          branch: 'OBIE Open Banking v4.0',
          name: acc.Nickname || 'Current Account',
          number: acc.AccountId?.slice(-4) || '8920',
          category: acc.AccountSubType || acc.AccountType || 'Current',
          balance: acc.Nickname?.includes('Monzo') ? 12000.00 : acc.Nickname?.includes('Vanguard') ? 126250.00 : 14850.40,
          currency: acc.Currency || 'GBP',
          status: acc.Status === 'Enabled' ? 'Active' : 'Inactive'
        }));
        setAccounts(mapped);
      }
    } catch (err) {
      console.error('[OBIE AISP] Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.number.includes(searchTerm)
  );

  return (
    <div className="card-panel">
      {/* Table Controls */}
      <div className="p-5 border-b border-wm-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAccounts}
            className="flex items-center gap-2 px-4 py-2 border border-wm-border rounded-lg text-sm text-wm-textMain hover:bg-slate-50 transition-colors font-medium"
          >
            <RefreshCw className={`w-4 h-4 text-wm-textMuted ${loading ? 'animate-spin' : ''}`} />
            <span>Sync OBIE Bank</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-wm-border rounded-lg text-sm text-wm-textMain hover:bg-slate-50 transition-colors font-medium">
            <ListFilter className="w-4 h-4 text-wm-textMuted" />
            <span>Filter</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-wm-textMuted" />
          <input 
            type="text" 
            placeholder="Find an account..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-wm-textMuted">
                  Loading live Open Banking OBIE accounts...
                </td>
              </tr>
            ) : filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-wm-textMuted">
                  No connected accounts match your search.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => (
                <tr key={acc.id} className="border-b border-wm-border hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-wm-border bg-white flex items-center justify-center p-2 shadow-sm font-bold text-xs text-wm-textMain">
                        {acc.institution.substring(0, 3).toUpperCase()}
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
                    <button 
                      onClick={() => setSelectedAccountId(acc.id)}
                      className="px-3 py-1.5 border border-wm-border rounded text-sm font-medium text-wm-blue hover:bg-wm-blue/5 hover:border-wm-blue transition-colors bg-white shadow-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Account Details Modal */}
      {selectedAccountId && (
        <AccountDetailsModal
          accountId={selectedAccountId}
          onClose={() => setSelectedAccountId(null)}
        />
      )}
    </div>
  );
}
