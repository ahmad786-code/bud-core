import React, { useState } from 'react';
import { X, User, Phone, Coins } from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';
import { WorkerTrade } from '../../types';

export const WorkerModal: React.FC = () => {
  const {
    projects,
    isNewWorkerModalOpen,
    setIsNewWorkerModalOpen,
    addWorker,
  } = useBudCore();

  const [name, setName] = useState('');
  const [trade, setTrade] = useState<WorkerTrade>('murarz');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [phone, setPhone] = useState('+48 500 000 000');
  const [hourlyRate, setHourlyRate] = useState(40);
  const [experienceYears, setExperienceYears] = useState(5);
  const [presentToday, setPresentToday] = useState(true);

  if (!isNewWorkerModalOpen) return null;

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentProject) return;

    addWorker({
      name: name.trim(),
      trade,
      projectId,
      projectName: currentProject.name,
      phone,
      hourlyRate: Number(hourlyRate),
      experienceYears: Number(experienceYears),
      presentToday,
    });

    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Dodaj pracownika budowlanego</h3>
            <p className="text-xs text-slate-500">Zarejestruj nowego członka załogi na budowie</p>
          </div>
          <button
            onClick={() => setIsNewWorkerModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Imię i nazwisko *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Np. Kazimierz Dąbrowski"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specjalizacja (Zawód) *
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as WorkerTrade)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none capitalize"
              >
                <option value="brygadzista">brygadzista</option>
                <option value="murarz">murarz</option>
                <option value="zbrojarz">zbrojarz</option>
                <option value="cieśla">cieśla</option>
                <option value="elektryk">elektryk</option>
                <option value="hydraulik">hydraulik</option>
                <option value="operator żurawia">operator żurawia</option>
                <option value="pomocnik">pomocnik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Przypisana budowa *
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Telefon
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                Stawka godzinowa (zł/h)
              </label>
              <input
                type="number"
                min="25"
                max="100"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="presentToday"
              checked={presentToday}
              onChange={(e) => setPresentToday(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="presentToday" className="text-xs font-medium text-slate-800">
              Pracownik obecny dzisiaj na placu budowy
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewWorkerModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              Zapisz pracownika
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
