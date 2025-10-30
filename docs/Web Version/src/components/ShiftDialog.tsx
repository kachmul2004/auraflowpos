import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';
import { Printer } from 'lucide-react';

interface ShiftDialogProps {
  open: boolean;
  onClose: () => void;
  onClockOut?: (report: any) => void;
}

export function ShiftDialog({ open, onClose, onClockOut }: ShiftDialogProps) {
  const currentShift = useStore(state => state.currentShift);
  const endShift = useStore(state => state.endShift);
  const generateZReport = useStore(state => state.generateZReport);

  if (!currentShift) {
    return null;
  }

  const totalOrders = currentShift.orders.length;
  const totalSales = currentShift.orders.reduce((sum, order) => sum + order.total, 0);

  const cashSales = currentShift.orders
    .filter(o => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.total, 0);

  const cashIn = currentShift.transactions
    .filter(t => t.type === 'cashIn')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashOut = currentShift.transactions
    .filter(t => t.type === 'cashOut')
    .reduce((sum, t) => sum + t.amount, 0);

  const expectedCash = currentShift.openingBalance + cashSales + cashIn - cashOut;

  const handleClockOut = () => {
    // Auto-use expected cash as closing balance
    endShift(expectedCash);
    const report = generateZReport();
    toast.success('Shift ended successfully');
    
    // Always call onClockOut callback, even if report is null
    // This ensures navigation happens in POSView
    if (onClockOut) {
      onClockOut(report);
    }
  };

  const handlePrintReport = () => {
    window.print();
    toast.success('Printing report...');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Shift Status Summary</DialogTitle>
          <DialogDescription>
            Current session details and transaction summary.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Terminal:</span>
              <span>{currentShift.terminal.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Clocked In:</span>
              <span>{new Date(currentShift.startTime).toLocaleString()}</span>
            </div>
            {currentShift.endTime && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Clocked Out:</span>
                <span>{new Date(currentShift.endTime).toLocaleString()}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Opening Balance:</span>
              <span>${currentShift.openingBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span>{totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Sales:</span>
              <span>${totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash Sales:</span>
              <span>${cashSales.toFixed(2)}</span>
            </div>
            {cashIn > 0 && (
              <div className="flex justify-between text-success">
                <span>Cash In:</span>
                <span>+${cashIn.toFixed(2)}</span>
              </div>
            )}
            {cashOut > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Cash Out:</span>
                <span>-${cashOut.toFixed(2)}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between text-lg">
            <span>Expected Cash:</span>
            <span>${expectedCash.toFixed(2)}</span>
          </div>

          {currentShift.closingBalance !== undefined && (
            <>
              <div className="flex justify-between">
                <span>Closing Balance:</span>
                <span>${currentShift.closingBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Variance:</span>
                <span className={currentShift.closingBalance - expectedCash !== 0 ? 'text-destructive' : ''}>
                  ${(currentShift.closingBalance - expectedCash).toFixed(2)}</span>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Total Transactions: {currentShift.transactions.length}</p>
            <p>Orders: {currentShift.orders.length}</p>
            <p>No Sales: {currentShift.transactions.filter(t => t.type === 'noSale').length}</p>
            <p>Cash Movements: {currentShift.transactions.filter(t => t.type === 'cashIn' || t.type === 'cashOut').length}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Button 
              variant="outline" 
              onClick={handlePrintReport}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!currentShift.endTime && (
              <Button onClick={handleClockOut}>
                Clock Out
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}