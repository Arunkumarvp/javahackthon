import React, { useEffect } from 'react';
import { X, PiggyBank, AlertCircle, ArrowRight, Star } from 'lucide-react';
import { useSavingsOffers } from '../../../hooks/useSavingsOffers';

/**
 * SavingsOffersModal
 *
 * Purpose: Modal displaying live savings account offers for the "Explore Accounts" action.
 * Loads offers on open, filtered by the recommendation's surplus amount.
 * Shows computed potential annual return per offer.
 *
 * @param {{ surplusAmount: number, onClose: Function }} props
 */
export function SavingsOffersModal({ surplusAmount = 2000, onClose }) {
  const { offers, loading, error, load } = useSavingsOffers();

  useEffect(() => {
    load(surplusAmount);
  }, [surplusAmount]);

  const typeLabels = { FIXED: '🔒 Fixed Rate', EASY_ACCESS: '🔓 Easy Access', ISA: '💰 ISA' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Explore Savings Accounts"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Savings Account Offers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Based on £{surplusAmount.toLocaleString()} surplus</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3" aria-live="polite">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
              <span className="w-5 h-5 border-2 border-slate-200 border-t-wm-blue rounded-full animate-spin" aria-hidden="true" />
              <span className="text-sm">Fetching live offers…</span>
            </div>
          )}

          {error && !loading && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex gap-2 items-center text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              <button onClick={() => load(surplusAmount)} className="ml-auto text-xs font-semibold underline">Retry</button>
            </div>
          )}

          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`relative p-4 rounded-xl border transition-all hover:shadow-md ${
                idx === 0 ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              {/* Best Rate badge */}
              {idx === 0 && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  <Star className="w-2.5 h-2.5" fill="currentColor" /> Best Rate
                </span>
              )}

              <div className="flex items-start gap-3">
                <div>
                  <p className="font-bold text-slate-800 text-sm pr-16">{offer.provider}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{typeLabels[offer.type] || offer.type} · {offer.term}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="text-2xl font-bold text-blue-700">{offer.rateLabel}</div>
                  {offer.minDeposit && (
                    <div className="text-xs text-slate-500">Min. deposit: £{parseFloat(offer.minDeposit).toLocaleString()}</div>
                  )}
                </div>
                <div className="text-right">
                  {offer.potentialAnnualReturn > 0 && (
                    <>
                      <div className="text-sm font-bold text-emerald-700">+£{parseFloat(offer.potentialAnnualReturn).toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-600">Potential/year</div>
                    </>
                  )}
                </div>
              </div>

              {offer.badge && (
                <div className="mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{offer.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 shrink-0">
          <p className="text-[10px] text-slate-400 text-center">
            Rates are indicative. FSCS protected up to £85,000. Subject to eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}
