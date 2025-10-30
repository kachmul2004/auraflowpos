import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useStore } from '../lib/store';
import { ManagerOverrideDialog } from './ManagerOverrideDialog';
import { AlertCircle } from 'lucide-react';

interface VoidItemDialogProps {
  open: boolean;
  onClose: () => void;
  cartItemId: string;
  itemName: string;
  itemPrice: number;
}

export function VoidItemDialog({
  open,
  onClose,
  cartItemId,
  itemName,
  itemPrice,
}: VoidItemDialogProps) {
  const [reason, setReason] = useState('');
  const [showManagerOverride, setShowManagerOverride] = useState(false);
  const voidCartItem = useStore(state => state.voidCartItem);
  const hasPermission = useStore(state => state.hasPermission);
  
  const canVoid = hasPermission('void_items');
  
  const handleVoid = () => {
    if (!canVoid) {
      setShowManagerOverride(true);
      return;
    }
    
    performVoid();
  };
  
  const performVoid = () => {
    if (!reason) return;
    
    voidCartItem(cartItemId, reason);
    onClose();
    setReason('');
  };
  
  const handleManagerApproval = (managerId: string) => {
    performVoid();
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Void Item</DialogTitle>
            <DialogDescription>
              Remove item from cart with void tracking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!canVoid && (
              <div className="p-3 bg-[var(--warning)]/10 text-[var(--warning)] rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  This action requires manager approval
                </p>
              </div>
            )}
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">{itemName}</p>
              <p className="text-sm text-muted-foreground">
                Price: ${itemPrice.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voidReason">Reason for Void *</Label>
              <Textarea
                id="voidReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for voiding this item..."
                className="bg-input-background"
                rows={3}
              />
            </div>
            
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              <p className="font-medium">Warning:</p>
              <p>This action will be logged and cannot be undone.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleVoid}
              disabled={!reason}
            >
              Void Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ManagerOverrideDialog
        open={showManagerOverride}
        onClose={() => setShowManagerOverride(false)}
        action={`Void Item: ${itemName}`}
        onApprove={handleManagerApproval}
      />
    </>
  );
}