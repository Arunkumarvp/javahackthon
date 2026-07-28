import React, { useState, useCallback } from 'react';
import {
  Utensils, PlaySquare, PiggyBank, CalendarDays, Landmark,
  Sparkles, CheckCircle2, ArrowRight, TrendingUp, AlertTriangle,
  Info, RefreshCw
} from 'lucide-react';
import { RecommendationsToolbar }  from './RecommendationsToolbar';
import { SkeletonCard, ErrorCard, Toast } from './SkeletonCard';
import { SetLimitModal }           from './modals/SetLimitModal';
import { WeekendBreakdownModal }   from './modals/WeekendBreakdownModal';
import { SubscriptionsListModal }  from './modals/SubscriptionsListModal';
import { SavingsOffersModal }      from './modals/SavingsOffersModal';
import { AutoTransferModal }       from './modals/AutoTransferModal';
import { useRecommendations }      from '../../hooks/useRecommendations';
import { useSpendingTrend }        from '../../hooks/useSpendingTrend';

// ─── Badge styling map ────────────────────────────────────────────────────────
const BADGE_STYLES = {
  alert:   'bg-amber-100 text-amber-800 border border-amber-200',
  success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  info:    'bg-blue-100 text-blue-800 border border-blue-200',
};

// ─── Icon map ─────────────────────────────────────────────────────────────────
const TYPE_ICONS = {
  SPENDING_ALERT:      Utensils,
  SUBSCRIPTION_SAVINGS: PlaySquare,
  SAVINGS_OPPORTUNITY: PiggyBank,
  WEEKEND_SPIKE:       CalendarDays,
  SURPLUS_REALLOCATION: Landmark,
};

/**
 * SpendingBarChart — CSS bar chart driven by API series data.
 * maxAmount is computed from the series for relative scaling.
 */
