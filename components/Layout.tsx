
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Home, History, PlayCircle, HelpCircle, User, LogOut, Settings, CreditCard, Users, FileText, Key, Globe, Bell, Package, Box, ChevronLeft, Menu, X } from 'lucide-react';
import { useApp } from '../scr/context/AppContext';
import { TRANSLATIONS } from '../constants';
import { playNotificationSoundDouble } from '../utils/notification';

// Simple Notification Toast Component
const NotificationToast = () => {
    const { adminNotification, clearAdminNotification } = useApp();
    
    useEffect(() => {
        if (adminNotification) {
            // Play notification sound when admin notification arrives
            try {
                playNotificationSoundDouble();
            } catch (e) {
                console.log('Could not play notification sound:', e);
            }
            
            const timer = setTimeout(() => {
                clearAdminNotification();
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [adminNotification, clearAdminNotification]);

    if (!adminNotification) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] animate-bounce">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3">
                <Bell size={24} className="animate-pulse" />
                <div>
                    <h4 className="font-bold">New Notification</h4>
                    <p className="text-sm">{adminNotification.message}</p>
                </div>
                <button onClick={clearAdminNotification} className="ml-4 text-white/80 hover:text-white">✕</button>
            </div>
        </div>
    );
};

export const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useApp();
  const t = TRANSLATIONS[language];

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
    <button 
      onClick={() => navigate(path)}
      className={`flex flex-col items-center justify-center w-full py-2 space-y-1 transition-colors ${isActive(path) ? 'text-gold-500' : 'text-gray-500 dark:text-gray-400'}`}
    >
      <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="w-full md:max-w-2xl mx-auto min-h-screen bg-white dark:bg-gray-900 shadow-xl relative overflow-hidden">
        <Outlet />
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 w-full md:max-w-2xl mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="flex justify-around items-center h-16">
            <NavItem path="/user/home" icon={Home} label={t.home} />
            <NavItem path="/user/history" icon={History} label={t.history} />
            <div className="relative -top-5">
              <button 
                onClick={() => navigate('/user/grab')}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-400 to-gold-600 shadow-lg shadow-gold-500/50 flex items-center justify-center text-white transform hover:scale-105 transition-transform"
              >
                <PlayCircle size={32} fill="currentColor" />
              </button>
            </div>
            <NavItem path="/user/help" icon={HelpCircle} label={t.help} />
            <NavItem path="/user/profile" icon={User} label={t.my} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, language, setLanguage, transactions } = useApp();
  const t = TRANSLATIONS[language];
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Calculate Pending Transactions for Badge
  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
  
  const isActive = (path: string) => location.pathname === path;

  // Get current page title for mobile
  const getPageTitle = (): string => {
    if (location.pathname.includes('/admin/dashboard')) return t.admin_dashboard;
    if (location.pathname.includes('/admin/users')) return t.admin_users;
    if (location.pathname.includes('/admin/transactions')) return t.admin_transactions;
    if (location.pathname.includes('/admin/products')) return 'Product Catalog';
    if (location.pathname.includes('/admin/orders')) return t.admin_orders;
    if (location.pathname.includes('/admin/invites')) return t.admin_invites;
    if (location.pathname.includes('/admin/settings')) return t.admin_settings;
    return t.admin_panel;
  };

  const SidebarItem = ({ path, icon: Icon, label, badge }: { path: string, icon: any, label: string, badge?: number }) => (
    <button
      onClick={() => {
        navigate(path);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 space-x-3 rounded-lg transition-colors relative ${
        isActive(path) 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
          <span className="absolute right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {badge}
          </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Toast Notification */}
      <NotificationToast />

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {t.admin_panel}
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem path="/admin/dashboard" icon={Home} label={t.admin_dashboard} />
          <SidebarItem path="/admin/users" icon={Users} label={t.admin_users} />
          <SidebarItem path="/admin/transactions" icon={CreditCard} label={t.admin_transactions} badge={pendingCount} />
          <SidebarItem path="/admin/products" icon={Box} label="Product Catalog" />
          <SidebarItem path="/admin/orders" icon={FileText} label={t.admin_orders} />
          <SidebarItem path="/admin/invites" icon={Key} label={t.admin_invites} />
          <SidebarItem path="/admin/settings" icon={Settings} label={t.admin_settings} />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => { logout(); navigate('/auth'); }}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors w-full px-4 py-2"
          >
            <LogOut size={20} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40">
           <div className="flex items-center space-x-4 md:hidden">
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
             >
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
             <span className="font-bold text-lg">{getPageTitle()}</span>
           </div>
           <div className="hidden md:block md:font-bold md:text-lg">{t.admin_panel}</div>
           <div className="flex items-center space-x-4">
             {/* Admin Language Switcher */}
             <div className="flex space-x-1 mr-4">
                {(['en', 'vi', 'zh'] as const).map(lang => (
                    <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-2 py-1 text-xs font-bold uppercase rounded ${language === lang ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {lang}
                    </button>
                ))}
             </div>

             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
               A
             </div>
             <span className="font-medium dark:text-white">Admin</span>
           </div>
        </header>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <nav className="px-4 py-4 space-y-2">
              <SidebarItem path="/admin/dashboard" icon={Home} label={t.admin_dashboard} />
              <SidebarItem path="/admin/users" icon={Users} label={t.admin_users} />
              <SidebarItem path="/admin/transactions" icon={CreditCard} label={t.admin_transactions} badge={pendingCount} />
              <SidebarItem path="/admin/products" icon={Box} label="Product Catalog" />
              <SidebarItem path="/admin/orders" icon={FileText} label={t.admin_orders} />
              <SidebarItem path="/admin/invites" icon={Key} label={t.admin_invites} />
              <SidebarItem path="/admin/settings" icon={Settings} label={t.admin_settings} />
              <button 
                onClick={() => { logout(); navigate('/auth'); setMobileMenuOpen(false); }}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors w-full px-4 py-3"
              >
                <LogOut size={20} />
                <span>{t.logout}</span>
              </button>
            </nav>
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
