import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { useStore } from '../lib/store';
import { Order } from '../lib/types';
import { Checkbox } from './ui/checkbox';
import { Search, ArrowLeft } from 'lucide-react';

interface ReturnsPageProps {
  onBack: () => void;
}

export function ReturnsPage({ onBack }: ReturnsPageProps) {
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const currentShift = useStore(state => state.currentShift);
  const recentOrders = useStore(state => state.recentOrders);
  const returnOrder = useStore(state => state.returnOrder);
  
  const allOrders = [
    ...(currentShift?.orders || []),
    ...recentOrders,
  ].filter(o => o.status === 'paid');
  
  const searchResults = orderSearch
    ? allOrders.filter(o => 
        o.orderNumber.toString().includes(orderSearch) ||
        o.id.includes(orderSearch)
      )
    : allOrders.slice(0, 20);
  
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setSelectedItems([]);
  };
  
  const toggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const handleReturn = () => {
    if (!selectedOrder || selectedItems.length === 0 || !reason) return;
    
    const result = returnOrder(selectedOrder.id, selectedItems, reason);
    if (result) {
      onBack();
      setSelectedOrder(null);
      setSelectedItems([]);
      setReason('');
      setOrderSearch('');
    }
  };
  
  const calculateReturnTotal = () => {
    if (!selectedOrder) return 0;
    const items = selectedOrder.items.filter(item => 
      selectedItems.includes(item.product)
    );
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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
            <h1>Process Return</h1>
            <p className="text-sm text-muted-foreground">
              Search for the original order and select items to return
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto h-full">
          {!selectedOrder ? (
            <div className="space-y-4 h-full flex flex-col">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by order number..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-10 bg-input-background"
                />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                    {searchResults.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className="p-6 bg-card border border-border rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-lg">Order #{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(order.dateCreated).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item(s)
                            </p>
                          </div>
                          <p className="text-xl font-medium">${order.total.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="col-span-full flex items-center justify-center py-20">
                        <p className="text-center text-muted-foreground">
                          No orders found
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xl">Order #{selectedOrder.orderNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedOrder.dateCreated).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Change Order
                  </Button>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <Label className="text-lg mb-4 block">Select Items to Return</Label>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.product}
                        className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                      >
                        <Checkbox
                          checked={selectedItems.includes(item.product)}
                          onCheckedChange={() => toggleItem(item.product)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium text-lg">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <Label htmlFor="reason" className="text-lg">Return Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for return..."
                  className="mt-3 bg-input-background min-h-[100px]"
                />
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl">Return Total:</span>
                  <span className="text-3xl font-medium">
                    ${calculateReturnTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReturn}
                  disabled={selectedItems.length === 0 || !reason}
                  className="flex-1"
                  size="lg"
                >
                  Process Return
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
