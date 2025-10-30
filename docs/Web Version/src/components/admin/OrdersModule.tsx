import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  ShoppingCart,
  DollarSign,
  Package,
  RotateCcw,
  Search,
  Download,
  Calendar,
  User,
  Printer,
  Edit,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Order } from '../../lib/types';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { ExportDialog } from '../ExportDialog';
import { exportOrders, exportOrderItems, ExportOptions, filterByDateRange } from '../../lib/exportUtils';

export function OrdersModule() {
  const orders = useStore((state) => state.recentOrders);
  const users = useStore((state) => state.users);
  const getEnabledOrderTypes = useStore(state => state.getEnabledOrderTypes);
  const getOrderTypeLabel = useStore(state => state.getOrderTypeLabel);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<'orders' | 'items'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOrderType, setFilterOrderType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);

  // Get user name by ID (from shift)
  const getUserName = (shiftId: string) => {
    const shifts = useStore.getState().shifts;
    const shift = shifts.find((s) => s.id === shiftId);
    if (shift) {
      const user = users.find((u) => u.id === shift.userId);
      return user ? user.name : 'Unknown User';
    }
    return 'Unknown User';
  };

  // Handle export
  const handleExport = (options: ExportOptions) => {
    try {
      let dataToExport = [...filteredOrders];
      
      // Apply date range filter if specified
      if (options.dateRange) {
        dataToExport = filterByDateRange(dataToExport, options.dateRange.start, options.dateRange.end);
      }
      
      // Export based on type
      if (exportType === 'orders') {
        exportOrders(dataToExport, options);
      } else {
        exportOrderItems(dataToExport, options);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export data');
    }
  };

  // Get available fields for export
  const getExportFields = () => {
    if (exportType === 'orders') {
      return [
        { value: 'Order Number', label: 'Order Number' },
        { value: 'Date', label: 'Date & Time' },
        { value: 'Customer', label: 'Customer Name' },
        { value: 'Customer Email', label: 'Customer Email' },
        { value: 'Status', label: 'Status' },
        { value: 'Order Type', label: 'Order Type' },
        { value: 'Table', label: 'Table' },
        { value: 'Server', label: 'Server' },
        { value: 'Cashier', label: 'Cashier' },
        { value: 'Subtotal', label: 'Subtotal' },
        { value: 'Discount', label: 'Discount' },
        { value: 'Tax', label: 'Tax' },
        { value: 'Tip', label: 'Tip' },
        { value: 'Total', label: 'Total' },
        { value: 'Payment Method', label: 'Payment Method' },
        { value: 'Terminal', label: 'Terminal' },
        { value: 'Items Count', label: 'Items Count' },
        { value: 'Notes', label: 'Notes' },
        { value: 'Training Mode', label: 'Training Mode' },
      ];
    } else {
      return [
        { value: 'Order Number', label: 'Order Number' },
        { value: 'Order Date', label: 'Order Date' },
        { value: 'Customer', label: 'Customer' },
        { value: 'Item Name', label: 'Item Name' },
        { value: 'Category', label: 'Category' },
        { value: 'Variation', label: 'Variation' },
        { value: 'Quantity', label: 'Quantity' },
        { value: 'Unit Price', label: 'Unit Price' },
        { value: 'Total Price', label: 'Total Price' },
        { value: 'Discount', label: 'Discount' },
        { value: 'Modifiers', label: 'Modifiers' },
        { value: 'Notes', label: 'Notes' },
        { value: 'Seat', label: 'Seat' },
        { value: 'Course', label: 'Course' },
      ];
    }
  };

  // Get status badge
  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      paid: { label: 'Paid', className: 'bg-[var(--success)]/10 text-[var(--success)]' },
      pending: { label: 'Pending', className: 'bg-[var(--warning)]/10 text-[var(--warning)]' },
      cancelled: { label: 'Cancelled', className: 'bg-muted/50 text-muted-foreground' },
      voided: { label: 'Voided', className: 'bg-destructive/10 text-destructive-foreground' },
      returned: { label: 'Returned', className: 'bg-[var(--orange)]/10 text-[var(--orange)]' },
    };
    const config = badges[status] || badges.paid;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Get order type badge
  const getOrderTypeBadge = (orderType?: string) => {
    if (!orderType) return null;
    
    const icons = {
      'dine-in': UtensilsCrossed,
      'takeout': Package,
      'delivery': MapPin,
      'in-store': Package,
      'pickup': Package,
    };
    
    const Icon = icons[orderType as keyof typeof icons] || Package;
    return (
      <Badge variant="outline" className="gap-1">
        <Icon className="w-3 h-3" />
        {getOrderTypeLabel(orderType as any)}
      </Badge>
    );
  };

  // Handle view details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  // Handle reprint receipt
  const handleReprintReceipt = (order: Order) => {
    toast.success('Receipt sent to printer');
    // Implementation would trigger actual print
  };

  // Handle process return
  const handleProcessReturn = (order: Order) => {
    setSelectedOrder(order);
    setShowReturnDialog(true);
  };

  // Confirm return
  const handleConfirmReturn = () => {
    if (!selectedOrder) return;
    
    toast.success('Return processed successfully');
    setShowReturnDialog(false);
    // Implementation would create return transaction
  };

  // Define columns
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order #',
      cell: ({ row }) => (
        <div className="font-medium">#{row.original.orderNumber}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'dateCreated',
      header: 'Date & Time',
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.dateCreated).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'shift',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>{getUserName(row.original.shift)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          {row.original.customer ? (
            <span>{row.original.customer.name}</span>
          ) : (
            <span className="text-muted-foreground">Walk-in</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'orderType',
      header: 'Type',
      cell: ({ row }) => getOrderTypeBadge(row.original.orderType),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <div className="text-right font-medium">${row.original.total.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => (
        <div className="text-center">{row.original.items.length}</div>
      ),
    },
    {
      id: 'training',
      header: 'Mode',
      cell: ({ row }) => (
        <div>
          {row.original.isTrainingMode && (
            <Badge variant="outline" className="text-xs">Training</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReprintReceipt(row.original)}
          >
            <Printer className="w-4 h-4" />
          </Button>
          {row.original.status === 'paid' && !row.original.isTrainingMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleProcessReturn(row.original)}
              className="text-orange-600 hover:text-orange-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const orderNumber = order.orderNumber.toString();
    const customerName = order.customer?.name.toLowerCase() || '';
    const userName = getUserName(order.shift).toLowerCase();
    
    const matchesSearch =
      orderNumber.includes(query) ||
      customerName.includes(query) ||
      userName.includes(query) ||
      order.id.toLowerCase().includes(query);

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesOrderType =
      filterOrderType === 'all' || order.orderType === filterOrderType;

    return matchesSearch && matchesStatus && matchesOrderType;
  });

  // Calculate summary stats
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.status === 'paid').length;
  const returnedOrders = orders.filter((o) => o.status === 'returned').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  
  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-medium mb-2">Order Records</h1>
        <p className="text-muted-foreground">
          View and manage all order history, reprint receipts, and process returns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{paidOrders} paid orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnedOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidOrders > 0 ? ((returnedOrders / paidOrders) * 100).toFixed(1) : 0}% return rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Search, filter, and manage order records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, customer, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="voided">Voided</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterOrderType} onValueChange={setFilterOrderType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {getEnabledOrderTypes().map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          <DataTable columns={columns} data={filteredOrders} />
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>
                Order placed on {new Date(selectedOrder.dateCreated).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[600px] pr-4">
              <div className="space-y-6">
                {/* Status and Type */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedOrder.status)}
                  {getOrderTypeBadge(selectedOrder.orderType)}
                  {selectedOrder.isTrainingMode && (
                    <Badge variant="outline">Training Mode</Badge>
                  )}
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Order ID</Label>
                    <p className="font-mono text-sm">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">User</Label>
                    <p>{getUserName(selectedOrder.shift)}</p>
                  </div>
                  {selectedOrder.customer && (
                    <>
                      <div>
                        <Label className="text-muted-foreground">Customer Name</Label>
                        <p>{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Customer Email</Label>
                        <p className="text-sm">{selectedOrder.customer.email}</p>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="ml-8 text-sm text-muted-foreground">
                              {item.modifiers.map((mod, modIndex) => (
                                <div key={modIndex}>
                                  + {mod.name} {mod.price > 0 && `(+$${mod.price.toFixed(2)})`}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="ml-8 text-sm text-muted-foreground">
                            ${item.unitPrice.toFixed(2)} each
                            {item.sku && ` • SKU: ${item.sku}`}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="text-red-600">-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  {selectedOrder.tip && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tip:</span>
                      <span className="text-green-600">${selectedOrder.tip.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-lg">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                {selectedOrder.paymentMethods && selectedOrder.paymentMethods.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Payment Methods</h4>
                      <div className="space-y-2">
                        {selectedOrder.paymentMethods.map((payment, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="capitalize">{payment.method}:</span>
                            <span className="font-medium">${payment.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground">Order Notes</Label>
                      <p className="text-sm mt-1">{selectedOrder.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => handleReprintReceipt(selectedOrder)}>
                <Printer className="w-4 h-4 mr-2" />
                Reprint Receipt
              </Button>
              {selectedOrder.status === 'paid' && !selectedOrder.isTrainingMode && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleProcessReturn(selectedOrder);
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Process Return
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Return</DialogTitle>
            <DialogDescription>
              Process a return for order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Total:</span>
                  <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{selectedOrder.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(selectedOrder.dateCreated).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  This will create a return transaction and refund the customer. 
                  The items will be added back to inventory.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReturn} className="bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-[var(--orange-foreground)]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Process Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        title={`Export ${exportType === 'orders' ? 'Orders' : 'Order Items'}`}
        description={`Export ${filteredOrders.length} ${exportType === 'orders' ? 'orders' : 'order items'} to CSV, Excel, or JSON format`}
        availableFields={getExportFields()}
        defaultFilename={`orders_${new Date().toISOString().split('T')[0]}`}
        enableDateRange={true}
      />
    </div>
  );
}