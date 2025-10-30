import { useState } from 'react';
import { DashboardHome } from './admin/DashboardHome';
import { ProductsModule } from './admin/ProductsModule';
import { InventoryModule } from './admin/InventoryModule';
import { CustomersModule } from './admin/CustomersModule';
import { LoyaltyModule } from './admin/LoyaltyModule';
import { UsersModule } from './admin/UsersModule';
import { TerminalsModule } from './admin/TerminalsModule';
import { ReportsModule } from './admin/ReportsModule';
import { SettingsModule } from './admin/SettingsModule';
import { ShiftsModule } from './admin/ShiftsModule';
import { TransactionsModule } from './admin/TransactionsModule';
import { OrdersModule } from './admin/OrdersModule';
import { ProductEditPage } from './admin/ProductEditPage';
import { PluginsModule } from './admin/PluginsModule';
import { KitchenDisplaySystem } from '../plugins/kitchen-display/components/KitchenDisplaySystem';
import { OpenTabsView } from '../plugins/open-tabs/components/OpenTabsView';
import { AnalyticsReportingDashboard } from '../plugins/analytics-reporting/components/AnalyticsReportingDashboard';
import { AdvancedCustomerManagement } from '../plugins/customer-management-advanced/components/AdvancedCustomerManagement';
import { LocationManagement } from '../plugins/multi-location/components/LocationManagement';
import { EmployeePerformance } from '../plugins/employee-performance/components/EmployeePerformance';
import { AdvancedInventoryManagement } from '../plugins/inventory-management-advanced/components/AdvancedInventoryManagement';
import { AdvancedReporting } from '../plugins/reporting-export-advanced/components/AdvancedReporting';
import { EnhancedAnalyticsDashboard } from './admin/EnhancedAnalyticsDashboard';
import { AnimationShowcase } from './admin/AnimationShowcase';
import { PageTransition } from './animated/PageTransition';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useStore } from '../lib/store';
import { 
  LayoutDashboard, 
  Package, 
  Box, 
  UserCircle, 
  Users, 
  Monitor, 
  BarChart3, 
  Settings, 
  LogOut, 
  Clock, 
  Receipt, 
  ShoppingCart, 
  ChefHat, 
  UtensilsCrossed,
  Sun,
  Moon,
  Puzzle,
  HelpCircle,
  ArrowLeft,
  Search,
  Bell,
  Trophy,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Product, ProductVariation } from '../lib/types';
import { toast } from 'sonner@2.0.3';
import { AdminHelpDialog } from './admin/AdminHelpDialog';
import { usePlugins } from '../core/hooks/usePlugins';

