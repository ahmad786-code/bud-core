import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Upload,
  Calendar,
  Building2,
  FileCheck,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { formatDate } from '../utils/formatters';

export const DocumentsPage: React.FC = () => {
  const { documents, projects, showToast, globalSearch } = useBudCore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const categories = [
    'Umowy',
    'Protokoły odbioru',
    'Dziennik budowy',
    'Faktury',
    'Rysunki i projekty',
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) {
        return false;
      }
      if (selectedProjectId !== 'all' && d.projectId !== selectedProjectId) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.projectName.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q)
      );
    });
  }, [documents, selectedCategory, selectedProjectId, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Repozytorium dokumentacji budowlanej
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dzienniki budowy, protokoły odbiorów technicznych, umowy i projekty wykonawcze
          </p>
        </div>

        <button
          onClick={() => showToast('Dokument został przesłany do chmury projektu')}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Wgraj nowy dokument</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Wszystkie kategorie ({documents.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
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
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj dokumentu..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nazwa dokumentu</th>
                <th className="py-3 px-4">Kategoria</th>
                <th className="py-3 px-4">Budowa</th>
                <th className="py-3 px-4 whitespace-nowrap">Data dodania</th>
                <th className="py-3 px-4 whitespace-nowrap">Rozmiar & Format</th>
                <th className="py-3 px-4 whitespace-nowrap">Dodane przez</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="truncate max-w-sm">{doc.title}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold whitespace-nowrap">
                      {doc.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">{doc.projectName}</td>

                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">{formatDate(doc.date)}</td>

                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{doc.fileType}</span>
                    <span className="text-slate-400 text-xs ml-1">({doc.fileSize})</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{doc.uploadedBy}</td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => showToast(`Otwieranie podglądu pliku: ${doc.title}`)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Podgląd dokumentu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Pobieranie pliku: ${doc.title}`)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Pobierz PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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
