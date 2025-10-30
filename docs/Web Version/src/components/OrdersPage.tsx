import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useStore } from '../lib/store';
import { Order } from '../lib/types';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Printer, ArrowLeft, Mail } from 'lucide-react';
import { PrintReceiptDialog } from './PrintReceiptDialog';
import { EmailReceiptDialog } from './EmailReceiptDialog';

interface OrdersPageProps {
  onBack: () => void;
}

export function OrdersPage({ onBack }: OrdersPageProps) {
  const currentShift = useStore(state => state.currentShift);
  const recentOrders = useStore(state => state.recentOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
  
  // Combine orders and remove duplicates based on order ID
  const allOrders = [
    ...(currentShift?.orders || []),
    ...recentOrders,
  ]
    .filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    )
    .sort((a, b) => 
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );
  
  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], 'default' | 'secondary' | 'destructive'> = {
      'paid': 'default',
      'pending': 'secondary',
      'cancelled': 'destructive',
      'voided': 'destructive',
      'returned': 'secondary',
    };
    
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };
  
  const handlePrint = (order: Order) => {
    setOrderToPrint(order);
    setShowPrintDialog(true);
  };

  const handleEmail = (order: Order) => {
    setOrderToPrint(order);
    setShowEmailDialog(true);
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Recent Orders</h1>
            <p className="text-sm text-muted-foreground">
              View and reprint receipts for recent orders
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Orders List */}
            <div className="flex flex-col h-full">
              <h2 className="mb-4">All Orders</h2>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                    {allOrders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full p-4 rounded-lg text-left transition-colors border ${
                          selectedOrder?.id === order.id
                            ? 'bg-accent border-primary border-2'
                            : 'bg-card border-border hover:bg-accent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-lg">Order #{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.dateCreated).toLocaleString()}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {order.items.length} item(s)
                          </span>
                          <span className="font-medium text-lg">${order.total.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                    {allOrders.length === 0 && (
                      <div className="flex items-center justify-center py-20">
                        <p className="text-center text-muted-foreground">
                          No orders found
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="flex flex-col h-full">
              {selectedOrder ? (
                <div className="space-y-6 h-full flex flex-col">
                  <h2>Order Details</h2>
                  
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl">Order #{selectedOrder.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(selectedOrder.dateCreated).toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    
                    {selectedOrder.customer && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Customer: {selectedOrder.customer.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden bg-card border border-border rounded-lg p-6">
                    <h3 className="mb-4">Items</h3>
                    <ScrollArea className="h-full">
                      <div className="space-y-3 pr-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.quantity} × ${item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Discount:</span>
                          <span>-${selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      {selectedOrder.tip && (
                        <div className="flex justify-between">
                          <span>Tip:</span>
                          <span>${selectedOrder.tip.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-xl">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <p className="font-medium">Payment Methods:</p>
                      {selectedOrder.paymentMethods.map((pm, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="capitalize">{pm.method}</span>
                          <span>${pm.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handlePrint(selectedOrder)}
                      size="lg"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Reprint Receipt
                    </Button>
                    <Button
                      onClick={() => handleEmail(selectedOrder)}
                      size="lg"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Receipt
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground bg-card border border-border rounded-lg">
                  Select an order to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPrintDialog && orderToPrint && (
        <PrintReceiptDialog
          open={showPrintDialog}
          order={orderToPrint}
          onClose={() => setShowPrintDialog(false)}
        />
      )}

      {showEmailDialog && orderToPrint && (
        <EmailReceiptDialog
          open={showEmailDialog}
          order={orderToPrint}
          onClose={() => setShowEmailDialog(false)}
        />
      )}
    </div>
  );
}