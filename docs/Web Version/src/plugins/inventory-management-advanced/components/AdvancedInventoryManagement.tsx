import React, { useState, useMemo } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Progress } from '../../../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Truck,
  ClipboardCheck,
  Calendar,
  DollarSign,
  BarChart3,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  FileText,
  Users,
  ArrowUpDown,
  Activity,
  Zap,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { format, subDays, addDays } from 'date-fns';

type StockStatus = 'in-stock' | 'low-stock' | 'critical' | 'out-of-stock' | 'overstock';
type POStatus = 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  status: StockStatus;
  lastOrdered?: Date;
  expirationDate?: Date;
  vendorId?: string;
  vendorName?: string;
  leadTimeDays?: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  status: POStatus;
  items: number;
  total: number;
  orderDate: Date;
  expectedDelivery?: Date;
  receivedDate?: Date;
}

interface Vendor {
  id: string;
  name: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  paymentTerms: string;
  leadTimeDays: number;
  totalOrders: number;
  totalSpend: number;
  onTimeDeliveryRate: number;
}

export function AdvancedInventoryManagement() {
  const { inventory, products } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showAddPODialog, setShowAddPODialog] = useState(false);
  const [showStockTakeDialog, setShowStockTakeDialog] = useState(false);

  // Mock data - would come from database in production
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      productId: 'p1',
      productName: 'Espresso Beans',
      sku: 'COF-ESP-001',
      category: 'Coffee',
      currentStock: 8,
      reorderPoint: 15,
      reorderQuantity: 50,
      maxStock: 100,
      unitCost: 12.50,
      totalValue: 100,
      status: 'critical',
      vendorId: 'v1',
      vendorName: 'Premium Coffee Co.',
      leadTimeDays: 3,
      expirationDate: addDays(new Date(), 45)
    },
    {
      id: '2',
      productId: 'p2',
      productName: 'Whole Milk',
      sku: 'DRY-MLK-001',
      category: 'Dairy',
      currentStock: 35,
      reorderPoint: 20,
      reorderQuantity: 40,
      maxStock: 80,
      unitCost: 3.25,
      totalValue: 113.75,
      status: 'in-stock',
      vendorId: 'v2',
      vendorName: 'Fresh Dairy LLC',
      leadTimeDays: 1,
      expirationDate: addDays(new Date(), 7)
    },
    {
      id: '3',
      productId: 'p3',
      productName: 'Sugar (Bulk)',
      sku: 'SWE-SUG-001',
      category: 'Ingredients',
      currentStock: 250,
      reorderPoint: 50,
      reorderQuantity: 100,
      maxStock: 200,
      unitCost: 0.45,
      totalValue: 112.50,
      status: 'overstock',
      vendorId: 'v3',
      vendorName: 'Bulk Supplies Inc.',
      leadTimeDays: 7
    },
    {
      id: '4',
      productId: 'p4',
      productName: 'Vanilla Syrup',
      sku: 'SYR-VAN-001',
      category: 'Syrups',
      currentStock: 0,
      reorderPoint: 10,
      reorderQuantity: 24,
      maxStock: 48,
      unitCost: 5.75,
      totalValue: 0,
      status: 'out-of-stock',
      vendorId: 'v1',
      vendorName: 'Premium Coffee Co.',
      leadTimeDays: 3
    },
    {
      id: '5',
      productId: 'p5',
      productName: 'Paper Cups (12oz)',
      sku: 'SUP-CUP-012',
      category: 'Supplies',
      currentStock: 12,
      reorderPoint: 20,
      reorderQuantity: 100,
      maxStock: 200,
      unitCost: 0.15,
      totalValue: 1.80,
      status: 'low-stock',
      vendorId: 'v4',
      vendorName: 'Packaging Pro',
      leadTimeDays: 5
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po1',
      poNumber: 'PO-2024-001',
      vendor: 'Premium Coffee Co.',
      status: 'approved',
      items: 3,
      total: 1250.00,
      orderDate: subDays(new Date(), 2),
      expectedDelivery: addDays(new Date(), 1)
    },
    {
      id: 'po2',
      poNumber: 'PO-2024-002',
      vendor: 'Fresh Dairy LLC',
      status: 'pending',
      items: 2,
      total: 340.00,
      orderDate: subDays(new Date(), 1),
      expectedDelivery: addDays(new Date(), 2)
    },
    {
      id: 'po3',
      poNumber: 'PO-2024-003',
      vendor: 'Packaging Pro',
      status: 'received',
      items: 4,
      total: 850.00,
      orderDate: subDays(new Date(), 10),
      expectedDelivery: subDays(new Date(), 3),
      receivedDate: subDays(new Date(), 3)
    }
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 'v1',
      name: 'Premium Coffee Co.',
      code: 'VEN-001',
      contact: 'John Smith',
      email: 'orders@premiumcoffee.com',
      phone: '(555) 123-4567',
      paymentTerms: 'Net 30',
      leadTimeDays: 3,
      totalOrders: 24,
      totalSpend: 28500,
      onTimeDeliveryRate: 95
    },
    {
      id: 'v2',
      name: 'Fresh Dairy LLC',
      code: 'VEN-002',
      contact: 'Sarah Johnson',
      email: 'sales@freshdairy.com',
      phone: '(555) 234-5678',
      paymentTerms: 'Net 15',
      leadTimeDays: 1,
      totalOrders: 52,
      totalSpend: 12400,
      onTimeDeliveryRate: 98
    },
    {
      id: 'v3',
      name: 'Bulk Supplies Inc.',
      code: 'VEN-003',
      contact: 'Mike Davis',
      email: 'info@bulksupplies.com',
      phone: '(555) 345-6789',
      paymentTerms: 'Net 30',
      leadTimeDays: 7,
      totalOrders: 18,
      totalSpend: 8900,
      onTimeDeliveryRate: 88
    },
    {
      id: 'v4',
      name: 'Packaging Pro',
      code: 'VEN-004',
      contact: 'Lisa Chen',
      email: 'orders@packagingpro.com',
      phone: '(555) 456-7890',
      paymentTerms: 'COD',
      leadTimeDays: 5,
      totalOrders: 15,
      totalSpend: 6200,
      onTimeDeliveryRate: 92
    }
  ]);

  // Filter inventory items
  const filteredInventory = useMemo(() => {
    let filtered = inventoryItems;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'stock':
          return b.currentStock - a.currentStock;
        case 'value':
          return b.totalValue - a.totalValue;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [inventoryItems, searchQuery, filterStatus, sortBy]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalItems = inventoryItems.length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = inventoryItems.filter(item => 
      item.status === 'low-stock' || item.status === 'critical' || item.status === 'out-of-stock'
    ).length;
    const overstockItems = inventoryItems.filter(item => item.status === 'overstock').length;
    const needsReorder = inventoryItems.filter(item => 
      item.currentStock <= item.reorderPoint
    ).length;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      overstockItems,
      needsReorder,
      healthScore: ((totalItems - lowStockItems - overstockItems) / totalItems) * 100
    };
  }, [inventoryItems]);

  // Stock status distribution
  const stockStatusDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    inventoryItems.forEach(item => {
      distribution[item.status] = (distribution[item.status] || 0) + 1;
    });

    return Object.entries(distribution).map(([status, count]) => ({
      name: status.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      value: count,
      status
    }));
  }, [inventoryItems]);

  // Inventory value by category
  const valueByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};
    inventoryItems.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + item.totalValue;
    });

    return Object.entries(categories)
      .map(([category, value]) => ({
        category,
        value: parseFloat(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value);
  }, [inventoryItems]);

  // Recent purchase orders
  const recentPOs = useMemo(() => {
    return purchaseOrders
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
      .slice(0, 5);
  }, [purchaseOrders]);

  // Vendor performance
  const topVendors = useMemo(() => {
    return vendors
      .sort((a, b) => b.onTimeDeliveryRate - a.onTimeDeliveryRate)
      .slice(0, 5);
  }, [vendors]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const getStatusBadge = (status: StockStatus) => {
    const config = {
      'in-stock': { label: 'In Stock', variant: 'default' as const, color: 'text-green-500' },
      'low-stock': { label: 'Low Stock', variant: 'secondary' as const, color: 'text-yellow-500' },
      'critical': { label: 'Critical', variant: 'destructive' as const, color: 'text-red-500' },
      'out-of-stock': { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-red-500' },
      'overstock': { label: 'Overstock', variant: 'outline' as const, color: 'text-blue-500' }
    };

    const { label, variant, color } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPOStatusBadge = (status: POStatus) => {
    const config = {
      'draft': { label: 'Draft', variant: 'outline' as const },
      'pending': { label: 'Pending', variant: 'secondary' as const },
      'approved': { label: 'Approved', variant: 'default' as const },
      'ordered': { label: 'Ordered', variant: 'default' as const },
      'received': { label: 'Received', variant: 'default' as const },
      'cancelled': { label: 'Cancelled', variant: 'destructive' as const }
    };

    const { label, variant } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStockLevel = (item: InventoryItem) => {
    if (item.maxStock === 0) return 0;
    return (item.currentStock / item.maxStock) * 100;
  };

  const handleCreatePO = () => {
    setShowAddPODialog(true);
  };

  const handleStockTake = () => {
    setShowStockTakeDialog(true);
  };

  const handleReorderItem = (item: InventoryItem) => {
    toast.success(`Creating purchase order for ${item.productName}`);
    // Would create PO in production
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Package className="w-8 h-8" />
            Advanced Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive inventory control, purchase orders, and vendor management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleStockTake}>
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Stock Take
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleCreatePO}>
            <Plus className="w-4 h-4 mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Inventory Value</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${summaryMetrics.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.totalItems} unique items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Low Stock Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Needs Reorder</CardTitle>
            <ShoppingCart className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.needsReorder}</div>
            <p className="text-xs text-muted-foreground">
              Below reorder point
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Inventory Health</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.healthScore.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall health score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="overstock">Overstock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">
            Inventory ({filteredInventory.length})
          </TabsTrigger>
          <TabsTrigger value="purchase-orders">
            Purchase Orders ({purchaseOrders.length})
          </TabsTrigger>
          <TabsTrigger value="vendors">
            Vendors ({vendors.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Stock Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Status Distribution</CardTitle>
                <CardDescription>Inventory health breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockStatusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inventory Value by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Value by Category</CardTitle>
                <CardDescription>Inventory value distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="category" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {inventoryItems
                      .filter(item => item.status === 'critical' || item.status === 'out-of-stock' || item.status === 'low-stock')
                      .sort((a, b) => {
                        const statusPriority = { 'out-of-stock': 0, 'critical': 1, 'low-stock': 2 };
                        return statusPriority[a.status as keyof typeof statusPriority] - statusPriority[b.status as keyof typeof statusPriority];
                      })
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className={`w-5 h-5 ${
                              item.status === 'out-of-stock' ? 'text-red-500' :
                              item.status === 'critical' ? 'text-red-400' :
                              'text-yellow-500'
                            }`} />
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.sku} • {item.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Current Stock</p>
                              <p className="font-mono">{item.currentStock} / {item.reorderPoint}</p>
                            </div>
                            {getStatusBadge(item.status)}
                            <Button size="sm" onClick={() => handleReorderItem(item)}>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-mono">{item.currentStock}</TableCell>
                        <TableCell className="font-mono">{item.reorderPoint}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={getStockLevel(item)} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {getStockLevel(item).toFixed(0)}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">${item.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${item.totalValue.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">{item.vendorName || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {item.currentStock <= item.reorderPoint && (
                              <Button variant="ghost" size="sm" onClick={() => handleReorderItem(item)}>
                                <ShoppingCart className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Track and manage purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {recentPOs.map(po => (
                    <div key={po.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{po.poNumber}</p>
                          <p className="text-sm text-muted-foreground">{po.vendor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="text-sm">{format(po.orderDate, 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Expected</p>
                          <p className="text-sm">
                            {po.expectedDelivery ? format(po.expectedDelivery, 'MMM dd, yyyy') : '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p className="font-mono">{po.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-mono">${po.total.toLocaleString()}</p>
                        </div>
                        {getPOStatusBadge(po.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance</CardTitle>
              <CardDescription>Track supplier reliability and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {topVendors.map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                          {index + 1}
                        </Badge>
                        <Truck className="w-6 h-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {vendor.code} • {vendor.contact}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Orders</p>
                          <p className="font-mono">{vendor.totalOrders}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Spend</p>
                          <p className="font-mono">${vendor.totalSpend.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Lead Time</p>
                          <p className="font-mono">{vendor.leadTimeDays} days</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">On-Time Rate</p>
                          <div className="flex items-center gap-2">
                            <Progress value={vendor.onTimeDeliveryRate} className="w-20 h-2" />
                            <span className="font-mono text-sm">{vendor.onTimeDeliveryRate}%</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Advanced Analytics Coming Soon</p>
            <p className="text-sm">Inventory turnover, ABC analysis, and trend forecasting</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create PO Dialog */}
      <Dialog open={showAddPODialog} onOpenChange={setShowAddPODialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Generate a new purchase order for inventory replenishment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Purchase order creation form coming soon</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Take Dialog */}
      <Dialog open={showStockTakeDialog} onOpenChange={setShowStockTakeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conduct Stock Take</DialogTitle>
            <DialogDescription>
              Physical inventory count and variance tracking
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Stock take interface coming soon</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
