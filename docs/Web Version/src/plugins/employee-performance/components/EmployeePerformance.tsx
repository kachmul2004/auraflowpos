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
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Award,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Star,
  Trophy,
  Zap,
  Activity,
  BarChart3,
  Search,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Eye
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
type MetricType = 'revenue' | 'transactions' | 'aov' | 'items' | 'upsells';

interface EmployeeMetrics {
  employeeId: string;
  employeeName: string;
  role: string;
  totalSales: number;
  transactionCount: number;
  averageOrderValue: number;
  itemsSold: number;
  itemsPerTransaction: number;
  refunds: number;
  voids: number;
  discountsGiven: number;
  hoursWorked: number;
  salesPerHour: number;
  goals?: {
    salesGoal: number;
    salesActual: number;
    transactionGoal: number;
    transactionActual: number;
  };
}

export function EmployeePerformance() {
  const { users, shifts } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<MetricType>('revenue');

  // Get all orders from shifts
  const allOrders = useMemo(() => {
    return shifts.flatMap(shift => shift.orders || []);
  }, [shifts]);

  // Calculate time range based on period
  const getTimeRange = () => {
    const now = new Date();
    switch (timePeriod) {
      case 'today':
        return { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date() };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'quarter':
        return { start: subDays(now, 90), end: now };
      case 'year':
        return { start: subDays(now, 365), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start: startDate, end: endDate } = getTimeRange();

  // Calculate employee metrics
  const employeeMetrics = useMemo((): EmployeeMetrics[] => {
    return users.map(user => {
      // Get user's shifts in the time period
      const userShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.startTime);
        return (
          shift.userId === user.id &&
          shiftDate >= startDate &&
          shiftDate <= endDate
        );
      });

      // Get user's orders
      const userOrders = allOrders.filter(order => {
        const orderDate = new Date(order.timestamp);
        return (
          order.cashierId === user.id &&
          orderDate >= startDate &&
          orderDate <= endDate
        );
      });

      // Calculate metrics
      const totalSales = userOrders.reduce((sum, order) => sum + order.total, 0);
      const transactionCount = userOrders.length;
      const averageOrderValue = transactionCount > 0 ? totalSales / transactionCount : 0;
      
      const itemsSold = userOrders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);
      
      const itemsPerTransaction = transactionCount > 0 ? itemsSold / transactionCount : 0;
      
      const refunds = userOrders.filter(order => order.type === 'refund').length;
      const voids = userOrders.filter(order => order.void).length;
      const discountsGiven = userOrders.filter(order => order.discountAmount && order.discountAmount > 0).length;

      // Calculate hours worked
      const hoursWorked = userShifts.reduce((sum, shift) => {
        if (shift.endTime) {
          const start = new Date(shift.startTime);
          const end = new Date(shift.endTime);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }
        return sum;
      }, 0);

      const salesPerHour = hoursWorked > 0 ? totalSales / hoursWorked : 0;

      // Mock goals (would come from database in production)
      const goals = {
        salesGoal: 5000,
        salesActual: totalSales,
        transactionGoal: 100,
        transactionActual: transactionCount
      };

      return {
        employeeId: user.id,
        employeeName: user.name,
        role: user.role,
        totalSales,
        transactionCount,
        averageOrderValue,
        itemsSold,
        itemsPerTransaction,
        refunds,
        voids,
        discountsGiven,
        hoursWorked,
        salesPerHour,
        goals
      };
    });
  }, [users, shifts, allOrders, startDate, endDate]);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = employeeMetrics;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.employeeName.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query)
      );
    }

    // Sort by selected metric
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalSales - a.totalSales;
        case 'transactions':
          return b.transactionCount - a.transactionCount;
        case 'aov':
          return b.averageOrderValue - a.averageOrderValue;
        case 'items':
          return b.itemsSold - a.itemsSold;
        case 'upsells':
          return b.itemsPerTransaction - a.itemsPerTransaction;
        default:
          return b.totalSales - a.totalSales;
      }
    });
  }, [employeeMetrics, searchQuery, sortBy]);

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    const totalSales = employeeMetrics.reduce((sum, emp) => sum + emp.totalSales, 0);
    const totalTransactions = employeeMetrics.reduce((sum, emp) => sum + emp.transactionCount, 0);
    const totalHours = employeeMetrics.reduce((sum, emp) => sum + emp.hoursWorked, 0);
    const activeEmployees = employeeMetrics.filter(emp => emp.transactionCount > 0).length;

    return {
      totalSales,
      totalTransactions,
      totalHours,
      activeEmployees,
      avgSalesPerEmployee: activeEmployees > 0 ? totalSales / activeEmployees : 0,
      avgTransactionsPerEmployee: activeEmployees > 0 ? totalTransactions / activeEmployees : 0
    };
  }, [employeeMetrics]);

  // Top performers
  const topPerformers = useMemo(() => {
    return filteredEmployees.slice(0, 5);
  }, [filteredEmployees]);

  // Performance distribution
  const performanceDistribution = useMemo(() => {
    const ranges = [
      { label: '$0-1K', min: 0, max: 1000 },
      { label: '$1K-3K', min: 1000, max: 3000 },
      { label: '$3K-5K', min: 3000, max: 5000 },
      { label: '$5K-10K', min: 5000, max: 10000 },
      { label: '$10K+', min: 10000, max: Infinity }
    ];

    return ranges.map(range => ({
      range: range.label,
      count: employeeMetrics.filter(emp =>
        emp.totalSales >= range.min && emp.totalSales < range.max
      ).length
    }));
  }, [employeeMetrics]);

  // Goals achievement
  const goalsAchievement = useMemo(() => {
    return employeeMetrics.map(emp => ({
      name: emp.employeeName.split(' ')[0],
      salesAchievement: emp.goals ? (emp.goals.salesActual / emp.goals.salesGoal) * 100 : 0,
      transactionAchievement: emp.goals ? (emp.goals.transactionActual / emp.goals.transactionGoal) * 100 : 0
    })).slice(0, 10);
  }, [employeeMetrics]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const getPerformanceBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <Badge className="gap-1 bg-yellow-500 text-yellow-950">
          <Crown className="w-3 h-3" />
          #1
        </Badge>
      );
    } else if (rank <= 3) {
      return (
        <Badge className="gap-1 bg-blue-500 text-blue-950">
          <Star className="w-3 h-3" />
          #{rank}
        </Badge>
      );
    } else if (rank <= 5) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Trophy className="w-3 h-3" />
          #{rank}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          #{rank}
        </Badge>
      );
    }
  };

  const getGoalProgress = (actual: number, goal: number) => {
    const percentage = (actual / goal) * 100;
    return Math.min(100, Math.round(percentage));
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Employee Performance
          </h1>
          <p className="text-muted-foreground">
            Track, analyze, and improve employee performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${summaryMetrics.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {summaryMetrics.activeEmployees} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg per Employee</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ${summaryMetrics.avgSalesPerEmployee.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Average sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Transactions</CardTitle>
            <ShoppingCart className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.avgTransactionsPerEmployee.toFixed(0)} avg per employee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Hours</CardTitle>
            <Clock className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.totalHours.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Hours worked
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
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as MetricType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="aov">Avg Order Value</SelectItem>
                <SelectItem value="items">Items Sold</SelectItem>
                <SelectItem value="upsells">Items/Transaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="employees">All Employees</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Sales ranges across all employees</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="range" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Goal Achievement */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Achievement</CardTitle>
                <CardDescription>Top 10 employees vs goals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={goalsAchievement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    <Bar dataKey="salesAchievement" fill="#10b981" name="Sales Goal %" />
                    <Bar dataKey="transactionAchievement" fill="#3b82f6" name="Transaction Goal %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top 5 Performers</CardTitle>
                <CardDescription>Highest performers for {timePeriod}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((employee, index) => (
                    <div key={employee.employeeId} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getPerformanceBadge(index + 1)}
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(employee.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{employee.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">${employee.totalSales.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.transactionCount} transactions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Leaderboard</CardTitle>
              <CardDescription>
                Ranked by {sortBy === 'revenue' ? 'total sales' : sortBy === 'transactions' ? 'transactions' : sortBy}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredEmployees.map((employee, index) => (
                    <div
                      key={employee.employeeId}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        index < 3 ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getPerformanceBadge(index + 1)}
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className={`${
                            index === 0 ? 'bg-yellow-500 text-yellow-950' :
                            index === 1 ? 'bg-gray-400 text-gray-950' :
                            index === 2 ? 'bg-orange-600 text-orange-950' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {getInitials(employee.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-mono">${employee.totalSales.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Transactions</p>
                          <p className="font-mono">{employee.transactionCount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">AOV</p>
                          <p className="font-mono">${employee.averageOrderValue.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">$/Hour</p>
                          <p className="font-mono">${employee.salesPerHour.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees
              .filter(emp => emp.goals)
              .map((employee) => {
                const salesProgress = getGoalProgress(employee.goals!.salesActual, employee.goals!.salesGoal);
                const transactionProgress = getGoalProgress(employee.goals!.transactionActual, employee.goals!.transactionGoal);

                return (
                  <Card key={employee.employeeId}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(employee.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{employee.employeeName}</CardTitle>
                          <CardDescription className="text-xs">{employee.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Sales Goal */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Sales Goal</span>
                          <span className="text-sm font-mono">
                            ${employee.goals!.salesActual.toLocaleString()} / ${employee.goals!.salesGoal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={salesProgress} className="h-2" />
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{salesProgress}%</span>
                          {salesProgress >= 100 ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Achieved
                            </Badge>
                          ) : salesProgress >= 75 ? (
                            <Badge variant="secondary" className="gap-1">
                              <Activity className="w-3 h-3" />
                              On Track
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Behind
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Transaction Goal */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Transaction Goal</span>
                          <span className="text-sm font-mono">
                            {employee.goals!.transactionActual} / {employee.goals!.transactionGoal}
                          </span>
                        </div>
                        <Progress value={transactionProgress} className="h-2" />
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{transactionProgress}%</span>
                          {transactionProgress >= 100 ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Achieved
                            </Badge>
                          ) : transactionProgress >= 75 ? (
                            <Badge variant="secondary" className="gap-1">
                              <Activity className="w-3 h-3" />
                              On Track
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Behind
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* All Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>AOV</TableHead>
                      <TableHead>Items Sold</TableHead>
                      <TableHead>Items/Txn</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>$/Hour</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee, index) => (
                      <TableRow key={employee.employeeId}>
                        <TableCell>
                          {getPerformanceBadge(index + 1)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(employee.employeeName)}
                              </AvatarFallback>
                            </Avatar>
                            {employee.employeeName}
                          </div>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell className="font-mono">${employee.totalSales.toLocaleString()}</TableCell>
                        <TableCell className="font-mono">{employee.transactionCount}</TableCell>
                        <TableCell className="font-mono">${employee.averageOrderValue.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">{employee.itemsSold}</TableCell>
                        <TableCell className="font-mono">{employee.itemsPerTransaction.toFixed(1)}</TableCell>
                        <TableCell className="font-mono">{employee.hoursWorked.toFixed(1)}</TableCell>
                        <TableCell className="font-mono">${employee.salesPerHour.toFixed(0)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
