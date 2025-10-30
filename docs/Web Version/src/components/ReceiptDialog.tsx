import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Order } from '../lib/types';
import { useStore } from '../lib/store';
import { Printer, Mail } from 'lucide-react';
import { PrintReceiptDialog } from './PrintReceiptDialog';
import { EmailReceiptDialog } from './EmailReceiptDialog';

interface ReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

export function ReceiptDialog({ open, onClose, order }: ReceiptDialogProps) {
  const currentShift = useStore(state => state.currentShift);
  const appSettings = useStore(state => state.appSettings);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  // Auto-print if enabled
  useEffect(() => {
    if (open && appSettings.autoPrintReceipts) {
      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        setShowPrintDialog(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, appSettings.autoPrintReceipts]);
  
  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const handleEmail = () => {
    setShowEmailDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md flex flex-col max-h-[90vh] p-0">
          {/* Fixed Header */}
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>Receipt</DialogTitle>
            <DialogDescription>
              Transaction completed successfully. Print, email, or close to continue.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6" id="receipt-content">
            <div className="space-y-4 pb-4">
              <div className="text-center">
                <h3>AuraFlow POS</h3>
                {currentShift && <p className="text-xs text-muted-foreground">{currentShift.terminal.name}</p>}
                <p className="text-sm text-muted-foreground">
                  {order.dateCreated.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Order #{order.orderNumber}
                </p>
              </div>

              <Separator />

              {order.customer && (
                <>
                  <div>
                    <p className="text-sm">Customer: {order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  </div>
                  <Separator />
                </>
              )}

              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p className="text-muted-foreground">
                          ${item.unitPrice.toFixed(2)} x {item.quantity}
                        </p>
                        {item.modifiers.length > 0 && (
                          <div className="pl-2 space-y-0.5 mt-1">
                            {item.modifiers.map((mod, modIndex) => (
                              <p key={modIndex} className="text-xs text-muted-foreground">
                                + {mod.name}
                                {mod.quantity > 1 && ` x${mod.quantity}`}
                                {mod.price && ` (+${(mod.price * mod.quantity).toFixed(2)})`}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <p>${(item.unitPrice * item.quantity + 
                        item.modifiers.reduce((sum, mod) => sum + (mod.price || 0) * mod.quantity * item.quantity, 0)
                      ).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Discount:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.paymentMethods[0]?.method === 'cash' && order.paymentMethods[0]?.tender && (
                <>
                  <Separator />
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Cash Received:</span>
                      <span>${order.paymentMethods[0].tender.toFixed(2)}</span>
                    </div>
                    {order.paymentMethods[0].change && (
                      <div className="flex justify-between">
                        <span>Change:</span>
                        <span>${order.paymentMethods[0].change.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator />

              <div className="text-center text-sm text-muted-foreground">
                <p>Payment: {order.paymentMethods.map(pm => pm.method.toUpperCase()).join(', ')}</p>
                {order.notes && <p className="mt-1 text-xs">{order.notes}</p>}
                <p className="mt-2">Thank you for your purchase!</p>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-border shrink-0 bg-card">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEmail} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePrint} 
                className="flex-1"
                data-print-receipt
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <PrintReceiptDialog
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        order={order}
        onEmailClick={() => {
          setShowPrintDialog(false);
          setShowEmailDialog(true);
        }}
      />

      {/* Email Dialog */}
      <EmailReceiptDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        order={order}
      />
    </>
  );
}