import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  Project,
  Worker,
  Subcontractor,
  Material,
  PurchaseOrder,
  Task,
  DailyReport,
  Expense,
  DocumentItem,
  ActivityItem,
  OrderStatus,
  TaskStatus,
} from '../types';
import {
  initialProjects,
  initialWorkers,
  initialSubcontractors,
  initialMaterials,
  initialOrders,
  initialTasks,
  initialDailyReports,
  initialExpenses,
  initialDocuments,
  initialActivities,
} from '../data/mockData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

interface BudCoreContextType {
  // State
  projects: Project[];
  workers: Worker[];
  subcontractors: Subcontractor[];
  materials: Material[];
  orders: PurchaseOrder[];
  tasks: Task[];
  dailyReports: DailyReport[];
  expenses: Expense[];
  documents: DocumentItem[];
  activities: ActivityItem[];
  notifications: AppNotification[];
  globalSearch: string;
  toastMessage: string | null;

  // Modals state
  selectedDailyReport: DailyReport | null;
  isNewDailyReportModalOpen: boolean;
  isNewTaskModalOpen: boolean;
  isNewWorkerModalOpen: boolean;
  isOrderModalOpen: boolean;
  isExpenseModalOpen: boolean;
  isQuickActionModalOpen: boolean;
  selectedMaterialForOrder: Material | null;

  // Setters & Actions
  setGlobalSearch: (term: string) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;

  setSelectedDailyReport: (report: DailyReport | null) => void;
  setIsNewDailyReportModalOpen: (open: boolean) => void;
  setIsNewTaskModalOpen: (open: boolean) => void;
  setIsNewWorkerModalOpen: (open: boolean) => void;
  setIsOrderModalOpen: (open: boolean) => void;
  setIsExpenseModalOpen: (open: boolean) => void;
  setIsQuickActionModalOpen: (open: boolean) => void;
  setSelectedMaterialForOrder: (material: Material | null) => void;

