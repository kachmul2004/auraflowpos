import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Filter,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear } from 'date-fns';

type DateRangePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';

interface DateRange {
  start: Date;
  end: Date;
}

interface KPICard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function AnalyticsReportingDashboard() {
  const { currentShift, shifts, products, customers } = useStore();
  const [dateRange, setDateRange] = useState<DateRangePreset>('last7days');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // Get date range
  const getDateRange = (preset: DateRangePreset): DateRange => {
    const now = new Date();
    switch (preset) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'yesterday':
        const yesterday = subDays(now, 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      case 'last7days':
        return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
      case 'last30days':
        return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfDay(now) };
      case 'lastMonth':
        const lastMonth = subDays(startOfMonth(now), 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case 'thisYear':
        return { start: startOfYear(now), end: endOfDay(now) };
      default:
        return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
    }
  };

  const currentDateRange = getDateRange(dateRange);

  // Get all orders from all shifts
  const allOrders = useMemo(() => {
    return shifts.flatMap(shift => shift.orders || []);
  }, [shifts]);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= currentDateRange.start && orderDate <= currentDateRange.end;
    });
  }, [allOrders, currentDateRange]);

  // Calculate KPIs
  const kpis = useMemo((): KPICard[] => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalTransactions = filteredOrders.length;
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const uniqueCustomers = new Set(filteredOrders.map(o => o.customer?.id).filter(Boolean)).size;

    // Calculate previous period for comparison
    const periodDays = Math.ceil((currentDateRange.end.getTime() - currentDateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = subDays(currentDateRange.start, periodDays);
    const previousEnd = subDays(currentDateRange.end, periodDays);
    
    const previousOrders = allOrders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= previousStart && orderDate <= previousEnd;
    });

    const prevRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const prevTransactions = previousOrders.length;
    const prevAvgOrderValue = prevTransactions > 0 ? prevRevenue / prevTransactions : 0;
    const prevCustomers = new Set(previousOrders.map(o => o.customer?.id).filter(Boolean)).size;

    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const transactionsChange = prevTransactions > 0 ? ((totalTransactions - prevTransactions) / prevTransactions) * 100 : 0;
    const aovChange = prevAvgOrderValue > 0 ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100 : 0;
    const customersChange = prevCustomers > 0 ? ((uniqueCustomers - prevCustomers) / prevCustomers) * 100 : 0;

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toFixed(2)}`,
        change: revenueChange,
        trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'neutral',
        icon: DollarSign,
        color: 'text-green-500'
      },
      {
        title: 'Transactions',
        value: totalTransactions,
        change: transactionsChange,
        trend: transactionsChange > 0 ? 'up' : transactionsChange < 0 ? 'down' : 'neutral',
        icon: ShoppingCart,
        color: 'text-blue-500'
      },
      {
        title: 'Avg Order Value',
        value: `$${avgOrderValue.toFixed(2)}`,
        change: aovChange,
        trend: aovChange > 0 ? 'up' : aovChange < 0 ? 'down' : 'neutral',
        icon: Target,
        color: 'text-purple-500'
      },
      {
        title: 'Customers',
        value: uniqueCustomers,
        change: customersChange,
        trend: customersChange > 0 ? 'up' : customersChange < 0 ? 'down' : 'neutral',
        icon: Users,
        color: 'text-orange-500'
      }
    ];
  }, [filteredOrders, allOrders, currentDateRange]);

  // Sales by day
  const salesByDay = useMemo(() => {
    const days = Math.ceil((currentDateRange.end.getTime() - currentDateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(currentDateRange.end, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      const transactions = dayOrders.length;

      data.push({
        date: format(date, 'MMM dd'),
        revenue: parseFloat(revenue.toFixed(2)),
        transactions,
        avgOrder: transactions > 0 ? parseFloat((revenue / transactions).toFixed(2)) : 0
      });
    }

    return data;
  }, [filteredOrders, currentDateRange]);

  // Sales by hour
  const salesByHour = useMemo(() => {
    const hourData: { [hour: number]: { revenue: number; count: number } } = {};

    filteredOrders.forEach(order => {
      const hour = new Date(order.timestamp).getHours();
      if (!hourData[hour]) {
        hourData[hour] = { revenue: 0, count: 0 };
      }
      hourData[hour].revenue += order.total;
      hourData[hour].count += 1;
    });

    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      revenue: hourData[hour]?.revenue || 0,
      transactions: hourData[hour]?.count || 0
    }));
  }, [filteredOrders]);

  // Top products
  const topProducts = useMemo(() => {
    const productSales: { [id: string]: { name: string; quantity: number; revenue: number } } = {};

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  // Payment method breakdown
  const paymentMethodBreakdown = useMemo(() => {
    const methods: { [key: string]: number } = {};

    filteredOrders.forEach(order => {
      order.paymentMethods?.forEach(pm => {
        if (!methods[pm.method]) {
          methods[pm.method] = 0;
        }
        methods[pm.method] += pm.amount;
      });
    });

    return Object.entries(methods).map(([method, amount]) => ({
      method: method.charAt(0).toUpperCase() + method.slice(1),
      amount: parseFloat(amount.toFixed(2))
    }));
  }, [filteredOrders]);

  // Chart colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLastRefresh(new Date());
    toast.success('Analytics refreshed');
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Analytics & Reporting
          </h1>
          <p className="text-muted-foreground">
            Real-time business intelligence and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={autoRefresh}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRangePreset)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Last updated: {format(lastRefresh, 'HH:mm:ss')}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${autoRefresh ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span className="text-sm">
                Auto-refresh: {autoRefresh ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{kpi.title}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">{kpi.value}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(kpi.trend)}`}>
                  {getTrendIcon(kpi.trend)}
                  <span>{Math.abs(kpi.change).toFixed(1)}%</span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesByDay}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transactions Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Number of transactions per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="transactions" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Revenue breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.method}: $${entry.amount}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {paymentMethodBreakdown.map((entry, index) => (
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

            {/* Sales by Hour */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Hour</CardTitle>
                <CardDescription>Peak business hours analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="hour" stroke="#888" interval={2} />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="transactions" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Performance</CardTitle>
              <CardDescription>Revenue and average order value trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgOrder"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Avg Order ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Products</CardTitle>
              <CardDescription>Best performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p>{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">${product.revenue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(product.revenue / product.quantity).toFixed(2)} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Customers</CardTitle>
                <Users className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{customers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Registered customer accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Active Customers</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {new Set(filteredOrders.map(o => o.customer?.id).filter(Boolean)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Purchased in selected period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Retention Rate</CardTitle>
                <Award className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {customers.length > 0
                    ? ((new Set(filteredOrders.map(o => o.customer?.id).filter(Boolean)).size / customers.length) * 100).toFixed(1)
                    : '0'}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Customer engagement rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Coming soon: Customer segmentation and behavior analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Advanced customer analytics will be available soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Hours Performance</CardTitle>
                <CardDescription>Revenue distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="hour" stroke="#888" interval={2} />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Shifts</span>
                    <span className="font-mono">{shifts.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Products</span>
                    <span className="font-mono">{products.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Items per Transaction</span>
                    <span className="font-mono">
                      {filteredOrders.length > 0
                        ? (filteredOrders.reduce((sum, o) => sum + o.items.length, 0) / filteredOrders.length).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue per Hour</span>
                    <span className="font-mono">
                      ${filteredOrders.length > 0
                        ? ((filteredOrders.reduce((sum, o) => sum + o.total, 0) / (salesByHour.filter(h => h.transactions > 0).length || 1))).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
