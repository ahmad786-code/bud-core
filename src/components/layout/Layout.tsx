import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Toast } from '../common/Toast';
import { DailyReportModal } from '../modals/DailyReportModal';
import { TaskModal } from '../modals/TaskModal';
import { WorkerModal } from '../modals/WorkerModal';
import { OrderModal } from '../modals/OrderModal';
import { ExpenseModal } from '../modals/ExpenseModal';
import { QuickActionModal } from '../modals/QuickActionModal';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-68 transition-[padding] duration-300">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <DailyReportModal />
      <TaskModal />
      <WorkerModal />
      <OrderModal />
      <ExpenseModal />
      <QuickActionModal />
      <Toast />
    </div>
  );
};
