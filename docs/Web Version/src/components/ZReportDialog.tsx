import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { ZReport } from '../lib/types';
import { Printer, FileText } from 'lucide-react';

interface ZReportDialogProps {
  open: boolean;
  onClose: () => void;
  zReport: ZReport;
  onAfterClose?: () => void;
}

export function ZReportDialog({ open, onClose, zReport, onAfterClose }: ZReportDialogProps) {
  const { shift, terminal, cashier, paymentMethodSales, categorySales, cashTransactionTotals, cashTransactionReport } = zReport;

  const handlePrint = () => {
    window.print();
  };

  const totalSales = paymentMethodSales.reduce((sum, pm) => sum + pm.totalSales, 0);
  const totalOrders = paymentMethodSales.reduce((sum, pm) => sum + pm.quantitySold, 0);
  
  const cashSales = paymentMethodSales.find(pm => pm.name === 'Cash')?.totalSales || 0;
  const cashIn = cashTransactionTotals.find(ct => ct.name === 'Cash In')?.total || 0;
  const cashOut = cashTransactionTotals.find(ct => ct.name === 'Cash Out')?.total || 0;
  const expectedCash = shift.openingBalance + cashSales + cashIn - cashOut;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>End of Day Report (Z-Report)</DialogTitle>
          <DialogDescription>
            Complete session summary and sales breakdown
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="summary" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="summary" className="space-y-4 m-0">
              <div className="space-y-2">
                <h4>Session Information</h4>
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terminal:</span>
                    <span>{terminal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cashier:</span>
                    <span>{cashier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Time:</span>
                    <span>{shift.startTime.toLocaleString()}</span>
                  </div>
                  {shift.endTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Time:</span>
                      <span>{shift.endTime.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4>Sales Summary</h4>
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span>{totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Sales:</span>
                    <span>${totalSales.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4>Cash Reconciliation</h4>
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opening Balance:</span>
                    <span>${shift.openingBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cash Sales:</span>
                    <span>+${cashSales.toFixed(2)}</span>
                  </div>
                  {cashIn > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash In:</span>
                      <span className="text-success">+${cashIn.toFixed(2)}</span>
                    </div>
                  )}
                  {cashOut > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash Out:</span>
                      <span className="text-destructive">-${cashOut.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span>Expected Cash in Drawer:</span>
                    <span>${expectedCash.toFixed(2)}</span>
                  </div>
                  {shift.closingBalance !== undefined && (
                    <>
                      <div className="flex justify-between">
                        <span>Actual Cash Counted:</span>
                        <span>${shift.closingBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={shift.closingBalance - expectedCash >= 0 ? 'text-success' : 'text-destructive'}>
                          Difference:
                        </span>
                        <span className={shift.closingBalance - expectedCash >= 0 ? 'text-success' : 'text-destructive'}>
                          ${(shift.closingBalance - expectedCash).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4 m-0">
              <div className="space-y-2">
                <h4>Sales by Payment Method</h4>
                <div className="space-y-2">
                  {paymentMethodSales.map((pm) => (
                    <div key={pm.name} className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">{pm.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {pm.quantitySold} {pm.quantitySold === 1 ? 'order' : 'orders'}
                          </p>
                        </div>
                        <p>${pm.totalSales.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${totalSales.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4>Sales by Category</h4>
                <div className="space-y-2">
                  {categorySales.map((cat) => (
                    <div key={cat.id} className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {cat.quantitySold} {cat.quantitySold === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <p>${cat.totalSales.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cash" className="space-y-4 m-0">
              <div className="space-y-2">
                <h4>Cash Transactions Summary</h4>
                <div className="space-y-2">
                  {cashTransactionTotals.map((ct) => (
                    <div key={ct.id} className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-sm">{ct.name}</p>
                        <p className={ct.name === 'Cash In' ? 'text-success' : 'text-destructive'}>
                          ${ct.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {cashTransactionReport.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4>Cash Transaction Details</h4>
                    <div className="space-y-2">
                      {cashTransactionReport.map((tx, index) => (
                        <div key={index} className="bg-muted p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm">{tx.note || 'No note'}</p>
                              <p className="text-xs text-muted-foreground">{tx.type}</p>
                            </div>
                            <p className={tx.type === 'Cash In' ? 'text-success' : 'text-destructive'}>
                              ${tx.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={() => {
            onClose();
            if (onAfterClose) {
              setTimeout(onAfterClose, 300);
            }
          }} className="flex-1">
            {onAfterClose ? 'Continue' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}