type ViewType = 
  | 'dashboard'
  | 'products'
  | 'product-edit'
  | 'inventory'
  | 'customers'
  | 'customer-insights'
  | 'loyalty'
  | 'users'
  | 'terminals'
  | 'reports'
  | 'analytics'
  | 'employee-performance'
  | 'locations'
  | 'settings'
  | 'shifts'
  | 'transactions'
  | 'orders'
  | 'kitchen'
  | 'open-tabs'
  | 'plugins';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateToPOS: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function AdminDashboard({ onLogout, onNavigateToPOS, theme, onToggleTheme }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  
  const { isActive } = usePlugins();

  const baseMenuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'inventory' as const, label: 'Inventory', icon: Box },
    { id: 'customers' as const, label: 'Customers', icon: UserCircle },
    { id: 'shifts' as const, label: 'Shifts', icon: Clock },
    { id: 'transactions' as const, label: 'Transactions', icon: Receipt },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
  ];
  
  // Build customer engagement menu items based on active plugins  
  const customerMenuItems = [];
  if (isActive('customer-management-advanced')) {
    customerMenuItems.push({ id: 'customer-insights' as const, label: 'Customer Insights', icon: Users });
  }
  if (isActive('loyalty-program')) {
    customerMenuItems.push({ id: 'loyalty' as const, label: 'Loyalty Program', icon: Trophy });
  }
  
  // Build restaurant menu items based on active plugins
  const restaurantMenuItems = [];
  if (isActive('kitchen-display')) {
    restaurantMenuItems.push({ id: 'kitchen' as const, label: 'Kitchen Display', icon: ChefHat });
  }
  if (isActive('open-tabs')) {
    restaurantMenuItems.push({ id: 'open-tabs' as const, label: 'Open Tabs', icon: UtensilsCrossed });
  }
  
  // Build analytics/reporting menu items based on active plugins
  const analyticsMenuItems = [];
  if (isActive('analytics-reporting')) {
    analyticsMenuItems.push({ id: 'analytics' as const, label: 'Analytics', icon: BarChart3 });
  }
  if (isActive('employee-performance')) {
    analyticsMenuItems.push({ id: 'employee-performance' as const, label: 'Employee Performance', icon: TrendingUp });
  }
  
  // Build enterprise menu items based on active plugins
  const enterpriseMenuItems = [];
  if (isActive('multi-location')) {
    enterpriseMenuItems.push({ id: 'locations' as const, label: 'Locations', icon: MapPin });
  }
  
  const adminMenuItems = [
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'terminals' as const, label: 'Terminals', icon: Monitor },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { id: 'plugins' as const, label: 'Plugins', icon: Puzzle },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];
  
  const menuItems = [...baseMenuItems, ...customerMenuItems, ...restaurantMenuItems, ...analyticsMenuItems, ...enterpriseMenuItems, ...adminMenuItems];

  const handleNavigateToProductEdit = (product?: Product) => {
    setEditingProduct(product || null);
    setCurrentView('product-edit');
  };

  const handleBackToProducts = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleSaveProduct = (productData: any, variations: ProductVariation[]) => {
    if (editingProduct) {
      toast.success('Product updated successfully');
    } else {
      toast.success('Product created successfully');
    }
    // TODO: Save to store/API
    handleBackToProducts();
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'products':
        return <ProductsModule onNavigateToEdit={handleNavigateToProductEdit} />;
      case 'product-edit':
        return (
          <ProductEditPage
            product={editingProduct}
            onBack={handleBackToProducts}
            onSave={handleSaveProduct}
          />
        );
      case 'inventory':
        return isActive('inventory-management-advanced') ? <AdvancedInventoryManagement /> : <InventoryModule />;
      case 'customers':
        return <CustomersModule />;
      case 'customer-insights':
        return <AdvancedCustomerManagement />;
      case 'loyalty':
        return <LoyaltyModule />;
      case 'shifts':
        return <ShiftsModule />;
      case 'transactions':
        return <TransactionsModule />;
      case 'orders':
        return <OrdersModule />;
      case 'kitchen':
        return <KitchenDisplaySystem />;
      case 'open-tabs':
        return <OpenTabsView />;
      case 'users':
        return <UsersModule />;
      case 'terminals':
        return <TerminalsModule />;
      case 'reports':
        return isActive('reporting-export-advanced') ? <AdvancedReporting /> : <ReportsModule />;
      case 'analytics':
        return <AnalyticsReportingDashboard />;
      case 'employee-performance':
        return <EmployeePerformance />;
      case 'locations':
        return <LocationManagement />;
      case 'settings':
        return <SettingsModule />;
      case 'plugins':
        return <PluginsModule />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`border-r border-border bg-card transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="h-16 flex items-center px-4 border-b border-border">
            {!sidebarCollapsed ? (
              <div>
                <h1 className="text-lg font-medium">AuraFlow POS</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${
                      sidebarCollapsed ? 'px-2' : ''
                    }`}
                    onClick={() => setCurrentView(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : ''}`}
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-3">Help</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : ''}`}
              onClick={onNavigateToPOS}
            >
              <ArrowLeft className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-3">Back to POS</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
                sidebarCollapsed ? 'px-2' : ''
              }`}
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onToggleTheme}>
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <PageTransition transitionKey={currentView} type="fadeUp">
            <div className="p-6">{renderView()}</div>
          </PageTransition>
        </main>
      </div>

      {/* Help Dialog */}
      <AdminHelpDialog open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}