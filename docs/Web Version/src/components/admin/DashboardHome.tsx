import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useStore } from '../../lib/store';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertCircle,
  UserCircle,
  Mail,
  Phone,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';

export function DashboardHome() {
  const products = useStore((state) => state.products);
  const recentOrders = useStore((state) => state.recentOrders);
  const currentShift = useStore((state) => state.currentShift);

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const lowStockProducts = products.filter(
    (p) => p.inStock && p.stockQuantity < 10
  ).length;
  const outOfStockProducts = products.filter((p) => !p.inStock).length;

  const todaysSales = recentOrders.reduce((sum, order) => sum + order.total, 0);
  const todaysOrders = recentOrders.length;

  const stats = [
    {
      title: "Today's Sales",
      value: `$${todaysSales.toFixed(2)}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-success',
    },
    {
      title: "Today's Orders",
      value: todaysOrders.toString(),
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-info',
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: `${inStockProducts} in stock`,
      icon: Package,
      color: 'text-purple-500',
    },
    {
      title: 'Active Users',
      value: currentShift ? '1' : '0',
      change: currentShift ? 'Shift open' : 'No active shift',
      icon: Users,
      color: 'text-orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-medium mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions from POS</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No orders yet today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} items • {order.paymentMethods[0]?.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Out of Stock */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                  <Badge variant="destructive">{outOfStockProducts}</Badge>
                </div>
                {outOfStockProducts > 0 && (
                  <p className="text-xs text-muted-foreground ml-6">
                    Immediate restocking required
                  </p>
                )}
              </div>

              <Separator />

              {/* Low Stock */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">Low Stock</span>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {lowStockProducts}
                  </Badge>
                </div>
                {lowStockProducts > 0 && (
                  <p className="text-xs text-muted-foreground ml-6">
                    Below 10 units
                  </p>
                )}
              </div>

              <Separator />

              {/* Stock Health */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stock Health</span>
                  <span className="text-sm text-muted-foreground">
                    {inStockProducts}/{totalProducts}
                  </span>
                </div>
                <Progress
                  value={(inStockProducts / totalProducts) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <TopCustomersCard />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <Package className="w-5 h-5 mb-2 text-primary" />
              <p className="font-medium text-sm">Add Product</p>
              <p className="text-xs text-muted-foreground">Create new item</p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <Users className="w-5 h-5 mb-2 text-primary" />
              <p className="font-medium text-sm">Add User</p>
              <p className="text-xs text-muted-foreground">Create staff account</p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <TrendingUp className="w-5 h-5 mb-2 text-primary" />
              <p className="font-medium text-sm">View Reports</p>
              <p className="text-xs text-muted-foreground">Sales analytics</p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <ShoppingCart className="w-5 h-5 mb-2 text-primary" />
              <p className="font-medium text-sm">Back to POS</p>
              <p className="text-xs text-muted-foreground">Return to cashier</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TopCustomersCard() {
  const customers = useStore((state) => state.customers);

  // Get top 5 customers by total spent
  const topCustomers = [...customers]
    .filter((c) => c.totalSpent && c.totalSpent > 0)
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, 5);

  if (topCustomers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Customers with highest lifetime value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">#{index + 1}</span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm">
                  {customer.firstName[0]}
                  {customer.lastName[0]}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{customer.name}</p>
                  {customer.tags && customer.tags.includes('VIP') && (
                    <Badge variant="default" className="text-xs">VIP</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="font-medium text-green-600">
                  ${(customer.totalSpent || 0).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {customer.visitCount || 0} visits
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}