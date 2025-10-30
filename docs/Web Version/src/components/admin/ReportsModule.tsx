import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useStore } from '../../lib/store';
import { OrderTypeAnalytics } from './OrderTypeAnalytics';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Package,
  Users,
  XCircle,
  Receipt,
  Clock,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#A5D8F3', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316'];

export function ReportsModule() {
  const shifts = useStore((state) => state.shifts);
  const getAllTransactions = useStore((state) => state.getAllTransactions);
  const products = useStore((state) => state.products);
  const users = useStore((state) => state.users);
  const [dateRange, setDateRange] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const allTransactions = getAllTransactions();
  
  // Get all orders from all shifts
  const allOrders = shifts.flatMap((shift) => shift.orders);
  const paidOrders = allOrders.filter((order) => order.status === 'paid');
  
  // Calculate key metrics
  const totalSales = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = paidOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const totalItemsSold = paidOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  // Sales by payment method
  const salesByPaymentMethod = allTransactions
    .filter((t) => t.type === 'sale' && t.paymentMethod)
    .reduce((acc: any[], txn) => {
      const existing = acc.find((item) => item.method === txn.paymentMethod);
      if (existing) {
        existing.amount += txn.amount;
        existing.count += 1;
      } else {
        acc.push({
          method: txn.paymentMethod,
          amount: txn.amount,
          count: 1,
        });
      }
      return acc;
    }, []);

  // Sales by category
  const salesByCategory = paidOrders.reduce((acc: any[], order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.product);
      if (product) {
        const existing = acc.find((cat) => cat.category === product.category);
        const itemTotal = item.quantity * item.unitPrice;
        if (existing) {
          existing.value += itemTotal;
          existing.quantity += item.quantity;
        } else {
          acc.push({
            category: product.category,
            value: itemTotal,
            quantity: item.quantity,
          });
        }
      }
    });
    return acc;
  }, []);

  // Top selling products
  const productSales = paidOrders.reduce((acc: any, order) => {
    order.items.forEach((item) => {
      const existing = acc[item.product];
      const itemTotal = item.quantity * item.unitPrice;
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += itemTotal;
      } else {
        acc[item.product] = {
          productId: item.product,
          name: item.name,
          quantity: item.quantity,
          revenue: itemTotal,
        };
      }
    });
    return acc;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 10);

  // Sales by user
  const salesByUser = allTransactions
    .filter((t) => t.type === 'sale')
    .reduce((acc: any[], txn) => {
      const user = users.find((u) => u.id === txn.userId);
      const existing = acc.find((item) => item.userId === txn.userId);
      if (existing) {
        existing.amount += txn.amount;
        existing.count += 1;
      } else {
        acc.push({
          userId: txn.userId,
          userName: user?.name || 'Unknown',
          amount: txn.amount,
          count: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  // Voids and returns
  const voidedOrders = allOrders.filter((o) => o.status === 'voided');
  const returnedOrders = allOrders.filter((o) => o.status === 'returned');
  const voidTransactions = allTransactions.filter((t) => t.type === 'void');
  const returnTransactions = allTransactions.filter((t) => t.type === 'return');

  // Inventory status
  const lowStockProducts = products.filter((p) => p.stockQuantity <= 10);
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stockQuantity,
    0
  );

  // Sales by hour (sample data from existing orders)
  const salesByHour = (() => {
    const hourlyData: any = {};
    paidOrders.forEach((order) => {
      const hour = new Date(order.dateCreated).getHours();
      const hourLabel = `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`;
      if (hourlyData[hourLabel]) {
        hourlyData[hourLabel] += order.total;
      } else {
        hourlyData[hourLabel] = order.total;
      }
    });
    return Object.entries(hourlyData)
      .map(([hour, sales]) => ({ hour, sales }))
      .sort((a: any, b: any) => {
        const hourA = parseInt(a.hour);
        const hourB = parseInt(b.hour);
        return hourA - hourB;
      });
  })();

  // Shift performance columns
  const shiftColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'Shift ID',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    },
    {
      accessorKey: 'userName',
      header: 'User',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
    },
    {
      accessorKey: 'orders',
      header: 'Orders',
      cell: ({ row }) => <span className="text-center">{row.original.orders}</span>,
    },
    {
      accessorKey: 'sales',
      header: 'Total Sales',
      cell: ({ row }) => (
        <span className="font-medium text-green-600">${row.original.sales.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'discrepancy',
      header: 'Discrepancy',
      cell: ({ row }) => {
        const disc = row.original.discrepancy;
        return disc !== undefined ? (
          <span className={Math.abs(disc) > 0.01 ? 'text-amber-600' : 'text-green-600'}>
            {disc >= 0 ? '+' : ''}${disc.toFixed(2)}
          </span>
        ) : (
          '-'
        );
      },
    },
  ];

  const shiftData = shifts.map((shift) => {
    const user = users.find((u) => u.id === shift.userId);
    const duration = shift.endTime
      ? Math.round((shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60))
      : 0;
    const sales = shift.transactions
      .filter((t) => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    const cashIn = shift.transactions
      .filter((t) => t.type === 'cashIn')
      .reduce((sum, t) => sum + t.amount, 0);
    const cashOut = shift.transactions
      .filter((t) => t.type === 'cashOut')
      .reduce((sum, t) => sum + t.amount, 0);
    const returns = shift.transactions
      .filter((t) => t.type === 'return')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const expected = shift.openingBalance + sales - returns + cashIn - cashOut;
    const discrepancy = shift.closingBalance !== undefined ? shift.closingBalance - expected : undefined;

    return {
      id: shift.id,
      userName: user?.name || 'Unknown',
      date: new Date(shift.startTime).toLocaleDateString(),
      duration: `${duration}h`,
      orders: shift.orders.length,
      sales,
      discrepancy,
    };
  });

  // Product performance columns
  const productColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'rank',
      header: '#',
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
          {row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty Sold',
      cell: ({ row }) => <span className="font-medium">{row.original.quantity}</span>,
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }) => (
        <span className="font-medium text-green-600">${row.original.revenue.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Receipt className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {voidedOrders.length} voided, {returnedOrders.length} returned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="order-types">Order Types</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="voids">Voids & Returns</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Hour</CardTitle>
                <CardDescription>Revenue distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3C3C40" />
                    <XAxis dataKey="hour" stroke="#7A8C99" />
                    <YAxis stroke="#7A8C99" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121A3B',
                        border: '1px solid #3C3C40',
                      }}
                    />
                    <Bar dataKey="sales" fill="#A5D8F3" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121A3B',
                        border: '1px solid #3C3C40',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Sales breakdown by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesByPaymentMethod.map((pm) => (
                    <div key={pm.method} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <div>
                          <p className="font-medium capitalize">{pm.method}</p>
                          <p className="text-sm text-muted-foreground">{pm.count} transactions</p>
                        </div>
                      </div>
                      <p className="font-medium">${pm.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Units sold by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesByCategory.slice(0, 5).map((cat, idx) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{cat.category}</p>
                          <p className="text-sm text-muted-foreground">{cat.quantity} units</p>
                        </div>
                      </div>
                      <p className="font-medium">${cat.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Order Types Tab */}
        <TabsContent value="order-types" className="space-y-6 mt-6">
          <OrderTypeAnalytics />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing items by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={productColumns} data={topProducts} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shifts Tab */}
        <TabsContent value="shifts" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shift Performance</CardTitle>
              <CardDescription>Detailed shift analysis and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={shiftColumns} data={shiftData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Sales performance by cashier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByUser.map((user, idx) => (
                  <div key={user.userId} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.count} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">${user.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(user.amount / user.count).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <DollarSign className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockProducts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Below 10 units</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <XCircle className="w-4 h-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{outOfStockProducts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Needs restocking</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={product.stockQuantity === 0 ? 'destructive' : 'secondary'}
                          className={
                            product.stockQuantity === 0
                              ? ''
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }
                        >
                          {product.stockQuantity} units
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>All products are well stocked</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voids & Returns Tab */}
        <TabsContent value="voids" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Voided Transactions</CardTitle>
                <CardDescription>Track voided items and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                {voidTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {voidTransactions.map((txn) => {
                      const user = users.find((u) => u.id === txn.userId);
                      return (
                        <div key={txn.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm font-mono">{txn.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(txn.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400">
                              ${Math.abs(txn.amount).toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{txn.note}</p>
                          <p className="text-xs text-muted-foreground mt-1">By: {user?.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <XCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No voids recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Returns</CardTitle>
                <CardDescription>Customer returns and refunds</CardDescription>
              </CardHeader>
              <CardContent>
                {returnTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {returnTransactions.map((txn) => {
                      const user = users.find((u) => u.id === txn.userId);
                      return (
                        <div key={txn.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm font-mono">{txn.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(txn.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              ${Math.abs(txn.amount).toFixed(2)}
                            </Badge>
                          </div>
                          {txn.note && (
                            <p className="text-sm text-muted-foreground">{txn.note}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">By: {user?.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No returns recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}