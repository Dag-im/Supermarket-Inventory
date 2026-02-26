import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Transfers } from './pages/Transfers';
import { Analytics } from './pages/Analytics';
import { Products } from './pages/Products';
import { SalesDashboard } from './pages/SalesDashboard';
import { AuditLogPage } from './pages/AuditLogPage';
import { Suppliers } from './pages/Suppliers';
import { UserManagement } from './pages/UserManagement';
import { motion, AnimatePresence } from 'motion/react';

const Settings = () => <div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p className="text-black/40">System settings and configuration.</p></div>;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#E4E3E0] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales-dashboard" element={<SalesDashboard />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/audit" element={<AuditLogPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<UserManagement />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
