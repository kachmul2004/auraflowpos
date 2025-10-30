import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useStore } from '../lib/store';
import { ManagerOverrideDialog } from './ManagerOverrideDialog';
import { AlertCircle } from 'lucide-react';

interface PriceOverrideDialogProps {
  open: boolean;
  onClose: () => void;
  cartItemId: string;
  itemName: string;
  currentPrice: number;
}

export function PriceOverrideDialog({
  open,
  onClose,
  cartItemId,
  itemName,
  currentPrice,
}: PriceOverrideDialogProps) {
  const [newPrice, setNewPrice] = useState('');
  const [reason, setReason] = useState('');
  const [showManagerOverride, setShowManagerOverride] = useState(false);
  const setPriceOverride = useStore(state => state.setPriceOverride);
  const hasPermission = useStore(state => state.hasPermission);
  
  const canOverridePrice = hasPermission('price_override');
  
  const handleApply = () => {
    if (!canOverridePrice) {
      setShowManagerOverride(true);
      return;
    }
    
    applyOverride();
  };
  
  const applyOverride = () => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0 || !reason) return;
    
    setPriceOverride(cartItemId, price, reason);
    onClose();
    setNewPrice('');
    setReason('');
  };
  
  const handleManagerApproval = (managerId: string) => {
    applyOverride();
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Price Override</DialogTitle>
            <DialogDescription>
              Override the price for {itemName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!canOverridePrice && (
              <div className="p-3 bg-[var(--warning)]/10 text-[var(--warning)] rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  This action requires manager approval
                </p>
              </div>
            )}
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Current Price:</span>
                <span className="font-medium">${currentPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPrice">New Price *</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="newPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-input-background"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Override *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for price override..."
                className="bg-input-background"
              />
            </div>
            
            {newPrice && (
              <div className="p-3 bg-accent rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price Change:</span>
                  <span className={`font-medium ${
                    parseFloat(newPrice) < currentPrice ? 'text-success' : 'text-destructive'
                  }`}>
                    {parseFloat(newPrice) < currentPrice ? '-' : '+'}
                    ${Math.abs(parseFloat(newPrice) - currentPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!newPrice || !reason || parseFloat(newPrice) < 0}
            >
              Apply Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ManagerOverrideDialog
        open={showManagerOverride}
        onClose={() => setShowManagerOverride(false)}
        action={`Price Override for ${itemName}`}
        onApprove={handleManagerApproval}
      />
    </>
  );
}