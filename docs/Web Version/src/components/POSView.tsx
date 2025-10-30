import { useState, useEffect, useMemo, useRef } from 'react';
import { ProductGrid } from './ProductGrid';
import { ShoppingCart } from './ShoppingCart';
import { MobileHeader } from './MobileHeader';
import { MobileCategoryFilter } from './MobileCategoryFilter';
import { ItemSearchBar } from './ItemSearchBar';
import { ShiftDialog } from './ShiftDialog';
import { ZReportDialog } from './ZReportDialog';
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';
import { QuickSettingsDialog } from './QuickSettingsDialog';
import { useStore } from '../lib/store';
import { HelpDialog } from './HelpDialog';
import { TableManagementPage } from './TableManagementPage';
import { OrderTypeSelector } from '../plugins/order-types/components/OrderTypeSelector';
import { TransactionsPage } from './TransactionsPage';
import { ReturnsPage } from './ReturnsPage';
import { OrdersPage } from './OrdersPage';
import { ActionBar } from './ActionBar';
import { LockScreen } from './LockScreen';
import { BarProductArea } from './bar/BarProductArea';
import { User, Sun, Moon, GraduationCap, Keyboard, HelpCircle, Shield, Maximize2, Minimize2, Settings, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Product } from '../lib/types';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { UserProfileDropdown } from './UserProfileDropdown';
import { OfflineIndicator } from '../plugins/offline-mode/components/OfflineIndicator';
import { sounds, playSound } from '../lib/audioUtils';

interface POSViewProps {
  onLogout: () => void;
  onNavigateToAdmin: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function POSView({ onLogout, onNavigateToAdmin, theme, onToggleTheme }: POSViewProps) {
  const currentUser = useStore(state => state.currentUser);
  const currentShift = useStore(state => state.currentShift);
  const endShift = useStore(state => state.endShift);
  const generateZReport = useStore(state => state.generateZReport);
  const isTrainingMode = useStore(state => state.isTrainingMode);
  const setTrainingMode = useStore(state => state.setTrainingMode);
  const addToCart = useStore(state => state.addToCart);
  const parkSale = useStore(state => state.parkSale);
  const cart = useStore(state => state.cart);
  const noSale = useStore(state => state.noSale);
  const businessProfile = useStore(state => state.businessProfile);
  const subscribedPresets = useStore(state => state.subscribedPresets);
  const quickBarMode = useStore(state => state.quickBarMode);
  const setQuickBarMode = useStore(state => state.setQuickBarMode);
  const hasFeature = useStore(state => state.hasFeature);
  const searchProducts = useStore(state => state.searchProducts);
  
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showZReport, setShowZReport] = useState(false);
  const [zReport, setZReport] = useState<any>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [clockOutIntent, setClockOutIntent] = useState<'admin' | 'logout' | null>(null);
  const [currentView, setCurrentView] = useState<'pos' | 'transactions' | 'returns' | 'orders' | 'tables'>('pos');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  
  // Barcode scanner state
  const barcodeBuffer = useRef<string>('');
  const barcodeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Debug: Log subscription state
  useEffect(() => {
    console.log('[POSView] Current subscription state:', {
      subscribedPresets,
      hasTableManagement: hasFeature('tableManagement'),
      hasOrderTypes: hasFeature('orderTypes'),
      hasTipping: hasFeature('tipping')
    });
  }, [subscribedPresets, hasFeature]);

