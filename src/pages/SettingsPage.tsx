import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Bell,
  Coins,
  Save,
  CheckCircle2,
  HardHat,
  Users,
} from 'lucide-react';
import { useBudCore } from '../context/BudCoreContext';

export const SettingsPage: React.FC = () => {
  const { showToast } = useBudCore();

  const [companyName, setCompanyName] = useState('BudCore Sp. z o.o.');
  const [nip, setNip] = useState('525-28-94-112');
  const [regon, setRegon] = useState('382910482');
  const [address, setAddress] = useState('Al. Jerozolimskie 142B, 02-305 Warszawa');
  const [email, setEmail] = useState('biuro@budcore-zarzadzanie.pl');
  const [phone, setPhone] = useState('+48 22 590 12 00');
  const [defaultCurrency, setDefaultCurrency] = useState('PLN');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailyReportReminders, setDailyReportReminders] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Ustawienia systemu zostały pomyślnie zaktualizowane.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Ustawienia profilu i konfiguracja firmy
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Zarządzaj danymi rejestrowymi BudCore, powiadomieniami oraz regułami operacyjnymi
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Dane firmy */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <Building className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base">Dane przedsiębiorstwa</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pełna nazwa firmy
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">REGON</label>
              <input
                type="text"
                value={regon}
                onChange={(e) => setRegon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adres siedziby
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adres e-mail operacyjny
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefon do sekretariatu
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Waluta i Ustawienia regionalne */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <Coins className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base">Ustawienia regionalne i walutowe</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Waluta domyślna systemu
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="PLN">Polski Złoty (PLN, zł)</option>
                <option value="EUR">Euro (EUR, €)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Format daty i czasu
              </label>
              <input
                type="text"
                disabled
                value="DD.MM.YYYY (Polski format budowlany)"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Powiadomienia */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base">Alerty operacyjne i powiadomienia</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={lowStockAlerts}
                onChange={(e) => setLowStockAlerts(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span>
                <strong>Powiadomienia o niskim stanie magazynowym</strong> – alert przy spadku
                zapasów poniżej minimum
              </span>
            </label>

            <label className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={dailyReportReminders}
                onChange={(e) => setDailyReportReminders(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span>
                <strong>Przypomnienia o raporcie dziennym</strong> – monit dla kierowników budów o
                godz. 16:00
              </span>
            </label>

            <label className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span>
                <strong>Wiadomości e-mail o zamówieniach</strong> – natychmiastowe powiadomienie
                dyrektora o zamówieniach powyżej 20 000 zł
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Zapisz zmiany w ustawieniach</span>
          </button>
        </div>
      </form>
    </div>
  );
};
