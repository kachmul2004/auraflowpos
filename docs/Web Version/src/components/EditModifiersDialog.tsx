import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useStore } from '../lib/store';
import { CartItemModifier } from '../lib/types';
import { Plus, Minus, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface EditModifiersDialogProps {
  open: boolean;
  onClose: () => void;
  cartItemId: string;
  itemName: string;
  currentModifiers: CartItemModifier[];
  productId: string;
}

export function EditModifiersDialog({
  open,
  onClose,
  cartItemId,
  itemName,
  currentModifiers,
  productId,
}: EditModifiersDialogProps) {
  const products = useStore(state => state.products);
  const updateCartItemModifiers = useStore(state => state.updateCartItemModifiers);
  
  const product = products.find(p => p.id === productId);
  const availableModifiers = product?.modifiers || [];
  
  const [selectedModifiers, setSelectedModifiers] = useState<CartItemModifier[]>(
    currentModifiers.map(m => ({ ...m }))
  );

  const handleToggleModifier = (modifierId: string, modifierName: string, price: number) => {
    const existing = selectedModifiers.find(m => m.id === modifierId);
    
    if (existing) {
      // Remove modifier
      setSelectedModifiers(selectedModifiers.filter(m => m.id !== modifierId));
    } else {
      // Add modifier
      setSelectedModifiers([
        ...selectedModifiers,
        {
          id: modifierId,
          name: modifierName,
          price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleQuantityChange = (modifierId: string, delta: number) => {
    setSelectedModifiers(
      selectedModifiers.map(m => {
        if (m.id === modifierId) {
          const newQuantity = Math.max(1, m.quantity + delta);
          return { ...m, quantity: newQuantity };
        }
        return m;
      })
    );
  };

  const handleSave = () => {
    updateCartItemModifiers(cartItemId, selectedModifiers);
    onClose();
  };

  const totalModifierCost = selectedModifiers.reduce(
    (sum, m) => sum + (m.price || 0) * m.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Modifiers</DialogTitle>
          <DialogDescription>
            Customize modifiers for {itemName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4">
            {availableModifiers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No modifiers available for this item</p>
              </div>
            ) : (
              availableModifiers.map((modifier) => {
                const selected = selectedModifiers.find(m => m.id === modifier.id);
                const isChecked = !!selected;
                
                return (
                  <div key={modifier.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`modifier-${modifier.id}`}
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleToggleModifier(modifier.id, modifier.name, modifier.price || 0)
                          }
                        />
                        <div>
                          <Label
                            htmlFor={`modifier-${modifier.id}`}
                            className="cursor-pointer"
                          >
                            {modifier.name}
                          </Label>
                          {modifier.price && modifier.price > 0 && (
                            <p className="text-xs text-muted-foreground">
                              +${modifier.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isChecked && selected && (
                        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(modifier.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {selected.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(modifier.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {selectedModifiers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Modifiers:</h4>
              <div className="space-y-1">
                {selectedModifiers.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                  >
                    <span>
                      {mod.name}
                      {mod.quantity > 1 && ` x${mod.quantity}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        ${((mod.price || 0) * mod.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() =>
                          setSelectedModifiers(selectedModifiers.filter(m => m.id !== mod.id))
                        }
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total Modifiers:</span>
                <span className="font-medium">${totalModifierCost.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
