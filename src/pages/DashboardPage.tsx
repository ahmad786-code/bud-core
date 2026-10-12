import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  Users,
  CheckSquare,
  AlertTriangle,
  Package,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ClipboardList,
  Receipt,
  Clock,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { useBudCore } from '../context/BudCoreContext';
import {
  formatCurrency,
  formatCompactCurrency,
  formatPercent,
  formatDate,
  pluralize,
  PLURAL_TASKS,
  PLURAL_WORKERS,
  PLURAL_MATERIALS,
} from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { monthlyExpensesData } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const {
    projects,
    kpis,
    activities,
    setIsNewDailyReportModalOpen,
    setIsNewTaskModalOpen,
    setIsExpenseModalOpen,
  } = useBudCore();

  const [chartType, setChartType] = useState<'comparison' | 'monthly'>('comparison');

  // Chart data for "Budżet vs Wydatki"
  const projectComparisonData = projects.map((p) => ({
    name: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
    Budżet: p.budget,
    Wydano: p.spent,
    Pozostało: Math.max(0, p.budget - p.spent),
  }));

  return (
    <div className="space-y-6">
      {/* 1. Dark Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-xl">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Nadzór operacyjny • Dziś, {formatDate('2026-10-12')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Centrum dowodzenia <span className="text-amber-500">FB Bartłomiej Kleczkowski Szczecin</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Zarządzasz równolegle <strong className="text-white">4 placami budowy</strong>. Wszystkie
              procesy: załoga na budowach, zapotrzebowanie materiałowe, dzienne meldunki i koszty
              są zsynchronizowane w czasie rzeczywistym.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsNewDailyReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Dodaj raport dzienny</span>
            </button>
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>Przydziel zadanie</span>
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Dodaj wydatek</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 7 KPI Cards (Titles allow 2 lines, never truncate; money never wraps) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* KPI 1: Aktywne projekty */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Aktywne projekty</span>
            <Building2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {kpis.activeProjectsCount}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 whitespace-nowrap">
              Wszystkie w realizacji
            </span>
          </div>
        </div>

        {/* KPI 2: Wartość projektów */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Wartość projektów</span>
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
              {formatCompactCurrency(kpis.totalProjectValue)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 whitespace-nowrap">
              Wydano: {formatCompactCurrency(kpis.totalSpent)}
            </span>
          </div>
        </div>

        {/* KPI 3: Wydatki w tym miesiącu */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Wydatki w tym miesiącu</span>
            <TrendingUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-slate-900 whitespace-nowrap">
              {formatCompactCurrency(kpis.monthlySpent)}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded whitespace-nowrap">
                {kpis.monthlySpentPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">planu 1,1 mln zł</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Pracownicy na budowach */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Pracownicy na budowach</span>
            <Users className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-2xl font-extrabold text-slate-900">
                {kpis.presentWorkersCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ {kpis.totalWorkersCount}</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5 whitespace-nowrap">
              {kpis.attendanceRate}% obecności dzisiaj
            </span>
          </div>
        </div>

        {/* KPI 5: Zadania w toku */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Zadania w toku</span>
            <CheckSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {kpis.inProgressTasksCount}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded whitespace-nowrap">
                {kpis.overdueTasksCount} {pluralize(kpis.overdueTasksCount, ['opóźnione', 'opóźnione', 'opóźnionych'])}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 6: Zapotrzebowanie na materiały */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Zapotrzebowanie na materiały</span>
            <Package className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-amber-600">
              {kpis.lowStockMaterialsCount}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 whitespace-nowrap">
              Wymagają zamówienia
            </span>
          </div>
        </div>

        {/* KPI 7: Projekty zagrożone */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-slate-500 min-h-[2.5rem]">
            <span className="text-xs font-semibold leading-tight text-slate-700">Projekty zagrożone</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-rose-600">
              {kpis.atRiskProjectsCount}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 whitespace-nowrap">
              1 zagrożony, 1 opóźniony
            </span>
          </div>
        </div>
      </div>

      {/* 3. Table: Postęp projektów i finanse */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Postęp projektów i finanse</h3>
            <p className="text-xs text-slate-500">
              Przegląd budżetów, realizacji rzeczowej i kierowników budowy
            </p>
          </div>
          <Link
            to="/projekty"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 group whitespace-nowrap"
          >
            <span>Zobacz wszystkie projekty</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Projekt i adres</th>
                <th className="py-3 px-4">Kierownik budowy</th>
                <th className="py-3 px-4">Postęp prac i wydatki</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Budżet całkowity</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Wydano</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Pozostało</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {projects.map((proj) => {
                const spentPercent = Math.round((proj.spent / proj.budget) * 100);
                const remaining = proj.budget - proj.spent;
                const managerInitials = proj.manager
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <Link
                          to={`/projekty/${proj.id}`}
                          className="font-bold text-slate-900 hover:text-amber-600 transition-colors"
                        >
                          {proj.name}
                        </Link>
                        <p className="text-[11px] text-slate-500">{proj.address}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {managerInitials}
                        </div>
                        <span className="font-medium text-slate-900">{proj.manager}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[160px]">
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1 whitespace-nowrap">
                          <span className="text-slate-700">Realizacja: {proj.progress}%</span>
                          <span className="text-slate-500 text-[11px] font-normal">
                            Wydano {spentPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          <div
                            className={`h-full rounded-full ${
                              proj.status === 'Opóźniony'
                                ? 'bg-rose-500'
                                : proj.status === 'Zagrożony'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {formatCurrency(proj.budget)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700 whitespace-nowrap">
                      {formatCurrency(proj.spent)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(remaining)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={proj.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/projekty/${proj.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-slate-200 rounded-md transition-all whitespace-nowrap"
                      >
                        <span>Szczegóły</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts interactive chart (reduced height, space removed, polish formatting) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {chartType === 'comparison'
                  ? 'Budżet vs wydatki według projektów'
                  : 'Wydatki miesięczne (ostatnie 6 miesięcy)'}
              </h3>
              <p className="text-xs text-slate-500">
                {chartType === 'comparison'
                  ? 'Porównanie kosztów poniesionych z planem budżetowym'
                  : 'Dynamika kosztów w podziale na miesiące i plan finansowy'}
              </p>
            </div>

            {/* Segmented control for toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                onClick={() => setChartType('comparison')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  chartType === 'comparison'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Budżet vs wydatki
              </button>
              <button
                onClick={() => setChartType('monthly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  chartType === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Wydatki miesięczne
              </button>
            </div>
          </div>

          <div className="h-60 w-full pt-1">
            {chartType === 'comparison' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectComparisonData}
                  layout="horizontal"
                  margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => {
                      if (val === 0) return '0 zł';
                      const m = val / 1_000_000;
                      return `${m.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mln zł`;
                    }}
                    domain={[0, 5000000]}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString('pl-PL')} zł`]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }}
                  />
                  <Bar dataKey="Budżet" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={22} />
                  <Bar dataKey="Wydano" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyExpensesData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => {
                      if (val === 0) return '0 zł';
                      if (val >= 1_000_000) {
                        const m = val / 1_000_000;
                        return `${m.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mln zł`;
                      }
                      const k = val / 1_000;
                      return `${k.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} tys. zł`;
                    }}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString('pl-PL')} zł`]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="wydatki"
                    name="Wydatki faktyczne"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSpent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="budzetPlan"
                    name="Plan budżetowy"
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right 1 Col: Ostatnia aktywność feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Ostatnia aktywność</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Na żywo</span>
            </div>

            <div className="mt-4 space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 leading-tight">{act.title}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{act.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{act.relativeTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/raporty-dzienne"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1"
            >
              <span>Przejdź do dziennika raportów</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
