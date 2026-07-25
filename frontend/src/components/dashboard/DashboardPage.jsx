import React, { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { ReportsSection } from './ReportsSection';
import { TransactionsTable } from './TransactionsTable';
import { TransactionDetailModal } from './TransactionDetailModal';
import { QuickTransferModal } from './QuickTransferModal';
import { Landmark, CreditCard, PiggyBank, ArrowRight, ArrowUpRight, ShieldAlert, Sparkles, RefreshCw, Send } from 'lucide-react';
import { apiRequest } from '../../services/api';

export function DashboardPage({ onOpenAiChat }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modals state
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showQuickTransfer, setShowQuickTransfer] = useState(false);

  const loadSummary = async () => {
    try {
      setRefreshing(true);
      const data = await apiRequest('/summary');
      setSummaryData(data);
    } catch (err) {
      console.error('[Dashboard] Error fetching summary:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleTransferSuccess = (vopData) => {
    setShowQuickTransfer(false);
    loadSummary();
    if (onOpenAiChat) onOpenAiChat();
  };

  const formattedBalance = summaryData?.totalBalance 
    ? `£${summaryData.totalBalance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` 
    : '£14,850.40';

  const formattedSpending = summaryData?.monthlySpending 
    ? `£${summaryData.monthlySpending.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` 
    : '£2,340.10';

  const formattedSavings = summaryData?.totalSavings
    ? `£${summaryData.totalSavings.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
    : '£15,000.00';

  const flagsCount = summaryData?.securityFlagsCount ?? 1;

  return (
    <div>
      {/* Top Title & Primary Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">Dashboard</h2>
          <p className="text-sm text-wm-textMuted mt-1">Live overview of your financial standing & Open Banking protection.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQuickTransfer(true)}
            className="flex items-center gap-2 px-3.5 py-2 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-xl shadow-sm transition-all"
            title="Make a Quick Open Banking Payment"
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Quick Transfer</span>
          </button>

          <button
            onClick={loadSummary}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 border border-wm-border bg-white hover:bg-slate-50 text-wm-textMain text-sm font-medium rounded-xl shadow-sm transition-all"
            title="Sync Banfico Open Banking API"
          >
            <RefreshCw className={`w-4 h-4 text-wm-blue ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Banking'}</span>
          </button>

          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Guardian</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Balance" 
          amount={formattedBalance} 
          trend="Banfico OBIE v4.0 Active"
          icon={Landmark}
          trendIcon={ArrowUpRight}
          trendColor="text-emerald-600"
        />
        <MetricCard 
          title="Monthly Outflow" 
          amount={formattedSpending} 
          trend="Verified by AI Guardian"
          icon={CreditCard}
          trendIcon={ArrowUpRight}
          trendColor="text-wm-blue"
        />
        <MetricCard 
          title="Security Alerts" 
          amount={`${flagsCount} Active`} 
          trend={flagsCount > 0 ? "Requires Review" : "Zero Threats Detected"}
          icon={ShieldAlert}
          trendIcon={ArrowRight}
          trendColor={flagsCount > 0 ? "text-amber-600" : "text-emerald-600"}
        />
        <MetricCard 
          title="Total Savings" 
          amount={formattedSavings} 
          trend="On track for goal"
          icon={PiggyBank}
          trendIcon={ArrowRight}
          trendColor="text-wm-blue"
        />
      </div>

      {/* Reports Section (Dynamic Visualizations & Interactive Paging) */}
      <ReportsSection 
        barChartData={summaryData?.barChartData} 
        lineChartData={summaryData?.lineChartData} 
      />

      {/* Recent Transactions Table with Search, Filter & Row Selection */}
      <TransactionsTable 
        transactionsData={summaryData?.recentTransactions} 
        onSelectTransaction={setSelectedTransaction}
      />

      {/* Transaction Detail & Fraud Dispute Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onDispute={(id) => {
            console.log('[Dashboard] Disputed transaction ID:', id);
          }}
          onMarkSafe={(id) => {
            console.log('[Dashboard] Marked safe transaction ID:', id);
          }}
        />
      )}

      {/* Quick Transfer VoP Modal */}
      {showQuickTransfer && (
        <QuickTransferModal
          onClose={() => setShowQuickTransfer(false)}
          onTransferSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
}
