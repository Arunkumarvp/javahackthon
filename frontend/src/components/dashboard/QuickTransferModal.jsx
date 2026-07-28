import React, { useState } from 'react';
import { X, Send, ShieldCheck, Landmark, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { chatService } from '../../services/chatService';

export function QuickTransferModal({ onClose, onTransferSuccess }) {
  const [payeeName, setPayeeName] = useState('John Smith');
  const [sortCode, setSortCode] = useState('20-45-11');
  const [accountNumber, setAccountNumber] = useState('88392019');
  const [amount, setAmount] = useState('150.00');
  const [verifying, setVerifying] = useState(false);
  const [vopResult, setVopResult] = useState(null);

  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVopResult(null);

    // Simulate Verification of Payee (VoP) check
    setTimeout(async () => {
      const isClose = payeeName.toLowerCase().includes('john');
      const vopData = {
        status: isClose ? 'MATCH' : 'CLOSE_MATCH',
        confidence: isClose ? 100 : 85,
        registeredName: 'John Anthony Smith',
        bankName: 'Barclays Bank UK'
      };

      setVopResult(vopData);
      setVerifying(false);

      // Trigger chat message / action gate via AI Guardian backend
      try {
        const chatPrompt = `Pay £${amount} to ${payeeName} (Sort Code: ${sortCode}, Account: ${accountNumber})`;
        await chatService.sendMessage(chatPrompt);
        if (onTransferSuccess) onTransferSuccess(vopData);
      } catch (err) {
        console.error('[QuickTransfer] Error sending payment prompt:', err);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-wm-border overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-wm-border bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-wm-textMain text-lg">Quick Open Banking Transfer</h3>
              <p className="text-xs text-wm-textMuted">Protected by Verification of Payee (VoP)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-wm-textMuted hover:text-wm-textMain hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleVerifyAndSubmit} className="p-6 space-y-4 text-sm">
          
          <div>
            <label className="block text-xs font-semibold text-wm-textMuted mb-1">Recipient Payee Name</label>
            <input
              type="text"
              required
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              className="w-full px-3 py-2 border border-wm-border rounded-lg text-wm-textMain focus:outline-none focus:border-wm-blue"
              placeholder="e.g. John Smith"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-wm-textMuted mb-1">Sort Code</label>
              <input
                type="text"
                required
                value={sortCode}
                onChange={(e) => setSortCode(e.target.value)}
                className="w-full px-3 py-2 border border-wm-border rounded-lg text-wm-textMain font-mono focus:outline-none focus:border-wm-blue"
                placeholder="20-45-11"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-wm-textMuted mb-1">Account Number</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 border border-wm-border rounded-lg text-wm-textMain font-mono focus:outline-none focus:border-wm-blue"
                placeholder="88392019"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-wm-textMuted mb-1">Transfer Amount (£ GBP)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-wm-border rounded-lg text-wm-textMain font-bold focus:outline-none focus:border-wm-blue text-base"
              placeholder="100.00"
            />
          </div>

          {vopResult && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>VoP Match Verified ({vopResult.confidence}%)</span>
              </div>
              <p>Registered Account: <span className="font-semibold">{vopResult.registeredName}</span> ({vopResult.bankName})</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {verifying ? (
                <span>Executing VoP Check...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Payee & Initiate Transfer</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
