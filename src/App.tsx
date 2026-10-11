import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BudCoreProvider } from './context/BudCoreContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { DailyReportsPage } from './pages/DailyReportsPage';
import { WorkersPage } from './pages/WorkersPage';
import { SubcontractorsPage } from './pages/SubcontractorsPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BudCoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projekty" element={<ProjectsPage />} />
            <Route path="projekty/:id" element={<ProjectDetailPage />} />
            <Route path="zadania" element={<TasksPage />} />
            <Route path="raporty-dzienne" element={<DailyReportsPage />} />
            <Route path="pracownicy" element={<WorkersPage />} />
            <Route path="podwykonawcy" element={<SubcontractorsPage />} />
            <Route path="materialy" element={<MaterialsPage />} />
            <Route path="zamowienia" element={<OrdersPage />} />
            <Route path="wydatki" element={<ExpensesPage />} />
            <Route path="dokumenty" element={<DocumentsPage />} />
            <Route path="analizy" element={<ReportsPage />} />
            <Route path="ustawienia" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BudCoreProvider>
  );
}
