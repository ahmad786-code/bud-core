import React from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { projects, kpis, showToast } = useBudCore();

  const handleExportPDF = (title: string) => {
    showToast(`Generowanie raportu PDF: "${title}"... Plik pobrany.`);
  };

  const handleExportXLS = (title: string) => {
    showToast(`Eksport danych do arkusza Excel (XLSX): "${title}" zakończony.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Raporty zarządcze i analityka budów
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zestawienia finansowe, wykonanie harmonogramów i wskaźniki BHP dla zarządu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportPDF('Zbiorczy Raport Operacyjny FB Bartłomiej Kleczkowski Szczecin')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Pobierz PDF</span>
          </button>
          <button
            onClick={() => handleExportXLS('Koszty i harmonogramy FB Bartłomiej Kleczkowski Szczecin Q3-Q4')}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Eksport Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Wykonanie budżetu ogółem</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
            {kpis.spentPercentage}%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {formatCurrency(kpis.totalSpent)} z {formatCurrency(kpis.totalProjectValue)}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Rentowność planowana</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">18.4%</span>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Zgodnie z założeniami ofertowymi
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Dni bez wypadku (BHP)</span>
          <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">342 dni</span>
          <span className="text-xs text-slate-500 mt-1 block">Wszystkie 4 aktywne budowy</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Średnia terminowość faz</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">91.2%</span>
          <span className="text-xs text-slate-500 mt-1 block">1 projekt z korektą harmonogramu</span>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report 1: Finanse */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">
                Raport rentowności i odchyleń budżetowych
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Szczegółowa analiza rentowności poszczególnych kontraktów, rozliczeń z podwykonawcami
              oraz wariancji cen kluczowych materiałów (stal, beton, izolacje) w relacji do kosztorysów
              inwestorskich.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              {projects.map((p) => (
                <div key={p.id} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">{p.name}</span>
                  <span className="text-slate-600">
                    Wydano {Math.round((p.spent / p.budget) * 100)}% ({formatCurrency(p.spent)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => handleExportPDF('Raport Rentowności i Odchyleń Budżetowych')}
              className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg cursor-pointer"
            >
              Generuj zestawienie PDF
            </button>
            <button
              onClick={() => handleExportXLS('Wariancje budżetowe')}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg cursor-pointer"
            >
              Eksportuj arkusz XLS
            </button>
          </div>
        </div>

        {/* Report 2: Postęp i Kamienie milowe */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Building2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">
                Raport postępu rzeczowo-finansowego inwestycji
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kwantyfikacja zaawansowania robót budowlano-montażowych w ujęciu tygodniowym, miesięcznym
              i narastającym, wraz z estymacją ścieżki krytycznej dla każdego z obiektów.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              {projects.map((p) => (
                <div key={p.id} className="space-y-1 py-1 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className="text-slate-600">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => handleExportPDF('Postęp Rzeczowo-Finansowy')}
              className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg cursor-pointer"
            >
              Generuj zestawienie PDF
            </button>
            <button
              onClick={() => handleExportXLS('Zaawansowanie robót')}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg cursor-pointer"
            >
              Eksportuj arkusz XLS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
