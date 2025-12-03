
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './scr/context/AppContext';
import { UserLayout, AdminLayout } from './components/Layout';
import { Login, Register } from './pages/Auth';
import { UserHome, GrabOrder, UserProfile, HistoryPage, HelpPage, WalletPage, UserInfoPage, BankBindPage, SecurityPage, UserTransactionsPage } from './pages/UserPages';
import { AdminDashboard, AdminUsers, AdminTransactions, AdminOrderConfig, AdminInviteCodes, AdminSettings, AdminProducts } from './pages/AdminPages';
import { Role } from './types';

// Fix: Use React.ReactNode instead of JSX.Element to avoid namespace errors
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: Role }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  if (currentUser.role !== allowedRole) {
    // Redirect if wrong role
    return <Navigate to={currentUser.role === Role.ADMIN ? "/admin/dashboard" : "/user/home"} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useApp();

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                <p className="text-gray-500 font-medium">Connecting to system...</p>
            </div>
        </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      
      {/* Auth */}
      <Route path="/auth" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      {/* User Routes */}
      <Route path="/user" element={<ProtectedRoute allowedRole={Role.USER}><UserLayout /></ProtectedRoute>}>
        <Route path="home" element={<UserHome />} />
        <Route path="grab" element={<GrabOrder />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="info" element={<UserInfoPage />} />
        <Route path="bank" element={<BankBindPage />} />
        <Route path="transactions" element={<UserTransactionsPage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="wallet/:type" element={<WalletPage />} />
        <Route path="bank-bind" element={<Navigate to="/user/bank" replace />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole={Role.ADMIN}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrderConfig />} />
        <Route path="invites" element={<AdminInviteCodes />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
