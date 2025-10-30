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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { Textarea } from '../../../components/ui/textarea';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  FileSpreadsheet,
  FileJson,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  BarChart3,
  PieChart,
  Settings,
  Copy,
  RefreshCw,
  Archive
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'once';
type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';
type ReportStatus = 'active' | 'paused' | 'completed' | 'failed';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  dataPoints: string[];
  estimatedTime: string;
  popular: boolean;
}

interface ScheduledReport {
  id: string;
  name: string;
  template: string;
  frequency: ReportFrequency;
  format: ReportFormat;
  recipients: string[];
  nextRun: Date;
  lastRun?: Date;
  status: ReportStatus;
  deliveryTime: string;
}

interface ReportHistory {
  id: string;
  name: string;
  template: string;
  generatedAt: Date;
  format: ReportFormat;
  size: string;
  status: 'success' | 'failed';
  downloadUrl?: string;
}

export function AdvancedReporting() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'daily-sales',
      name: 'Daily Sales Summary',
      description: 'Complete sales overview with transactions, revenue, and payment methods',
      category: 'Sales',
      icon: DollarSign,
      dataPoints: ['Total Sales', 'Transaction Count', 'Avg Order Value', 'Payment Methods', 'Hourly Breakdown'],
      estimatedTime: '< 1 min',
      popular: true
    },
    {
      id: 'weekly-performance',
      name: 'Weekly Performance Report',
      description: 'Week-over-week analysis with trends and key metrics',
      category: 'Analytics',
      icon: TrendingUp,
      dataPoints: ['Sales Trends', 'Top Products', 'Employee Performance', 'Customer Growth', 'Inventory Status'],
      estimatedTime: '2-3 min',
      popular: true
    },
    {
      id: 'monthly-financial',
      name: 'Monthly Financial Report',
      description: 'Comprehensive financial summary for accounting and tax purposes',
      category: 'Financial',
      icon: BarChart3,
      dataPoints: ['Revenue', 'Expenses', 'Profit Margin', 'Tax Summary', 'Cost of Goods Sold'],
      estimatedTime: '3-5 min',
      popular: true
    },
    {
      id: 'inventory-status',
      name: 'Inventory Status Report',
      description: 'Current stock levels, low stock alerts, and reorder suggestions',
      category: 'Inventory',
      icon: Package,
      dataPoints: ['Stock Levels', 'Low Stock Items', 'Overstock', 'Inventory Value', 'Reorder Needs'],
      estimatedTime: '1-2 min',
      popular: false
    },
    {
      id: 'employee-performance',
      name: 'Employee Performance Report',
      description: 'Individual and team performance metrics with goals',
      category: 'HR',
      icon: Users,
      dataPoints: ['Sales per Employee', 'Transactions', 'Hours Worked', 'Goal Achievement', 'Rankings'],
      estimatedTime: '2-3 min',
      popular: false
    },
    {
      id: 'customer-insights',
      name: 'Customer Analytics Report',
      description: 'Customer behavior, segmentation, and lifetime value analysis',
      category: 'Customers',
      icon: Users,
      dataPoints: ['Customer Count', 'RFM Segments', 'Lifetime Value', 'Retention Rate', 'Top Customers'],
      estimatedTime: '2-4 min',
      popular: false
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level KPIs and trends for leadership review',
      category: 'Executive',
      icon: TrendingUp,
      dataPoints: ['Key Metrics', 'YoY Growth', 'Performance vs Goals', 'Risk Indicators', 'Opportunities'],
      estimatedTime: '1-2 min',
      popular: true
    },
    {
      id: 'tax-report',
      name: 'Tax Report',
      description: 'Sales tax summary by jurisdiction for tax filing',
      category: 'Financial',
      icon: FileText,
      dataPoints: ['Tax Collected', 'By Jurisdiction', 'Tax-Exempt Sales', 'Adjustments', 'Remittance Due'],
      estimatedTime: '2-3 min',
      popular: false
    },
    {
      id: 'audit-trail',
      name: 'Audit Trail Report',
      description: 'Complete transaction history with modifications and voids',
      category: 'Compliance',
      icon: Archive,
      dataPoints: ['All Transactions', 'Modifications', 'Voids', 'Refunds', 'User Actions'],
      estimatedTime: '5-10 min',
      popular: false
    }
  ];

  // Mock scheduled reports
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Morning Sales Report',
      template: 'Daily Sales Summary',
      frequency: 'daily',
      format: 'pdf',
      recipients: ['owner@business.com', 'manager@business.com'],
      nextRun: addDays(new Date(), 1),
      lastRun: new Date(),
      status: 'active',
      deliveryTime: '08:00'
    },
    {
      id: '2',
      name: 'Weekly Performance Review',
      template: 'Weekly Performance Report',
      frequency: 'weekly',
      format: 'excel',
      recipients: ['owner@business.com'],
      nextRun: addDays(new Date(), 7),
      lastRun: subDays(new Date(), 7),
      status: 'active',
      deliveryTime: '09:00'
    },
    {
      id: '3',
      name: 'Monthly Financial Close',
      template: 'Monthly Financial Report',
      frequency: 'monthly',
      format: 'pdf',
      recipients: ['accountant@business.com', 'owner@business.com'],
      nextRun: addDays(new Date(), 30),
      lastRun: subDays(new Date(), 30),
      status: 'active',
      deliveryTime: '17:00'
    }
  ]);

  // Mock report history
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([
    {
      id: 'h1',
      name: 'Daily Sales Summary',
      template: 'daily-sales',
      generatedAt: new Date(),
      format: 'pdf',
      size: '2.4 MB',
      status: 'success'
    },
    {
      id: 'h2',
      name: 'Weekly Performance Report',
      template: 'weekly-performance',
      generatedAt: subDays(new Date(), 1),
      format: 'excel',
      size: '1.8 MB',
      status: 'success'
    },
    {
      id: 'h3',
      name: 'Inventory Status Report',
      template: 'inventory-status',
      generatedAt: subDays(new Date(), 2),
      format: 'csv',
      size: '456 KB',
      status: 'success'
    },
    {
      id: 'h4',
      name: 'Executive Summary',
      template: 'executive-summary',
      generatedAt: subDays(new Date(), 3),
      format: 'pdf',
      size: '1.2 MB',
      status: 'success'
    }
  ]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = reportTemplates;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(template => template.category === filterCategory);
    }

    return filtered;
  }, [reportTemplates, searchQuery, filterCategory]);

  // Get categories
  const categories = useMemo(() => {
    const cats = new Set(reportTemplates.map(t => t.category));
    return Array.from(cats);
  }, [reportTemplates]);

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    return {
      totalTemplates: reportTemplates.length,
      scheduledReports: scheduledReports.filter(r => r.status === 'active').length,
      reportsGenerated: reportHistory.length,
      successRate: (reportHistory.filter(r => r.status === 'success').length / reportHistory.length) * 100
    };
  }, [reportTemplates, scheduledReports, reportHistory]);

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-purple-500" />;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const config = {
      'active': { label: 'Active', variant: 'default' as const, icon: CheckCircle },
      'paused': { label: 'Paused', variant: 'secondary' as const, icon: Pause },
      'completed': { label: 'Completed', variant: 'outline' as const, icon: CheckCircle },
      'failed': { label: 'Failed', variant: 'destructive' as const, icon: XCircle }
    };

    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowCreateDialog(true);
  };

  const handleScheduleReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowScheduleDialog(true);
  };

  const handleCreateReport = (format: ReportFormat) => {
    toast.success(`Generating ${selectedTemplate?.name} as ${format.toUpperCase()}...`);
    setShowCreateDialog(false);
    // Would trigger actual report generation
  };

  const handleSaveSchedule = () => {
    toast.success('Report scheduled successfully');
    setShowScheduleDialog(false);
    // Would save to database
  };

  const handleToggleSchedule = (id: string) => {
    setScheduledReports(reports =>
      reports.map(r =>
        r.id === id
          ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
          : r
      )
    );
    toast.success('Schedule updated');
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduledReports(reports => reports.filter(r => r.id !== id));
    toast.success('Schedule deleted');
  };

  const handleDownload = (report: ReportHistory) => {
    toast.info('Download starting...');
    // Would trigger actual download
  };

  const handleResend = (report: ReportHistory) => {
    toast.success('Report resent to recipients');
    // Would trigger email resend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Advanced Reporting & Export
          </h1>
          <p className="text-muted-foreground">
            Generate, schedule, and export comprehensive business reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Report Templates</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Built-in and custom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Scheduled Reports</CardTitle>
            <Calendar className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.scheduledReports}</div>
            <p className="text-xs text-muted-foreground">
              Active schedules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Reports Generated</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.reportsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Success Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.successRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Delivery success
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduledReports.filter(r => r.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="history">History ({reportHistory.length})</TabsTrigger>
          <TabsTrigger value="quick-export">Quick Export</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Popular Templates */}
          {filterCategory === 'all' && !searchQuery && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Popular Templates</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reportTemplates
                  .filter(t => t.popular)
                  .map(template => {
                    const Icon = template.icon;
                    return (
                      <Card key={template.id} className="border-primary/50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{template.name}</CardTitle>
                                <Badge variant="secondary" className="mt-1">{template.category}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          
                          <div>
                            <p className="text-xs font-medium mb-2">Includes:</p>
                            <div className="flex flex-wrap gap-1">
                              {template.dataPoints.map(point => (
                                <Badge key={point} variant="outline" className="text-xs">
                                  {point}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {template.estimatedTime}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleGenerateReport(template)}
                              className="flex-1"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Generate Now
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleScheduleReport(template)}
                              className="flex-1"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}

          {/* All Templates */}
          <div className="mt-6">
            {(filterCategory !== 'all' || searchQuery) && (
              <h2 className="text-lg font-medium mb-4">
                {searchQuery ? 'Search Results' : 'All Templates'}
              </h2>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTemplates
                .filter(t => filterCategory !== 'all' || searchQuery || !t.popular)
                .map(template => {
                  const Icon = template.icon;
                  return (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <Badge variant="outline" className="mt-1">{template.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        
                        <div>
                          <p className="text-xs font-medium mb-2">Includes:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.dataPoints.slice(0, 3).map(point => (
                              <Badge key={point} variant="outline" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                            {template.dataPoints.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.dataPoints.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.estimatedTime}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateReport(template)}
                            className="flex-1"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Generate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScheduleReport(template)}
                            className="flex-1"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {scheduledReports.map(report => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <Calendar className="w-8 h-8 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.template}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Every {report.frequency}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {report.deliveryTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getFormatIcon(report.format)}
                              {report.format.toUpperCase()}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {report.recipients.length} recipients
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Next Run</p>
                          <p className="font-mono">{format(report.nextRun, 'MMM dd, HH:mm')}</p>
                        </div>
                        {getStatusBadge(report.status)}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSchedule(report.id)}
                          >
                            {report.status === 'active' ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSchedule(report.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Recently generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportHistory.map(report => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{format(report.generatedAt, 'MMM dd, HH:mm')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(report.format)}
                            {report.format.toUpperCase()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{report.size}</TableCell>
                        <TableCell>
                          {report.status === 'success' ? (
                            <Badge variant="default">Success</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(report)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResend(report)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
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

        {/* Quick Export Tab */}
        <TabsContent value="quick-export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Data Export</CardTitle>
              <CardDescription>Export raw data without report templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Quick Export Coming Soon</p>
                <p className="text-sm">Export transactions, customers, inventory, and more</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleCreateReport('pdf')}
                >
                  <FileText className="w-4 h-4 mr-2 text-red-500" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleCreateReport('excel')}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleCreateReport('csv')}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-blue-500" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleCreateReport('json')}
                >
                  <FileJson className="w-4 h-4 mr-2 text-purple-500" />
                  JSON
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Report will be generated and available in the History tab
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Report Name</Label>
              <Input placeholder="My Weekly Report" />
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Delivery Time</Label>
              <Input type="time" defaultValue="08:00" />
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email Recipients</Label>
              <Textarea
                placeholder="Enter email addresses (one per line)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
