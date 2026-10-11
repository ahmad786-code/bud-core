import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Plus,
  Package,
  Users,
  Receipt,
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { TaskStatus } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    dailyReports,
    workers,
    materials,
    expenses,
    updateTaskStatus,
    toggleWorkerAttendance,
    setSelectedDailyReport,
    setIsNewTaskModalOpen,
    setIsNewDailyReportModalOpen,
    setSelectedMaterialForOrder,
    setIsOrderModalOpen,
    setIsExpenseModalOpen,
  } = useBudCore();

  const [activeTab, setActiveTab] = useState<
    'Przegląd' | 'Zadania' | 'Raporty' | 'Pracownicy' | 'Materiały' | 'Wydatki'
  >('Przegląd');

  const project = projects.find((p) => p.id === id) || projects[0];

  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600">Nie znaleziono projektu o podanym ID.</p>
        <Link to="/projekty" className="mt-3 inline-block text-amber-600 font-bold text-sm">
          Wróć do listy projektów
        </Link>
      </div>
    );
  }

  // Related filtered items
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectReports = dailyReports.filter((r) => r.projectId === project.id);
  const projectWorkers = workers.filter((w) => w.projectId === project.id);
  const projectMaterials = materials.filter((m) => m.projectId === project.id);
  const projectExpenses = expenses.filter((e) => e.projectId === project.id);

  const tabs: ('Przegląd' | 'Zadania' | 'Raporty' | 'Pracownicy' | 'Materiały' | 'Wydatki')[] = [
    'Przegląd',
    'Zadania',
    'Raporty',
    'Pracownicy',
    'Materiały',
    'Wydatki',
  ];

  const spentPercent = Math.round((project.spent / project.budget) * 100);
  const remaining = project.budget - project.spent;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/projekty')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Powrót do listy projektów</span>
      </button>

      {/* Project Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {project.type}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">Klient: {project.client}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.address}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(project.startDate)} – {formatDate(project.endDate)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Kierownik: <strong className="text-slate-700">{project.manager}</strong> ({project.managerPhone})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} size="md" />
          </div>
        </div>

        {/* Financial and Progress KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-xs text-slate-500 block">Budżet całkowity</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Wydano do tej pory</span>
            <span className="text-lg font-extrabold text-slate-700">
              {formatCurrency(project.spent)}
            </span>
            <span className="text-[11px] text-slate-400 block">{spentPercent}% budżetu</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Pozostało w budżecie</span>
            <span className="text-lg font-extrabold text-emerald-700">
              {formatCurrency(remaining)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Postęp rzeczowy</span>
            <span className="text-lg font-extrabold text-slate-900">{project.progress}%</span>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          let count = 0;
          if (tab === 'Zadania') count = projectTasks.length;
          if (tab === 'Raporty') count = projectReports.length;
          if (tab === 'Pracownicy') count = projectWorkers.length;
          if (tab === 'Materiały') count = projectMaterials.length;
          if (tab === 'Wydatki') count = projectExpenses.length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'border-amber-500 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab}</span>
              {tab !== 'Przegląd' && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRZEGLĄD */}
      {activeTab === 'Przegląd' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Opis inwestycji</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Fazy i etapy budowy ({project.phases.length})
            </h3>
            <div className="space-y-3">
              {project.phases.map((ph, idx) => (
                <div
                  key={ph.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{ph.name}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {formatDate(ph.startDate)} – {formatDate(ph.endDate)}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          ph.status === 'Zakończona'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ph.status === 'W toku'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {ph.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          ph.status === 'Zakończona' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${ph.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-10 text-right">
                      {ph.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ZADANIA */}
      {activeTab === 'Zadania' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Zadania i prace na budowie ({projectTasks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Aktualny wykaz zadań przypisanych do tego placu budowy
              </p>
            </div>
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dodaj zadanie</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {projectTasks.map((t) => (
              <div
                key={t.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{t.title}</span>
                    <PriorityBadge priority={t.priority} />
                    {t.isOverdue && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        Opóźnione
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>
                      Odpowiedzialny: <strong className="text-slate-700">{t.assigneeName}</strong> ({t.assigneeTrade})
                    </span>
                    <span>•</span>
                    <span>Termin: {formatDate(t.dueDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Do zrobienia">Do zrobienia</option>
                    <option value="W toku">W toku</option>
                    <option value="Do sprawdzenia">Do sprawdzenia</option>
                    <option value="Zrobione">Zrobione</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RAPORTY */}
      {activeTab === 'Raporty' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Raporty dzienne ({projectReports.length})
              </h3>
              <p className="text-xs text-slate-500">Historia meldunków z tego placu budowy</p>
            </div>
            <button
              onClick={() => setIsNewDailyReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nowy raport</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    {formatDate(rep.date)}
                  </span>
                  <span className="text-xs text-slate-500">
                    Pogoda: {rep.weather.condition}, {rep.weather.temp}°C
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{rep.workCompleted}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                  <span>Załoga: {rep.workersOnSite + rep.subcontractorsOnSite} osób</span>
                  <button
                    onClick={() => setSelectedDailyReport(rep)}
                    className="font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Otwórz pełny raport →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRACOWNICY */}
      {activeTab === 'Pracownicy' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Załoga przypisana do budowy ({projectWorkers.length} osób)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Pracownik</th>
                  <th className="py-2.5 px-3">Zawód</th>
                  <th className="py-2.5 px-3">Telefon</th>
                  <th className="py-2.5 px-3 text-right">Stawka</th>
                  <th className="py-2.5 px-3 text-center">Dzisiejsza obecność</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{w.name}</td>
                    <td className="py-3 px-3 capitalize text-slate-700">{w.trade}</td>
                    <td className="py-3 px-3 text-slate-500">{w.phone}</td>
                    <td className="py-3 px-3 text-right font-semibold">{w.hourlyRate} zł/h</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleWorkerAttendance(w.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          w.presentToday
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {w.presentToday ? 'Obecny dzisiaj' : 'Nieobecny'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MATERIAŁY */}
      {activeTab === 'Materiały' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Stan magazynowy materiałów na tej budowie
            </h3>
            <button
              onClick={() => {
                setSelectedMaterialForOrder(null);
                setIsOrderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Zamów materiał</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Materiał</th>
                  <th className="py-2.5 px-3">Kategoria</th>
                  <th className="py-2.5 px-3 text-right">Stan obecny</th>
                  <th className="py-2.5 px-3 text-right">Minimum</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3 px-3 text-slate-600">{m.category}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {m.currentStock} {m.unit}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      {m.minStock} {m.unit}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {m.isLowStock ? (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Niski stan!
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Wystarczający
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMaterialForOrder(m);
                          setIsOrderModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold text-xs rounded-md transition-colors cursor-pointer"
                      >
                        Zamów
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: WYDATKI */}
      {activeTab === 'Wydatki' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Wydatki i faktury na tej budowie ({projectExpenses.length})
              </h3>
              <p className="text-xs text-slate-500">
                Łącznie poniesiono:{' '}
                <strong className="text-slate-800">
                  {formatCurrency(projectExpenses.reduce((acc, e) => acc + e.amount, 0))}
                </strong>
              </p>
            </div>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dodaj wydatek</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Tytuł</th>
                  <th className="py-2.5 px-3">Kategoria</th>
                  <th className="py-2.5 px-3">Wystawca / Kontrahent</th>
                  <th className="py-2.5 px-3">Nr faktury</th>
                  <th className="py-2.5 px-3 text-right">Kwota</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{exp.title}</td>
                    <td className="py-3 px-3 text-slate-600">{exp.category}</td>
                    <td className="py-3 px-3 text-slate-700">{exp.contractor}</td>
                    <td className="py-3 px-3 text-slate-500">{exp.invoiceNumber}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-800">
                        {exp.status}
                      </span>
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
