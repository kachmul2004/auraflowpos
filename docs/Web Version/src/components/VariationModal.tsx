import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product, ProductVariation, CartItemModifier, Modifier } from '../lib/types';
import { Plus, Minus } from 'lucide-react';
import { useStore } from '../lib/store';
import { sounds, playSound } from '../lib/audioUtils';

interface VariationModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export function VariationModal({ open, onClose, product }: VariationModalProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [modifiers, setModifiers] = useState<Map<string, number>>(new Map());
  
  const addToCart = useStore(state => state.addToCart);
  const getAvailableStock = useStore(state => state.getAvailableStock);

  const handleAddToCart = () => {
    if (!selectedVariation) return;
    
    const modifierList: CartItemModifier[] = Array.from(modifiers.entries())
      .filter(([_, qty]) => qty > 0)
      .map(([modId, quantity]) => {
        const mod = product.modifiers?.find(m => m.id === modId);
        return {
          id: modId,
          name: mod?.name || '',
          quantity,
          price: mod?.price,
        };
      });
    
    addToCart(product, selectedVariation, modifierList);
    handleClose();
    playSound(sounds.addToCart);
  };

  const handleClose = () => {
    setSelectedVariation(null);
    setModifiers(new Map());
    onClose();
  };

  const updateModifierQuantity = (modifierId: string, delta: number) => {
    setModifiers(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(modifierId) || 0;
      const newQty = Math.max(0, Math.min(10, current + delta));
      
      if (newQty === 0) {
        newMap.delete(modifierId);
      } else {
        newMap.set(modifierId, newQty);
      }
      
      return newMap;
    });
  };

  const calculateTotal = () => {
    if (!selectedVariation) return 0;
    
    let total = selectedVariation.price;
    
    modifiers.forEach((qty, modId) => {
      const mod = product.modifiers?.find(m => m.id === modId);
      if (mod?.price) {
        total += mod.price * qty;
      }
    });
    
    return total;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {product.variationType && `Select ${product.variationType.name.toLowerCase()} and customize your order`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm">
                {product.variationType?.name || 'Options'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {product.variations.map((variation) => {
                  const availableStock = getAvailableStock(product.id, variation.id);
                  const isOutOfStock = availableStock <= 0;
                  const isSelected = selectedVariation?.id === variation.id;
                  
                  return (
                    <Button
                      key={variation.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col items-start relative"
                      onClick={() => setSelectedVariation(variation)}
                      disabled={isOutOfStock}
                    >
                      <span className="text-sm">{variation.name}</span>
                      <span className="text-xs opacity-80">${variation.price.toFixed(2)}</span>
                      {isOutOfStock && (
                        <Badge variant="destructive" className="absolute top-1 right-1 text-xs px-1 py-0">
                          Out
                        </Badge>
                      )}
                      {!isOutOfStock && availableStock <= 5 && (
                        <Badge variant="secondary" className="absolute top-1 right-1 text-xs px-1 py-0">
                          {availableStock}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modifiers */}
          {product.modifiers && product.modifiers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm">Add-ons (Optional)</h4>
              <div className="space-y-2">
                {product.modifiers.map((modifier) => {
                  const quantity = modifiers.get(modifier.id) || 0;
                  
                  return (
                    <div
                      key={modifier.id}
                      className="flex items-center justify-between p-2 border border-border rounded-md"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{modifier.name}</p>
                        {modifier.price && (
                          <p className="text-xs text-muted-foreground">
                            +${modifier.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateModifierQuantity(modifier.id, -1)}
                          disabled={quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center text-sm">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateModifierQuantity(modifier.id, 1)}
                          disabled={quantity >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-lg">
            Total: <span className="text-primary">${calculateTotal().toFixed(2)}</span>
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={!selectedVariation}
          >
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}