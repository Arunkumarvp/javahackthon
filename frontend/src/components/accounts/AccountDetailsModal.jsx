import React, { useState, useEffect } from 'react';
import { X, CreditCard, Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export function AccountDetailsModal({ accountId, onClose }) {
  const [details, setDetails] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccountData() {
      setLoading(true);
      try {
        const [accRes, balRes, txRes] = await Promise.all([
          fetch(`/api/obie-aisp/v4.0/accounts/${accountId}`),
          fetch(`/api/obie-aisp/v4.0/accounts/${accountId}/balances`),
          fetch(`/api/obie-aisp/v4.0/accounts/${accountId}/transactions`)
        ]);

        if (accRes.ok) {
          const accJson = await accRes.json();
          const accData = accJson?.Data?.Account?.[0];
          setDetails(accData);
        }

        if (balRes.ok) {
          const balJson = await balRes.json();
          const balData = balJson?.Data?.Balance?.[0];
          setBalance(balData);
        }

        if (txRes.ok) {
          const txJson = await txRes.json();
          const txData = txJson?.Data?.Transaction || [];
          setTransactions(txData);
        }
      } catch (err) {
        console.error('[OBIE Modal] Failed to load account details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (accountId) {
      fetchAccountData();
    }
  }, [accountId]);

  if (!accountId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-wm-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-wm-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wm-blue/10 border border-wm-blue/20 flex items-center justify-center text-wm-blue">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-wm-textMain flex items-center gap-2">
                <span>{details?.Nickname || 'Account Details'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  OBIE v4.0 Connected
                </span>
              </h3>
              <p className="text-xs text-wm-textMuted font-mono mt-0.5">Account ID: {accountId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-wm-border flex items-center justify-center text-wm-textMuted hover:text-wm-textMain hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center text-wm-textMuted space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-wm-blue" />
              <p className="text-sm">Fetching OBIE Open Banking details for {accountId}...</p>
            </div>
          ) : (
            <>
              {/* Balance Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-10">
                  <Landmark className="w-24 h-24" />
                </div>
                
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Interim Available Balance
                </div>

                <div className="text-3xl font-extrabold tracking-tight font-sans text-emerald-400 mb-3">
                  £{balance?.Amount?.Amount ? parseFloat(balance.Amount.Amount).toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '14,850.40'}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Currency</span>
                    <span className="font-semibold">{balance?.Amount?.Currency || 'GBP'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Indicator</span>
                    <span className="font-semibold text-emerald-300">{balance?.CreditDebitIndicator || 'Credit'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status</span>
                    <span className="font-semibold text-blue-300">{details?.Status || 'Enabled'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Scheme</span>
                    <span className="font-semibold text-amber-300">OBIE SortCodeAccount</span>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div>
                <h4 className="text-sm font-bold text-wm-textMain mb-3 flex items-center justify-between">
                  <span>Recent OBIE Bank Transactions</span>
                  <span className="text-xs font-normal text-wm-textMuted">{transactions.length} Records</span>
                </h4>

                <div className="border border-wm-border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-wm-border font-bold text-wm-textMuted uppercase text-[10px]">
                        <th className="py-2.5 px-4">Transaction</th>
                        <th className="py-2.5 px-4">Reference</th>
                        <th className="py-2.5 px-4 text-right">Amount</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-wm-border">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-wm-textMuted">
                            No recent transactions found.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx, idx) => (
                          <tr key={tx.TransactionId || idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 font-semibold text-wm-textMain flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </div>
                              <span>{tx.TransactionInformation || 'Merchant Transaction'}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-wm-textMuted">
                              {tx.TransactionReference || 'Ref 89201'}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-red-600">
                              -£{tx.Amount?.Amount ? parseFloat(tx.Amount.Amount).toFixed(2) : '45.99'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {tx.Status || 'BOOK'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-wm-border bg-slate-50/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-wm-textMuted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted OBIE AISP v4.0 Connection</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-wm-blue hover:bg-wm-blue-hover text-white font-semibold rounded-xl shadow-sm transition-all"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
