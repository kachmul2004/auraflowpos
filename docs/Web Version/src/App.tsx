import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { POSView } from './components/POSView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useStore } from './lib/store';
import { User } from './lib/types';
import { Toaster } from './components/ui/sonner';
import { PluginProvider } from './core/contexts/PluginContext';
import { PluginManager } from './core/lib/plugin-manager';
import { getAllPlugins } from './plugins/_registry';
import { getCurrentPreset } from './presets';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { initPWA } from './lib/pwa';
import { ErrorBoundary } from './components/error/ErrorBoundary';

type AppView = 'cashier-login' | 'pos' | 'admin-login' | 'admin-dashboard';

// Initialize plugin manager
const pluginManager = new PluginManager();

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('cashier-login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const setCurrentUser = useStore(state => state.setCurrentUser);
  const currentShift = useStore(state => state.currentShift);

  // Initialize PWA
  useEffect(() => {
    initPWA();
  }, []);

  // Initialize plugin system
  useEffect(() => {
    // Register all available plugins
    const plugins = getAllPlugins();
    pluginManager.registerPlugins(plugins);
    
    // Load preset
    const preset = getCurrentPreset();
    pluginManager.loadPreset(preset).catch(err => {
      console.error('Failed to load preset:', err);
    });
    
    console.log(`✓ Plugin system initialized with preset: ${preset.name}`);
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleCashierLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentView('pos');
  };

  const handleCashierLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentView('cashier-login');
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin-login');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('admin-login');
  };

  const handleBackToPOS = () => {
    // If there's an active cashier session, return to POS
    // Otherwise, show cashier login
    if (isLoggedIn && currentShift) {
      setCurrentView('pos');
    } else {
      setCurrentView('cashier-login');
    }
  };

  const handleNavigateToCashierLogin = () => {
    setCurrentView('cashier-login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'cashier-login':
        return (
          <LoginScreen
            onLogin={handleCashierLogin}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        );
      
      case 'pos':
        return (
          <POSView
            onLogout={handleCashierLogout}
            onNavigateToAdmin={handleNavigateToAdmin}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      
      case 'admin-login':
        return (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBackToPOS={handleBackToPOS}
            onNavigateToCashier={handleNavigateToCashierLogin}
          />
        );
      
      case 'admin-dashboard':
        return (
          <AdminDashboard
            onNavigateToPOS={handleBackToPOS}
            onLogout={handleAdminLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      
      default:
        return (
          <LoginScreen
            onLogin={handleCashierLogin}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        );
    }
  };

  return (
    <>
      <PluginProvider manager={pluginManager}>
        <ErrorBoundary>
          {renderView()}
        </ErrorBoundary>
        <PWAInstallPrompt />
      </PluginProvider>
      <Toaster />
    </>
  );
}