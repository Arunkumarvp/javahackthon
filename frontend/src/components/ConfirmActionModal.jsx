/**
 * ConfirmActionModal.jsx
 * 
 * Purpose:
 * Action Confirmation Card & Modal Component implementing the core "AI cannot act silently"
 * security requirement.
 * 
 * Responsibilities:
 * - Render explicit payment/action details requiring user authorization.
 * - Display Verification of Payee (VOP) match results (MATCH, CLOSE_MATCH, NO_MATCH).
 * - Offer "Confirm & Execute" and "Cancel" buttons.
 * - Provide expandable reasoning explanation for security auditability.
 * 
 * Dependencies:
 * - lucide-react (ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, Lock)
 */

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, Lock, ArrowRight } from 'lucide-react';

/**
 * @param {object} props
 * @param {object} props.action - Pending action payload
 * @param {function} props.onConfirm - Callback when user clicks Confirm & Execute
 * @param {function} props.onCancel - Callback when user clicks Cancel
 * @param {boolean} [props.isModal=false] - Whether rendered as a overlay modal or inline card
 */
export function ConfirmActionModal({ action, onConfirm, onCancel, isModal = false }) {
  const [showReasoning, setShowReasoning] = useState(false);

  if (!action) return null;

  const { actionId, title, details = {}, payeeVerification, reasoning } = action;

  // Determine Payee Verification Badge styling
  const renderVerificationBadge = () => {
    if (!payeeVerification) return null;

    const { status, providedName, registeredName, notes } = payeeVerification;

    if (status === 'MATCH') {
      return (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Payee Verified: Exact match with Open Banking record</span>
        </div>
      );
    }

    if (status === 'CLOSE_MATCH') {
      return (
        <div className="space-y-1.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Verification Warning: Close Name Match</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-500/20 text-slate-300">
            <div><span className="text-slate-400">Provided:</span> {providedName}</div>
            <div><span className="text-slate-400">Registered:</span> {registeredName}</div>
          </div>
          {notes && <p className="text-[11px] text-slate-400 italic pt-1">{notes}</p>}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
        <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
        <span>Payee Warning: No match found for registered name</span>
      </div>
    );
  };

  const cardContent = (
    <div className="glass-panel glow-border-amber rounded-xl p-5 space-y-4 text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Top Warning Banner */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-amber-300">{title || 'Authorization Required'}</h3>
            <p className="text-xs text-slate-400">Action ID: {actionId}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
          Pending Confirm
        </span>
      </div>

      {/* Payment Details Grid */}
      <div className="bg-slate-900/80 rounded-lg p-3.5 border border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="text-slate-400">Transfer Amount</span>
          <span className="text-lg font-bold text-emerald-400">{details.currency || '£'} {details.amount?.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 pt-1">
          <div>
            <span className="text-slate-500 block text-[11px]">Recipient Name</span>
            <span className="font-medium text-slate-200">{details.payeeName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Bank</span>
            <span className="font-medium text-slate-200">{details.bankName || 'Barclays Bank UK'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Sort Code</span>
            <span className="font-mono text-slate-300">{details.sortCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Account Number</span>
            <span className="font-mono text-slate-300">{details.accountNumber}</span>
          </div>
        </div>
      </div>

      {/* Payee Verification Badge */}
      {renderVerificationBadge()}

      {/* Expandable Reasoning */}
      <div className="border-t border-slate-800/80 pt-2">
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Why is confirmation required?
          </span>
          {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showReasoning && (
          <div className="mt-2 p-2.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            {reasoning || "To protect your funds, AI Financial Guardian requires explicit user confirmation before executing any outbound wire or transfer."}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onConfirm(actionId)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-glow transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm & Execute</span>
        </button>
        <button
          onClick={() => onCancel(actionId)}
          className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="max-w-md w-full">
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
}
