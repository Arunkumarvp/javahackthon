import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function IncomeExpenseChart({ chartData, timeframe = 'MONTH', periodTitle = 'June 2026' }) {
  const displayData = (chartData && chartData.length > 0)
    ? chartData.map(item => ({
        name: item.date || item.name,
        income: typeof item.income === 'number' ? item.income : parseFloat(item.income || 0),
        expense: typeof item.expense === 'number' ? item.expense : parseFloat(item.expense || 0)
      }))
    : [
        { name: '01 Jun', income: 1200, expense: 400 },
        { name: '05 Jun', income: 800, expense: 350 },
        { name: '10 Jun', income: 1500, expense: 620 },
        { name: '15 Jun', income: 950, expense: 410 },
        { name: '20 Jun', income: 1100, expense: 580 },
        { name: '25 Jun', income: 750, expense: 490 },
        { name: '30 Jun', income: 1300, expense: 700 }
      ];

  const subtitleLabel = timeframe === 'DAY'
    ? 'Hourly Cashflow Timeline (Today)'
    : (timeframe === 'YEAR' ? 'Monthly Trends (Jan - Dec 2026)' : `Daily Outflow & Income Trend (${periodTitle})`);

  return (
    <div className="card-panel p-6 flex flex-col h-full min-h-[350px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-wm-textMain">Income vs Expenditure</h3>
          <p className="text-xs text-wm-textMuted mt-0.5">{subtitleLabel}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <span className="text-wm-textMuted">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
            <span className="text-wm-textMuted">Expenditure</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#15803d" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              formatter={(value, name) => [`£${Number(value).toFixed(2)}`, name === 'income' ? 'Income' : 'Expenditure']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#15803d" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#b91c1c" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
