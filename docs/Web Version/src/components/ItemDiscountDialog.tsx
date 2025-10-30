import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useStore } from '../lib/store';
import { Percent, DollarSign, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ItemDiscountDialogProps {
  open: boolean;
  onClose: () => void;
  cartItemId: string;
  itemName: string;
  itemPrice: number;
}

// Predefined discount reasons (Square-style)
const DISCOUNT_REASONS = [
  'Employee Discount',
  'Manager Discretion',
  'Customer Loyalty',
  'Damaged Item',
  'Price Match',
  'Promotional',
  'Clearance',
  'Bulk Discount',
  'VIP Customer',
  'Complaint Resolution',
  'Senior Discount',
  'Student Discount',
  'Military Discount',
  'Birthday Special',
  'Other',
];

// Quick discount presets
const PERCENTAGE_PRESETS = [5, 10, 15, 20, 25, 50];
const AMOUNT_PRESETS = [1, 5, 10, 20];

export function ItemDiscountDialog({
  open,
  onClose,
  cartItemId,
  itemName,
  itemPrice,
}: ItemDiscountDialogProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const setItemDiscount = useStore(state => state.setItemDiscount);
  const hasPermission = useStore(state => state.hasPermission);
  const currentUser = useStore(state => state.currentUser);
  
  const canApplyDiscount = hasPermission('apply_discounts');
  
  // Role-based limits (Square-style)
  const getMaxDiscount = () => {
    const role = currentUser?.role;
    if (role === 'admin') return { percentage: 100, amount: itemPrice };
    if (role === 'manager') return { percentage: 50, amount: 500 };
    return { percentage: 10, amount: 20 }; // cashier
  };
  
  const maxLimits = getMaxDiscount();
  
  const handleApply = () => {
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid discount amount');
      return;
    }
    
    // Validate against limits
    if (discountType === 'percentage') {
      if (value > maxLimits.percentage) {
        toast.error(`Your role allows max ${maxLimits.percentage}% discount`);
        return;
      }
      if (value > 100) {
        toast.error('Discount cannot exceed 100%');
        return;
      }
    } else {
      if (value > maxLimits.amount) {
        toast.error(`Your role allows max $${maxLimits.amount} discount`);
        return;
      }
      if (value > itemPrice) {
        toast.error('Discount cannot exceed item price');
        return;
      }
    }
    
    // Require reason for discounts
    if (!discountReason) {
      toast.error('Please select a discount reason');
      return;
    }
    
    const finalReason = discountReason === 'Other' ? customReason : discountReason;
    if (!finalReason) {
      toast.error('Please specify a reason');
      return;
    }
    
    setItemDiscount(cartItemId, discountType, value, finalReason);
    toast.success(`Discount applied: ${discountType === 'percentage' ? value + '%' : '$' + value.toFixed(2)}`);
    onClose();
    
    // Reset form
    setDiscountValue('');
    setDiscountReason('');
    setCustomReason('');
  };
  
  const calculateDiscountedPrice = () => {
    const value = parseFloat(discountValue) || 0;
    if (discountType === 'percentage') {
      return itemPrice * (1 - value / 100);
    }
    return itemPrice - value;
  };
  
  const calculateSavings = () => {
    const discounted = calculateDiscountedPrice();
    return Math.max(0, itemPrice - discounted);
  };
  
  const isValueExceedsLimit = () => {
    const value = parseFloat(discountValue) || 0;
    if (discountType === 'percentage') {
      return value > maxLimits.percentage;
    }
    return value > maxLimits.amount;
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Apply Discount
          </DialogTitle>
          <DialogDescription>
            Discount for {itemName}
          </DialogDescription>
        </DialogHeader>
        
        {!canApplyDiscount ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Permission Denied</p>
              <p className="text-sm">You do not have permission to apply discounts</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Original Price */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Original Price:</span>
                <span className="text-lg font-medium">${itemPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Role limits badge */}
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className="gap-1">
                <Tag className="w-3 h-3" />
                {currentUser?.role || 'User'}
              </Badge>
              <span className="text-muted-foreground">
                Max: {maxLimits.percentage}% or ${maxLimits.amount}
              </span>
            </div>
            
            {/* Discount Type Tabs */}
            <Tabs value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="percentage" className="gap-2">
                  <Percent className="w-4 h-4" />
                  Percentage
                </TabsTrigger>
                <TabsTrigger value="fixed" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  Fixed Amount
                </TabsTrigger>
              </TabsList>
              
              {/* Percentage Tab */}
              <TabsContent value="percentage" className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Discount Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      max={maxLimits.percentage}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="0"
                      className="bg-input-background text-lg"
                    />
                    <span className="text-muted-foreground text-lg">%</span>
                  </div>
                </div>
                
                {/* Quick Buttons */}
                <div>
                  <Label className="text-xs text-muted-foreground">Quick Select</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {PERCENTAGE_PRESETS.map((pct) => (
                      <Button
                        key={pct}
                        variant={discountValue === pct.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDiscountValue(pct.toString())}
                        disabled={pct > maxLimits.percentage}
                        className="h-10"
                      >
                        {pct}%
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Fixed Amount Tab */}
              <TabsContent value="fixed" className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Discount Amount</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-lg">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max={Math.min(itemPrice, maxLimits.amount)}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="0.00"
                      className="bg-input-background text-lg"
                    />
                  </div>
                </div>
                
                {/* Quick Buttons */}
                <div>
                  <Label className="text-xs text-muted-foreground">Quick Select</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {AMOUNT_PRESETS.map((amt) => (
                      <Button
                        key={amt}
                        variant={discountValue === amt.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDiscountValue(amt.toString())}
                        disabled={amt > maxLimits.amount || amt > itemPrice}
                        className="h-10"
                      >
                        ${amt}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Warning for exceeding limits */}
            {isValueExceedsLimit() && (
              <div className="p-3 bg-[var(--warning)]/10 text-[var(--warning)] rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-medium">Exceeds Your Limit</p>
                  <p className="text-xs">Manager approval may be required</p>
                </div>
              </div>
            )}
            
            {/* Discount Reason */}
            <div className="space-y-2">
              <Label>Discount Reason *</Label>
              <Select value={discountReason} onValueChange={setDiscountReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Custom Reason */}
            {discountReason === 'Other' && (
              <div className="space-y-2">
                <Label>Specify Reason *</Label>
                <Input
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter custom reason..."
                  className="bg-input-background"
                />
              </div>
            )}
            
            {/* Preview */}
            {discountValue && parseFloat(discountValue) > 0 && (
              <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">New Price:</span>
                  <span className="text-2xl font-bold text-[var(--success)]">
                    ${Math.max(0, calculateDiscountedPrice()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">You Save:</span>
                  <span className="font-medium text-[var(--success)]">
                    ${calculateSavings().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={
              !canApplyDiscount || 
              !discountValue || 
              parseFloat(discountValue) <= 0 ||
              !discountReason ||
              (discountReason === 'Other' && !customReason)
            }
          >
            Apply Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}