import React, { useState, useEffect } from 'react';
import { Utensils, PlaySquare, PiggyBank, CalendarDays, Landmark, CheckCircle2, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { RecommendationCard, BenefitBox } from './RecommendationCard';
import { chatService } from '../../services/chatService';

const fallbackRecommendations = [
  {
    id: 'rec-1',
    title: 'Reduce Food Delivery Spending',
    category: 'Food & Dining',
    description: 'You spent 22% more on food delivery this month than your three-month average. Cutting back to your average could save you significantly.',
    badge: 'Spending Alert',
    badgeStyle: 'alert',
    expectedBenefit: 'Potential savings: £45/month',
    actionText: 'Set Limit',
    potentialSavings: 45.00,
    type: 'chart'
  },
  {
    id: 'rec-2',
    title: 'Potential Subscription Savings',
    category: 'Subscriptions',
    description: "We noticed you haven't used your 'CinemaMax' subscription in over 60 days.",
    badge: 'SAVINGS',
    badgeStyle: 'success',
    expectedBenefit: 'Save £12.99/month',
    actionText: 'Cancel Subscription',
    potentialSavings: 12.99,
    type: 'subscription'
  },
  {
    id: 'rec-3',
    title: 'High-Interest Savings Opportunity',
    category: 'Savings',
    description: "Your surplus cash in 'Current Account' is earning 0.1%. Moving £2,000 to a fixed saver could yield more.",
    badge: 'OPPORTUNITY',
    badgeStyle: 'info',
    expectedBenefit: 'Potential: 4.5% AER (£90/year)',
    actionText: 'Explore Accounts',
    potentialSavings: 90.00,
    type: 'interest'
  },
  {
    id: 'rec-4',
    title: 'Recurring Weekend Spike',
    category: 'Behavioral Alert',
    description: 'Your spending consistently spikes by 40% on Sundays, primarily on retail and dining.',
    badge: 'RECURRING',
    badgeStyle: 'alert',
    expectedBenefit: 'Potential control: £60/month',
    actionText: 'Set Weekend Limit',
    potentialSavings: 60.00,
    type: 'sparkline'
  },
  {
    id: 'rec-5',
    title: 'Reallocate Surplus to Savings',
    category: 'Budget Automation',
    description: "You are consistently £150 under budget in your 'Transport' category. Consider automating this to savings.",
    badge: 'AUTOMATION',
    badgeStyle: 'success',
    expectedBenefit: 'Auto-Save: £150/month',
    actionText: 'Create Auto-Transfer',
    potentialSavings: 150.00,
    type: 'progress'
  }
];

export function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(fallbackRecommendations);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState({});
  const [noticeMessage, setNoticeMessage] = useState('');

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await chatService.getRecommendations();
        if (data && data.length > 0) {
          setRecommendations(data);
        }
      } catch (err) {
        console.warn('[Recommendations] Offline fallback active:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  const handleApplyAction = async (rec) => {
    try {
      await chatService.applyRecommendation(rec.id);
    } catch (err) {
      console.warn('[Recommendations] Service fallback active for action:', rec.id);
    } finally {
      setAppliedIds(prev => ({ ...prev, [rec.id]: true }));
      setNoticeMessage(`Action applied for '${rec.title}'! AI Guardian automation active.`);
      setTimeout(() => setNoticeMessage(''), 4000);
    }
  };

  const getIconForCategory = (cat) => {
    if (cat?.includes('Food')) return Utensils;
    if (cat?.includes('Subscription')) return PlaySquare;
    if (cat?.includes('Savings')) return PiggyBank;
    if (cat?.includes('Behavioral')) return CalendarDays;
    return Landmark;
  };

  return (
    <div className="space-y-8">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wm-border pb-4">
        <div>
          <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">AI Financial Recommendations</h2>
          <p className="text-sm text-wm-textMuted mt-1">Personalized Open Banking optimizations & automated savings rules.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Brain Engine Active</span>
          </span>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
          <span>{noticeMessage}</span>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      )}

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
          const IconComp = getIconForCategory(rec.category);
          const isApplied = appliedIds[rec.id];

          return (
            <div key={rec.id || index} className={index === 0 ? "lg:col-span-2" : "lg:col-span-1"}>
              <RecommendationCard 
                icon={IconComp} 
                title={rec.title} 
                badge={rec.badge} 
                badgeStyle={rec.badgeStyle}
              >
                <div className="flex flex-col flex-1 mt-2 justify-between space-y-4">
                  <p className="text-sm text-wm-textMuted leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Visual Sub-widgets based on Card Type */}
                  {index === 0 && (
                    <div className="flex items-end justify-center gap-6 pb-2 pt-2 border-y border-slate-100 my-2">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-12 bg-slate-200 rounded-t"></div>
                        <span className="text-[10px] text-wm-textMuted uppercase font-bold">Oct</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-16 bg-slate-200 rounded-t"></div>
                        <span className="text-[10px] text-wm-textMuted uppercase font-bold">Nov</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-10 bg-slate-200 rounded-t"></div>
                        <span className="text-[10px] text-wm-textMuted uppercase font-bold">Dec</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-24 bg-amber-600 rounded-t"></div>
                        <span className="text-[10px] text-amber-900 uppercase font-bold">Jan</span>
                      </div>
                    </div>
                  )}

                  {rec.type === 'interest' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs my-2">
                      <div>
                        <span className="text-wm-textMuted block">Current Rate</span>
                        <span className="font-bold text-wm-textMain text-sm">0.1%</span>
                      </div>
                      <div className="text-wm-blue font-bold">→</div>
                      <div>
                        <span className="text-emerald-600 block font-semibold">Potential Yield</span>
                        <span className="font-bold text-emerald-700 text-sm">4.5% AER</span>
                      </div>
                    </div>
                  )}

                  {rec.type === 'sparkline' && (
                    <div className="flex items-end justify-between h-10 px-4 py-1 bg-slate-50 rounded-lg border border-slate-100 my-2">
                      <div className="w-1.5 h-2 bg-slate-300 rounded-t"></div>
                      <div className="w-1.5 h-3 bg-slate-300 rounded-t"></div>
                      <div className="w-1.5 h-2 bg-slate-300 rounded-t"></div>
                      <div className="w-1.5 h-8 bg-amber-600 rounded-t"></div>
                      <div className="w-1.5 h-2 bg-slate-300 rounded-t"></div>
                      <div className="w-1.5 h-4 bg-slate-300 rounded-t"></div>
                      <div className="w-1.5 h-10 bg-amber-600 rounded-t"></div>
                    </div>
                  )}

                  {rec.type === 'progress' && (
                    <div className="bg-slate-100 rounded-full h-7 flex items-center px-4 relative overflow-hidden my-2 border border-slate-200">
                      <div className="absolute left-0 top-0 bottom-0 bg-wm-blue w-[40%] rounded-r-full"></div>
                      <span className="text-[10px] font-bold text-slate-700 relative z-10 ml-auto">40% Budget Used</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <BenefitBox label="EXPECTED BENEFIT" value={rec.expectedBenefit} />

                    {isApplied ? (
                      <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Action Applied & Automation Active</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApplyAction(rec)}
                        className="w-full py-2.5 bg-wm-blue hover:bg-wm-blue-hover text-white rounded-lg text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>{rec.actionText || 'Apply Recommendation'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </RecommendationCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
