import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Users,
  AlertTriangle,
  ShieldCheck,
  Check,
  Image,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import {
  formatDate,
  formatPlural,
  PLURAL_PHOTOS,
  PLURAL_PERSONS,
} from '../utils/formatters';
import { WeatherIcon } from '../components/common/WeatherBadge';

export const DailyReportsPage: React.FC = () => {
  const {
    dailyReports,
    projects,
    setSelectedDailyReport,
    setIsNewDailyReportModalOpen,
    globalSearch,
  } = useBudCore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const filteredReports = useMemo(() => {
    return dailyReports.filter((r) => {
      if (selectedProjectId !== 'all' && r.projectId !== selectedProjectId) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        r.projectName.toLowerCase().includes(q) ||
        r.siteManager.toLowerCase().includes(q) ||
        r.workCompleted.toLowerCase().includes(q) ||
        r.safetyBHP.toLowerCase().includes(q) ||
        r.delaysBlockers.toLowerCase().includes(q) ||
        r.date.includes(q)
      );
    });
  }, [dailyReports, selectedProjectId, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Raporty dzienne z placów budowy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Meldunki kierowników budów: postęp prac, stany załogi, BHP i przeszkody
          </p>
        </div>

        <button
          onClick={() => setIsNewDailyReportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nowy raport dzienny</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Project selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filtr budowy:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">Wszystkie budowy (4)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj w treści raportów, prac, BHP..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Reports Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {formatDate(report.date)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      {report.projectName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Kierownik: <strong className="text-slate-800">{report.siteManager}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium shrink-0">
                  <WeatherIcon condition={report.weather.condition} className="w-4 h-4" />
                  <span>
                    {report.weather.condition}, {report.weather.temp}°C
                  </span>
                </div>
              </div>

              {/* Workers count badge */}
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Pracownicy FB Bartłomiej Kleczkowski: <strong className="text-slate-900">{report.workersOnSite}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span>
                  Podwykonawcy: <strong className="text-slate-900">{report.subcontractorsOnSite}</strong>
                </span>
                <span className="ml-auto text-slate-400 font-semibold">
                  Suma: {formatPlural(report.workersOnSite + report.subcontractorsOnSite, PLURAL_PERSONS)}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              {/* Wykonane prace */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Wykonane prace
                </span>
                <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 overflow-hidden">
                  <p className="line-clamp-3 leading-relaxed text-slate-600">
                    {report.workCompleted}
                  </p>
                </div>
              </div>

              {/* BHP */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  BHP
                </span>
                <p className="line-clamp-1 text-slate-600">{report.safetyBHP}</p>
              </div>

              {/* Opóźnienia / problemy */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Opóźnienia / problemy
                </span>
                <p className="line-clamp-1 text-amber-900/90 font-medium">{report.delaysBlockers}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Image className="w-3.5 h-3.5 text-slate-400" />
                {formatPlural(report.photoCount, PLURAL_PHOTOS)}
              </span>

              <button
                onClick={() => setSelectedDailyReport(report)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
              >
                <span>Otwórz pełny raport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Nie znaleziono raportów</h3>
          <p className="text-xs text-slate-500 mt-1">Zmień filtry lub utwórz nowy raport dzienny.</p>
        </div>
      )}
    </div>
  );
};
