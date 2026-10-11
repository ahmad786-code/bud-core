import React, { useState, useEffect } from 'react';
import { X, Package, Truck, Calendar, DollarSign } from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';

export const OrderModal: React.FC = () => {
  const {
    projects,
    isOrderModalOpen,
    setIsOrderModalOpen,
    selectedMaterialForOrder,
    setSelectedMaterialForOrder,
    createOrder,
  } = useBudCore();

  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [supplier, setSupplier] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [quantity, setQuantity] = useState<number>(20);
  const [unit, setUnit] = useState('t');
  const [amount, setAmount] = useState<number>(15000);
  const [deliveryDate, setDeliveryDate] = useState('2026-10-15');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedMaterialForOrder) {
      setProjectId(selectedMaterialForOrder.projectId);
      setMaterialName(selectedMaterialForOrder.name);
      setUnit(selectedMaterialForOrder.unit);
      const needed = Math.max(
        selectedMaterialForOrder.minStock * 2 - selectedMaterialForOrder.currentStock,
        selectedMaterialForOrder.minStock
      );
      setQuantity(Math.round(needed));
      setAmount(Math.round(needed * selectedMaterialForOrder.unitPrice));
      setSupplier(
        selectedMaterialForOrder.category === 'Konstrukcja'
          ? 'Cemex Polska Sp. z o.o.'
          : 'SIG Materiały Budowlane'
      );
    } else {
      setMaterialName('');
      setSupplier('');
    }
  }, [selectedMaterialForOrder]);

  if (!isOrderModalOpen) return null;

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim() || !supplier.trim() || !currentProject) return;

    createOrder({
      supplier: supplier.trim(),
      projectId,
      projectName: currentProject.name,
      materialName: materialName.trim(),
      quantity: Number(quantity),
      unit,
      amount: Number(amount),
      status: 'Oczekuje na akceptację',
      orderDate: '2026-10-11',
      deliveryDate,
      notes: notes.trim() || 'Wymagane atesty jakościowe i certyfikaty CE.',
    });
  };

  const handleClose = () => {
    setIsOrderModalOpen(false);
    setSelectedMaterialForOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Nowe zamówienie materiałowe
            </h3>
            <p className="text-xs text-slate-500">
              Złóż zapotrzebowanie do zatwierdzenia przez dyrektora
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dla budowy (Projekt) *
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
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                Dostawca / Hurtownia *
              </label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Np. Cemex / ArcelorMittal"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              Nazwa materiału i parametry *
            </label>
            <input
              type="text"
              required
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="Np. Beton towarowy C25/30 W8"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ilość *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jednostka</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="m³, t, szt."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-slate-500" />
                Wartość netto (zł)
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Oczekiwany termin dostawy na budowę
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Uwagi do logistyki i rozładunku
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Np. Wjazd od ul. Lipowej, wymagany HDS"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              Złóż zamówienie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
