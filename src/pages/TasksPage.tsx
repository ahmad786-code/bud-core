import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { TaskStatus, TaskPriority, Task } from '../types';
import { formatDate } from '../utils/formatters';
import { PriorityBadge } from '../components/common/StatusBadge';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    projects,
    updateTaskStatus,
    deleteTask,
    setIsNewTaskModalOpen,
    globalSearch,
  } = useBudCore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'Do zrobienia', title: 'Do zrobienia', color: 'border-slate-300' },
    { status: 'W toku', title: 'W toku', color: 'border-blue-400' },
    { status: 'Do sprawdzenia', title: 'Do sprawdzenia', color: 'border-amber-400' },
    { status: 'Zrobione', title: 'Zrobione', color: 'border-emerald-400' },
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) {
        return false;
      }
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.assigneeName.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [tasks, selectedProjectId, selectedPriority, localSearch, globalSearch]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Harmonogram robót i tablica zadań
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zarządzaj realizacją zadań technicznych, odbiorów i prac podwykonawczych
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Przydziel zadanie</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
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

          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Wszystkie priorytety</option>
              <option value="Krytyczny">Krytyczny</option>
              <option value="Wysoki">Wysoki</option>
              <option value="Średni">Średni</option>
              <option value="Niski">Niski</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj zadania..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">{col.title}</span>
                  <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-xs font-bold flex items-center justify-center shadow-xs">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`bg-white rounded-xl p-4 border shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5 ${
                      task.isOverdue ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {task.projectName}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <strong className="text-slate-800">{task.assigneeName}</strong>
                        </span>
                        <span className="text-slate-400">({task.assigneeTrade})</span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            task.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                          {task.isOverdue && ' (Opóźnione!)'}
                        </span>

                        {/* Move column quick selector */}
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium focus:outline-none"
                        >
                          <option value="Do zrobienia">Do zrobienia</option>
                          <option value="W toku">W toku</option>
                          <option value="Do sprawdzenia">Do sprawdzenia</option>
                          <option value="Zrobione">Zrobione</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    Przeciągnij tutaj lub brak zadań
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