  // Business logic mutations
  addDailyReport: (data: Omit<DailyReport, 'id'>) => void;
  addTask: (data: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  addWorker: (data: Omit<Worker, 'id'>) => void;
  toggleWorkerAttendance: (workerId: string) => void;
  createOrder: (data: Omit<PurchaseOrder, 'id' | 'orderNumber'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addExpense: (data: Omit<Expense, 'id'>) => void;
  markNotificationsAsRead: () => void;

  // Computed metrics
  kpis: {
    activeProjectsCount: number;
    totalProjectValue: number;
    totalSpent: number;
    spentPercentage: number;
    monthlySpent: number;
    monthlyBudget: number;
    monthlySpentPercentage: number;
    totalWorkersCount: number;
    presentWorkersCount: number;
    attendanceRate: number;
    inProgressTasksCount: number;
    overdueTasksCount: number;
    lowStockMaterialsCount: number;
    atRiskProjectsCount: number;
    pendingOrdersCount: number;
  };
}

const BudCoreContext = createContext<BudCoreContextType | undefined>(undefined);

export const BudCoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [subcontractors] = useState<Subcontractor[]>(initialSubcontractors);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialDailyReports);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [documents] = useState<DocumentItem[]>(initialDocuments);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedDailyReport, setSelectedDailyReport] = useState<DailyReport | null>(null);
  const [isNewDailyReportModalOpen, setIsNewDailyReportModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewWorkerModalOpen, setIsNewWorkerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [selectedMaterialForOrder, setSelectedMaterialForOrder] = useState<Material | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Opóźnienie w dostawie stali',
      message: 'Dostawa dla budowy Hala Goleniów ma 2 dni opóźnienia.',
      time: '10 min temu',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-2',
      title: 'Nowy raport dzienny',
      message: 'Tomasz Nowak złożył raport dla: Budynek wielorodzinny, ul. Ku Słońcu.',
      time: '25 min temu',
      read: false,
      type: 'info',
    },
    {
      id: 'notif-3',
      title: 'Niski stan materiału',
      message: 'Beton C25/30 spadł poniżej stanu minimalnego.',
      time: '1 godz. temu',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-4',
      title: 'Zamówienie zatwierdzone',
      message: 'ZAM/2026/089 zostało pomyślnie zaakceptowane.',
      time: '3 godz. temu',
      read: true,
      type: 'success',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  // Actions
  const addDailyReport = (data: Omit<DailyReport, 'id'>) => {
    const newReport: DailyReport = {
      ...data,
      id: `rep-${Date.now()}`,
    };
    setDailyReports((prev) => [newReport, ...prev]);

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'report',
      title: 'Nowy raport dzienny',
      description: `${data.siteManager} złożył raport dla ${data.projectName} (${data.workersOnSite} pracowników)`,
      timestamp: new Date().toISOString(),
      relativeTime: 'przed chwilą',
      projectId: data.projectId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('Raport został zapisany');
    setIsNewDailyReportModalOpen(false);
  };

  const addTask = (data: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...data,
      id: `tsk-${Date.now()}`,
      isOverdue: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'task',
      title: 'Nowe zadanie',
      description: `Przydzielono "${data.title}" do ${data.assigneeName}`,
      timestamp: new Date().toISOString(),
      relativeTime: 'przed chwilą',
      projectId: data.projectId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('Zadanie zostało utworzone');
    setIsNewTaskModalOpen(false);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showToast(`Status zadania zmieniony na: ${newStatus}`);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Zadanie zostało usunięte');
  };

  const addWorker = (data: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...data,
      id: `w-${Date.now()}`,
    };
    setWorkers((prev) => [newWorker, ...prev]);
    showToast(`Dodano pracownika: ${data.name}`);
    setIsNewWorkerModalOpen(false);
  };

  const toggleWorkerAttendance = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const nextState = !w.presentToday;
          return { ...w, presentToday: nextState };
        }
        return w;
      })
    );
  };

  const createOrder = (data: Omit<PurchaseOrder, 'id' | 'orderNumber'>) => {
    const orderNumber = `ZAM/2026/${String(orders.length + 80).padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber,
    };
    setOrders((prev) => [newOrder, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'order',
      title: `Nowe zamówienie ${orderNumber}`,
      description: `${data.materialName} (${data.quantity} ${data.unit}) u dostawcy ${data.supplier}`,
      timestamp: new Date().toISOString(),
      relativeTime: 'przed chwilą',
      projectId: data.projectId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Zamówienie ${orderNumber} zostało złożone`);
    setIsOrderModalOpen(false);
    setSelectedMaterialForOrder(null);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    const targetOrder = orders.find((o) => o.id === orderId);
    showToast(`Zamówienie ${targetOrder?.orderNumber || ''} zostało: ${status}`);

    // If delivered, we can update material stock level
    if (status === 'Dostarczone' && targetOrder) {
      setMaterials((prev) =>
        prev.map((m) => {
          if (m.projectId === targetOrder.projectId && m.name.toLowerCase().includes(targetOrder.materialName.toLowerCase().slice(0, 5))) {
            const newStock = m.currentStock + targetOrder.quantity;
            return {
              ...m,
              currentStock: newStock,
              isLowStock: newStock < m.minStock,
            };
          }
          return m;
        })
      );
    }
  };

  const addExpense = (data: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);

    // Update project spent
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === data.projectId) {
          const newSpent = p.spent + data.amount;
          return { ...p, spent: newSpent };
        }
        return p;
      })
    );

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'expense',
      title: 'Zarejestrowano wydatek',
      description: `${data.title} (${data.amount.toLocaleString('pl-PL')} zł) na budowie ${data.projectName}`,
      timestamp: new Date().toISOString(),
      relativeTime: 'przed chwilą',
      projectId: data.projectId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('Wydatek został zarejestrowany');
    setIsExpenseModalOpen(false);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // KPIs calculation
  const kpis = useMemo(() => {
    const activeProjectsCount = projects.length;
    const totalProjectValue = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
    const spentPercentage = Math.round((totalSpent / totalProjectValue) * 100);

    // This month (Październik 2026)
    const monthlyBudget = 1100000;
    const monthlySpent = 760000;
    const monthlySpentPercentage = Math.round((monthlySpent / monthlyBudget) * 100);

    const totalWorkersCount = workers.length;
    const presentWorkersCount = workers.filter((w) => w.presentToday).length;
    const attendanceRate = totalWorkersCount > 0 ? Math.round((presentWorkersCount / totalWorkersCount) * 100) : 0;

    const inProgressTasksCount = tasks.filter((t) => t.status === 'W toku').length;
    const overdueTasksCount = tasks.filter((t) => t.isOverdue || (t.status !== 'Zrobione' && t.dueDate < '2026-10-11')).length;

    const lowStockMaterialsCount = materials.filter((m) => m.currentStock < m.minStock).length;
    const atRiskProjectsCount = projects.filter((p) => p.status === 'Zagrożony' || p.status === 'Opóźniony').length;
    const pendingOrdersCount = orders.filter((o) => o.status === 'Oczekuje na akceptację').length;

    return {
      activeProjectsCount,
      totalProjectValue,
      totalSpent,
      spentPercentage,
      monthlySpent,
      monthlyBudget,
      monthlySpentPercentage,
      totalWorkersCount,
      presentWorkersCount,
      attendanceRate,
      inProgressTasksCount,
      overdueTasksCount,
      lowStockMaterialsCount,
      atRiskProjectsCount,
      pendingOrdersCount,
    };
  }, [projects, workers, tasks, materials, orders]);

  return (
    <BudCoreContext.Provider
      value={{
        projects,
        workers,
        subcontractors,
        materials,
        orders,
        tasks,
        dailyReports,
        expenses,
        documents,
        activities,
        notifications,
        globalSearch,
        toastMessage,

        selectedDailyReport,
        isNewDailyReportModalOpen,
        isNewTaskModalOpen,
        isNewWorkerModalOpen,
        isOrderModalOpen,
        isExpenseModalOpen,
        isQuickActionModalOpen,
        selectedMaterialForOrder,

        setGlobalSearch,
        showToast,
        clearToast,
        setSelectedDailyReport,
        setIsNewDailyReportModalOpen,
        setIsNewTaskModalOpen,
        setIsNewWorkerModalOpen,
        setIsOrderModalOpen,
        setIsExpenseModalOpen,
        setIsQuickActionModalOpen,
        setSelectedMaterialForOrder,

        addDailyReport,
        addTask,
        updateTaskStatus,
        deleteTask,
        addWorker,
        toggleWorkerAttendance,
        createOrder,
        updateOrderStatus,
        addExpense,
        markNotificationsAsRead,

        kpis,
      }}
    >
      {children}
    </BudCoreContext.Provider>
  );
};

export const useBudCore = (): BudCoreContextType => {
  const context = useContext(BudCoreContext);
  if (!context) {
    throw new Error('useBudCore must be used within a BudCoreProvider');
  }
  return context;
};
