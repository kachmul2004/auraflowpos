import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useStore } from '../lib/store';
import { Modifier, ProductVariation } from '../lib/types';
import { Minus, Plus, Percent, DollarSign, Trash2, X, Hash, Layers, Settings } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { sounds, playSound } from '../lib/audioUtils';

interface EditCartItemDialogProps {
  open: boolean;
  onClose: () => void;
  cartItemId: string;
}

type TabType = 'quantity' | 'variations' | 'modifiers' | 'pricing';

export function EditCartItemDialog({ open, onClose, cartItemId }: EditCartItemDialogProps) {
  const cart = useStore(state => state.cart);
  const updateCartItemQuantity = useStore(state => state.updateCartItemQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const getAvailableStock = useStore(state => state.getAvailableStock);
  const products = useStore(state => state.products);
  const updateCartItemModifiers = useStore(state => state.updateCartItemModifiers);
  const setItemDiscount = useStore(state => state.setItemDiscount);
  const setPriceOverride = useStore(state => state.setPriceOverride);
  
  const cartItem = cart.items.find(item => item.id === cartItemId);
  
  const [activeTab, setActiveTab] = useState<TabType>('quantity');
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(cartItem?.variation || null);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    cartItem?.discountType || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState(cartItem?.discountValue?.toString() || '');
  const [priceOverride, setPriceOverrideValue] = useState(cartItem?.priceOverride?.toString() || '');
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>(cartItem?.modifiers || []);

  if (!cartItem) return null;

  const itemName = cartItem.variation 
    ? `${cartItem.product.name} - ${cartItem.variation.name}`
    : cartItem.product.name;

  const maxQuantity = getAvailableStock(
    cartItem.product.id,
    cartItem.variation?.id
  ) + cartItem.quantity;

  const product = products.find(p => p.id === cartItem.product.id);
  const availableModifiers = product?.modifiers || [];
  const hasVariations = product?.variations && product.variations.length > 0;

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= maxQuantity) {
      setQuantity(newQty);
    }
  };

  const handleModifierToggle = (modifier: Modifier) => {
    const existing = selectedModifiers.find(m => m.id === modifier.id);
    if (existing) {
      // Remove or decrease quantity
      if (existing.quantity > 1) {
        setSelectedModifiers(
          selectedModifiers.map(m =>
            m.id === modifier.id ? { ...m, quantity: m.quantity - 1 } : m
          )
        );
      } else {
        setSelectedModifiers(selectedModifiers.filter(m => m.id !== modifier.id));
      }
    } else {
      // Add modifier
      setSelectedModifiers([...selectedModifiers, { ...modifier, quantity: 1 }]);
    }
  };

  const handleModifierIncrease = (modifierId: string) => {
    const existing = selectedModifiers.find(m => m.id === modifierId);
    if (existing) {
      setSelectedModifiers(
        selectedModifiers.map(m =>
          m.id === modifierId ? { ...m, quantity: m.quantity + 1 } : m
        )
      );
    }
  };

  const handleSave = () => {
    // Update quantity
    if (quantity !== cartItem.quantity) {
      updateCartItemQuantity(cartItemId, quantity);
    }

    // Update modifiers
    if (JSON.stringify(selectedModifiers) !== JSON.stringify(cartItem.modifiers)) {
      updateCartItemModifiers(cartItemId, selectedModifiers);
    }

    // Update discount
    const discountNum = parseFloat(discountValue);
    if (!isNaN(discountNum) && discountNum > 0) {
      setItemDiscount(cartItemId, discountType, discountNum);
    } else if (cartItem.discountValue) {
      // Remove discount if cleared
      setItemDiscount(cartItemId, 'percentage', 0);
    }

    // Update price override
    const priceNum = parseFloat(priceOverride);
    if (!isNaN(priceNum) && priceNum > 0) {
      setPriceOverride(cartItemId, priceNum, 'Price override from cart edit');
    } else if (cartItem.priceOverride) {
      // Remove override by setting to original price
      setPriceOverride(cartItemId, cartItem.unitPrice, 'Price override removed');
    }

    onClose();
  };

  const handleVoid = () => {
    if (confirm(`Are you sure you want to void this item?\n\n${itemName}\n\nThis action cannot be undone.`)) {
      removeFromCart(cartItemId);
      playSound(sounds.removeFromCart);
      onClose();
    }
  };

  const getModifierQuantity = (modifierId: string) => {
    return selectedModifiers.find(m => m.id === modifierId)?.quantity || 0;
  };

  // Calculate totals
  const basePrice = priceOverride ? parseFloat(priceOverride) : cartItem.unitPrice;
  const itemSubtotal = basePrice * quantity;
  const discountAmount = discountValue && parseFloat(discountValue) > 0
    ? (discountType === 'percentage' 
        ? (itemSubtotal * parseFloat(discountValue)) / 100
        : parseFloat(discountValue))
    : 0;
  const itemTotal = itemSubtotal - discountAmount;

  // Tab configuration
  const tabs = [
    { id: 'quantity' as TabType, label: 'Quantity', icon: Hash, show: true },
    { id: 'variations' as TabType, label: 'Variations', icon: Layers, show: hasVariations },
    { id: 'modifiers' as TabType, label: 'Modifiers', icon: Plus, show: availableModifiers.length > 0 },
    { id: 'pricing' as TabType, label: 'Pricing', icon: DollarSign, show: true },
  ].filter(tab => tab.show);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[900px] max-w-[95vw] sm:max-w-[900px] h-[80vh] max-h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-4 pb-3 shrink-0">
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {cartItem.product.name}
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area with Left Tabs */}
        <div className="flex-1 flex min-h-0 px-6">
          {/* Left Tab Navigation */}
          <div className="w-36 shrink-0 pr-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 h-9"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-sm">{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 border-l pl-4">
            <ScrollArea className="h-full">
              <div className="pr-3 pb-4">
                {/* Quantity Tab */}
                {activeTab === 'quantity' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg mb-1">Quantity</h3>
                      <p className="text-sm text-muted-foreground">Adjust the item quantity</p>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="h-14 w-14"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) handleQuantityChange(val);
                          }}
                          className="text-center h-14 w-28 text-lg"
                          min={1}
                          max={maxQuantity}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= maxQuantity}
                          className="h-14 w-14"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm p-4 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Available Stock:</span>
                        <Badge variant="secondary">{maxQuantity} units</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Variations Tab */}
                {activeTab === 'variations' && hasVariations && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg mb-1">{product?.variationType?.name || 'Variations'}</h3>
                      <p className="text-sm text-muted-foreground">Select a variation for this item</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3">
                      {product?.variations?.map((variation) => {
                        const availableStock = getAvailableStock(product.id, variation.id);
                        const isOutOfStock = availableStock <= 0;
                        const isSelected = selectedVariation?.id === variation.id;
                        
                        return (
                          <Button
                            key={variation.id}
                            variant={isSelected ? 'default' : 'outline'}
                            className="h-auto py-4 flex flex-col items-start relative"
                            onClick={() => setSelectedVariation(variation)}
                            disabled={isOutOfStock}
                          >
                            <span className="text-sm">{variation.name}</span>
                            <span className="text-xs opacity-80">${variation.price.toFixed(2)}</span>
                            {isOutOfStock && (
                              <Badge variant="destructive" className="absolute top-2 right-2 text-xs px-2 py-0.5">
                                Out of Stock
                              </Badge>
                            )}
                            {!isOutOfStock && availableStock <= 5 && (
                              <Badge variant="secondary" className="absolute top-2 right-2 text-xs px-2 py-0.5">
                                {availableStock} left
                              </Badge>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Modifiers Tab */}
                {activeTab === 'modifiers' && availableModifiers.length > 0 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg mb-1">Modifiers</h3>
                      <p className="text-sm text-muted-foreground">Customize your item with add-ons</p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      {availableModifiers.map((modifier) => {
                        const qty = getModifierQuantity(modifier.id);
                        return (
                          <div
                            key={modifier.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{modifier.name}</p>
                              {modifier.price && (
                                <p className="text-xs text-muted-foreground">
                                  +${modifier.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                            {qty > 0 ? (
                              <div className="flex items-center gap-3 ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleModifierToggle(modifier)}
                                  className="h-9 w-9"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center">{qty}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleModifierIncrease(modifier.id)}
                                  className="h-9 w-9"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleModifierToggle(modifier)}
                                className="ml-4"
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg mb-1">Pricing & Discounts</h3>
                      <p className="text-sm text-muted-foreground">Adjust price or apply discounts</p>
                    </div>
                    <Separator />
                    
                    {/* Price Override */}
                    <div className="space-y-3">
                      <Label className="text-base">Price Override</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            value={priceOverride}
                            onChange={(e) => setPriceOverrideValue(e.target.value)}
                            placeholder={cartItem.unitPrice.toFixed(2)}
                            className="pl-10 h-12"
                          />
                        </div>
                        {priceOverride && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPriceOverrideValue('')}
                            className="h-12 w-12"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Original: ${cartItem.unitPrice.toFixed(2)}
                        {priceOverride && parseFloat(priceOverride) !== cartItem.unitPrice && (
                          <span className={parseFloat(priceOverride) < cartItem.unitPrice ? ' text-destructive' : ' text-success'}>
                            {' '}({parseFloat(priceOverride) < cartItem.unitPrice ? '-' : '+'}
                            ${Math.abs(parseFloat(priceOverride) - cartItem.unitPrice).toFixed(2)})
                          </span>
                        )}
                      </p>
                    </div>

                    <Separator />

                    {/* Discount */}
                    <div className="space-y-3">
                      <Label className="text-base">Discount</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={discountType === 'percentage' ? 'default' : 'outline'}
                          onClick={() => setDiscountType('percentage')}
                          className="h-12"
                        >
                          <Percent className="w-4 h-4 mr-2" />
                          Percentage
                        </Button>
                        <Button
                          variant={discountType === 'fixed' ? 'default' : 'outline'}
                          onClick={() => setDiscountType('fixed')}
                          className="h-12"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Fixed Amount
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          {discountType === 'percentage' ? (
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          ) : (
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          )}
                          <Input
                            type="number"
                            step="0.01"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            placeholder="0.00"
                            className="pl-10 h-12"
                          />
                        </div>
                        {discountValue && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDiscountValue('')}
                            className="h-12 w-12"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Summary */}
                    <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({quantity}×):</span>
                        <span>${itemSubtotal.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-destructive">
                          <span>Discount:</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="text-primary text-lg">${itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-10 py-6 border-t bg-muted/20 shrink-0">
          <Button
            variant="destructive"
            onClick={handleVoid}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Void Item
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} className="min-w-24">
            Cancel
          </Button>
          <Button onClick={handleSave} className="min-w-24">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}