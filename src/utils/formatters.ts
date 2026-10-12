import { ProjectStatus, TaskPriority, OrderStatus } from '../types';

/**
 * Polish plural helper:
 * 1 = one (np. "załączone zdjęcie", "pracownik", "osoba", "zadanie", "raport")
 * 2-4, 22-24, 32-34... (except 12-14) = few (np. "załączone zdjęcia", "pracownicy", "osoby", "zadania", "raporty")
 * 0, 5-21, 25-31... = many (np. "załączonych zdjęć", "pracowników", "osób", "zadań", "raportów")
 */
export function pluralize(
  count: number,
  [one, few, many]: [string, string, string]
): string {
  const abs = Math.abs(count);
  if (abs === 1) {
    return one;
  }
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }
  return many;
}

export function formatPlural(
  count: number,
  forms: [string, string, string]
): string {
  return `${count} ${pluralize(count, forms)}`;
}

// Preset forms for convenient imports:
export const PLURAL_PHOTOS: [string, string, string] = [
  'załączone zdjęcie',
  'załączone zdjęcia',
  'załączonych zdjęć',
];
export const PLURAL_PHOTOS_SHORT: [string, string, string] = [
  'zdjęcie',
  'zdjęcia',
  'zdjęć',
];
export const PLURAL_WORKERS: [string, string, string] = [
  'pracownik',
  'pracownicy',
  'pracowników',
];
export const PLURAL_PERSONS: [string, string, string] = [
  'osoba',
  'osoby',
  'osób',
];
export const PLURAL_TASKS: [string, string, string] = [
  'zadanie',
  'zadania',
  'zadań',
];
export const PLURAL_REPORTS: [string, string, string] = [
  'raport',
  'raporty',
  'raportów',
];
export const PLURAL_SITES: [string, string, string] = [
  'budowa',
  'budowy',
  'budów',
];
export const PLURAL_FIRMS: [string, string, string] = [
  'firma',
  'firmy',
  'firm',
];
export const PLURAL_MATERIALS: [string, string, string] = [
  'pozycja materiałowa',
  'pozycje materiałowe',
  'pozycji materiałowych',
];
export const PLURAL_EXPENSES: [string, string, string] = [
  'wydatek',
  'wydatki',
  'wydatków',
];
export const PLURAL_DOCUMENTS: [string, string, string] = [
  'dokument',
  'dokumenty',
  'dokumentów',
];

/**
 * Format currency in Polish locale: "1 250 000 zł"
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} zł`;
}

/**
 * Format compact currency in Polish standard: "12,44 mln zł", "1,1 mln zł", "850 tys. zł"
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted = millions.toLocaleString('pl-PL', {
      maximumFractionDigits: 2,
    });
    return `${formatted} mln zł`;
  }
  if (amount >= 10_000) {
    const thousands = amount / 1_000;
    const formatted = thousands.toLocaleString('pl-PL', {
      maximumFractionDigits: 0,
    });
    return `${formatted} tys. zł`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    const formatted = thousands.toLocaleString('pl-PL', {
      maximumFractionDigits: 1,
    });
    return `${formatted} tys. zł`;
  }
  return `${amount} zł`;
}

/**
 * Format compact numbers the Polish way: "1,1 mln", "6 mln", "850 tys."
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions.toLocaleString('pl-PL', { maximumFractionDigits: 2 })} mln`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} tys.`;
  }
  return value.toLocaleString('pl-PL');
}

/**
 * Format date in Polish format "DD.MM.YYYY"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // If already in DD.MM.YYYY format
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr;
  }
}


/**
 * Format percentage: e.g. 68%
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Color classes and label for ProjectStatus
 */
export function getProjectStatusConfig(status: ProjectStatus) {
  switch (status) {
    case 'Zgodnie z planem':
      return {
        label: 'Zgodnie z planem',
        dotColor: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
      };
    case 'Zagrożony':
      return {
        label: 'Zagrożony',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
      };
    case 'Opóźniony':
      return {
        label: 'Opóźniony',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
      };
    case 'Zakończony':
    default:
      return {
        label: 'Zakończony',
        dotColor: 'bg-slate-400',
        textColor: 'text-slate-600',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-200',
      };
  }
}

/**
 * Priority badge configuration
 */
export function getPriorityConfig(priority: TaskPriority) {
  switch (priority) {
    case 'Krytyczny':
      return {
        label: 'Krytyczny',
        badge: 'text-rose-700 bg-rose-50 border-rose-200',
      };
    case 'Wysoki':
      return {
        label: 'Wysoki',
        badge: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    case 'Średni':
      return {
        label: 'Średni',
        badge: 'text-blue-700 bg-blue-50 border-blue-200',
      };
    case 'Niski':
    default:
      return {
        label: 'Niski',
        badge: 'text-slate-600 bg-slate-100 border-slate-200',
      };
  }
}

/**
 * Order status configuration
 */
export function getOrderStatusConfig(status: OrderStatus) {
  switch (status) {
    case 'Oczekuje na akceptację':
      return {
        label: 'Oczekuje na akceptację',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Zatwierdzone':
      return {
        label: 'Zatwierdzone',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'Dostarczone':
      return {
        label: 'Dostarczone',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Odrzucone':
      return {
        label: 'Odrzucone',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
  }
}
