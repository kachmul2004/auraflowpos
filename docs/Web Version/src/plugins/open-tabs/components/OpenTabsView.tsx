import React, { useState, useMemo } from 'react';
import { useStore } from '../../../lib/store';
import { Order } from '../../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { 
  UtensilsCrossed, 
  Clock, 
  DollarSign,
  User,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  SortAsc,
  SortDesc,
  TrendingUp,
  Users,
  Receipt,
  AlertCircle,
  ChefHat
} from 'lucide-react';
import { ReceiptDialog } from '../../../components/ReceiptDialog';
import { toast } from 'sonner@2.0.3';

type SortField = 'orderNumber' | 'time' | 'total' | 'table';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | 'pending' | 'new' | 'preparing' | 'ready';
type FilterType = 'all' | 'dine-in' | 'takeout' | 'delivery';

export function OpenTabsView() {
  const { currentShift, tables, getTableOrders, updateOrderKitchenStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Get all open tabs (orders with status 'pending' or dine-in orders still at tables)
  const openOrders = currentShift?.orders.filter(order => 
    order.status === 'pending' || 
    (order.status === 'paid' && order.orderType === 'dine-in' && order.kitchenStatus !== 'served')
  ) || [];
  
  // Get occupied tables with their orders
  const occupiedTables = tables
    .filter(table => table.status === 'occupied')
    .map(table => ({
      ...table,
      orders: getTableOrders(table.id),
    }));
  
  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = openOrders.length;
    const totalRevenue = openOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = openOrders.filter(o => o.status === 'pending').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Longest wait time
    const oldestOrder = openOrders.length > 0 
      ? openOrders.reduce((oldest, order) => {
          const orderTime = new Date(order.dateCreated).getTime();
          const oldestTime = new Date(oldest.dateCreated).getTime();
          return orderTime < oldestTime ? order : oldest;
        })
      : null;
    
    const longestWait = oldestOrder 
      ? Math.floor((Date.now() - new Date(oldestOrder.dateCreated).getTime()) / 60000)
      : 0;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      averageOrderValue,
      longestWait,
      occupiedTables: occupiedTables.length,
    };
  }, [openOrders, occupiedTables]);
  
  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = openOrders;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const table = tables.find(t => t.id === order.tableId);
        return (
          order.orderNumber.toString().includes(query) ||
          table?.name.toLowerCase().includes(query) ||
          order.serverId?.toLowerCase().includes(query) ||
          order.customer?.name.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        filtered = filtered.filter(o => o.status === 'pending');
      } else {
        filtered = filtered.filter(o => o.kitchenStatus === filterStatus);
      }
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(o => o.orderType === filterType);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'orderNumber':
          comparison = a.orderNumber - b.orderNumber;
          break;
        case 'time':
          comparison = new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'table':
          const tableA = tables.find(t => t.id === a.tableId);
          const tableB = tables.find(t => t.id === b.tableId);
          comparison = (tableA?.number || 0) - (tableB?.number || 0);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [openOrders, searchQuery, filterStatus, filterType, sortField, sortDirection, tables]);
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };
  
  const handleMarkReady = (order: Order) => {
    if (order.id) {
      updateOrderKitchenStatus(order.id, 'ready');
      toast.success(`Order #${order.orderNumber} marked as ready`);
    }
  };
  
  const handleMarkServed = (order: Order) => {
    if (order.id) {
      updateOrderKitchenStatus(order.id, 'served');
      toast.success(`Order #${order.orderNumber} marked as served`);
    }
  };
  
  const getElapsedTime = (order: Order) => {
    const elapsed = Date.now() - new Date(order.dateCreated).getTime();
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  const getStatusBadge = (order: Order) => {
    if (order.status === 'pending') {
      return <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 border-amber-500/50">Pending Payment</Badge>;
    }
    
    switch (order.kitchenStatus) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500">New Order</Badge>;
      case 'preparing':
        return <Badge variant="default" className="bg-orange-500">Preparing</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-green-500">Ready</Badge>;
      default:
        return <Badge variant="outline">Active</Badge>;
    }
  };
  
  const getPriorityColor = (order: Order) => {
    const elapsed = Date.now() - new Date(order.dateCreated).getTime();
    const minutes = Math.floor(elapsed / 60000);
    
    if (minutes > 30) return 'border-red-500 bg-red-500/10';
    if (minutes > 20) return 'border-orange-500 bg-orange-500/10';
    if (minutes > 10) return 'border-amber-500 bg-amber-500/10';
    return '';
  };
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const OrderCard = ({ order }: { order: Order }) => {
    const table = tables.find(t => t.id === order.tableId);
    const elapsed = getElapsedTime(order);
    const priorityClass = getPriorityColor(order);
    
    return (
      <Card className={`${priorityClass} border-2 transition-all hover:shadow-lg`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                #{order.orderNumber}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {table && (
                  <Badge variant="outline">
                    {table.name}
                  </Badge>
                )}
                {order.orderType && (
                  <Badge variant="secondary">
                    {order.orderType}
                  </Badge>
                )}
              </div>
            </div>
            {getStatusBadge(order)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Info */}
          <div className="space-y-2">
            {order.serverId && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Server:</span>
                <span>{order.serverId}</span>
              </div>
            )}
            
            {order.customer && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Customer:</span>
                <span>{order.customer.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Open for:</span>
              <span className="font-medium">{elapsed}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Items Summary */}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="font-medium">{item.quantity}x</span>
                  <span className="truncate flex-1">{item.name}</span>
                  {item.course && (
                    <Badge variant="outline" className="text-xs">
                      {item.course}
                    </Badge>
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{order.items.length - 3} more...
                </p>
              )}
            </div>
          </div>
          
          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded-md border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {order.notes}
                </p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewOrder(order)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            {order.status === 'pending' ? (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Pay
              </Button>
            ) : order.kitchenStatus === 'preparing' ? (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleMarkReady(order)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Ready
              </Button>
            ) : order.kitchenStatus === 'ready' ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkServed(order)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Served
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl tracking-tight">Open Tabs</h2>
          <p className="text-muted-foreground">
            Manage all active orders and table assignments
          </p>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupied Tables</p>
                <p className="text-2xl font-bold">{stats.occupiedTables}</p>
              </div>
              <UtensilsCrossed className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Longest Wait</p>
                <p className="text-2xl font-bold">{stats.longestWait}m</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order #, table, server, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending Payment</SelectItem>
            <SelectItem value="new">New Order</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <ChefHat className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="dine-in">Dine-in</SelectItem>
            <SelectItem value="takeout">Takeout</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleSort('time')}
            className={sortField === 'time' ? 'bg-accent' : ''}
          >
            {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Quick Sort Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={sortField === 'orderNumber' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('orderNumber')}
        >
          Order #
          {sortField === 'orderNumber' && (
            sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </Button>
        <Button
          variant={sortField === 'time' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('time')}
        >
          Time
          {sortField === 'time' && (
            sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </Button>
        <Button
          variant={sortField === 'total' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('total')}
        >
          Amount
          {sortField === 'total' && (
            sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </Button>
        <Button
          variant={sortField === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('table')}
        >
          Table
          {sortField === 'table' && (
            sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </Button>
      </div>
      
      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-center">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? 'No orders match your filters'
                : 'No open tabs at the moment'}
            </p>
            {(searchQuery || filterStatus !== 'all' || filterType !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterType('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Table Overview Section */}
      {occupiedTables.length > 0 && (
        <>
          <Separator className="my-8" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Table Overview</h3>
              <Badge variant="outline" className="px-3 py-1">
                <Users className="h-4 w-4 mr-2" />
                {occupiedTables.length} Occupied
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {occupiedTables.map((table) => {
                const totalAmount = table.orders.reduce((sum, order) => sum + order.total, 0);
                
                return (
                  <Card key={table.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{table.name}</span>
                          <Badge variant="default" className="text-xs bg-red-500">
                            {table.orders.length}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {table.server && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="truncate text-xs">{table.server}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 font-medium">
                            <DollarSign className="h-3 w-3" />
                            <span className="text-xs">${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
      
      {/* Receipt Dialog */}
      {selectedOrder && (
        <ReceiptDialog
          open={showReceipt}
          onOpenChange={setShowReceipt}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
