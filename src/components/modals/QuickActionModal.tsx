import React from 'react';
import {
  X,
  ClipboardList,
  CheckSquare,
  Receipt,
  ShoppingCart,
  UserPlus,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionModalOpen,
    setIsQuickActionModalOpen,
    setIsNewDailyReportModalOpen,
    setIsNewTaskModalOpen,
    setIsExpenseModalOpen,
    setIsOrderModalOpen,
    setIsNewWorkerModalOpen,
  } = useBudCore();

  if (!isQuickActionModalOpen) return null;

  const actions = [
    {
      title: 'Nowy raport dzienny',
      desc: 'Wpisz stan załogi, postęp robót, warunki pogodowe i uwagi BHP z placu budowy.',
      icon: ClipboardList,
      color: 'bg-amber-500 text-slate-950',
      action: () => {
        setIsQuickActionModalOpen(false);
        setIsNewDailyReportModalOpen(true);
      },
    },
    {
      title: 'Przydziel nowe zadanie',
      desc: 'Stwórz zadanie na tablicy kanban, przypisz pracownika i ustaw termin.',
      icon: CheckSquare,
      color: 'bg-blue-600 text-white',
      action: () => {
        setIsQuickActionModalOpen(false);
        setIsNewTaskModalOpen(true);
      },
    },
    {
      title: 'Zarejestruj wydatek',
      desc: 'Wprowadź fakturę lub koszt materiałów, sprzętu, robocizny albo podwykonawcy.',
      icon: Receipt,
      color: 'bg-emerald-600 text-white',
      action: () => {
        setIsQuickActionModalOpen(false);
        setIsExpenseModalOpen(true);
      },
    },
    {
      title: 'Złóż zamówienie materiałowe',
      desc: 'Zamów beton, stal, bloczki lub izolacje z dostawą bezpośrednio na plac.',
      icon: ShoppingCart,
      color: 'bg-purple-600 text-white',
      action: () => {
        setIsQuickActionModalOpen(false);
        setIsOrderModalOpen(true);
      },
    },
    {
      title: 'Dodaj pracownika do załogi',
      desc: 'Zarejestruj nowego murarza, zbrojarza, cieślę lub brygadzistę w systemie.',
      icon: UserPlus,
      color: 'bg-slate-800 text-white',
      action: () => {
        setIsQuickActionModalOpen(false);
        setIsNewWorkerModalOpen(true);
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Szybka akcja operacyjna</h3>
              <p className="text-xs text-slate-500">Wybierz czynność, którą chcesz wykonać</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickActionModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 divide-y divide-slate-100 space-y-1">
          {actions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
              >
                <div className={`p-2.5 rounded-xl ${item.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsQuickActionModalOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
