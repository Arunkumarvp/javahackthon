import React from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences';

/**
 * CommunicationPreferencesPanel
 *
 * Collapsible accordion section lazy-loading notification preferences.
 * Toggling any preference fires an immediate PATCH update with optimistic UI state.
 */
export function CommunicationPreferencesPanel() {
  const {
    preferences,
    loading,
    error,
    isExpanded,
    toggleExpand,
    togglePreference,
  } = useNotificationPreferences();

  return (
    <div className="card-panel bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm">
      {/* Header Button */}
      <button
        type="button"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        className="w-full p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors focus:outline-none focus:ring-2 focus:ring-wm-blue text-left"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100/70 flex items-center justify-center text-wm-blue">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Communication Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage alert delivery channels & summary emails
            </p>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            /* Skeleton Loading Rows */
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 animate-pulse"
                >
                  <div className="h-4 bg-slate-200 rounded w-48" />
                  <div className="h-6 bg-slate-200 rounded-full w-11" />
                </div>
              ))}
            </div>
          ) : (
            /* Preference Toggle Rows */
            <div className="divide-y divide-slate-100">
              {preferences.map((pref) => (
                <div
                  key={pref.key}
                  className="flex items-center justify-between py-3.5 first:pt-2 last:pb-0"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {pref.label}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={pref.enabled}
                    aria-label={`Toggle preference: ${pref.label}`}
                    onClick={() => togglePreference(pref.key, pref.enabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-wm-blue focus:ring-offset-2 ${
                      pref.enabled ? 'bg-wm-blue' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        pref.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
