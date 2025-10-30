import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { useStore } from '../lib/store';
import { ReceiptDialog } from './ReceiptDialog';
import { usePlugin } from '../core/hooks/usePlugin';
import { Check } from 'lucide-react';
import { sounds, playSound } from '../lib/audioUtils';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PaymentDialog({ open, onClose }: PaymentDialogProps) {
  const cart = useStore(state => state.cart);
  const createOrder = useStore(state => state.createOrder);
  const clearCart = useStore(state => state.clearCart);
  const currentUser = useStore(state => state.currentUser);
  
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'cheque'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [holdOrder, setHoldOrder] = useState(false);
  
  // Check if kitchen display plugin is active
  const kitchenDisplayPlugin = usePlugin('kitchen-display');
  const showHoldOption = kitchenDisplayPlugin?.isActive && cart.orderType === 'dine-in' && cart.tableId;
  
  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  let discount = 0;
  if (cart.discountType === 'percentage') {
    discount = (subtotal * cart.discountValue) / 100;
  } else if (cart.discountType === 'fixed') {
    discount = cart.discountValue;
  }
  
  const taxRate = 0.08;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;

  const received = parseFloat(amountReceived) || 0;
  const changeDue = paymentMethod === 'cash' ? Math.max(0, received - total) : 0;
  const remainingBalance = total - received;

  const appSettings = useStore(state => state.appSettings);
  
  const handlePayment = () => {
    if (paymentMethod === 'cash' && received < total) {
      return;
    }

    const tender = paymentMethod === 'cash' ? received : total;
    const order = createOrder(paymentMethod, tender, holdOrder);
    
    if (order) {
      setLastOrder(order);
      clearCart();
      
      // Play "cha-ching!" sound on sale complete
      playSound(sounds.saleComplete);
      
      // Auto-print if enabled
      if (appSettings.autoPrintReceipts) {
        // Auto-print will be handled in ReceiptDialog
        setShowReceipt(true);
      } else {
        setShowReceipt(true);
      }
    }
  };

  const handleClose = () => {
    setAmountReceived('');
    setPaymentMethod('cash');
    onClose();
  };

  if (showReceipt && lastOrder) {
    return (
      <ReceiptDialog
        open={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          handleClose();
        }}
        order={lastOrder}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Select payment method and complete the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-border pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cash">Cash</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="cash" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="received">Amount Received</Label>
                <Input
                  id="received"
                  type="number"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="0.00"
                  autoFocus
                  className="bg-input-background"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-lg">
                  <span>Change Due:</span>
                  <span className={changeDue < 0 ? 'text-destructive' : ''}>
                    ${changeDue.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setAmountReceived(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setAmountReceived(total.toFixed(2))}
                >
                  Exact
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="card">
              <p className="text-sm text-muted-foreground py-4">
                Process card payment through your payment terminal.
              </p>
            </TabsContent>

            <TabsContent value="other">
              <p className="text-sm text-muted-foreground py-4">
                Other payment methods (check, mobile payment, etc.)
              </p>
            </TabsContent>
          </Tabs>

          {showHoldOption && (
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg border border-border">
              <Checkbox
                id="hold-order"
                checked={holdOrder}
                onCheckedChange={(checked) => setHoldOrder(checked as boolean)}
              />
              <Label 
                htmlFor="hold-order" 
                className="text-sm cursor-pointer"
              >
                Hold order (don't send to kitchen yet)
              </Label>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={remainingBalance > 0}
              className="flex-1 bg-[var(--success)] hover:bg-[var(--success)]/90 text-[var(--success-foreground)]"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}