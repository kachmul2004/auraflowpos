import { Button } from './ui/button';
import { Archive, Calculator, FileText, Receipt, HelpCircle, Users, Scissors, ChefHat, Calendar, Lock, DollarSign, RefreshCcw, Pause, Scan, Flame } from 'lucide-react';
import { useStore } from '../lib/store';
import { useState, useEffect } from 'react';
import { CashDrawerDialog } from './CashDrawerDialog';
import { ParkedSalesDialog } from './ParkedSalesDialog';
import { SplitCheckDialog } from '../plugins/split-checks/components/SplitCheckDialog';
import { CoursesDialog } from '../plugins/course-management/components/CoursesDialog';
import { BarcodeScannerDialog } from '../plugins/barcode-scanner/components/BarcodeScannerDialog';
import { HeldOrdersDialog } from './HeldOrdersDialog';
import { Badge } from './ui/badge';
import { usePlugins } from '../core/hooks/usePlugins';
import { toast } from 'sonner@2.0.3';
import { sounds, playSound } from '../lib/audioUtils';

interface ActionBarProps {
  onEndDay: () => void;
  onLock: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToReturns: () => void;
  onNavigateToOrders: () => void;
}

export function ActionBar({ onEndDay, onLock, onNavigateToTransactions, onNavigateToReturns, onNavigateToOrders }: ActionBarProps) {
  const currentShift = useStore(state => state.currentShift);
  const addTransaction = useStore(state => state.addTransaction);
  const parkedSales = useStore(state => state.parkedSales);
  const currentUser = useStore(state => state.currentUser);
  const parkSale = useStore(state => state.parkSale);
  const cart = useStore(state => state.cart);
  
  // Use plugin system instead of industryType
  const { isActive } = usePlugins();
  
  const [showCashDrawer, setShowCashDrawer] = useState(false);
  const [showParkedSales, setShowParkedSales] = useState(false);
  const [showSplitCheck, setShowSplitCheck] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showHeldOrders, setShowHeldOrders] = useState(false);

  const handleNoSale = () => {
    if (currentUser) {
      addTransaction({
        type: 'noSale',
        userId: currentUser.id,
        amount: 0,
        paymentMethod: 'none',
        notes: 'No Sale - Drawer opened',
      });
    }
  };

  const handleParkCurrentSale = () => {
    if (cart.items.length > 0) {
      parkSale();
      playSound(sounds.success);
      toast.success('Sale parked successfully');
    }
  };

  const onOpenCashDrawer = () => setShowCashDrawer(true);

  return (
    <>
      <div className="border-t border-border bg-card p-2 md:p-3">
        {/* Desktop: All buttons in a row */}
        <div className="hidden lg:flex gap-1.5 md:gap-2">
          <Button
            onClick={onEndDay}
            className="flex-1 min-w-0 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs md:text-sm px-2 md:px-4"
          >
            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
            <span className="truncate">Clock Out</span>
          </Button>
          
          <Button
            onClick={onLock}
            className="flex-1 min-w-0 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs md:text-sm px-2 md:px-4"
          >
            <Lock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
            <span className="truncate">Lock</span>
          </Button>
          
          <Button
            onClick={onOpenCashDrawer}
            className="flex-1 min-w-0 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs md:text-sm px-2 md:px-4"
          >
            <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
            <span className="truncate">Cash Drawer</span>
          </Button>
          
          <Button
            onClick={onNavigateToTransactions}
            className="flex-1 min-w-0 bg-[#ec4899] hover:bg-[#db2777] text-white text-xs md:text-sm px-2 md:px-4"
          >
            <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
            <span className="truncate">Transactions</span>
          </Button>
          
          <Button
            onClick={onNavigateToReturns}
            className="flex-1 min-w-0 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs md:text-sm px-2 md:px-4"
          >
            <RefreshCcw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
            <span className="truncate">Returns</span>
          </Button>
          
          <Button
            onClick={onNavigateToOrders}
            className="flex-1 min-w-0 bg-[#eab308] hover:bg-[#ca8a04] text-white text-xs md:text-sm px-2 md:px-4"
          >
            <Pause className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
            <span className="truncate">Orders</span>
          </Button>
          
          {isActive('split-checks') && (
            <Button
              onClick={() => setShowSplitCheck(true)}
              className="flex-1 min-w-0 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs md:text-sm px-2 md:px-4"
              disabled={cart.items.length === 0}
            >
              <Scissors className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              <span className="truncate">Split Check</span>
            </Button>
          )}
          
          {isActive('course-management') && (
            <Button
              onClick={() => setShowCourses(true)}
              className="flex-1 min-w-0 bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs md:text-sm px-2 md:px-4"
              disabled={cart.items.length === 0}
            >
              <ChefHat className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              <span className="truncate">Courses</span>
            </Button>
          )}
          
          {isActive('barcode-scanner') && (
            <Button
              onClick={() => setShowBarcodeScanner(true)}
              className="flex-1 min-w-0 bg-[#65a30d] hover:bg-[#4d7c0f] text-white text-xs md:text-sm px-2 md:px-4"
            >
              <Scan className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              <span className="truncate">Scan</span>
            </Button>
          )}
          
          {isActive('kitchen-display') && (
            <Button
              onClick={() => setShowHeldOrders(true)}
              className="flex-1 min-w-0 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs md:text-sm px-2 md:px-4 relative"
            >
              <Flame className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              <span className="truncate">Held Orders</span>
              {currentShift && currentShift.orders.filter(o => o.fireStatus === 'held').length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                  {currentShift.orders.filter(o => o.fireStatus === 'held').length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Mobile: 2 rows of 4 buttons */}
        <div className="lg:hidden space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={onEndDay}
              className="flex flex-col gap-1 h-auto py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Clock Out</span>
            </Button>
            
            <Button
              onClick={onLock}
              className="flex flex-col gap-1 h-auto py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white"
            >
              <Lock className="w-5 h-5" />
              <span className="text-xs">Lock</span>
            </Button>
            
            <Button
              onClick={onOpenCashDrawer}
              className="flex flex-col gap-1 h-auto py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-xs">Cash</span>
            </Button>
          </div>

          <div className={`grid ${isActive('barcode-scanner') ? 'grid-cols-5' : 'grid-cols-4'} gap-2`}>
            <Button
              onClick={onNavigateToTransactions}
              className="flex flex-col gap-1 h-auto py-3 bg-[#ec4899] hover:bg-[#db2777] text-white"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">Trans</span>
            </Button>
            
            <Button
              onClick={onNavigateToReturns}
              className="flex flex-col gap-1 h-auto py-3 bg-[#f97316] hover:bg-[#ea580c] text-white"
            >
              <RefreshCcw className="w-5 h-5" />
              <span className="text-xs">Returns</span>
            </Button>
            
            <Button
              onClick={onNavigateToOrders}
              className="flex flex-col gap-1 h-auto py-3 bg-[#eab308] hover:bg-[#ca8a04] text-white"
            >
              <Pause className="w-5 h-5" />
              <span className="text-xs">Orders</span>
            </Button>
            
            {isActive('barcode-scanner') && (
              <Button
                onClick={() => setShowBarcodeScanner(true)}
                className="flex flex-col gap-1 h-auto py-3 bg-[#65a30d] hover:bg-[#4d7c0f] text-white"
              >
                <Scan className="w-5 h-5" />
                <span className="text-xs">Scan</span>
              </Button>
            )}
            
            {isActive('kitchen-display') && (
              <Button
                onClick={() => setShowHeldOrders(true)}
                className="flex flex-col gap-1 h-auto py-3 bg-[#f97316] hover:bg-[#ea580c] text-white relative"
              >
                <Flame className="w-5 h-5" />
                <span className="text-xs">Held Orders</span>
                {currentShift && currentShift.orders.filter(o => o.fireStatus === 'held').length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                    {currentShift.orders.filter(o => o.fireStatus === 'held').length}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <CashDrawerDialog
        open={showCashDrawer}
        onClose={() => setShowCashDrawer(false)}
      />

      <ParkedSalesDialog
        open={showParkedSales}
        onClose={() => setShowParkedSales(false)}
        onParkCurrent={handleParkCurrentSale}
      />
      
      {isActive('split-checks') && (
        <SplitCheckDialog
          open={showSplitCheck}
          onOpenChange={setShowSplitCheck}
        />
      )}
      
      {isActive('course-management') && (
        <CoursesDialog
          open={showCourses}
          onOpenChange={setShowCourses}
        />
      )}
      
      {isActive('barcode-scanner') && (
        <BarcodeScannerDialog
          open={showBarcodeScanner}
          onOpenChange={setShowBarcodeScanner}
        />
      )}
      
      {isActive('kitchen-display') && (
        <HeldOrdersDialog
          open={showHeldOrders}
          onClose={() => setShowHeldOrders(false)}
        />
      )}
    </>
  );
}