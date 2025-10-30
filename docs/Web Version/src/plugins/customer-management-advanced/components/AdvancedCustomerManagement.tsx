import React, { useState, useMemo } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Input } from '../../../components/ui/input';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Search,
  Tag,
  Mail,
  Gift,
  Award,
  UserPlus,
  UserX,
  UserCheck,
  Crown,
  Heart,
  BarChart3,
  PieChart,
  Activity,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { format, differenceInDays, subDays } from 'date-fns';

type LifecycleStage = 'new' | 'active' | 'at-risk' | 'churned' | 'vip';
type RFMScore = 1 | 2 | 3 | 4 | 5;

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface RFMAnalysis {
  customerId: string;
  recencyScore: RFMScore;
  frequencyScore: RFMScore;
  monetaryScore: RFMScore;
  rfmScore: number; // Combined score
  segment: string;
}

interface CustomerInsight {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lifecycleStage: LifecycleStage;
  totalPurchases: number;
  lifetimeValue: number;
  averageOrderValue: number;
  daysSinceLastPurchase: number;
  firstPurchaseDate: Date;
  lastPurchaseDate: Date;
  rfmAnalysis: RFMAnalysis;
  loyaltyTier?: string;
  tags: string[];
}

export function AdvancedCustomerManagement() {
  const { customers, shifts } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all orders from all shifts
  const allOrders = useMemo(() => {
    return shifts.flatMap(shift => shift.orders || []);
  }, [shifts]);

  // Calculate customer insights with RFM analysis
  const customerInsights = useMemo((): CustomerInsight[] => {
    const now = new Date();
    
    return customers.map(customer => {
      // Get customer's orders
      const customerOrders = allOrders.filter(order => order.customer?.id === customer.id);
      
      // Basic metrics
      const totalPurchases = customerOrders.length;
      const lifetimeValue = customerOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalPurchases > 0 ? lifetimeValue / totalPurchases : 0;
      
      // Date metrics
      const orderDates = customerOrders.map(o => new Date(o.timestamp)).sort((a, b) => b.getTime() - a.getTime());
      const lastPurchaseDate = orderDates[0] || now;
      const firstPurchaseDate = orderDates[orderDates.length - 1] || now;
      const daysSinceLastPurchase = differenceInDays(now, lastPurchaseDate);
      
      // RFM Analysis
      const rfmAnalysis = calculateRFM(daysSinceLastPurchase, totalPurchases, lifetimeValue);
      
      // Lifecycle stage
      const lifecycleStage = determineLifecycleStage(
        totalPurchases,
        daysSinceLastPurchase,
        lifetimeValue,
        differenceInDays(now, firstPurchaseDate)
      );
      
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        lifecycleStage,
        totalPurchases,
        lifetimeValue,
        averageOrderValue,
        daysSinceLastPurchase,
        firstPurchaseDate,
        lastPurchaseDate,
        rfmAnalysis,
        loyaltyTier: customer.loyaltyTier,
        tags: customer.tags || []
      };
    });
  }, [customers, allOrders]);

  // Calculate RFM scores
  function calculateRFM(recency: number, frequency: number, monetary: number): RFMAnalysis {
    // Recency Score (lower is better)
    let recencyScore: RFMScore;
    if (recency <= 30) recencyScore = 5;
    else if (recency <= 60) recencyScore = 4;
    else if (recency <= 90) recencyScore = 3;
    else if (recency <= 180) recencyScore = 2;
    else recencyScore = 1;

    // Frequency Score
    let frequencyScore: RFMScore;
    if (frequency >= 20) frequencyScore = 5;
    else if (frequency >= 10) frequencyScore = 4;
    else if (frequency >= 5) frequencyScore = 3;
    else if (frequency >= 2) frequencyScore = 2;
    else frequencyScore = 1;

    // Monetary Score
    let monetaryScore: RFMScore;
    if (monetary >= 1000) monetaryScore = 5;
    else if (monetary >= 500) monetaryScore = 4;
    else if (monetary >= 200) monetaryScore = 3;
    else if (monetary >= 50) monetaryScore = 2;
    else monetaryScore = 1;

    // Combined RFM Score
    const rfmScore = recencyScore + frequencyScore + monetaryScore;

    // Determine segment based on RFM
    let segment = '';
    if (recencyScore >= 4 && frequencyScore >= 4 && monetaryScore >= 4) {
      segment = 'Champions';
    } else if (recencyScore >= 3 && frequencyScore >= 3 && monetaryScore >= 3) {
      segment = 'Loyal Customers';
    } else if (recencyScore >= 4 && frequencyScore <= 2) {
      segment = 'New Customers';
    } else if (recencyScore <= 2 && frequencyScore >= 3 && monetaryScore >= 3) {
      segment = 'At Risk';
    } else if (recencyScore <= 2 && frequencyScore <= 2) {
      segment = 'Lost';
    } else {
      segment = 'Potential';
    }

    return {
      customerId: '',
      recencyScore,
      frequencyScore,
      monetaryScore,
      rfmScore,
      segment
    };
  }

  // Determine lifecycle stage
  function determineLifecycleStage(
    purchases: number,
    daysSince: number,
    ltv: number,
    customerAge: number
  ): LifecycleStage {
    // VIP: High value customers
    if (ltv >= 500 && purchases >= 10) return 'vip';
    
    // New: First purchase within 30 days
    if (customerAge <= 30) return 'new';
    
    // Churned: Haven't purchased in 6+ months
    if (daysSince > 180) return 'churned';
    
    // At Risk: 3-6 months since last purchase
    if (daysSince > 90 && daysSince <= 180) return 'at-risk';
    
    // Active: Regular customers
    return 'active';
  }

  // Generate segments
  const segments: CustomerSegment[] = useMemo(() => {
    const newCustomers = customerInsights.filter(c => c.lifecycleStage === 'new');
    const activeCustomers = customerInsights.filter(c => c.lifecycleStage === 'active');
    const vipCustomers = customerInsights.filter(c => c.lifecycleStage === 'vip');
    const atRiskCustomers = customerInsights.filter(c => c.lifecycleStage === 'at-risk');
    const churnedCustomers = customerInsights.filter(c => c.lifecycleStage === 'churned');

    return [
      {
        id: 'all',
        name: 'All Customers',
        description: 'Entire customer base',
        count: customerInsights.length,
        color: 'text-blue-500',
        icon: Users
      },
      {
        id: 'vip',
        name: 'VIP',
        description: 'High-value customers',
        count: vipCustomers.length,
        color: 'text-yellow-500',
        icon: Crown
      },
      {
        id: 'active',
        name: 'Active',
        description: 'Regular customers',
        count: activeCustomers.length,
        color: 'text-green-500',
        icon: UserCheck
      },
      {
        id: 'new',
        name: 'New',
        description: 'Recent signups',
        count: newCustomers.length,
        color: 'text-blue-400',
        icon: UserPlus
      },
      {
        id: 'at-risk',
        name: 'At Risk',
        description: 'May churn soon',
        count: atRiskCustomers.length,
        color: 'text-orange-500',
        icon: AlertCircle
      },
      {
        id: 'churned',
        name: 'Churned',
        description: 'Inactive 6+ months',
        count: churnedCustomers.length,
        color: 'text-red-500',
        icon: UserX
      }
    ];
  }, [customerInsights]);

  // Filter customers based on segment and search
  const filteredCustomers = useMemo(() => {
    let filtered = customerInsights;

    // Filter by segment
    if (selectedSegment && selectedSegment !== 'all') {
      filtered = filtered.filter(c => c.lifecycleStage === selectedSegment);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [customerInsights, selectedSegment, searchQuery]);

  const handleExportSegment = () => {
    toast.success('Segment exported to CSV');
  };

  // Lifecycle badge component
  const getLifecycleBadge = (stage: LifecycleStage) => {
    const config = {
      new: { label: 'New', variant: 'default' as const, className: 'bg-blue-500' },
      active: { label: 'Active', variant: 'default' as const, className: 'bg-green-500' },
      vip: { label: 'VIP', variant: 'default' as const, className: 'bg-yellow-500' },
      'at-risk': { label: 'At Risk', variant: 'destructive' as const, className: 'bg-orange-500' },
      churned: { label: 'Churned', variant: 'destructive' as const, className: 'bg-red-500' }
    };

    const { label, variant, className } = config[stage];
    return <Badge variant={variant} className={className}>{label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-2">
            <Users className="w-8 h-8" />
            Advanced Customer Management
          </h1>
          <p className="text-muted-foreground">
            Customer intelligence and segmentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportSegment}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {segments.map((segment) => {
          const Icon = segment.icon;
          return (
            <Card
              key={segment.id}
              className={`cursor-pointer transition-all ${
                selectedSegment === segment.id ? 'ring-2 ring-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${segment.color}`} />
                  {selectedSegment === segment.id && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">{segment.count}</div>
                <p className="text-sm mb-1">{segment.name}</p>
                <p className="text-xs text-muted-foreground">{segment.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="customers">All Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Customers</CardTitle>
                <Users className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{customers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Registered accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Avg Lifetime Value</CardTitle>
                <DollarSign className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  ${customerInsights.length > 0
                    ? (customerInsights.reduce((sum, c) => sum + c.lifetimeValue, 0) / customerInsights.length).toFixed(2)
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per customer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Avg Order Value</CardTitle>
                <ShoppingCart className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  ${customerInsights.length > 0
                    ? (customerInsights.reduce((sum, c) => sum + c.averageOrderValue, 0) / customerInsights.length).toFixed(2)
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per transaction
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  ${customerInsights.reduce((sum, c) => sum + c.lifetimeValue, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifecycle Distribution</CardTitle>
                <CardDescription>Breakdown by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VIP</span>
                    <span className="font-mono text-yellow-500">
                      {customers.length > 0
                        ? ((segments.find(s => s.id === 'vip')?.count || 0) / customers.length * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <span className="font-mono text-green-500">
                      {customers.length > 0
                        ? ((segments.find(s => s.id === 'active')?.count || 0) / customers.length * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New</span>
                    <span className="font-mono text-blue-500">
                      {customers.length > 0
                        ? ((segments.find(s => s.id === 'new')?.count || 0) / customers.length * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">At Risk</span>
                    <span className="font-mono text-orange-500">
                      {customers.length > 0
                        ? ((segments.find(s => s.id === 'at-risk')?.count || 0) / customers.length * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Patterns</CardTitle>
                <CardDescription>Average customer behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Purchases per Customer</span>
                    <span className="font-mono">
                      {customerInsights.length > 0
                        ? (customerInsights.reduce((sum, c) => sum + c.totalPurchases, 0) / customerInsights.length).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Days Between Purchases</span>
                    <span className="font-mono">
                      {customerInsights.length > 0
                        ? (customerInsights.reduce((sum, c) => sum + c.daysSinceLastPurchase, 0) / customerInsights.length).toFixed(0)
                        : '0'} days
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Lifetime (Avg)</span>
                    <span className="font-mono">
                      {customerInsights.length > 0
                        ? Math.round(
                            customerInsights.reduce((sum, c) => {
                              return sum + differenceInDays(new Date(), c.firstPurchaseDate);
                            }, 0) / customerInsights.length
                          )
                        : '0'} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Data-driven observations about your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segments.find(s => s.id === 'at-risk')!.count > 0 && (
                  <div className="flex items-start gap-3 p-3 border border-orange-500/20 bg-orange-500/5 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {segments.find(s => s.id === 'at-risk')!.count} customers at risk of churning
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        These customers haven't purchased in 3-6 months. Consider reaching out with personalized offers.
                      </p>
                    </div>
                  </div>
                )}

                {segments.find(s => s.id === 'new')!.count > 0 && (
                  <div className="flex items-start gap-3 p-3 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                    <UserPlus className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {segments.find(s => s.id === 'new')!.count} new customers to nurture
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Recent customers are in the critical conversion phase. Provide excellent service to build loyalty.
                      </p>
                    </div>
                  </div>
                )}

                {segments.find(s => s.id === 'vip')!.count > 0 && (
                  <div className="flex items-start gap-3 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                    <Crown className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {segments.find(s => s.id === 'vip')!.count} VIP customers drive significant revenue
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your top customers account for a large portion of revenue. Keep them happy with exclusive perks.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Info className="w-4 h-4 text-blue-500" />
            <AlertDescription className="text-sm">
              <strong>POS-Focused Design:</strong> AuraFlow POS excels at point-of-sale operations. 
              For advanced marketing automation, CRM workflows, and campaign management, we recommend 
              connecting to specialized tools built for those purposes.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Email Marketing & Automation</CardTitle>
              <CardDescription>Send campaigns and automate customer communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Mailchimp</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Industry leader in email marketing
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Klaviyo</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        E-commerce focused automation
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Constant Contact</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Simple email marketing
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CRM & Customer Management</CardTitle>
              <CardDescription>Advanced customer relationship management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">HubSpot CRM</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Full-featured CRM platform
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Salesforce</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Enterprise CRM solution
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Zoho CRM</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Affordable CRM platform
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-2">Need a custom integration?</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    AuraFlow POS provides webhook APIs and data export capabilities. 
                    Connect to Zapier, Make, or build custom integrations.
                  </p>
                  <Button variant="outline" size="sm">
                    View API Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Customers</CardTitle>
                  <CardDescription>
                    {filteredCustomers.length} of {customerInsights.length} customers
                    {selectedSegment && ` (filtered by ${segments.find(s => s.id === selectedSegment)?.name})`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Purchases</TableHead>
                      <TableHead>Lifetime Value</TableHead>
                      <TableHead>Avg Order</TableHead>
                      <TableHead>Last Purchase</TableHead>
                      <TableHead>RFM Segment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p>{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getLifecycleBadge(customer.lifecycleStage)}
                        </TableCell>
                        <TableCell className="font-mono">{customer.totalPurchases}</TableCell>
                        <TableCell className="font-mono">${customer.lifetimeValue.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${customer.averageOrderValue.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">
                          {customer.totalPurchases > 0
                            ? `${customer.daysSinceLastPurchase} days ago`
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer.rfmAnalysis.segment}</Badge>
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
