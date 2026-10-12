import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Check,
  X,
  Truck,
  Calendar,
  DollarSign,
  PackageCheck,
  Clock,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';
import { OrderStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { OrderStatusBadge } from '../components/common/StatusBadge';

export const OrdersPage: React.FC = () => {
  const {
    orders,
    projects,
    updateOrderStatus,
    setIsOrderModalOpen,
    setSelectedMaterialForOrder,
    globalSearch,
    kpis,
  } = useBudCore();

  const [activeFilter, setActiveFilter] = useState<'Wszystkie' | OrderStatus>('Wszystkie');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const filterTabs: ('Wszystkie' | OrderStatus)[] = [
    'Wszystkie',
    'Oczekuje na akceptację',
    'Zatwierdzone',
    'Dostarczone',
    'Odrzucone',
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeFilter !== 'Wszystkie' && o.status !== activeFilter) {
        return false;
      }
      if (selectedProjectId !== 'all' && o.projectId !== selectedProjectId) {
        return false;
      }
      const q = (localSearch || globalSearch).toLowerCase().trim();
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q) ||
        o.materialName.toLowerCase().includes(q) ||
        o.projectName.toLowerCase().includes(q)
      );
    });
  }, [orders, activeFilter, selectedProjectId, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Zamówienia materiałowe i dostawy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zarządzaj procesem akceptacji dostaw i koordynacją dostawców
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedMaterialForOrder(null);
            setIsOrderModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nowe zamówienie</span>
        </button>
      </div>

      {/* Status Tabs and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {filterTabs.map((tab) => {
            const count =
              tab === 'Wszystkie'
                ? orders.length
                : orders.filter((o) => o.status === tab).length;

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

        <div className="flex items-center gap-3">
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

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Szukaj nr zamówienia, dostawcy..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nr zamówienia</th>
                <th className="py-3 px-4">Dostawca</th>
                <th className="py-3 px-4">Przedmiot zamówienia</th>
                <th className="py-3 px-4">Budowa</th>
                <th className="py-3 px-4 text-right">Wartość netto</th>
                <th className="py-3 px-4">Data dostawy</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Decyzja / Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {order.orderNumber}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {order.supplier}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{order.materialName}</span>
                    <span className="text-xs text-slate-500">
                      Ilość: {order.quantity} {order.unit}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {order.projectName}
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    {formatCurrency(order.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(order.deliveryDate)}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  {/* Actions column */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {order.status === 'Oczekuje na akceptację' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Zatwierdzone')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="Zatwierdź zamówienie"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Zatwierdź</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Odrzucone')}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Odrzuć zamówienie"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Odrzuć</span>
                        </button>
                      </div>
                    )}

                    {order.status === 'Zatwierdzone' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Dostarczone')}
                        className="px-3 py-1 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        title="Potwierdź odbiór na budowie"
                      >
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Odbierz</span>
                      </button>
                    )}

                    {order.status === 'Dostarczone' && (
                      <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Rozliczono
                      </span>
                    )}

                    {order.status === 'Odrzucone' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Oczekuje na akceptację')}
                        className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Przywróć
                      </button>
                    )}
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
