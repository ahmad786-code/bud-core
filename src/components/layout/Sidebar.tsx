import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  ClipboardList,
  Users,
  Handshake,
  Package,
  ShoppingCart,
  Receipt,
  FolderArchive,
  BarChart3,
  Settings,
  HardHat,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { kpis, tasks, materials, orders } = useBudCore();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Zrobione').length;
  const lowStockCount = materials.filter((m) => m.isLowStock).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Oczekuje na akceptację').length;

  const navItems = [
    { to: '/', label: 'Pulpit', icon: LayoutDashboard },
    { to: '/projekty', label: 'Projekty', icon: Building2, count: kpis.activeProjectsCount },
    { to: '/zadania', label: 'Zadania', icon: CheckSquare, badge: `${pendingTasksCount}` },
    { to: '/raporty-dzienne', label: 'Raporty dzienne', icon: ClipboardList },
    { to: '/pracownicy', label: 'Pracownicy', icon: Users },
    { to: '/podwykonawcy', label: 'Podwykonawcy', icon: Handshake },
    {
      to: '/materialy',
      label: 'Materiały',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} niski stan` : undefined,
      badgeVariant: 'warning',
    },
    {
      to: '/zamowienia',
      label: 'Zamówienia',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeVariant: 'amber',
    },
    { to: '/wydatki', label: 'Wydatki', icon: Receipt },
    { to: '/dokumenty', label: 'Dokumenty', icon: FolderArchive },
    { to: '/analizy', label: 'Raporty', icon: BarChart3 },
    { to: '/ustawienia', label: 'Ustawienia', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-68 bg-[#0f172a] text-slate-300 border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <HardHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white font-sans truncate">
                  FB B. Kleczkowski
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Szczecin • Nadzór budowlany</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Zamknij menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Nawigacja główna
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 text-[11px] font-medium rounded ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950'
                            : item.badgeVariant === 'warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2.5">
          {/* Status box as requested */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px] uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Stan operacyjny
            </div>
            <div className="text-[11px] leading-tight text-slate-300">
              Aktywne budowy: <strong className="text-white">{kpis.activeProjectsCount}</strong> • Pracownicy na budowach: <strong className="text-white">{kpis.totalWorkersCount}</strong>
            </div>
          </div>

          {/* Company card as requested */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs border border-slate-700 shrink-0">
              BK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate" title="Firma Budowlana Bartłomiej Kleczkowski Szczecin">
                FB Bartłomiej Kleczkowski
              </p>
              <div className="flex items-center gap-1 text-[11px] text-amber-400/90">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span className="truncate">Szczecin • Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
