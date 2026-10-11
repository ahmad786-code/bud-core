export type ProjectStatus = 'Zgodnie z planem' | 'Zagrożony' | 'Opóźniony' | 'Zakończony';

export type ProjectType = 'Komercyjny' | 'Przemysłowy' | 'Mieszkaniowy' | 'Remont';

export interface ProjectPhase {
  id: string;
  name: string;
  status: 'Zakończona' | 'W toku' | 'Zaplanowana';
  progress: number;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  client: string;
  manager: string;
  managerPhone: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  type: ProjectType;
  startDate: string;
  endDate: string;
  phases: ProjectPhase[];
  description: string;
  workersCount: number;
}

export type WorkerTrade =
  | 'murarz'
  | 'zbrojarz'
  | 'cieśla'
  | 'elektryk'
  | 'hydraulik'
  | 'operator żurawia'
  | 'pomocnik'
  | 'brygadzista';

export interface Worker {
  id: string;
  name: string;
  trade: WorkerTrade;
  projectId: string;
  projectName: string;
  phone: string;
  hourlyRate: number;
  presentToday: boolean;
  avatarUrl?: string;
  experienceYears: number;
}

export interface Subcontractor {
  id: string;
  companyName: string;
  trade: string;
  contractValue: number;
  invoicedAmount: number;
  paidAmount: number;
  contactPerson: string;
  phone: string;
  email: string;
  activeProjects: string[];
  status: 'W realizacji' | 'Odbiór' | 'Zakończono';
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  projectId: string;
  projectName: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  isLowStock: boolean;
  category: 'Konstrukcja' | 'Izolacje' | 'Instalacje' | 'Wykończenie';
  lastDelivery: string;
}

export type OrderStatus = 'Oczekuje na akceptację' | 'Zatwierdzone' | 'Dostarczone' | 'Odrzucone';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  projectId: string;
  projectName: string;
  materialName: string;
  quantity: number;
  unit: string;
  amount: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate: string;
  notes?: string;
}

export type TaskStatus = 'Do zrobienia' | 'W toku' | 'Do sprawdzenia' | 'Zrobione';
export type TaskPriority = 'Niski' | 'Średni' | 'Wysoki' | 'Krytyczny';

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assigneeName: string;
  assigneeTrade: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  description: string;
  isOverdue?: boolean;
}

export interface DailyReport {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  siteManager: string;
  workersOnSite: number;
  subcontractorsOnSite: number;
  weather: {
    temp: number;
    condition: 'Słonecznie' | 'Pochmurno' | 'Deszcz' | 'Wiatr' | 'Śnieg';
    favorable: boolean;
  };
  workCompleted: string;
  safetyBHP: string;
  delaysBlockers: string;
  notes?: string;
  photoCount: number;
  photos: {
    id: string;
    caption: string;
    url: string;
    timestamp: string;
  }[];
}

export type ExpenseCategory = 'Materiały' | 'Robocizna' | 'Sprzęt' | 'Podwykonawcy' | 'Inne';

export interface Expense {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  invoiceNumber: string;
  status: 'Opłacone' | 'Zatwierdzone' | 'Oczekuje';
  contractor: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Umowy' | 'Protokoły odbioru' | 'Dziennik budowy' | 'Faktury' | 'Rysunki i projekty';
  projectId: string;
  projectName: string;
  date: string;
  fileSize: string;
  fileType: 'PDF' | 'DWG' | 'DOCX';
  uploadedBy: string;
}

export interface ActivityItem {
  id: string;
  type: 'report' | 'order' | 'worker' | 'expense' | 'task';
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  projectId?: string;
}