  // Global barcode scanner listener
  useEffect(() => {
    const handleBarcodeInput = (e: KeyboardEvent) => {
      // Don't capture if typing in input/textarea (let the search bar handle it)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't capture if modifier keys are pressed (for shortcuts)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      // Don't capture function keys (except Enter)
      if (e.key.startsWith('F') && e.key !== 'F') {
        return;
      }

      // Handle Enter key - process the barcode
      if (e.key === 'Enter' && barcodeBuffer.current.length > 0) {
        e.preventDefault();
        
        const barcode = barcodeBuffer.current;
        barcodeBuffer.current = '';
        
        if (barcodeTimeout.current) {
          clearTimeout(barcodeTimeout.current);
          barcodeTimeout.current = null;
        }

        // Search for product by barcode/SKU
        const results = searchProducts(barcode);
        
        if (results.length > 0) {
          const product = results[0]; // Take first match
          
          // Add to cart
          addToCart(product);
          playSound(sounds.scan);
          toast.success(`Scanned: ${product.name}`, {
            description: `Added to cart - $${product.price.toFixed(2)}`,
          });
        } else {
          playSound(sounds.error);
          toast.error('Product not found', {
            description: `No product found with code: ${barcode}`,
          });
        }
        
        return;
      }

      // Handle Escape - clear barcode buffer
      if (e.key === 'Escape') {
        barcodeBuffer.current = '';
        if (barcodeTimeout.current) {
          clearTimeout(barcodeTimeout.current);
          barcodeTimeout.current = null;
        }
        return;
      }

      // Capture alphanumeric characters and some special chars (typical in barcodes)
      if (e.key.length === 1 && /[a-zA-Z0-9\-_]/.test(e.key)) {
        barcodeBuffer.current += e.key;
        
        // Clear the timeout if it exists
        if (barcodeTimeout.current) {
          clearTimeout(barcodeTimeout.current);
        }
        
        // Set timeout to clear buffer after 100ms of inactivity
        // Barcode scanners type very fast, so this won't trigger between their keystrokes
        barcodeTimeout.current = setTimeout(() => {
          barcodeBuffer.current = '';
          barcodeTimeout.current = null;
        }, 100);
      }
    };

    window.addEventListener('keydown', handleBarcodeInput);
    return () => {
      window.removeEventListener('keydown', handleBarcodeInput);
      if (barcodeTimeout.current) {
        clearTimeout(barcodeTimeout.current);
      }
    };
  }, [searchProducts, addToCart]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // F1: Show keyboard shortcuts
      if (e.key === 'F1') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      
      // F2: Quick Payment (Cash) - Process payment with cash
      if (e.key === 'F2') {
        e.preventDefault();
        if (cart.items.length > 0) {
          // Trigger payment with cash - this will be handled by the cart's checkout button
          const checkoutButton = document.querySelector('[data-checkout-button]') as HTMLButtonElement;
          if (checkoutButton) {
            playSound(sounds.checkout);
            checkoutButton.click();
          }
        } else {
          toast.error('Cart is empty', { description: 'Add items to cart before checkout' });
        }
      }
      
      // F3 or Ctrl+K: Focus search
      if (e.key === 'F3' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        // Focus the search input
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      
      // F10: No sale
      if (e.key === 'F10') {
        e.preventDefault();
        noSale('No Sale - Manual open drawer');
        toast.info('Cash drawer opened');
      }
      
      // F11: Toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Ctrl+L: Lock screen
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        handleLock();
      }
      
      // Ctrl+N: New order (clear cart)
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (cart.items.length > 0) {
          if (confirm('Clear current cart?')) {
            useStore.getState().clearCart();
            toast.success('Cart cleared');
          }
        }
      }
      
