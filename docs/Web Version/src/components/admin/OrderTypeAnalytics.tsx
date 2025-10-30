import { useMemo } from 'react';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { OrderType } from '../../lib/types';

export function OrderTypeAnalytics() {
  const currentShift = useStore(state => state.currentShift);
  const recentOrders = useStore(state => state.recentOrders);
  const getOrderTypeLabel = useStore(state => state.getOrderTypeLabel);
  const getEnabledOrderTypes = useStore(state => state.getEnabledOrderTypes);
  
  // Combine shift orders and recent orders
  const allOrders = useMemo(() => {
    return [
      ...(currentShift?.orders || []),
      ...recentOrders,
    ].filter(order => 
      order.status === 'paid' && 
      !order.isTrainingMode &&
      order.orderType
    );
  }, [currentShift, recentOrders]);
  
  const enabledTypes = getEnabledOrderTypes();
  
  // Calculate analytics by order type
  const orderTypeStats = useMemo(() => {
    const stats: Record<OrderType, {
      count: number;
      revenue: number;
      itemsSold: number;
      averageOrderValue: number;
    }> = {} as any;
    
    // Initialize stats for all enabled order types
    enabledTypes.forEach(type => {
      stats[type.id] = {
        count: 0,
        revenue: 0,
        itemsSold: 0,
        averageOrderValue: 0,
      };
    });
    
    // Calculate stats from orders
    allOrders.forEach(order => {
      if (order.orderType && stats[order.orderType]) {
        stats[order.orderType].count++;
        stats[order.orderType].revenue += order.total;
        stats[order.orderType].itemsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    });
    
    // Calculate averages
    Object.keys(stats).forEach(key => {
      const orderType = key as OrderType;
      if (stats[orderType].count > 0) {
        stats[orderType].averageOrderValue = stats[orderType].revenue / stats[orderType].count;
      }
    });
    
    return stats;
  }, [allOrders, enabledTypes]);
  
  // Prepare chart data
  const revenueChartData = useMemo(() => {
    return Object.entries(orderTypeStats).map(([type, stats]) => ({
      name: getOrderTypeLabel(type as OrderType),
      revenue: Number(stats.revenue.toFixed(2)),
      orders: stats.count,
    }));
  }, [orderTypeStats, getOrderTypeLabel]);
  
  const distributionChartData = useMemo(() => {
    return Object.entries(orderTypeStats)
      .filter(([_, stats]) => stats.count > 0)
      .map(([type, stats]) => ({
        name: getOrderTypeLabel(type as OrderType),
        value: stats.count,
      }));
  }, [orderTypeStats, getOrderTypeLabel]);
  
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
  
  // Calculate totals
  const totals = useMemo(() => {
    return Object.values(orderTypeStats).reduce(
      (acc, stats) => ({
        orders: acc.orders + stats.count,
        revenue: acc.revenue + stats.revenue,
        items: acc.items + stats.itemsSold,
      }),
      { orders: 0, revenue: 0, items: 0 }
    );
  }, [orderTypeStats]);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.orders}</div>
            <p className="text-xs text-muted-foreground">
              Across all order types
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totals.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all order types
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.items}</div>
            <p className="text-xs text-muted-foreground">
              Total items across orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totals.orders > 0 ? (totals.revenue / totals.orders).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all types
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Stats by Order Type */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Order Type</CardTitle>
          <CardDescription>Detailed breakdown of each order type's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(orderTypeStats).map(([type, stats]) => {
              const orderType = type as OrderType;
              const percentage = totals.orders > 0 ? (stats.count / totals.orders) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{getOrderTypeLabel(orderType)}</h3>
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-medium">{stats.count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium text-green-600">${stats.revenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Items Sold</p>
                        <p className="font-medium">{stats.itemsSold}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Order</p>
                        <p className="font-medium">${stats.averageOrderValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {totals.orders === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No order data available yet. Complete some orders to see analytics.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Order Type */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Order Type</CardTitle>
            <CardDescription>Compare revenue across different order types</CardDescription>
          </CardHeader>
          <CardContent>
            {totals.orders > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
                  <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Order Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Distribution</CardTitle>
            <CardDescription>Percentage breakdown of orders by type</CardDescription>
          </CardHeader>
          <CardContent>
            {distributionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
