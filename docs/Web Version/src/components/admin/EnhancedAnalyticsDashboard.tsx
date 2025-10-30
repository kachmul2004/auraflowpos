import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { toast } from 'sonner@2.0.3';

// Sample data generators
const generateRevenueData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    revenue: Math.floor(Math.random() * 3000) + 1500,
    previousWeek: Math.floor(Math.random() * 2800) + 1400,
    orders: Math.floor(Math.random() * 80) + 40,
  }));
};

const generateHourlyData = () => {
  const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
  return hours.map((hour) => ({
    hour,
    sales: Math.floor(Math.random() * 500) + 100,
    orders: Math.floor(Math.random() * 30) + 10,
  }));
};

const generateTopProducts = (products: any[]) => {
  const productSales = products.slice(0, 8).map((product, index) => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    sales: Math.floor(Math.random() * 150) + 50,
    revenue: Math.floor(Math.random() * 800) + 200,
  }));
  return productSales.sort((a, b) => b.revenue - a.revenue);
};

const generateCategoryData = () => {
  return [
    { name: 'Beverages', value: 3245, color: '#3b82f6' },
    { name: 'Food', value: 2856, color: '#10b981' },
    { name: 'Desserts', value: 1654, color: '#f59e0b' },
    { name: 'Merchandise', value: 987, color: '#8b5cf6' },
    { name: 'Other', value: 456, color: '#6b7280' },
  ];
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function EnhancedAnalyticsDashboard() {
  const products = useStore((state) => state.products);
  const recentOrders = useStore((state) => state.recentOrders);
  
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [compareMode, setCompareMode] = useState<'previous' | 'none'>('previous');

  // Generate data
  const revenueData = useMemo(() => generateRevenueData(), [timeRange]);
  const hourlyData = useMemo(() => generateHourlyData(), []);
  const topProducts = useMemo(() => generateTopProducts(products), [products]);
  const categoryData = useMemo(() => generateCategoryData(), []);

  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const previousRevenue = revenueData.reduce((sum, day) => sum + day.previousWeek, 0);
  const revenueChange = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
  const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // Goals
  const revenueGoal = 20000;
  const ordersGoal = 500;
  const revenueProgress = (totalRevenue / revenueGoal) * 100;
  const ordersProgress = (totalOrders / ordersGoal) * 100;

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting analytics to ${type.toUpperCase()}...`, {
      description: 'Your file will download shortly.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your business performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {revenueChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-xs ${
                  revenueChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {Math.abs(revenueChange).toFixed(1)}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {(totalOrders / 7).toFixed(1)} orders/day
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: $50.00
            </p>
          </CardContent>
        </Card>

        {/* Products Sold */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders * 2.5}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {2.5} items/order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Revenue Goal
            </CardTitle>
            <CardDescription>
              Track progress towards weekly revenue target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  / ${revenueGoal.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{revenueProgress.toFixed(1)}%</span>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                  />
                </div>
              </div>
              {revenueProgress >= 100 ? (
                <Badge className="bg-emerald-600 dark:bg-emerald-600">🎉 Goal Achieved!</Badge>
              ) : (
                <p className="text-xs text-muted-foreground">
                  ${(revenueGoal - totalRevenue).toLocaleString()} remaining to goal
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Orders Goal
            </CardTitle>
            <CardDescription>
              Track progress towards weekly order target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalOrders}</span>
                <span className="text-muted-foreground">/ {ordersGoal}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{ordersProgress.toFixed(1)}%</span>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${Math.min(ordersProgress, 100)}%` }}
                  />
                </div>
              </div>
              {ordersProgress >= 100 ? (
                <Badge className="bg-blue-600 dark:bg-blue-600">🎉 Goal Achieved!</Badge>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {ordersGoal - totalOrders} more orders to goal
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Sales</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Revenue Trends Chart */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Daily revenue comparison</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`$${value}`, '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="This Week"
                  />
                  {compareMode === 'previous' && (
                    <Line
                      type="monotone"
                      dataKey="previousWeek"
                      stroke="#6b7280"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#6b7280', r: 3 }}
                      name="Last Week"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hourly Sales Chart */}
        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hourly Sales Pattern
              </CardTitle>
              <CardDescription>Revenue distribution throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="hour"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`$${value}`, 'Sales']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Peak Hour</div>
                  <div className="font-semibold">12PM - 1PM</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Avg Hourly</div>
                  <div className="font-semibold">$287</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Total Hours</div>
                  <div className="font-semibold">12 hrs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Products Chart */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    type="number"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Breakdown Chart */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`$${value}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Detailed breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => {
                    const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
                    const percentage = (category.value / total) * 100;
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">
                              ${category.value.toLocaleString()}
                            </span>
                            <span className="font-semibold min-w-[45px] text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Revenue</span>
                    <span className="text-2xl font-bold">
                      ${categoryData.reduce((sum, cat) => sum + cat.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <CardDescription>
            Download detailed reports for external analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}