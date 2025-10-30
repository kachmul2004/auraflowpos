import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { UserCircle, FileText, Banknote, Archive, Tag, Receipt, X, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { sounds, playSound } from '../lib/audioUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PaymentDialogEnhanced } from './PaymentDialogEnhanced';
import { ParkedSalesDialog } from './ParkedSalesDialog';
import { Badge } from './ui/badge';
import { CustomerSelectionDialog } from './CustomerSelectionDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usePlugins } from '../core/hooks/usePlugins';
import { EditCartItemDialog } from './EditCartItemDialog';

interface ShoppingCartProps {
  onClose?: () => void;
}

export function ShoppingCart({ onClose }: ShoppingCartProps) {
  const cart = useStore(state => state.cart);
  const customers = useStore(state => state.customers);
  const updateCartItemQuantity = useStore(state => state.updateCartItemQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const setCustomer = useStore(state => state.setCustomer);
  const tables = useStore(state => state.tables);
  const setNotes = useStore(state => state.setNotes);
  const setDiscount = useStore(state => state.setDiscount);
  const parkSale = useStore(state => state.parkSale);
  
  const { isActive } = usePlugins();
  
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showParkedSales, setShowParkedSales] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountInput, setDiscountInput] = useState('');
  
  // Item-level dialogs
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  
  const setOrderType = useStore(state => state.setOrderType);
  const getAvailableStock = useStore(state => state.getAvailableStock);
  const parkedSales = useStore(state => state.parkedSales);
  const businessProfile = useStore(state => state.businessProfile);
  const getEnabledOrderTypes = useStore(state => state.getEnabledOrderTypes);
  const getOrderTypeLabel = useStore(state => state.getOrderTypeLabel);
  
  const selectedItem = cart.items.find(item => item.id === selectedItemId);

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

  const handleApplyDiscount = () => {
    const value = parseFloat(discountInput);
    if (!isNaN(value) && value >= 0) {
      setDiscount(discountType, value);
      setShowDiscountDialog(false);
      setDiscountInput('');
    }
  };

  const handleCharge = () => {
    if (cart.items.length > 0) {
      setShowPayment(true);
    }
  };

  return (
    <div className="w-full lg:w-96 lg:border-l border-border flex flex-col h-full bg-card">
      {/* Mobile Close Button - Floating */}
      {onClose && (
        <div className="lg:hidden absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Restaurant: Table Assignment Info */}
      {isActive('table-management') && cart.tableId && (
        <div className="px-4 py-2 bg-accent/50 border-b border-border">
          <p className="text-sm text-accent-foreground">
            📍 Table {tables.find(t => t.id === cart.tableId)?.number}
            {cart.orderType && ` • ${getOrderTypeLabel(cart.orderType)}`}
          </p>
        </div>
      )}

      {/* Customer & Notes Section */}
      <div className="p-4 space-y-2 border-b border-border bg-muted/20">
        {/* Order Type - Show for restaurant, cafe, bar, and ultimate profiles */}
        {isActive('order-types') && (businessProfile === 'restaurant' || businessProfile === 'cafe' || businessProfile === 'bar' || businessProfile === 'ultimate') && (() => {
          const enabledTypes = getEnabledOrderTypes();
          if (enabledTypes.length === 0) return null;
          
          return (
            <div className="mb-2">
              <Label className="text-xs text-muted-foreground mb-1 block">Order Type</Label>
              <Select
                value={cart.orderType || enabledTypes[0]?.id || (businessProfile === 'ultimate' ? 'in-store' : 'dine-in')}
                onValueChange={(value: any) => setOrderType(value)}
              >
                <SelectTrigger className="w-full bg-input-background">
                  <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {enabledTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          );
        })()}
        <Button 
          variant="outline" 
          className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all" 
          size="sm"
          onClick={() => setShowCustomerDialog(true)}
        >
          <UserCircle className="w-4 h-4 mr-2" />
          <span className="flex-1 text-left">{cart.customer ? cart.customer.name : 'Add Customer'}</span>
          {cart.customer && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Set
            </Badge>
          )}
        </Button>
        
        <CustomerSelectionDialog
          open={showCustomerDialog}
          onOpenChange={setShowCustomerDialog}
          currentCustomer={cart.customer}
          onSelectCustomer={(customer) => {
            setCustomer(customer);
            setShowCustomerDialog(false);
          }}
        />

        <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              <span className="flex-1 text-left">Order Notes</span>
              {cart.notes && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {cart.notes.length > 20 ? '...' : cart.notes.substring(0, 20)}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Notes</DialogTitle>
              <DialogDescription>
                Add any special instructions or notes for this order.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={cart.notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this order..."
              rows={5}
              className="bg-input-background"
            />
            <Button onClick={() => setShowNotesDialog(false)}>Done</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cart Items - Scrollable */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-2 space-y-1">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Banknote className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Add items to start an order</p>
            </div>
          ) : (
            cart.items.map((item, index) => (
              <button 
                key={item.id}
                onClick={() => {
                  setSelectedItemId(item.id);
                  setShowEditItemDialog(true);
                }}
                className="w-full group relative bg-gradient-to-br from-muted/30 to-transparent border border-border hover:border-primary/50 rounded-lg p-2 transition-all hover:shadow-md text-left cursor-pointer"
              >
                {/* Product info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm shrink-0 text-muted-foreground">
                        {item.quantity}×
                      </span>
                      <p className="text-sm line-clamp-1 flex-1">
                        {item.product.name}
                        {item.variation && (
                          <span className="text-muted-foreground"> - {item.variation.name}</span>
                        )}
                      </p>
                    </div>
                    {item.modifiers.length > 0 && (
                      <div className="mt-0.5 space-y-0.5 pl-6">
                        {item.modifiers.map((mod) => (
                          <p key={mod.id} className="text-xs text-muted-foreground">
                            + {mod.name}
                            {mod.quantity > 1 && ` x${mod.quantity}`}
                            {mod.price && ` (+$${(mod.price * mod.quantity).toFixed(2)})`}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Totals */}
      <div className="p-4 border-t-2 border-border space-y-3 bg-muted/40 dark:bg-[#0a0f22]">
        <div className="flex justify-between items-center text-sm opacity-80">
          <span>Subtotal</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        
        <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
          <DialogTrigger asChild>
            <button className="w-full flex justify-between items-center text-sm cursor-pointer hover:text-primary transition-colors opacity-80 hover:opacity-100">
              <span className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                Discount
              </span>
              <span className="flex items-center gap-2">
                {discount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {cart.discountType === 'percentage' ? `${cart.discountValue}%` : 'Fixed'}
                  </Badge>
                )}
                <span className={`tabular-nums ${discount > 0 ? 'text-destructive' : ''}`}>
                  {discount > 0 ? '-' : ''}${discount.toFixed(2)}
                </span>
              </span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Discount</DialogTitle>
              <DialogDescription>
                Apply a percentage or fixed amount discount to this order.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={discountType === 'percentage' ? 'default' : 'outline'}
                    onClick={() => setDiscountType('percentage')}
                    className="flex-1"
                  >
                    Percentage (%)
                  </Button>
                  <Button
                    variant={discountType === 'fixed' ? 'default' : 'outline'}
                    onClick={() => setDiscountType('fixed')}
                    className="flex-1"
                  >
                    Fixed ($)
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder="0.00"
                  className="bg-input-background"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleApplyDiscount} className="flex-1">
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDiscount(null, 0);
                    setShowDiscountDialog(false);
                  }}
                  className="flex-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-between items-center text-sm opacity-80">
          <span>Tax (8%)</span>
          <span className="tabular-nums">${tax.toFixed(2)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center text-lg py-3">
          <span>Total</span>
          <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-2">
          <Button
            onClick={() => {
              if (cart.items.length > 0) {
                if (confirm('Clear all items from cart?')) {
                  useStore.getState().clearCart();
                }
              }
            }}
            variant="outline"
            disabled={cart.items.length === 0}
            className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => setShowParkedSales(true)}
            variant="outline"
            className="flex-1 hover:bg-primary/10 hover:border-primary/50 transition-all relative"
          >
            <Archive className="w-4 h-4 mr-2" />
            Park Sale
            {parkedSales.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {parkedSales.length}
              </Badge>
            )}
          </Button>
          
          <Button
            onClick={handleCharge}
            disabled={cart.items.length === 0}
            data-checkout-button
            className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all hover:scale-[1.02]"
          >
            <Banknote className="w-4 h-4 mr-2" />
            Charge
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      {showPayment && (
        <PaymentDialogEnhanced
          open={showPayment}
          onClose={() => setShowPayment(false)}
        />
      )}

      {showParkedSales && (
        <ParkedSalesDialog
          open={showParkedSales}
          onClose={() => setShowParkedSales(false)}
          onParkCurrent={parkSale}
        />
      )}

      {/* Item-level Dialogs */}
      {selectedItemId && (
        <EditCartItemDialog
          open={showEditItemDialog}
          onClose={() => {
            setShowEditItemDialog(false);
            setSelectedItemId(null);
          }}
          cartItemId={selectedItemId}
        />
      )}
    </div>
  );
}