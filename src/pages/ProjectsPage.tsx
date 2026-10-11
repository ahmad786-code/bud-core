import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  User,
  DollarSign,
  Search,
  LayoutGrid,
  List,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { ProjectStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const ProjectsPage: React.FC = () => {
  const { projects, globalSearch } = useBudCore();
  const [activeFilter, setActiveFilter] = useState<'Wszystkie' | ProjectStatus>('Wszystkie');
  const [localSearch, setLocalSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filterTabs: ('Wszystkie' | ProjectStatus)[] = [
    'Wszystkie',
    'Zgodnie z planem',
    'Zagrożony',
    'Opóźniony',
    'Zakończony',
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Status filter
      if (activeFilter !== 'Wszystkie' && p.status !== activeFilter) {
        return false;
      }
      // Search term (combine globalSearch or localSearch)
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.manager.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    });
  }, [projects, activeFilter, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Zarządzanie projektami i budowami
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zarządzaj 4 kluczowymi inwestycjami budowlanymi w portfolio
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Widok kafelkowy"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Widok tabelaryczny"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Local Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Status segmented tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => {
            const count =
              tab === 'Wszystkie'
                ? projects.length
                : projects.filter((p) => p.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeFilter === tab ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj projektu, klienta..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Brak projektów spełniających kryteria</h3>
          <p className="text-xs text-slate-500 mt-1">Zmień filtr statusu lub wyczyść pole wyszukiwania.</p>
          <button
            onClick={() => {
              setActiveFilter('Wszystkie');
              setLocalSearch('');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            Pokaż wszystkie projekty
          </button>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => {
            const spentPercent = Math.round((project.spent / project.budget) * 100);
            const remaining = project.budget - project.spent;

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 border-b border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
                          {project.type}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {project.client}
                        </span>
                      </div>
                      <Link
                        to={`/projekty/${project.id}`}
                        className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors block"
                      >
                        {project.name}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{project.address}</span>
                      </div>
                    </div>

                    <StatusBadge status={project.status} />
                  </div>

                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Postęp rzeczowy: {project.progress}%</span>
                      <span className="text-slate-500 text-[11px]">Wydano: {spentPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          project.status === 'Opóźniony'
                            ? 'bg-rose-500'
                            : project.status === 'Zagrożony'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial strip */}
                <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-slate-50/70 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Budżet</span>
                    <strong className="text-slate-900">{formatCurrency(project.budget)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Wydano</span>
                    <strong className="text-slate-700">{formatCurrency(project.spent)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Pozostało</span>
                    <strong className="text-emerald-700">{formatCurrency(remaining)}</strong>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 px-5 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center">
                      {project.manager
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block leading-tight">
                        {project.manager}
                      </span>
                      <span className="text-[11px] text-slate-400">Kierownik budowy</span>
                    </div>
                  </div>

                  <Link
                    to={`/projekty/${project.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    <span>Szczegóły</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && filteredProjects.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Inwestycja</th>
                  <th className="py-3 px-4">Typ & Klient</th>
                  <th className="py-3 px-4">Kierownik</th>
                  <th className="py-3 px-4">Postęp</th>
                  <th className="py-3 px-4 text-right">Budżet</th>
                  <th className="py-3 px-4 text-right">Wydano</th>
                  <th className="py-3 px-4 text-right">Pozostało</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link to={`/projekty/${p.id}`} className="hover:text-amber-600">
                        {p.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 font-normal">{p.address}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{p.type}</span>
                      <p className="text-[11px] text-slate-500">{p.client}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{p.manager}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">{formatCurrency(p.budget)}</td>
                    <td className="py-3.5 px-4 text-right">{formatCurrency(p.spent)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {formatCurrency(p.budget - p.spent)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/projekty/${p.id}`}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-md text-slate-800"
                      >
                        Otwórz
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
