import React, { useState } from 'react';
import {
  X,
  Calendar,
  CloudSun,
  Users,
  AlertTriangle,
  ShieldCheck,
  Check,
  Image,
  Upload,
} from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';
import {
  formatDate,
  formatPlural,
  PLURAL_PHOTOS,
  PLURAL_PERSONS,
} from '../../utils/formatters';
import { WeatherIcon } from '../common/WeatherBadge';

export const DailyReportModal: React.FC = () => {
  const {
    projects,
    selectedDailyReport,
    setSelectedDailyReport,
    isNewDailyReportModalOpen,
    setIsNewDailyReportModalOpen,
    addDailyReport,
  } = useBudCore();

  // Form state for creating a new report
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [date, setDate] = useState('2026-10-12');
  const [workersCount, setWorkersCount] = useState(10);
  const [subcontractorsCount, setSubcontractorsCount] = useState(8);
  const [weatherCondition, setWeatherCondition] = useState<
    'Słonecznie' | 'Pochmurno' | 'Deszcz' | 'Wiatr' | 'Śnieg'
  >('Słonecznie');
  const [temperature, setTemperature] = useState(16);
  const [workCompleted, setWorkCompleted] = useState('');
  const [safetyBHP, setSafetyBHP] = useState(
    'Stanowiska pracy zabezpieczone. Pracownicy posiadają wymagane ŚOI. Brak wypadków i incydentów.'
  );
  const [delaysBlockers, setDelaysBlockers] = useState('Brak opóźnień.');
  const [notes, setNotes] = useState('');
  const [simulatedPhotos, setSimulatedPhotos] = useState<
    { id: string; caption: string; url: string; timestamp: string }[]
  >([
    {
      id: 'np-1',
      caption: 'Zdjęcie z postępu robót - rano',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
      timestamp: '08:30',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProject = projects.find((p) => p.id === projectId);
    if (!currentProject) return;

    addDailyReport({
      date,
      projectId,
      projectName: currentProject.name,
      siteManager: currentProject.manager,
      workersOnSite: Number(workersCount),
      subcontractorsOnSite: Number(subcontractorsCount),
      weather: {
        temp: Number(temperature),
        condition: weatherCondition,
        favorable: weatherCondition !== 'Deszcz' && weatherCondition !== 'Wiatr',
      },
      workCompleted:
        workCompleted.trim() ||
        'Wykonano zaplanowane prace konstrukcyjne i instalacyjne zgodnie z harmonogramem.',
      safetyBHP,
      delaysBlockers,
      notes,
      photoCount: simulatedPhotos.length,
      photos: simulatedPhotos,
    });
  };

  // 1. Details view modal
  if (selectedDailyReport) {
    const report = selectedDailyReport;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Raport dzienny
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {formatDate(report.date)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{report.projectName}</h3>
            </div>
            <button
              onClick={() => setSelectedDailyReport(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-sm">
            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-700">
              <div>
                <span className="text-xs text-slate-500 block">Kierownik budowy</span>
                <span className="font-semibold text-slate-900">{report.siteManager}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Załoga własna</span>
                <span className="font-semibold text-slate-900">
                  {formatPlural(report.workersOnSite, PLURAL_PERSONS)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Podwykonawcy</span>
                <span className="font-semibold text-slate-900">
                  {formatPlural(report.subcontractorsOnSite, PLURAL_PERSONS)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Warunki pogodowe</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <WeatherIcon condition={report.weather.condition} className="w-4 h-4" />
                  <span className="font-semibold text-slate-900">
                    {report.weather.condition}, {report.weather.temp}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Wykonane prace */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Wykonane prace
              </h4>
              <p className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                {report.workCompleted}
              </p>
            </div>

            {/* Bezpieczeństwo BHP */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Bezpieczeństwo i higiena pracy (BHP)
              </h4>
              <p className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg text-emerald-950 leading-relaxed">
                {report.safetyBHP}
              </p>
            </div>

            {/* Opóźnienia / problemy */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Opóźnienia / problemy i przeszkody
              </h4>
              <p className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg text-amber-950 leading-relaxed">
                {report.delaysBlockers}
              </p>
            </div>

            {report.notes && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">Uwagi i zalecenia kierownika</h4>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  {report.notes}
                </p>
              </div>
            )}

            {/* Documentation photos */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-slate-600" />
                Dokumentacja fotograficzna ({formatPlural(report.photos.length, PLURAL_PHOTOS)})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950/80 to-transparent text-[11px] text-white">
                      <p className="truncate font-medium">{photo.caption}</p>
                      <span className="text-[10px] text-slate-300">{photo.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => setSelectedDailyReport(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. New report mobile-friendly form modal
  if (isNewDailyReportModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Nowy raport dzienny
              </h3>
              <p className="text-xs text-slate-500">
                Wypełnij stan załogi, postęp robót i BHP na budowie
              </p>
            </div>
            <button
              onClick={() => setIsNewDailyReportModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - optimized for phone input */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm">
            {/* Project & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plac budowy (Projekt) *
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm font-medium"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Data raportu *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm font-medium"
                    required
                  />
                  <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Workers on site */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Własni pracownicy
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={workersCount}
                  onChange={(e) => setWorkersCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Podwykonawcy
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subcontractorsCount}
                  onChange={(e) => setSubcontractorsCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Weather */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5 text-slate-500" />
                  Warunki pogodowe
                </label>
                <select
                  value={weatherCondition}
                  onChange={(e) =>
                    setWeatherCondition(
                      e.target.value as 'Słonecznie' | 'Pochmurno' | 'Deszcz' | 'Wiatr' | 'Śnieg'
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm font-medium focus:border-amber-500 focus:outline-none"
                >
                  <option value="Słonecznie">Słonecznie</option>
                  <option value="Pochmurno">Pochmurno</option>
                  <option value="Deszcz">Deszcz</option>
                  <option value="Wiatr">Silny wiatr</option>
                  <option value="Śnieg">Śnieg</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Wykonane prace */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Wykonane prace (opis robót) *
              </label>
              <textarea
                rows={3}
                value={workCompleted}
                onChange={(e) => setWorkCompleted(e.target.value)}
                placeholder="Np. Zakończono szalowanie stropu osie 4-7, ułożono 120m² zbrojenia..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* Bezpieczeństwo BHP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Bezpieczeństwo BHP
              </label>
              <input
                type="text"
                value={safetyBHP}
                onChange={(e) => setSafetyBHP(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Opóźnienia / problemy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Opóźnienia / problemy
              </label>
              <input
                type="text"
                value={delaysBlockers}
                onChange={(e) => setDelaysBlockers(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Photos upload simulator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Zdjęcia z budowy ({formatPlural(simulatedPhotos.length, PLURAL_PHOTOS)})
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const id = `photo-${Date.now()}`;
                    setSimulatedPhotos((prev) => [
                      ...prev,
                      {
                        id,
                        caption: `Zdjęcie operacyjne #${prev.length + 1}`,
                        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
                        timestamp: '14:20',
                      },
                    ]);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Dodaj zdjęcie z aparatu/galerii</span>
                </button>
                <span className="text-xs text-slate-500">
                  {formatPlural(simulatedPhotos.length, PLURAL_PHOTOS)}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsNewDailyReportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
              >
                Zapisz raport dzienny
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
