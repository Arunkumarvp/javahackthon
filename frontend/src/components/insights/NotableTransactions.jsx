import React from 'react';

export function NotableTransactions({ transactionsData, periodTitle = 'June 2026' }) {
  const displayList = (transactionsData && transactionsData.length > 0)
    ? transactionsData.map(tx => ({
        id: tx.id || String(Math.random()),
        date: tx.date || 'Recent',
        description: tx.description || 'Transaction',
        category: tx.category || 'General',
        amount: typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount || 0),
        warning: Boolean(tx.warning)
      }))
    : [
        { id: 'tx-1', date: periodTitle + ', 01', description: 'Barclays Mortgage', category: 'Housing', amount: 1597.50, warning: false },
        { id: 'tx-2', date: periodTitle + ', 05', description: 'Waitrose & Partners', category: 'Food & Dining', amount: 142.50, warning: false },
        { id: 'tx-3', date: periodTitle + ', 10', description: 'TfL Commute Pass', category: 'Transport', amount: 95.00, warning: false },
        { id: 'tx-4', date: periodTitle + ', 15', description: 'Uber Eats Delivery', category: 'Food & Dining', amount: 38.40, warning: true },
        { id: 'tx-5', date: periodTitle + ', 22', description: 'British Gas Energy', category: 'Housing', amount: 210.00, warning: false }
      ];

  return (
    <div className="card-panel mt-6">
      <div className="p-6 border-b border-wm-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-wm-textMain">Notable Transactions Grid</h3>
          <p className="text-xs text-wm-textMuted mt-0.5">High value or unusual transactions for {periodTitle} (sorted latest first).</p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-wm-textMain">
          {displayList.length} Transactions
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-wm-border text-[11px] font-bold text-wm-textMuted uppercase tracking-wider bg-slate-50/50">
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {displayList.map((tx) => (
              <tr key={tx.id} className="border-b border-wm-border hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 text-wm-textMain font-medium">{tx.date}</td>
                <td className="py-4 px-6 font-semibold text-wm-textMain">{tx.description}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${
                    tx.warning ? 'bg-orange-100 text-orange-800 border border-orange-200 font-bold' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tx.category} {tx.warning && '⚠️'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-bold text-wm-textMain">
                  £{tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
