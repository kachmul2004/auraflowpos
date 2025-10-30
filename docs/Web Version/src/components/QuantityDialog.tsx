import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantityDialogProps {
  open: boolean;
  onClose: () => void;
  currentQuantity: number;
  maxQuantity: number;
  itemName: string;
  onConfirm: (quantity: number) => void;
  allowDecimals?: boolean;
}

export function QuantityDialog({
  open,
  onClose,
  currentQuantity,
  maxQuantity,
  itemName,
  onConfirm,
  allowDecimals = false,
}: QuantityDialogProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (open) {
      setQuantity(currentQuantity.toString());
      setTimeout(() => inputRef.current?.select(), 100);
    }
  }, [open, currentQuantity]);
  
  const handleConfirm = () => {
    const value = allowDecimals ? parseFloat(quantity) : parseInt(quantity);
    if (!isNaN(value) && value > 0 && value <= maxQuantity) {
      onConfirm(value);
      onClose();
    }
  };
  
  const adjustQuantity = (delta: number) => {
    const current = allowDecimals ? parseFloat(quantity) : parseInt(quantity);
    const newValue = Math.max(1, Math.min(maxQuantity, (current || 0) + delta));
    setQuantity(newValue.toString());
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust Quantity</DialogTitle>
          <DialogDescription>
            Change the quantity for {itemName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustQuantity(-1)}
              disabled={parseFloat(quantity) <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Input
              ref={inputRef}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-center bg-input-background"
              step={allowDecimals ? '0.01' : '1'}
              min="1"
              max={maxQuantity}
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustQuantity(1)}
              disabled={parseFloat(quantity) >= maxQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            Available: {maxQuantity}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
