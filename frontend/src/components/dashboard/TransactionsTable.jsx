import React, { useState } from 'react';
import { Search, Mic, ChevronDown, ListFilter, ShoppingCart, Zap, DollarSign, Utensils, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

const defaultTransactions = [
  { id: '1', date: 'Today, 14:20', description: 'Amazon UK', category: 'Shopping', amount: -45.99, icon: ShoppingCart, bgClass: 'bg-blue-100', textClass: 'text-blue-600', flagged: false },
  { id: '2', date: 'Yesterday, 09:15', description: 'CryptoExchange Ltd', category: 'Transfer', amount: -1250.00, icon: DollarSign, bgClass: 'bg-amber-100', textClass: 'text-amber-600', flagged: true, flagReason: 'Unusual high value transfer' },
  { id: '3', date: '22 Jul, 18:30', description: 'Sainsbury\'s', category: 'Groceries', amount: -68.40, icon: ShoppingCart, bgClass: 'bg-blue-100', textClass: 'text-blue-600', flagged: false },
  { id: '4', date: '20 Jul, 12:00', description: 'British Gas', category: 'Utilities', amount: -85.00, icon: Zap, bgClass: 'bg-slate-100', textClass: 'text-slate-600', flagged: false }
];

export function TransactionsTable({ transactionsData, onSelectTransaction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const rawList = (transactionsData && transactionsData.length > 0)
    ? transactionsData.map(tx => ({
        id: tx.id || String(Math.random()),
        date: tx.date || 'Recent',
        description: tx.merchant || tx.description || 'Transaction',
        category: tx.category || 'General',
        amount: typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount || 0),
        flagged: Boolean(tx.flagged),
        flagReason: tx.flagReason,
        icon: tx.flagged ? AlertTriangle : (tx.category === 'Groceries' ? ShoppingCart : (tx.category === 'Utilities' ? Zap : DollarSign)),
        bgClass: tx.flagged ? 'bg-amber-100' : 'bg-blue-100',
        textClass: tx.flagged ? 'text-amber-600' : 'text-blue-600'
      }))
    : defaultTransactions;

  // Filter logic
  const filteredTransactions = rawList.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || 
                            tx.category.toUpperCase() === selectedCategory.toUpperCase();

    const matchesFlagged = !flaggedOnly || tx.flagged;

    return matchesSearch && matchesCategory && matchesFlagged;
  });

  const handleVoiceSearch = () => {
    setIsListening(true);
    setSearchTerm('Amazon');
    setTimeout(() => setIsListening(false), 2000);
  };

  return (
    <div className="card-panel mt-8">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-wm-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-wm-textMain">Recent Transactions</h3>
          <p className="text-xs text-wm-textMuted mt-0.5">Showing {filteredTransactions.length} of {rawList.length} settled Open Banking transactions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-wm-textMuted" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isListening ? "Listening... 'Amazon'" : "Search transactions..."}
              className={`pl-9 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-wm-blue w-64 text-wm-textMain transition-all ${
                isListening ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200' : 'border-wm-border bg-white'
              }`}
            />
            <button 
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded ${isListening ? 'text-emerald-600 animate-pulse' : 'text-wm-textMuted hover:text-wm-textMain'}`}
              title="Simulate Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-wm-border rounded-lg text-sm text-wm-textMain bg-white focus:outline-none focus:border-wm-blue cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Groceries">Groceries</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Transfer">Transfers</option>
          </select>

          {/* AI Flagged Toggle Button */}
          <button 
            onClick={() => setFlaggedOnly(!flaggedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm transition-colors ${
              flaggedOnly 
                ? 'bg-amber-500 text-white border-amber-600 font-semibold' 
                : 'border-wm-border bg-white text-wm-textMain hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{flaggedOnly ? 'AI Flagged Only' : 'Show All'}</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-wm-border text-xs font-semibold text-wm-textMuted uppercase tracking-wider bg-slate-50/50">
              <th className="py-3 px-6 font-medium">Date</th>
              <th className="py-3 px-6 font-medium">Description</th>
              <th className="py-3 px-6 font-medium">Category</th>
              <th className="py-3 px-6 font-medium text-right">Amount</th>
              <th className="py-3 px-6 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-wm-textMuted text-xs">
                  No transactions match your search filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => onSelectTransaction && onSelectTransaction(tx)}
                  className={`border-b border-wm-border cursor-pointer transition-colors ${
                    tx.flagged ? 'bg-amber-50/40 hover:bg-amber-100/50' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <td className="py-4 px-6 text-wm-textMuted">{tx.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.bgClass}`}>
                        <tx.icon className={`w-4 h-4 ${tx.textClass}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-wm-textMain">{tx.description}</span>
                          {tx.flagged && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 border border-amber-500/30">
                              FLAGGED BY AI
                            </span>
                          )}
                        </div>
                        {tx.flagReason && <p className="text-[11px] text-amber-600 mt-0.5">{tx.flagReason}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-wm-textMuted">{tx.category}</td>
                  <td className={`py-4 px-6 text-right font-semibold ${tx.amount > 0 ? 'text-wm-blue' : 'text-wm-textMain'}`}>
                    {tx.amount > 0 ? '+' : '-'}&pound;{Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectTransaction) onSelectTransaction(tx);
                      }}
                      className="px-2.5 py-1 rounded border border-wm-border text-xs font-medium bg-white hover:bg-slate-100 text-wm-textMain"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 text-center border-t border-wm-border">
        <span className="text-xs text-wm-textMuted">
          Click any transaction row to view Open Banking settlement metadata or file an AI Fraud Dispute.
        </span>
      </div>
    </div>
  );
}
