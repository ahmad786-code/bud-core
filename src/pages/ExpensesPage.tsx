import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  Building,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useBudCore } from '../context/BudCoreContext';
import { ExpenseCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { monthlyExpensesData } from '../data/mockData';

export const ExpensesPage: React.FC = () => {
  const {
    expenses,
    projects,
    setIsExpenseModalOpen,
    globalSearch,
    kpis,
  } = useBudCore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const categories: ExpenseCategory[] = ['Materiały', 'Robocizna', 'Sprzęt', 'Podwykonawcy', 'Inne'];

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedProjectId !== 'all' && e.projectId !== selectedProjectId) {
        return false;
      }
      if (selectedCategory !== 'all' && e.category !== selectedCategory) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.contractor.toLowerCase().includes(q) ||
        e.invoiceNumber.toLowerCase().includes(q) ||
        e.projectName.toLowerCase().includes(q)
      );
    });
  }, [expenses, selectedProjectId, selectedCategory, localSearch, globalSearch]);

  // Category breakdown calculation
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {
      Materiały: 0,
      Robocizna: 0,
      Sprzęt: 0,
      Podwykonawcy: 0,
      Inne: 0,
    };
    expenses.forEach((e) => {
      if (map[e.category] !== undefined) {
        map[e.category] += e.amount;
      }
    });
    return [
      { name: 'Materiały', value: map['Materiały'], color: '#f59e0b' },
      { name: 'Robocizna', value: map['Robocizna'], color: '#3b82f6' },
      { name: 'Sprzęt', value: map['Sprzęt'], color: '#8b5cf6' },
      { name: 'Podwykonawcy', value: map['Podwykonawcy'], color: '#10b981' },
      { name: 'Inne', value: map['Inne'], color: '#64748b' },
    ];
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Koszty i wydatki budowlane
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zestawienie faktur, robocizny, sprzętu i podwykonawców z podziałem na budowy
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Dodaj wydatek</span>
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Miesięczny rozkład wydatków (ostatnie 6 miesięcy)
            </h3>
            <p className="text-xs text-slate-500">
              Koszty w podziale na materiały, robociznę, podwykonawców i sprzęt
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpensesData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('pl-PL')} zł`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="materialy" name="Materiały" fill="#f59e0b" stackId="a" />
                <Bar dataKey="robocizna" name="Robocizna" fill="#3b82f6" stackId="a" />
                <Bar dataKey="podwykonawcy" name="Podwykonawcy" fill="#10b981" stackId="a" />
                <Bar dataKey="sprzet" name="Sprzęt" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Podział według kategorii</h3>
            <p className="text-xs text-slate-500">Udział poszczególnych grup kosztowych</p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('pl-PL')} zł`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {categoryTotals.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <strong className="text-slate-900">{formatCurrency(cat.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Wszystkie budowy</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Wszystkie kategorie</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj faktury, kontrahenta..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Przedmiot kosztu</th>
                <th className="py-3 px-4">Kategoria</th>
                <th className="py-3 px-4">Budowa</th>
                <th className="py-3 px-4">Kontrahent</th>
                <th className="py-3 px-4">Nr dokumentu</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Kwota netto</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{exp.title}</td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {exp.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">{exp.projectName}</td>

                  <td className="py-3.5 px-4 text-slate-800">{exp.contractor}</td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">{exp.invoiceNumber}</td>

                  <td className="py-3.5 px-4 text-slate-600">{formatDate(exp.date)}</td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    {formatCurrency(exp.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        exp.status === 'Opłacone'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exp.status === 'Zatwierdzone'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exp.status}
                    </span>
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
