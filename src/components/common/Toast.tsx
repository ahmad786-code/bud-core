import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useBudCore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
      <span className="text-sm font-medium text-slate-100">{toastMessage}</span>
      <button
        onClick={clearToast}
        className="ml-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Zamknij"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
