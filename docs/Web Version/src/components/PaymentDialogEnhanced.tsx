import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { useStore } from '../lib/store';
import { ReceiptDialog } from './ReceiptDialog';
import { NumericKeypad } from './NumericKeypad';
import { PaymentMethodItem } from '../lib/types';
import { isFeatureEnabled } from '../lib/industryConfig';
import { CreditCard, Banknote, FileText, Gift, Percent } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { usePlugins } from '../core/hooks/usePlugins';

interface PaymentDialogEnhancedProps {
  open: boolean;
  onClose: () => void;
}

export function PaymentDialogEnhanced({ open, onClose }: PaymentDialogEnhancedProps) {
  const cart = useStore(state => state.cart);
  const createOrder = useStore(state => state.createOrder);
  const clearCart = useStore(state => state.clearCart);
  const checkGiftCardBalance = useStore(state => state.checkGiftCardBalance);
  const redeemGiftCard = useStore(state => state.redeemGiftCard);
  const hasFeature = useStore(state => state.hasFeature);
  
  const { isActive } = usePlugins();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);
  const [currentMethod, setCurrentMethod] = useState<'cash' | 'card' | 'cheque' | 'giftcard'>('cash');
  const [amountInput, setAmountInput] = useState('');
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [tipInput, setTipInput] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [showTipping, setShowTipping] = useState(false);

  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  let discount = 0;
  if (cart.discountType === 'percentage') {
    discount = (subtotal * cart.discountValue) / 100;
  } else if (cart.discountType === 'fixed') {
    discount = cart.discountValue;
  }
  
  const tax = (subtotal - discount) * (cart.taxRate || 0.08);
  const total = subtotal - discount + tax + tipAmount;
  
  const paidAmount = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
  const remainingBalance = total - paidAmount;

  useEffect(() => {
    if (open) {
      setPaymentMethods([]);
      setAmountInput('');
      setTipAmount(0);
      setTipInput('');
      setGiftCardNumber('');
    }
  }, [open]);

  const handleAddPayment = () => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return;
    
    if (currentMethod === 'giftcard') {
      const balance = checkGiftCardBalance(giftCardNumber);
      if (balance === 0) {
        toast.error('Invalid or empty gift card');
        return;
      }
      if (amount > balance) {
        toast.error(`Insufficient balance. Available: $${balance.toFixed(2)}`);
        return;
      }
      if (amount > remainingBalance) {
        toast.error(`Amount exceeds remaining balance`);
        return;
      }
    }
    
    const paymentToAdd = Math.min(amount, remainingBalance);
    
    const newPayment: PaymentMethodItem = {
      method: currentMethod,
      amount: paymentToAdd,
    };
    
    if (currentMethod === 'cash') {
      newPayment.tender = amount;
      newPayment.change = Math.max(0, amount - paymentToAdd);
    } else if (currentMethod === 'giftcard') {
      newPayment.giftCardNumber = giftCardNumber;
    }
    
    setPaymentMethods([...paymentMethods, newPayment]);
    setAmountInput('');
    setGiftCardNumber('');
    
    // Auto-switch to next method if balance remaining
    if (paymentToAdd < amount) {
      toast.success('Payment added');
    }
  };

  const handleRemovePayment = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handleQuickTip = (percentage: number) => {
    const tipValue = ((subtotal - discount) * percentage) / 100;
    setTipAmount(tipValue);
    setTipInput(tipValue.toFixed(2));
  };

  const handleCustomTip = () => {
    const tip = parseFloat(tipInput);
    if (!isNaN(tip) && tip >= 0) {
      setTipAmount(tip);
    }
  };

  const handleCompletePayment = () => {
    if (remainingBalance > 0.01) {
      toast.error('Payment incomplete. Please add more payment methods.');
      return;
    }
    
    // Redeem gift cards
    for (const pm of paymentMethods) {
      if (pm.method === 'giftcard' && pm.giftCardNumber) {
        redeemGiftCard(pm.giftCardNumber, pm.amount);
      }
    }
    
    const order = createOrder(paymentMethods, tipAmount);
    
    if (order) {
      setLastOrder(order);
      clearCart();
      setShowReceipt(true);
      toast.success('Payment completed successfully');
    }
  };

  const handleClose = () => {
    setPaymentMethods([]);
    setAmountInput('');
    setCurrentMethod('cash');
    setTipAmount(0);
    setTipInput('');
    setGiftCardNumber('');
    setShowTipping(false);
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
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Process payment with multiple methods and add tip
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Payment Entry */}
          <div className="space-y-4">
            <Tabs value={currentMethod} onValueChange={(v: any) => setCurrentMethod(v)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="cash">
                  <Banknote className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="card">
                  <CreditCard className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="cheque">
                  <FileText className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="giftcard">
                  <Gift className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cash" className="space-y-3">
                <Label>Cash Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="text-lg bg-input-background"
                />
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmountInput(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmountInput(remainingBalance.toFixed(2))}
                  >
                    Exact
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="card" className="space-y-3">
                <Label>Card Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="text-lg bg-input-background"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setAmountInput(remainingBalance.toFixed(2))}
                >
                  Pay Remaining (${remainingBalance.toFixed(2)})
                </Button>
              </TabsContent>
              
              <TabsContent value="cheque" className="space-y-3">
                <Label>Cheque Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="text-lg bg-input-background"
                />
              </TabsContent>
              
              <TabsContent value="giftcard" className="space-y-3">
                <Label>Gift Card Number</Label>
                <Input
                  type="text"
                  value={giftCardNumber}
                  onChange={(e) => setGiftCardNumber(e.target.value)}
                  placeholder="Enter gift card number"
                  className="bg-input-background"
                />
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="text-lg bg-input-background"
                />
              </TabsContent>
            </Tabs>
            
            <Button
              onClick={handleAddPayment}
              disabled={!amountInput || (currentMethod === 'giftcard' && !giftCardNumber)}
              className="w-full"
            >
              Add Payment
            </Button>
            
            {/* Tipping Section - Show only if subscribed preset has tipping feature */}
            {hasFeature('tipping') && cart.orderType !== 'takeout' && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>Add Tip</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTipping(!showTipping)}
                  >
                    <Percent className="w-4 h-4 mr-1" />
                    {showTipping ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                {showTipping && (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      {[15, 18, 20, 25].map((pct) => (
                        <Button
                          key={pct}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickTip(pct)}
                        >
                          {pct}%
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={tipInput}
                        onChange={(e) => setTipInput(e.target.value)}
                        onBlur={handleCustomTip}
                        placeholder="Custom tip"
                        className="bg-input-background"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTipAmount(0);
                          setTipInput('');
                        }}
                      >
                        No Tip
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tip:</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applied Payments</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No payments added yet
                  </p>
                ) : (
                  paymentMethods.map((pm, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div className="text-sm">
                        <p className="font-medium capitalize">{pm.method}</p>
                        {pm.change && pm.change > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Change: ${pm.change.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${pm.amount.toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePayment(index)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {remainingBalance > 0.01 ? 'Remaining:' : 'Change:'}
                </span>
                <span className="text-lg font-medium">
                  ${Math.abs(remainingBalance).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCompletePayment}
                disabled={remainingBalance > 0.01}
                className="w-full"
              >
                Complete Payment
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}