function SpendingBarChart({ series, loading }) {
  if (loading) return (
    <div className="flex items-end justify-center gap-3 h-20 animate-pulse">
      {[48, 64, 40, 96].map((h, i) => (
        <div key={i} className="w-8 rounded-t bg-slate-200" style={{ height: h }} />
      ))}
    </div>
  );

  if (!series?.length) return null;

  const maxAmt = Math.max(...series.map(p => parseFloat(p.amount)));

  return (
    <div className="flex items-end justify-center gap-3 py-2 border-y border-slate-100 my-2" role="img" aria-label="Monthly spending bar chart">
      {series.map((pt, i) => {
        const isLast = i === series.length - 1;
        const heightPx = Math.round((parseFloat(pt.amount) / maxAmt) * 96);
        return (
          <div key={pt.month} className="flex flex-col items-center gap-1.5" title={`${pt.month}: £${pt.amount}`}>
            <div
              className={`w-8 rounded-t transition-all duration-500 ${isLast ? 'bg-amber-500' : 'bg-slate-200'}`}
              style={{ height: Math.max(heightPx, 4) }}
            />
            <span className={`text-[10px] font-bold uppercase ${isLast ? 'text-amber-700' : 'text-wm-textMuted'}`}>
              {pt.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * RecommendationCardShell — base card container with header, badge, and CTA.
 */
function RecommendationCardShell({ rec, isApplied, onAction, children }) {
  const Icon = TYPE_ICONS[rec.type] || Landmark;

  return (
    <div className="card-panel p-6 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-wm-textMain leading-tight">{rec.title}</h3>
        </div>
        {rec.badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${BADGE_STYLES[rec.badgeStyle] || BADGE_STYLES.info}`}>
            {rec.badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-wm-textMuted leading-relaxed mb-3">{rec.description}</p>

      {/* Card-specific visualization */}
      {children}

      {/* Benefit Box */}
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-auto mb-3">
        <div className="text-[11px] font-semibold text-wm-textMuted uppercase tracking-wide mb-1">Expected Benefit</div>
        <div className="text-base font-bold text-wm-blue">{rec.expectedBenefit}</div>
      </div>

      {/* CTA */}
      {isApplied ? (
        <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Action Applied — AI Guardian Active</span>
        </div>
      ) : (
        <button
          onClick={() => onAction(rec)}
          className="w-full py-2.5 bg-wm-blue hover:bg-wm-blue-hover text-white rounded-lg text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          aria-label={`${rec.actionText} for ${rec.title}`}
        >
          <span>{rec.actionText || 'Apply Recommendation'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * FoodDeliveryCard — Spending Trend card with live bar chart.
 */
function FoodDeliveryCard({ rec, isApplied, onAction, month }) {
  // months param: use 4 always, month filter is informational
  const { data: trend, loading: trendLoading } = useSpendingTrend('food_delivery', 4);

  return (
    <RecommendationCardShell rec={rec} isApplied={isApplied} onAction={onAction}>
      <SpendingBarChart series={trend?.series} loading={trendLoading} />
      {trend?.percentChangeVsAverage != null && (
        <p className="text-xs text-amber-700 font-semibold text-center mb-2">
          ↑ {trend.percentChangeVsAverage}% above your 3-month average
        </p>
      )}
      {trend?.aiInsight && (
        <div className="mb-3 p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 leading-relaxed">
          <span className="font-bold">AI: </span>{trend.aiInsight}
        </div>
      )}
    </RecommendationCardShell>
  );
}

/**
 * SavingsOpportunityCard — rate comparison visualization.
 */
function SavingsOpportunityCard({ rec, isApplied, onAction }) {
  return (
    <RecommendationCardShell rec={rec} isApplied={isApplied} onAction={onAction}>
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs my-2">
        <div>
          <span className="text-wm-textMuted block">Current Rate</span>
          <span className="font-bold text-wm-textMain text-sm">{rec.currentRate != null ? `${parseFloat(rec.currentRate).toFixed(1)}%` : '0.1%'}</span>
        </div>
        <div className="text-wm-blue font-bold text-lg">→</div>
        <div>
          <span className="text-emerald-600 block font-semibold">Potential Yield</span>
          <span className="font-bold text-emerald-700 text-sm">{rec.potentialRate != null ? `${parseFloat(rec.potentialRate).toFixed(1)}% AER` : '4.5% AER'}</span>
        </div>
      </div>
    </RecommendationCardShell>
  );
}

/**
 * WeekendSpikeCard — mini sparkline visualization.
 */
function WeekendSpikeCard({ rec, isApplied, onAction }) {
  const heights = [8, 12, 8, 32, 8, 16, 40];
  const isWeekend = [false, false, false, false, false, true, true];
  return (
    <RecommendationCardShell rec={rec} isApplied={isApplied} onAction={onAction}>
      <div className="flex items-end justify-between h-12 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 my-2 gap-1" role="img" aria-label="Weekly spending pattern">
        {heights.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${isWeekend[i] ? 'bg-amber-500' : 'bg-slate-300'}`}
            style={{ height: h }}
          />
        ))}
      </div>
      {rec.percentChangeVsAverage != null && (
        <p className="text-xs text-amber-700 font-semibold text-center mb-2">
          Weekends are {rec.percentChangeVsAverage}% higher than weekdays
        </p>
      )}
    </RecommendationCardShell>
  );
}

/**
 * SurplusReallocationCard — progress bar visualization.
 */
function SurplusReallocationCard({ rec, isApplied, onAction }) {
  const pct = rec.budgetUsedPercent ?? 40;
  return (
    <RecommendationCardShell rec={rec} isApplied={isApplied} onAction={onAction}>
      <div className="my-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Budget used</span>
          <span className="font-bold text-wm-blue">{pct}%</span>
        </div>
        <div className="bg-slate-100 rounded-full h-6 relative overflow-hidden border border-slate-200">
          <div
            className="absolute left-0 top-0 bottom-0 bg-wm-blue rounded-r-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
          <span className="relative z-10 text-[10px] font-bold text-slate-600 flex items-center justify-end h-full pr-3">
            {100 - pct}% surplus available
          </span>
        </div>
      </div>
    </RecommendationCardShell>
  );
}

/**
 * GenericCard — fallback for subscription savings and other types.
 */
function GenericCard({ rec, isApplied, onAction }) {
  return (
    <RecommendationCardShell rec={rec} isApplied={isApplied} onAction={onAction}>
      {rec.type === 'SUBSCRIPTION_SAVINGS' && (
        <div className="my-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          Click to review all unused subscriptions
        </div>
      )}
    </RecommendationCardShell>
  );
}

// ─── Modal State Type ─────────────────────────────────────────────────────────
const MODAL_NONE          = null;
const MODAL_SET_LIMIT     = 'SET_LIMIT';
const MODAL_WEEKEND       = 'WEEKEND';
const MODAL_SUBSCRIPTIONS = 'SUBSCRIPTIONS';
const MODAL_SAVINGS       = 'SAVINGS';
const MODAL_AUTO_TRANSFER = 'AUTO_TRANSFER';

/**
 * RecommendationsPage
 *
 * Purpose: Top-level page component for the dynamic Recommendations feature.
 *
 * Responsibilities:
 * - Owns filter/search/sort/month state and passes to RecommendationsToolbar.
 * - Fetches paginated card list via useRecommendations.
 * - Renders correct card variant per recommendation type.
 * - Manages modal open/close state.
 * - Shows skeleton loading per-card and error state with retry.
 * - Displays toast notifications for action success/failure.
 */
export function RecommendationsPage() {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [q, setQ]           = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [sortDir, setSortDir] = useState('asc');
  const [month, setMonth]   = useState('');
  const [page]              = useState(0);

  // ── Applied cards (optimistic) ────────────────────────────────────────────
  const [appliedIds, setAppliedIds] = useState({});

  // ── Modal state ───────────────────────────────────────────────────────────
  const [activeModal, setActiveModal]   = useState(MODAL_NONE);
  const [activeRec, setActiveRec]       = useState(null);

  // ── Toast state ───────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { data, loading, error, retry } = useRecommendations({ q, sortBy, sortDir, month, page });

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleCardAction = rec => {
    setActiveRec(rec);
    switch (rec.type) {
      case 'SPENDING_ALERT':      setActiveModal(MODAL_SET_LIMIT);     break;
      case 'SUBSCRIPTION_SAVINGS': setActiveModal(MODAL_SUBSCRIPTIONS); break;
      case 'SAVINGS_OPPORTUNITY': setActiveModal(MODAL_SAVINGS);       break;
      case 'WEEKEND_SPIKE':       setActiveModal(MODAL_WEEKEND);       break;
      case 'SURPLUS_REALLOCATION': setActiveModal(MODAL_AUTO_TRANSFER); break;
      default:
        // Fallback: mark as applied immediately
        setAppliedIds(prev => ({ ...prev, [rec.id]: true }));
        showToast(`Action applied for '${rec.title}'!`);
    }
  };

  const handleModalSuccess = (recId, message) => {
    setAppliedIds(prev => ({ ...prev, [recId]: true }));
    showToast(message || 'Action applied successfully!');
  };

  const closeModal = () => {
    setActiveModal(MODAL_NONE);
    setActiveRec(null);
  };

  // ── Card renderer ─────────────────────────────────────────────────────────
  const renderCard = rec => {
    const isApplied = !!appliedIds[rec.id] || !!rec.applied;

    switch (rec.type) {
      case 'SPENDING_ALERT':
        return <FoodDeliveryCard key={rec.id} rec={rec} isApplied={isApplied} onAction={handleCardAction} month={month} />;
      case 'SAVINGS_OPPORTUNITY':
        return <SavingsOpportunityCard key={rec.id} rec={rec} isApplied={isApplied} onAction={handleCardAction} />;
      case 'WEEKEND_SPIKE':
        return <WeekendSpikeCard key={rec.id} rec={rec} isApplied={isApplied} onAction={handleCardAction} />;
      case 'SURPLUS_REALLOCATION':
        return <SurplusReallocationCard key={rec.id} rec={rec} isApplied={isApplied} onAction={handleCardAction} />;
      default:
        return <GenericCard key={rec.id} rec={rec} isApplied={isApplied} onAction={handleCardAction} />;
    }
  };

  const recommendations = data?.content || [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6" aria-label="AI Financial Recommendations">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wm-border pb-4">
        <div>
          <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">
            AI Financial Recommendations
          </h2>
          <p className="text-sm text-wm-textMuted mt-1">
            Personalized Open Banking optimizations & automated savings rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI Brain Engine Active
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <RecommendationsToolbar
        q={q}
        onQChange={setQ}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDir={sortDir}
        onSortDirChange={setSortDir}
        month={month}
        onMonthChange={setMonth}
        loading={loading}
      />

      {/* Error state */}
      {error && !loading && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Failed to load recommendations</p>
            <p className="text-xs mt-0.5 text-red-600">{error}</p>
          </div>
          <button
            onClick={retry}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            aria-label="Retry loading recommendations"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Results count */}
      {!loading && data && (
        <p className="text-xs text-wm-textMuted">
          Showing {recommendations.length} of {data.totalElements} recommendations
          {q && <> matching "<strong>{q}</strong>"</>}
        </p>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loading skeletons */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={i === 0 ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <SkeletonCard tall={i === 0} />
          </div>
        ))}

        {/* Actual cards */}
        {!loading && recommendations.map((rec, idx) => (
          <div key={rec.id} className={idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'}>
            {renderCard(rec)}
          </div>
        ))}

        {/* Empty state */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-16 gap-3 text-center border-2 border-dashed border-wm-border rounded-xl">
            <Info className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No recommendations found</p>
            <p className="text-xs text-slate-400">Try clearing your search or changing the filter.</p>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {activeModal === MODAL_SET_LIMIT && activeRec && (
        <SetLimitModal
          recommendationId={activeRec.id}
          currentCategory="food_delivery"
          onSuccess={() => handleModalSuccess(activeRec.id, `Spending limit set for ${activeRec.title}!`)}
          onClose={closeModal}
        />
      )}

      {activeModal === MODAL_WEEKEND && (
        <WeekendBreakdownModal onClose={closeModal} />
      )}

      {activeModal === MODAL_SUBSCRIPTIONS && (
        <SubscriptionsListModal onClose={closeModal} />
      )}

      {activeModal === MODAL_SAVINGS && activeRec && (
        <SavingsOffersModal
          surplusAmount={parseFloat(activeRec.surplusAmount) || 2000}
          onClose={closeModal}
        />
      )}

      {activeModal === MODAL_AUTO_TRANSFER && activeRec && (
        <AutoTransferModal
          defaultCategory={activeRec.fromCategory || 'transport'}
          defaultAmount={parseFloat(activeRec.potentialSavings) || 150}
          onSuccess={() => handleModalSuccess(activeRec.id, `Auto-transfer rule created for ${activeRec.title}!`)}
          onClose={closeModal}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
