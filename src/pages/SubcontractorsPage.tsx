import React, { useState, useMemo } from 'react';
import {
  Handshake,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { formatCurrency } from '../utils/formatters';

export const SubcontractorsPage: React.FC = () => {
  const { subcontractors, showToast, globalSearch } = useBudCore();
  const [localSearch, setLocalSearch] = useState('');

  const filteredSubcontractors = useMemo(() => {
    const q = (localSearch || globalSearch).toLowerCase().trim();
    if (!q) return subcontractors;
    return subcontractors.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.trade.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q)
    );
  }, [subcontractors, localSearch, globalSearch]);

  const totalContracts = subcontractors.reduce((acc, s) => acc + s.contractValue, 0);
  const totalInvoiced = subcontractors.reduce((acc, s) => acc + s.invoicedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Podwykonawcy i umowy branżowe
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Nadzór nad specjalistycznymi firmami wykonawczymi, rozliczeniami i fakturowaniem
          </p>
        </div>

        <button
          onClick={() => showToast('Formularz nowej umowy podwykonawczej został otwarty')}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Dodaj podwykonawcę</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Aktywne firmy podwykonawcze</span>
          <span className="text-2xl font-extrabold text-slate-900">{subcontractors.length}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Łączna wartość kontraktów</span>
          <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalContracts)}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Zafakturowano do tej pory</span>
          <span className="text-2xl font-extrabold text-emerald-700">
            {formatCurrency(totalInvoiced)} ({Math.round((totalInvoiced / totalContracts) * 100)}%)
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj firmy, branży, osoby kontaktowej..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Wyświetlono: {filteredSubcontractors.length} firm
        </span>
      </div>

      {/* Subcontractors Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubcontractors.map((sub) => {
          const progressPercent = Math.round((sub.invoicedAmount / sub.contractValue) * 100);

          return (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{sub.companyName}</h3>
                    <p className="text-xs font-semibold text-amber-600 mt-0.5">{sub.trade}</p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      sub.status === 'W realizacji'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Budowy: {sub.activeProjects.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {sub.contactPerson} ({sub.phone})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sub.email}</span>
                  </div>
                </div>
              </div>

              {/* Financial Progress */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Wartość umowy:</span>
                  <strong className="text-slate-900">{formatCurrency(sub.contractValue)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Zafakturowano:</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(sub.invoicedAmount)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-right text-slate-400 font-semibold">
                  Rozliczono {progressPercent}% kontraktu
                </div>
              </div>

              <button
                onClick={() => showToast(`Szczegóły umowy z ${sub.companyName} wygenerowane`)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
              >
                Szczegóły kontraktu i protokoły
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
