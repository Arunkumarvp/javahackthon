import React from 'react';
import { ShoppingCart, Utensils, Car, Film, Plane, ShoppingBag, Plus, MessageSquare, ChevronDown } from 'lucide-react';
import { BudgetCard } from './BudgetCard';

export function WorkflowsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-wm-textMain font-sans tracking-tight">Smart Workflows</h2>
        <p className="text-sm text-wm-textMuted mt-1">Budget Alerts & Automation</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-wm-textMain">Active Budgets</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <BudgetCard icon={ShoppingCart} title="Grocery" spent="425" limit="500" percentage={85} isAlert={true} />
        <BudgetCard icon={Utensils} title="Dining Out" spent="180" limit="300" percentage={60} isAlert={false} />
        <BudgetCard icon={Car} title="Transport" spent="60" limit="150" percentage={40} isAlert={false} />
        <BudgetCard icon={Film} title="Entertainment" spent="184" limit="200" percentage={92} isAlert={true} />
        <BudgetCard icon={Plane} title="Travel" spent="150" limit="1000" percentage={15} isAlert={false} />
        <BudgetCard icon={ShoppingBag} title="Shopping" spent="300" limit="400" percentage={75} isAlert={false} />

        {/* Add Category Card */}
        <button className="card-panel border-2 border-dashed border-wm-border bg-slate-50/50 p-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-colors min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-slate-600" />
          </div>
          <span className="text-sm font-bold text-wm-textMain">Add Category</span>
          <span className="text-[11px] text-wm-blue font-semibold mt-1">Create a new budget limit</span>
        </button>
      </div>

      {/* Communication Preferences */}
      <div className="card-panel bg-slate-50 border-none p-6 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-wm-textMain">Communication Preferences</h3>
        </div>
        <ChevronDown className="w-5 h-5 text-wm-textMuted" />
      </div>
    </div>
  );
}
