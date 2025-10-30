import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { useStore } from '../../../lib/store';
import { 
  Users, 
  Clock, 
  DollarSign, 
  ChefHat, 
  User,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { RestaurantTable, Order } from '../../../lib/types';

interface TableDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  table: RestaurantTable | null;
}

export function TableDetailsDialog({ open, onClose, table }: TableDetailsDialogProps) {
  const getTableOrders = useStore((state) => state.getTableOrders);
  const clearTable = useStore((state) => state.clearTable);
  const getOrderTypeLabel = useStore(state => state.getOrderTypeLabel);
  
  if (!table) return null;

  const orders = getTableOrders(table.id);
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  
  // Get oldest order for time calculation
  const oldestOrder = orders.length > 0 
    ? orders.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime())[0]
    : null;
  
  const timeOccupied = oldestOrder 
    ? Math.floor((Date.now() - new Date(oldestOrder.dateCreated).getTime()) / 60000)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-600 border-green-500/50';
      case 'occupied':
        return 'bg-red-500/20 text-red-600 border-red-500/50';
      case 'reserved':
        return 'bg-amber-500/20 text-amber-600 border-amber-500/50';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'occupied':
        return <XCircle className="w-5 h-5" />;
      case 'reserved':
        return <Clock className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleClearTable = () => {
    if (window.confirm(`Are you sure you want to clear Table ${table.number}? This will mark the table as available.`)) {
      clearTable(table.id);
      toast.success(`Table ${table.number} has been cleared`);
      onClose();
    }
  };

  const getKitchenStatusColor = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/50';
      case 'preparing':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/50';
      case 'ready':
        return 'bg-green-500/20 text-green-600 border-green-500/50';
      case 'served':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/50';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Table {table.number} Details</span>
            <Badge variant="outline" className={`${getStatusColor(table.status)} border`}>
              {getStatusIcon(table.status)}
              <span className="ml-1 capitalize">{table.status}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {table.section && `${table.section} Section • `}
            {table.seats} Seat{table.seats > 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Table Information */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Table Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Table Number</p>
                  <p className="text-lg font-medium">{table.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-lg font-medium">{table.seats} seats</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Section</p>
                  <p className="text-lg font-medium">{table.section || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusColor(table.status)}>
                    {table.status}
                  </Badge>
                </div>
                {table.server && (
                  <>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Server</p>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {table.server}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Occupancy Details */}
            {table.status === 'occupied' && (
              <Card className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Occupancy Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Occupied</p>
                    <p className="text-lg font-medium">{timeOccupied} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-lg font-medium">{orders.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-lg font-medium">{totalItems}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Orders List */}
            {orders.length > 0 && (
              <Card className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Orders ({orders.length})
                </h3>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-3 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{order.orderNumber}</Badge>
                          {order.kitchenStatus && (
                            <Badge 
                              variant="outline" 
                              className={`${getKitchenStatusColor(order.kitchenStatus)} border`}
                            >
                              {order.kitchenStatus}
                            </Badge>
                          )}
                          {order.orderType && (
                            <Badge variant="secondary">
                              {getOrderTypeLabel(order.orderType)}
                            </Badge>
                          )}
                        </div>
                        <span className="font-medium">${order.total.toFixed(2)}</span>
                      </div>

                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(order.dateCreated).toLocaleTimeString()}
                      </div>

                      <Separator className="my-2" />

                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.quantity}x</span>{' '}
                              <span>{item.name}</span>
                              {item.modifiers.length > 0 && (
                                <div className="ml-6 text-xs text-muted-foreground">
                                  {item.modifiers.map((mod, midx) => (
                                    <div key={midx}>+ {mod.name}</div>
                                  ))}
                                </div>
                              )}
                              {item.course && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.course}
                                </Badge>
                              )}
                              {item.seatNumber && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Seat {item.seatNumber}
                                </Badge>
                              )}
                            </div>
                            <span className="text-muted-foreground">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <>
                          <Separator className="my-2" />
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="w-3 h-3 mt-0.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.notes}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Empty State */}
            {table.status === 'available' && (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg mb-2">Table Available</h3>
                  <p className="text-sm">
                    This table is currently available and ready for new guests.
                  </p>
                </div>
              </Card>
            )}

            {table.status === 'reserved' && (
              <Card className="p-8 bg-amber-500/10 border-amber-500/50">
                <div className="text-center text-amber-600">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg mb-2">Table Reserved</h3>
                  <p className="text-sm">
                    This table has been reserved for upcoming guests.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t border-border">
          {table.status === 'occupied' && (
            <Button
              variant="destructive"
              onClick={handleClearTable}
              className="flex-1"
            >
              Clear Table
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
