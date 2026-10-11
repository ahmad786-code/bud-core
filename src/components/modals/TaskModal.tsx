import React, { useState } from 'react';
import { X, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';
import { TaskPriority, TaskStatus } from '../../types';

export const TaskModal: React.FC = () => {
  const {
    projects,
    workers,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    addTask,
  } = useBudCore();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [assigneeId, setAssigneeId] = useState(workers[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('Średni');
  const [status, setStatus] = useState<TaskStatus>('Do zrobienia');
  const [dueDate, setDueDate] = useState('2026-10-18');
  const [description, setDescription] = useState('');

  if (!isNewTaskModalOpen) return null;

  const currentProject = projects.find((p) => p.id === projectId);
  const currentWorker = workers.find((w) => w.id === assigneeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentProject) return;

    addTask({
      title: title.trim(),
      projectId,
      projectName: currentProject.name,
      assigneeName: currentWorker ? currentWorker.name : 'Janusz Kowalski',
      assigneeTrade: currentWorker ? currentWorker.trade : 'brygadzista',
      priority,
      status,
      dueDate,
      description: description.trim() || 'Wykonać zgodnie ze sztuką budowlaną i projektem wykonawczym.',
    });

    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Przydziel nowe zadanie</h3>
            <p className="text-xs text-slate-500">Dodaj zadanie do tablicy harmonogramu robót</p>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tytuł zadania *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Np. Szalowanie stropu osie 4-7 piętro +2"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budowa (Projekt) *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                Osoba odpowiedzialna *
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.trade})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priorytet</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
              >
                <option value="Niski">Niski</option>
                <option value="Średni">Średni</option>
                <option value="Wysoki">Wysoki</option>
                <option value="Krytyczny">Krytyczny</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kolumna</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
              >
                <option value="Do zrobienia">Do zrobienia</option>
                <option value="W toku">W toku</option>
                <option value="Do sprawdzenia">Do sprawdzenia</option>
                <option value="Zrobione">Zrobione</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Termin (Do kiedy)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opis wytycznych / uwagi technologiczne
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instrukcje montażowe, normy lub uwagi inspektora..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              Utwórz zadanie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
