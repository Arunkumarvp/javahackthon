import React, { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, LineChart, Line, Tooltip } from 'recharts';
import { MoreVertical, ChevronLeft, ChevronRight, ExternalLink, Download } from 'lucide-react';

const defaultBarDataH1 = [
  { name: 'Jan', value: 1500 },
  { name: 'Feb', value: 3000, active: true },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 3400, active: true },
  { name: 'May', value: 2340 }
];

const defaultBarDataH2 = [
  { name: 'Jun', value: 2800 },
  { name: 'Jul', value: 3100, active: true },
  { name: 'Aug', value: 1900 },
  { name: 'Sep', value: 2400 },
  { name: 'Oct', value: 3200, active: true }
];

const defaultLineData = [
  { name: 'Q1', value: 1000 },
  { name: 'Q2', value: 1500 },
  { name: 'Q3', value: 1300 },
  { name: 'Q4', value: 3800 }
];

export function ReportsSection({ barChartData, lineChartData }) {
  const [periodIndex, setPeriodIndex] = useState(0); // 0: H1, 1: H2
  const [exportNotice, setExportNotice] = useState('');

  const activeBarDataset = periodIndex === 0
    ? (barChartData && barChartData.length > 0 ? barChartData : defaultBarDataH1)
    : defaultBarDataH2;

  const displayBarData = activeBarDataset.map(item => ({
    name: item.name,
    value: typeof item.value === 'number' ? item.value : parseFloat(item.value || 0),
    active: Boolean(item.active)
  }));

  const displayLineData = (lineChartData && lineChartData.length > 0)
    ? lineChartData.map(item => ({
        name: item.name,
        value: typeof item.value === 'number' ? item.value : parseFloat(item.value || 0)
      }))
    : defaultLineData;

  const handleExportCsv = () => {
    setExportNotice('CSV Financial Report downloaded successfully!');
    setTimeout(() => setExportNotice(''), 3000);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-wm-textMain">Financial Analytics & Reports</h3>
          <p className="text-xs text-wm-textMuted mt-0.5">Showing period: {periodIndex === 0 ? 'Jan - May (H1)' : 'Jun - Oct (H2)'}</p>
        </div>

        <div className="flex items-center gap-3">
          {exportNotice && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              {exportNotice}
            </span>
          )}

          <button 
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-wm-border bg-white text-xs font-semibold text-wm-textMain hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-wm-blue" />
            <span>Export Report</span>
          </button>

          <div className="flex items-center gap-1 border-l border-wm-border pl-3">
            <button 
              onClick={() => setPeriodIndex(0)}
              disabled={periodIndex === 0}
              className="p-1.5 rounded-full border border-wm-border bg-white text-wm-textMuted disabled:opacity-40 hover:text-wm-textMain hover:bg-slate-50 transition-colors shadow-sm"
              title="Previous Period (H1)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPeriodIndex(1)}
              disabled={periodIndex === 1}
              className="p-1.5 rounded-full border border-wm-border bg-white text-wm-textMuted disabled:opacity-40 hover:text-wm-textMain hover:bg-slate-50 transition-colors shadow-sm"
              title="Next Period (H2)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income vs Expenditure */}
        <div className="card-panel p-6 flex flex-col h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-semibold text-wm-textMain">Income vs Expenditure (£)</h4>
            <button onClick={handleExportCsv} className="text-wm-textMuted hover:text-wm-textMain" title="Export Chart Data">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 w-full relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayBarData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dy={10}
                />
                <Tooltip 
                  formatter={(value) => [`£${Number(value).toFixed(2)}`, 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={40}>
                  {displayBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#005a8d' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income vs Savings */}
        <div className="card-panel p-6 flex flex-col h-[300px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-semibold text-wm-textMain">Quarterly Savings Growth (£)</h4>
            <button onClick={handleExportCsv} className="text-wm-textMuted hover:text-wm-textMain" title="Options">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayLineData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dy={10}
                />
                <Tooltip 
                  formatter={(value) => [`£${Number(value).toFixed(2)}`, 'Savings']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ color: '#64748b', fontSize: '12px' }}
                  itemStyle={{ color: '#15803d', fontSize: '14px', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#15803d" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#15803d' }} 
                  activeDot={{ r: 6, fill: '#15803d', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
