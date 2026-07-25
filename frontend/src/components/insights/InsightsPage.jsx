import React, { useState, useEffect } from 'react';
import { Calendar, Filter, TrendingUp, ArrowDownRight, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { NotableTransactions } from './NotableTransactions';
import { chatService } from '../../services/chatService';

const MONTH_OPTIONS = [
  { value: '2026-06', label: 'June 2026' },
  { value: '2026-05', label: 'May 2026' },
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' }
];

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Transport', label: 'Transport' }
];

export function InsightsPage() {
  const [timeframe, setTimeframe] = useState('MONTH'); // 'DAY' | 'MONTH' | 'YEAR'
  const [selectedMonth, setSelectedMonth] = useState('2026-06');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);
        const data = await chatService.getInsights(timeframe, selectedMonth, selectedCategory);
        setInsightsData(data);
      } catch (err) {
        console.error('[Insights] Failed to load cashflow analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadInsights, 150); // subtle debounce for smooth filter changes
    return () => clearTimeout(timer);
  }, [timeframe, selectedMonth, selectedCategory]);

  const periodTitle = insightsData?.formattedPeriodTitle || MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label || 'June 2026';

  const formattedIncome = insightsData?.totalIncome
    ? `£${insightsData.totalIncome.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
    : '£7,600.00';

  const formattedExpense = insightsData?.totalExpense
    ? `£${insightsData.totalExpense.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
    : '£3,550.00';

  const formattedNet = insightsData?.netCashflow
    ? `£${insightsData.netCashflow.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
    : '£4,050.00';

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-wm-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">Spending Insights</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-wm-blue-light text-wm-blue border border-blue-200">
              {periodTitle}
            </span>
          </div>
          <p className="text-sm text-wm-textMuted mt-1">Real-time cashflow curves, category percentages, and filtered transaction activity.</p>
        </div>

        {/* Filter Controls: Month Dropdown + Category Multi-Select + Timeframe Granularity Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector Dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-wm-border bg-white shadow-sm">
            <Calendar className="w-4 h-4 text-wm-textMuted" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold text-wm-textMain bg-transparent outline-none cursor-pointer"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-wm-border bg-white shadow-sm">
            <Filter className="w-4 h-4 text-wm-textMuted" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold text-wm-textMain bg-transparent outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Granularity Tabs (Day / Month / Year) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-wm-border">
            {[
              { id: 'DAY', label: 'Day' },
              { id: 'MONTH', label: 'Month' },
              { id: 'YEAR', label: 'Year' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeframe === tab.id
                    ? 'bg-wm-blue text-white shadow-sm'
                    : 'text-wm-textMuted hover:text-wm-textMain hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeleton Banner */}
      {loading && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center justify-between animate-pulse shadow-sm">
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-wm-blue" />
            <span>Updating Spending Insights for {periodTitle}...</span>
          </span>
        </div>
      )}

      {/* Dynamic Cashflow Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-panel p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-wm-textMuted font-medium block">Total Income ({periodTitle})</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">{formattedIncome}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="card-panel p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-wm-textMuted font-medium block">Total Expenditure ({periodTitle})</span>
            <span className="text-2xl font-bold text-red-700 mt-1 block">{formattedExpense}</span>
          </div>
          <div className="p-3 rounded-xl bg-red-100 text-red-700">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="card-panel p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-wm-textMuted font-medium block">Net Cashflow ({periodTitle})</span>
            <span className="text-2xl font-bold text-wm-blue mt-1 block">{formattedNet}</span>
          </div>
          <div className="p-3 rounded-xl bg-wm-blue-light text-wm-blue">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart 
            chartData={insightsData?.chartData} 
            timeframe={timeframe}
            periodTitle={periodTitle}
          />
        </div>
        <div className="lg:col-span-1">
          <CategoryBreakdownChart 
            categoriesData={insightsData?.categoryBreakdown} 
            totalSpend={insightsData?.totalSpend}
          />
        </div>
      </div>

      {/* Dynamic Notable Activity Grid */}
      <NotableTransactions 
        transactionsData={insightsData?.notableTransactions} 
        periodTitle={periodTitle}
      />
    </div>
  );
}
