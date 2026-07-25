import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Landmark, Calendar, DollarSign, Tag, FileText, ArrowRight } from 'lucide-react';

export function TransactionDetailModal({ transaction, onClose, onDispute, onMarkSafe }) {
  const [disputed, setDisputed] = useState(false);
  const [markedSafe, setMarkedSafe] = useState(false);

  if (!transaction) return null;

  const handleDisputeClick = () => {
    setDisputed(true);
    if (onDispute) onDispute(transaction.id);
  };

  const handleMarkSafeClick = () => {
    setMarkedSafe(true);
    if (onMarkSafe) onMarkSafe(transaction.id);
  };

  const formattedAmount = typeof transaction.amount === 'number'
    ? transaction.amount.toFixed(2)
    : parseFloat(transaction.amount || 0).toFixed(2);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-wm-border overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between ${transaction.flagged ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-wm-border'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${transaction.flagged ? 'bg-amber-100 text-amber-700' : 'bg-wm-blue-light text-wm-blue'}`}>
              {transaction.flagged ? <ShieldAlert className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-wm-textMain text-lg">{transaction.description || 'Transaction Details'}</h3>
              <p className="text-xs text-wm-textMuted font-mono">ID: {transaction.id || 'TX-99382'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-wm-textMuted hover:text-wm-textMain hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Anomaly Banner if Flagged */}
          {transaction.flagged && !markedSafe && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span>AI GUARDIAN SECURITY FLAG</span>
              </div>
              <p className="text-xs font-medium">{transaction.flagReason || 'Unusual high-value or out-of-pattern transaction detected by RAG anomaly guardrails.'}</p>
            </div>
          )}

          {markedSafe && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Marked as Safe & Verified by User</span>
            </div>
          )}

          {disputed && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Fraud Dispute Claim Submitted to Open Banking Gateway</span>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-wm-border text-xs">
            <div>
              <span className="text-wm-textMuted block flex items-center gap-1 mb-0.5">
                <Calendar className="w-3.5 h-3.5" /> Date & Time
              </span>
              <span className="font-bold text-wm-textMain">{transaction.date || 'Recent'}</span>
            </div>

            <div>
              <span className="text-wm-textMuted block flex items-center gap-1 mb-0.5">
                <Tag className="w-3.5 h-3.5" /> Category
              </span>
              <span className="font-bold text-wm-textMain">{transaction.category || 'General'}</span>
            </div>

            <div>
              <span className="text-wm-textMuted block flex items-center gap-1 mb-0.5">
                <DollarSign className="w-3.5 h-3.5" /> Amount
              </span>
              <span className={`font-bold ${transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {transaction.amount > 0 ? '+' : '-'}£{Math.abs(formattedAmount)}
              </span>
            </div>

            <div>
              <span className="text-wm-textMuted block flex items-center gap-1 mb-0.5">
                <FileText className="w-3.5 h-3.5" /> OBIE Status
              </span>
              <span className="font-bold text-emerald-700">Settled (Banfico AISP)</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-bold text-wm-textMain">Open Banking Settlement Details:</span>
            <p className="text-wm-textMuted leading-relaxed">
              Processed via Banfico OBIE AISP Gateway. Payment Reference: <span className="font-mono text-wm-textMain">REF-BANFICO-90218</span>. Verified by AI Guardian Zero-Trust pipeline.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-wm-border flex items-center justify-between gap-3">
          {transaction.flagged && !disputed && !markedSafe ? (
            <>
              <button
                onClick={handleMarkSafeClick}
                className="px-4 py-2 rounded-xl border border-wm-border bg-white hover:bg-slate-100 text-wm-textMain text-xs font-semibold transition-colors"
              >
                Mark as Safe
              </button>

              <button
                onClick={handleDisputeClick}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Report Fraud & Dispute</span>
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-wm-blue hover:bg-wm-blue-hover text-white text-xs font-bold transition-all"
            >
              Close Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
