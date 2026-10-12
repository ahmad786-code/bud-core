import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Coins,
  Building2,
  CheckCircle2,
  XCircle,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { formatPlural, PLURAL_WORKERS } from '../utils/formatters';

export const WorkersPage: React.FC = () => {
  const {
    workers,
    projects,
    toggleWorkerAttendance,
    setIsNewWorkerModalOpen,
    globalSearch,
    kpis,
  } = useBudCore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const trades = [
    'brygadzista',
    'murarz',
    'zbrojarz',
    'cieśla',
    'elektryk',
    'hydraulik',
    'operator żurawia',
    'pomocnik',
  ];

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      if (selectedProjectId !== 'all' && w.projectId !== selectedProjectId) {
        return false;
      }
      if (selectedTrade !== 'all' && w.trade !== selectedTrade) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.trade.toLowerCase().includes(q) ||
        w.projectName.toLowerCase().includes(q) ||
        w.phone.includes(q)
      );
    });
  }, [workers, selectedProjectId, selectedTrade, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pracownicy i obecności na budowach
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zarządzaj kadrą {formatPlural(workers.length, PLURAL_WORKERS)} i monitoruj frekwencję
          </p>
        </div>

        <button
          onClick={() => setIsNewWorkerModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Dodaj pracownika</span>
        </button>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Wszyscy pracownicy</span>
          <span className="text-2xl font-extrabold text-slate-900">{kpis.totalWorkersCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Obecni dzisiaj</span>
          <span className="text-2xl font-extrabold text-emerald-700">{kpis.presentWorkersCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Nieobecni</span>
          <span className="text-2xl font-extrabold text-slate-400">
            {kpis.totalWorkersCount - kpis.presentWorkersCount}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block font-semibold">Frekwencja</span>
          <span className="text-2xl font-extrabold text-indigo-700">{kpis.attendanceRate}%</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Site Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Wszystkie budowy (4)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trade Filter */}
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 capitalize"
            >
              <option value="all">Wszystkie specjalizacje</option>
              {trades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj imienia, telefonu..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Pracownik</th>
                <th className="py-3 px-4">Zawód & Doświadczenie</th>
                <th className="py-3 px-4">Przypisany plac budowy</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Stawka godzinowa</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status obecności dzisiaj</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {worker.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="font-semibold">{worker.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="capitalize font-semibold text-slate-900">{worker.trade}</span>
                    <span className="text-slate-400 text-xs block">
                      {worker.experienceYears} lat stażu
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">{worker.projectName}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs whitespace-nowrap">{worker.phone}</td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                    {worker.hourlyRate} zł/h
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => toggleWorkerAttendance(worker.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        worker.presentToday
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300/80 shadow-xs'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-xs'
                      }`}
                      title="Kliknij, aby zmienić obecność na budowie"
                    >
                      {worker.presentToday ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Obecny</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Nieobecny</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
