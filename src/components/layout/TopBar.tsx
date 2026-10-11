import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Coins,
  ChevronRight,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useBudCore } from '../../context/BudCoreContext';

interface TopBarProps {
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  '/': { title: 'Pulpit główny', breadcrumb: 'Pulpit' },
  '/projekty': { title: 'Zarządzanie projektami', breadcrumb: 'Projekty' },
  '/zadania': { title: 'Harmonogram i zadania', breadcrumb: 'Zadania' },
  '/raporty-dzienne': { title: 'Raporty dzienne z budów', breadcrumb: 'Raporty dzienne' },
  '/pracownicy': { title: 'Pracownicy i obecności', breadcrumb: 'Pracownicy' },
  '/podwykonawcy': { title: 'Podwykonawcy i umowy', breadcrumb: 'Podwykonawcy' },
  '/materialy': { title: 'Magazyn i materiały', breadcrumb: 'Materiały' },
  '/zamowienia': { title: 'Zamówienia materiałowe', breadcrumb: 'Zamówienia' },
  '/wydatki': { title: 'Koszty i wydatki budów', breadcrumb: 'Wydatki' },
  '/dokumenty': { title: 'Dzienniki i dokumentacja', breadcrumb: 'Dokumenty' },
  '/analizy': { title: 'Raporty i analizy budowlane', breadcrumb: 'Raporty' },
  '/ustawienia': { title: 'Ustawienia systemu', breadcrumb: 'Ustawienia' },
};

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const {
    globalSearch,
    setGlobalSearch,
    setIsQuickActionModalOpen,
    notifications,
    markNotificationsAsRead,
  } = useBudCore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Determine current title and breadcrumb
  let currentMeta = pageTitles[location.pathname];
  if (!currentMeta) {
    if (location.pathname.startsWith('/projekty/')) {
      currentMeta = { title: 'Szczegóły projektu', breadcrumb: 'Projekty / Szczegóły' };
    } else {
      currentMeta = { title: 'BudCore', breadcrumb: 'Pulpit' };
    }
  }

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Otwórz menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              BudCore
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 truncate">{currentMeta.breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="hidden md:flex flex-1 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Szukaj projektów, zadań, pracowników, materiałów…"
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium px-1"
            >
              Wyczyść
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Currency Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span>PLN (zł)</span>
        </div>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Powiadomienia"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Powiadomienia ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-[11px] font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Oznacz jako przeczytane
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors flex gap-2.5 ${
                      n.read ? 'text-slate-500 hover:bg-slate-50' : 'bg-amber-50/50 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'alert' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : n.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 leading-tight">{n.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button (Orange accent as requested) */}
        <button
          onClick={() => setIsQuickActionModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Szybka akcja</span>
        </button>
      </div>
    </header>
  );
};
