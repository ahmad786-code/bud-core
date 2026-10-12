import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  Calendar,
  Building2,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const MaterialsPage: React.FC = () => {
  const {
    materials,
    projects,
    setSelectedMaterialForOrder,
    setIsOrderModalOpen,
    globalSearch,
    kpis,
  } = useBudCore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>('');

  const categories = ['Konstrukcja', 'Izolacje', 'Instalacje', 'Wykończenie'];

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (selectedProjectId !== 'all' && m.projectId !== selectedProjectId) {
        return false;
      }
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }
      if (onlyLowStock && !m.isLowStock) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.projectName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [materials, selectedProjectId, selectedCategory, onlyLowStock, localSearch, globalSearch]);

  const handleOrderClick = (material: any) => {
    setSelectedMaterialForOrder(material);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Magazyn i zaopatrzenie materiałowe
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoruj stany magazynowe materiałów na {projects.length} budowach
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedMaterialForOrder(null);
            setIsOrderModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          <span>Nowe zamówienie</span>
        </button>
      </div>

      {/* Low stock alert banner */}
      {kpis.lowStockMaterialsCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-slate-950 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">
                Uwaga: {kpis.lowStockMaterialsCount} pozycje materiałowe poniżej stanu minimalnego!
              </h4>
              <p className="text-xs text-amber-800">
                Beton C25/30, pustaki Porotherm 25 oraz wełna mineralna wymagają pilnego uzupełnienia
                zapasów, aby uniknąć przestojów brygad.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              onlyLowStock
                ? 'bg-amber-600 text-white'
                : 'bg-amber-200/80 text-amber-900 hover:bg-amber-300'
            }`}
          >
            {onlyLowStock ? 'Pokaż wszystkie materiały' : 'Filtruj niski stan'}
          </button>
        </div>
      )}

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

          {/* Category Filter */}
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

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Szukaj materiału..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Materiał budowlany</th>
                <th className="py-3 px-4">Kategoria</th>
                <th className="py-3 px-4">Budowa (Lokalizacja)</th>
                <th className="py-3 px-4 text-right">Stan na placu</th>
                <th className="py-3 px-4 text-right">Stan minimalny</th>
                <th className="py-3 px-4 text-right">Cena jedn. netto</th>
                <th className="py-3 px-4 text-center">Status magazynu</th>
                <th className="py-3 px-4 text-right">Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredMaterials.map((material) => (
                <tr
                  key={material.id}
                  className={`transition-colors ${
                    material.isLowStock ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{material.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      {material.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {material.projectName}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                    {material.currentStock} {material.unit}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-500 font-medium whitespace-nowrap">
                    {material.minStock} {material.unit}
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-slate-700 whitespace-nowrap">
                    {formatCurrency(material.unitPrice)} / {material.unit}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {material.isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Niski stan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>W normie</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOrderClick(material)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        material.isLowStock
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Zamów</span>
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
