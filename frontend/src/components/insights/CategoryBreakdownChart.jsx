import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function CategoryBreakdownChart({ categoriesData, totalSpend }) {
  const displayData = (categoriesData && categoriesData.length > 0)
    ? categoriesData.map(item => ({
        name: item.name,
        value: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount || item.value || 0),
        percentage: item.percentage || 0,
        color: item.color || '#0f766e'
      }))
    : [
        { name: 'Housing', value: 1597.50, percentage: 45.00, color: '#0f766e' },
        { name: 'Food & Dining', value: 1136.00, percentage: 32.00, color: '#b91c1c' },
        { name: 'Transport', value: 816.50, percentage: 23.00, color: '#334155' }
      ];

  const totalSum = totalSpend != null ? parseFloat(totalSpend) : displayData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card-panel p-6 flex flex-col h-full min-h-[350px]">
      <h3 className="text-lg font-bold text-wm-textMain mb-6">Category Breakdown</h3>
      
      <div className="flex-1 relative flex flex-col justify-center min-h-[200px]">
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-[10px] font-bold text-wm-textMuted uppercase tracking-wider">Total Spend</span>
          <span className="text-xl font-bold text-wm-textMain">£{totalSum.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(val) => [`£${Number(val).toFixed(2)}`, 'Spend']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-3">
        {displayData.map((item, idx) => {
          const calculatedPct = totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : item.percentage;
          return (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-wm-textMain font-medium">{item.name}</span>
                <span className="text-xs text-wm-textMuted font-bold">({calculatedPct}%)</span>
              </div>
              <span className="text-wm-textMain font-semibold">£{item.value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
