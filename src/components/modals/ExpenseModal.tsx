import React, { useState } from 'react';
import { X, Receipt, Building, Calendar, DollarSign } from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';
import { ExpenseCategory } from '../../types';

export const ExpenseModal: React.FC = () => {
  const {
    projects,
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    addExpense,
  } = useBudCore();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [category, setCategory] = useState<ExpenseCategory>('Materiały');
  const [amount, setAmount] = useState<number>(25000);
  const [date, setDate] = useState('2026-10-10');
  const [invoiceNumber, setInvoiceNumber] = useState(`FV/2026/10/${Math.floor(Math.random() * 800 + 100)}`);
  const [contractor, setContractor] = useState('Dostawca / Podwykonawca');
  const [status, setStatus] = useState<'Opłacone' | 'Zatwierdzone' | 'Oczekuje'>('Zatwierdzone');

  if (!isExpenseModalOpen) return null;

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentProject) return;

    addExpense({
      title: title.trim(),
      projectId,
      projectName: currentProject.name,
      category,
      amount: Number(amount),
      date,
      invoiceNumber: invoiceNumber.trim(),
      contractor: contractor.trim(),
      status,
    });

    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Zarejestruj wydatek budowlany
            </h3>
            <p className="text-xs text-slate-500">
              Księguj faktury, koszty robocizny, sprzętu i podwykonawców
            </p>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              Tytuł wydatku / Przedmiot kosztu *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Np. Beton B25 płyta parteru lub Wynajem pompy"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategoria kosztu *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
              >
                <option value="Materiały">Materiały</option>
                <option value="Robocizna">Robocizna</option>
                <option value="Sprzęt">Sprzęt</option>
                <option value="Podwykonawcy">Podwykonawcy</option>
                <option value="Inne">Inne</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                Kwota netto (zł) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Data faktury / operacji
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numer faktury / dokumentu
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kontrahent / Wystawca
              </label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                placeholder="Np. Cemex Polska Sp. z o.o."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status płatności
            </label>
            <div className="flex gap-4">
              {(['Zatwierdzone', 'Opłacone', 'Oczekuje'] as const).map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              Zapisz wydatek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
