// made it client rendering but need to make the component based client/server rendering based on the requirements
"use client";
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import { AppProvider } from '@/context/AppContext';

export default function Home() {
  return (
    // should create a root layout for large and complex usecase
    <AppProvider>
      <div className="flex h-full md:h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header />
          <main className="flex-1 overflow-auto p-4 lg:p-4 pt-4 lg:pt-4 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80">
            <Dashboard />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
