import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useStore } from '../lib/store';
import { ChefHat, Clock, User, Hash, DollarSign, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface HeldOrdersDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HeldOrdersDialog({ open, onClose }: HeldOrdersDialogProps) {
  const currentShift = useStore(state => state.currentShift);
  const fireOrderToKitchen = useStore(state => state.fireOrderToKitchen);
  const currentUser = useStore(state => state.currentUser);
  const getOrderTypeLabel = useStore(state => state.getOrderTypeLabel);

  // Get all held orders from current shift
  const heldOrders = currentShift?.orders.filter(
    order => 
      order.fireStatus === 'held' && 
      order.kitchenStatus === undefined &&
      order.status === 'paid'
  ) || [];

  const handleFireOrder = (orderId: string) => {
    fireOrderToKitchen(orderId);
    toast.success('Order fired to kitchen!', {
      icon: <ChefHat className="w-4 h-4" />,
    });
  };

  const handleFireAll = () => {
    let count = 0;
    heldOrders.forEach(order => {
      fireOrderToKitchen(order.id);
      count++;
    });
    
    if (count > 0) {
      toast.success(`${count} order${count > 1 ? 's' : ''} fired to kitchen!`, {
        icon: <ChefHat className="w-4 h-4" />,
      });
    }
  };

  const getTimeHeld = (heldAt?: Date) => {
    if (!heldAt) return 'Unknown';
    const minutes = Math.floor((Date.now() - new Date(heldAt).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Held Orders
          </DialogTitle>
          <DialogDescription>
            Orders that are paid but not yet sent to the kitchen
          </DialogDescription>
        </DialogHeader>

        {heldOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ChefHat className="w-16 h-16 mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg mb-1">No Held Orders</h3>
            <p className="text-sm text-muted-foreground">
              All orders have been sent to the kitchen
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {heldOrders.length} order{heldOrders.length > 1 ? 's' : ''} on hold
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={handleFireAll}
                className="bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-[var(--orange-foreground)]"
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Fire All Orders
              </Button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {heldOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          <Hash className="w-3 h-3 mr-1" />
                          {order.orderNumber}
                        </Badge>
                        {order.tableId && (
                          <Badge variant="secondary">
                            <MapPin className="w-3 h-3 mr-1" />
                            Table {order.tableId.replace('table-', '')}
                          </Badge>
                        )}
                        {order.orderType && (
                          <Badge variant="secondary">
                            {getOrderTypeLabel(order.orderType)}
                          </Badge>
                        )}
                      </div>
                      <Badge variant="default" className="bg-[var(--warning)]">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeHeld(order.heldAt)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {order.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Items:</span>
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                      {order.heldBy && currentShift && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Held by:</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {currentUser?.id === order.heldBy ? 'You' : 'Cashier'}
                          </span>
                        </div>
                      )}
                      {order.notes && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="text-muted-foreground">Note: </span>
                          {order.notes}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border pt-3 mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-start justify-between text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.quantity}x</span>{' '}
                              <span>{item.name}</span>
                              {item.course && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.course}
                                </Badge>
                              )}
                              {item.modifiers.length > 0 && (
                                <div className="ml-6 mt-1 text-xs text-muted-foreground">
                                  {item.modifiers.map((mod, idx) => (
                                    <div key={idx}>+ {mod.name}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFireOrder(order.id)}
                      className="w-full bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-[var(--orange-foreground)]"
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      Fire to Kitchen
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}