import React, { useState } from 'react';
import { useStore } from '../../../lib/store';
import { CartItem } from '../../../lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
import { 
  Users, 
  User, 
  DollarSign, 
  CheckCircle,
  Scissors
} from 'lucide-react';

interface SplitCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SplitCheckDialog({ open, onOpenChange }: SplitCheckDialogProps) {
  const { cart, setItemSeat } = useStore();
  const [splitMethod, setSplitMethod] = useState<'seat' | 'even' | 'custom'>('seat');
  const [numberOfSplits, setNumberOfSplits] = useState(2);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Get unique seats from cart
  const seats = Array.from(new Set(
    cart.items.map(item => item.seatNumber).filter(Boolean)
  )).sort((a, b) => (a || 0) - (b || 0));
  
  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = cart.discountType === 'percentage' 
    ? (subtotal * cart.discountValue) / 100
    : cart.discountValue;
  const tax = (subtotal - discount) * cart.taxRate;
  const total = subtotal - discount + tax + (cart.tipAmount || 0);
  
  // Calculate split amounts
  const getSeatTotal = (seatNumber: number) => {
    return cart.items
      .filter(item => item.seatNumber === seatNumber)
      .reduce((sum, item) => sum + item.totalPrice, 0);
  };
  
  const getEvenSplitAmount = () => {
    return total / numberOfSplits;
  };
  
  const handleAssignSeat = (itemId: string, seatNumber: number) => {
    setItemSeat(itemId, seatNumber);
  };
  
  const handleClearSeat = (itemId: string) => {
    setItemSeat(itemId, undefined);
  };
  
  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Split Check
          </DialogTitle>
          <DialogDescription>
            Split the check by seat, evenly, or by custom amounts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={splitMethod} onValueChange={(v) => setSplitMethod(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seat">
              <User className="h-4 w-4 mr-2" />
              By Seat
            </TabsTrigger>
            <TabsTrigger value="even">
              <Users className="h-4 w-4 mr-2" />
              Even Split
            </TabsTrigger>
            <TabsTrigger value="custom">
              <DollarSign className="h-4 w-4 mr-2" />
              Custom
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="seat" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Assign Items to Seats</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on an item to assign it to a seat number
                  </p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map(seatNum => (
                    <Badge key={seatNum} variant="outline">
                      Seat {seatNum}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Items List */}
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.quantity}x {item.product.name}
                          </span>
                          {item.variation && (
                            <Badge variant="secondary">{item.variation.name}</Badge>
                          )}
                          {item.seatNumber && (
                            <Badge variant="default">
                              <User className="h-3 w-3 mr-1" />
                              Seat {item.seatNumber}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map(seatNum => (
                          <Button
                            key={seatNum}
                            size="sm"
                            variant={item.seatNumber === seatNum ? 'default' : 'outline'}
                            onClick={() => handleAssignSeat(item.id, seatNum)}
                          >
                            {seatNum}
                          </Button>
                        ))}
                        {item.seatNumber && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleClearSeat(item.id)}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Seat Totals */}
              {seats.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-3">Seat Totals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {seats.map(seatNum => {
                        if (!seatNum) return null;
                        const seatTotal = getSeatTotal(seatNum);
                        const seatTax = seatTotal * cart.taxRate;
                        const seatGrandTotal = seatTotal + seatTax;
                        
                        return (
                          <div key={seatNum} className="border rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">Seat {seatNum}</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>${seatTotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax:</span>
                                <span>${seatTax.toFixed(2)}</span>
                              </div>
                              <Separator className="my-1" />
                              <div className="flex justify-between font-medium">
                                <span>Total:</span>
                                <span>${seatGrandTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="even" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>Number of Ways to Split</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNumberOfSplits(Math.max(2, numberOfSplits - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={numberOfSplits}
                    onChange={(e) => setNumberOfSplits(Math.max(2, parseInt(e.target.value) || 2))}
                    className="w-20 text-center"
                    min={2}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNumberOfSplits(numberOfSplits + 1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    people
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Split Breakdown</h3>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Split {numberOfSplits} Ways:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${getEvenSplitAmount().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    Each person pays ${getEvenSplitAmount().toFixed(2)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: numberOfSplits }, (_, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Person {i + 1}</span>
                      </div>
                      <p className="text-lg font-medium">
                        ${getEvenSplitAmount().toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Select Items for Custom Split</h3>
                <p className="text-sm text-muted-foreground">
                  Select items to create a custom split check
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedItems.has(item.id) ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedItems.has(item.id) 
                            ? 'bg-primary border-primary' 
                            : 'border-muted-foreground'
                        }`}>
                          {selectedItems.has(item.id) && (
                            <CheckCircle className="h-4 w-4 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {item.quantity}x {item.product.name}
                            </span>
                            {item.variation && (
                              <Badge variant="secondary">{item.variation.name}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ${item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedItems.size > 0 && (
                <>
                  <Separator />
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Selected Items Total</h3>
                    <div className="text-2xl font-bold text-primary">
                      ${cart.items
                        .filter(item => selectedItems.has(item.id))
                        .reduce((sum, item) => sum + item.totalPrice, 0)
                        .toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedItems.size} item(s) selected
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // In a real app, this would create separate checks/orders
            onOpenChange(false);
          }}>
            Confirm Split
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
