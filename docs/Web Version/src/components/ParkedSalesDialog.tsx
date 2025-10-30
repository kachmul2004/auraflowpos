import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useStore } from '../lib/store';
import { Trash2 } from 'lucide-react';

interface ParkedSalesDialogProps {
  open: boolean;
  onClose: () => void;
  onParkCurrent: () => void;
}

export function ParkedSalesDialog({ open, onClose, onParkCurrent }: ParkedSalesDialogProps) {
  const parkedSales = useStore(state => state.parkedSales);
  const loadParkedSale = useStore(state => state.loadParkedSale);
  const deleteParkedSale = useStore(state => state.deleteParkedSale);
  const cart = useStore(state => state.cart);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingLoadId, setPendingLoadId] = useState<string | null>(null);

  const handleLoad = (id: string) => {
    // Check if cart has items
    if (cart.items.length > 0) {
      // Show confirmation dialog
      setPendingLoadId(id);
      setShowConfirmation(true);
    } else {
      // Load immediately if cart is empty
      loadParkedSale(id);
      onClose();
    }
  };

  const confirmLoad = () => {
    if (pendingLoadId) {
      loadParkedSale(pendingLoadId);
      setPendingLoadId(null);
      setShowConfirmation(false);
      onClose();
    }
  };

  const cancelLoad = () => {
    setPendingLoadId(null);
    setShowConfirmation(false);
  };

  const handleParkCurrent = () => {
    if (cart.items.length > 0) {
      onParkCurrent();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Parked Sales {parkedSales.length > 0 && `(${parkedSales.length})`}
            </DialogTitle>
            <DialogDescription>
              Park the current sale or load a previously parked sale.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={handleParkCurrent}
              disabled={cart.items.length === 0}
              className="w-full"
            >
              Park Current Sale
            </Button>

            <ScrollArea className="h-96">
              {parkedSales.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No parked sales</p>
              ) : (
                <div className="space-y-2">
                  {parkedSales.map((sale) => {
                    const total = sale.cart.items.reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    );

                    return (
                      <div
                        key={sale.id}
                        className="p-4 bg-muted rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">
                              {new Date(sale.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {sale.cart.items.length} item(s)
                            </p>
                            {sale.cart.customer && (
                              <p className="text-sm text-muted-foreground">
                                Customer: {sale.cart.customer.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p>${total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleLoad(sale.id)}
                            size="sm"
                            className="flex-1"
                          >
                            Load Sale
                          </Button>
                          <Button
                            onClick={() => deleteParkedSale(sale.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite Current Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              You have items in your current cart. Loading this parked sale will replace all current cart contents. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLoad}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLoad}>
              Load Parked Sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