      // Ctrl+Shift+T: Toggle training mode
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setTrainingMode(!isTrainingMode);
        toast.success(`Training mode ${!isTrainingMode ? 'enabled' : 'disabled'}`);
      }
      
      // Ctrl+P: Print receipt (if there's a recent order)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        const recentOrders = useStore.getState().recentOrders;
        if (recentOrders && recentOrders.length > 0) {
          // Find the print button in the receipt dialog if it's open
          const printButton = document.querySelector('[data-print-receipt]') as HTMLButtonElement;
          if (printButton) {
            printButton.click();
          } else {
            toast.info('No receipt to print', { description: 'Complete a sale first' });
          }
        } else {
          toast.info('No recent orders', { description: 'Complete a sale to print a receipt' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart.items.length, isTrainingMode]);

  const handleEndDay = (intent: 'admin' | 'logout' = 'logout') => {
    setClockOutIntent(intent);
    setShowShiftDialog(true);
  };

  const handleLock = () => {
    // Lock the screen while keeping the shift open
    setShowLockScreen(true);
    toast.info('Screen locked', { description: 'Enter your PIN to unlock' });
  };

  const handleUnlock = () => {
    setShowLockScreen(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        toast.success('Fullscreen mode enabled');
      } else {
        await document.exitFullscreen();
        toast.success('Fullscreen mode disabled');
      }
    } catch (error) {
      toast.error('Fullscreen not supported on this device');
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (product.variations && product.variations.length > 0) {
      // Will open variation modal
      return;
    }
    addToCart(product);
    playSound(sounds.addToCart);
    toast.success(`Added ${product.name} to cart`);
  };

  // Show full page views
  if (currentView === 'transactions') {
    return <TransactionsPage onBack={() => setCurrentView('pos')} />;
  }

  if (currentView === 'returns') {
    return <ReturnsPage onBack={() => setCurrentView('pos')} />;
  }

  if (currentView === 'orders') {
    return <OrdersPage onBack={() => setCurrentView('pos')} />;
  }

  if (currentView === 'tables') {
    return <TableManagementPage onBack={() => setCurrentView('pos')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Desktop Header */}
      <header className="hidden lg:flex border-b border-border px-2 md:px-4 py-2 md:py-3 items-center justify-between bg-card">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-base md:text-xl">AuraFlow-POS</h1>
          
          {/* Training Mode Indicator */}
          {isTrainingMode && (
            <Badge variant="secondary" className="bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/50 text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              Training Mode
            </Badge>
          )}
          
          {/* Quick Bar Mode Toggle (if bar subscription active) */}
          {subscribedPresets.includes('bar') && (
            <Button
              variant={quickBarMode ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickBarMode(!quickBarMode)}
              className="gap-2 text-xs hidden xl:flex"
            >
              <Zap className="w-3 h-3" />
              {quickBarMode ? 'Quick Bar Mode' : 'Standard View'}
            </Button>
          )}
          
          {/* Subscription Badges with Feature Debug */}
          {subscribedPresets.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden xl:flex gap-1 cursor-help">
                    {subscribedPresets.map(preset => (
                      <Badge key={preset} variant="outline" className="text-xs">
                        {preset === 'restaurant' && '🍽️'}
                        {preset === 'bar' && '🍺'}
                        {preset === 'retail' && '🏪'}
                        {preset === 'cafe' && '☕'}
                        {preset === 'pharmacy' && '💊'}
                        {preset === 'salon' && '💇'}
                      </Badge>
                    ))}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <div>
                      <strong>Active Subscriptions:</strong>
                      <div className="text-xs mt-1">
                        {subscribedPresets.join(', ')}
                      </div>
                    </div>
                    <div>
                      <strong>Active Features:</strong>
                      <div className="text-xs mt-1 space-y-0.5">
                        <div>Tables: {hasFeature('tableManagement') ? '✅' : '❌'}</div>
                        <div>Order Types: {hasFeature('orderTypes') ? '✅' : '❌'}</div>
                        <div>Tipping: {hasFeature('tipping') ? '✅' : '❌'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground border-t pt-1">
                      Change in Admin → Settings → Subscriptions
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {currentShift && (
            <Badge variant="outline" className="text-xs">
              Clocked In: {currentShift.terminal.name}
            </Badge>
          )}
        </div>

        {/* Center: Online Indicator */}
        <div className="flex-1 flex justify-center">
          <OfflineIndicator mode="inline" />
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Help Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(true)}
            className="gap-1 md:gap-2 text-xs hidden xl:flex"
          >
            <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs">Help</span>
          </Button>

          {/* Training Mode Toggle */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <Switch
              checked={isTrainingMode}
              onCheckedChange={setTrainingMode}
              id="training-mode"
            />
            <Label htmlFor="training-mode" className="text-xs cursor-pointer hidden xl:block">
              Training
            </Label>
          </div>
          
          {/* Tables Button (only if any subscribed preset has table management) */}
          {hasFeature('tableManagement') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('tables')}
              className="gap-1 md:gap-2 text-xs px-2 md:px-3"
            >
              <User className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs hidden xl:inline">Tables</span>
            </Button>
          )}
          
          {/* Admin Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentShift) {
                setShowAdminDialog(true);
              } else {
                onNavigateToAdmin();
              }
            }}
            className="gap-1 md:gap-2 text-xs px-2 md:px-3"
          >
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs hidden xl:inline">Admin</span>
          </Button>
          
          {/* Fullscreen Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="w-8 h-8 md:w-9 md:h-9"
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
          
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="w-8 h-8 md:w-9 md:h-9"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
          
          {/* User Profile Dropdown */}
          {currentUser && (
            <UserProfileDropdown
              user={{
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                name: currentUser.name,
                pin: currentUser.pin,
              }}
              onOpenShiftStatus={() => setShowShiftDialog(true)}
              onOpenSettings={() => setShowQuickSettings(true)}
              onOpenKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
            />
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <MobileHeader 
        onOpenCart={() => setMobileCartOpen(true)}
        onOpenFilter={() => setMobileFilterOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Product Grid + Action Bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar - Always Visible on Desktop */}
          <div className="hidden lg:block p-4 border-b border-border bg-card">
            <ItemSearchBar onSelectProduct={handleSelectProduct} />
          </div>
          
          <div className="flex-1 overflow-hidden">
            {quickBarMode && subscribedPresets.includes('bar') ? (
              <BarProductArea 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            ) : (
              <ProductGrid 
                searchQuery={searchQuery} 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
          </div>
          <ActionBar
            onEndDay={() => handleEndDay('logout')}
            onLock={handleLock}
            onNavigateToTransactions={() => setCurrentView('transactions')}
            onNavigateToReturns={() => setCurrentView('returns')}
            onNavigateToOrders={() => setCurrentView('orders')}
          />
        </div>
        {/* Right: Shopping Cart - Desktop Only */}
        <div className="hidden lg:block">
          <ShoppingCart />
        </div>
      </div>

      {/* Mobile Cart Sheet */}
      <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
        <SheetContent side="right" className="w-full sm:w-96 p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              Shopping cart with current order items and checkout options
            </SheetDescription>
          </SheetHeader>
          <ShoppingCart onClose={() => setMobileCartOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Mobile Filter Sheet */}
      <MobileCategoryFilter
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {/* Shift Dialog */}
      <ShiftDialog
        open={showShiftDialog}
        onClose={() => {
          setShowShiftDialog(false);
          setClockOutIntent(null);
        }}
        onClockOut={(report) => {
          setShowShiftDialog(false);
          
          // Handle Z-Report if generated
          if (report) {
            setZReport(report);
            setShowZReport(true);
            // Don't navigate yet - wait for Z-Report to close
            // The navigation will be handled by ZReportDialog's onAfterClose
          } else {
            // No Z-Report, navigate immediately based on intent
            if (clockOutIntent === 'admin') {
              onNavigateToAdmin();
            } else if (clockOutIntent === 'logout') {
              onLogout();
            }
            setClockOutIntent(null);
          }
        }}
      />

      {/* Z-Report Dialog */}
      {showZReport && zReport && (
        <ZReportDialog
          open={showZReport}
          onClose={() => {
            setShowZReport(false);
            setZReport(null);
            // Don't reset clockOutIntent here - let onAfterClose handle it
          }}
          zReport={zReport}
          onAfterClose={clockOutIntent ? () => {
            const intent = clockOutIntent;
            setClockOutIntent(null);
            if (intent === 'admin') {
              onNavigateToAdmin();
            } else if (intent === 'logout') {
              onLogout();
            }
          } : undefined}
        />
      )}

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Quick Settings Dialog */}
      <QuickSettingsDialog
        open={showQuickSettings}
        onClose={() => setShowQuickSettings(false)}
      />

      {/* Help Dialog */}
      <HelpDialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Admin Navigation Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Admin Dashboard</DialogTitle>
            <DialogDescription>
              You have an open shift. Would you like to continue to the admin dashboard or clock out first?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdminDialog(false);
                handleEndDay('admin');
              }}
              className="w-full sm:w-auto"
            >
              Clock Out
            </Button>
            <Button
              onClick={() => {
                setShowAdminDialog(false);
                onNavigateToAdmin();
              }}
              className="w-full sm:w-auto"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock Screen */}
      {currentUser && (
        <LockScreen
          open={showLockScreen}
          userPin={currentUser.pin}
          userName={currentUser.name}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  );
}