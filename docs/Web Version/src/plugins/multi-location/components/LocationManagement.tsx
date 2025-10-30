import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import {
  MapPin,
  Store,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowRightLeft,
  BarChart3,
  Settings,
  MapPinned,
  Building,
  Warehouse,
  Package,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Globe,
  Phone,
  Mail,
  User,
  Calendar,
  Eye,
  Download
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
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';

type LocationType = 'store' | 'warehouse' | 'pop-up' | 'mobile';
type LocationStatus = 'active' | 'inactive' | 'pending';

interface Location {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  status: LocationStatus;
  region?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    manager: string;
  };
  settings: {
    timezone: string;
    currency: string;
    taxRate: number;
  };
  metrics?: {
    revenue: number;
    transactions: number;
    averageOrderValue: number;
    inventoryValue: number;
  };
  createdDate: Date;
  lastActivity?: Date;
}

export function LocationManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'list'>('grid');

  // Mock data - would come from store in production
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Downtown Store',
      code: 'DT-001',
      type: 'store',
      status: 'active',
      region: 'North',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      contact: {
        phone: '(555) 123-4567',
        email: 'downtown@example.com',
        manager: 'John Smith'
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        taxRate: 8.875
      },
      metrics: {
        revenue: 125430.50,
        transactions: 1842,
        averageOrderValue: 68.12,
        inventoryValue: 45000
      },
      createdDate: new Date('2024-01-15'),
      lastActivity: new Date()
    },
    {
      id: '2',
      name: 'Westside Location',
      code: 'WS-002',
      type: 'store',
      status: 'active',
      region: 'West',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA'
      },
      contact: {
        phone: '(555) 234-5678',
        email: 'westside@example.com',
        manager: 'Sarah Johnson'
      },
      settings: {
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        taxRate: 9.5
      },
      metrics: {
        revenue: 98750.25,
        transactions: 1523,
        averageOrderValue: 64.84,
        inventoryValue: 38500
      },
      createdDate: new Date('2024-02-20'),
      lastActivity: new Date()
    },
    {
      id: '3',
      name: 'Central Warehouse',
      code: 'WH-003',
      type: 'warehouse',
      status: 'active',
      region: 'Central',
      address: {
        street: '789 Industrial Dr',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'USA'
      },
      contact: {
        phone: '(555) 345-6789',
        email: 'warehouse@example.com',
        manager: 'Mike Davis'
      },
      settings: {
        timezone: 'America/Chicago',
        currency: 'USD',
        taxRate: 0
      },
      metrics: {
        revenue: 0,
        transactions: 0,
        averageOrderValue: 0,
        inventoryValue: 250000
      },
      createdDate: new Date('2024-01-01'),
      lastActivity: new Date()
    },
    {
      id: '4',
      name: 'Airport Pop-Up',
      code: 'AP-004',
      type: 'pop-up',
      status: 'active',
      region: 'North',
      address: {
        street: 'Terminal 4, Gate 23',
        city: 'New York',
        state: 'NY',
        zip: '11371',
        country: 'USA'
      },
      contact: {
        phone: '(555) 456-7890',
        email: 'airport@example.com',
        manager: 'Lisa Chen'
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        taxRate: 8.875
      },
      metrics: {
        revenue: 45200.00,
        transactions: 892,
        averageOrderValue: 50.67,
        inventoryValue: 12000
      },
      createdDate: new Date('2024-03-01'),
      lastActivity: new Date()
    },
    {
      id: '5',
      name: 'Southside Store',
      code: 'SS-005',
      type: 'store',
      status: 'inactive',
      region: 'South',
      address: {
        street: '321 Pine St',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        country: 'USA'
      },
      contact: {
        phone: '(555) 567-8901',
        email: 'southside@example.com',
        manager: 'Robert Martinez'
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        taxRate: 7.0
      },
      metrics: {
        revenue: 0,
        transactions: 0,
        averageOrderValue: 0,
        inventoryValue: 0
      },
      createdDate: new Date('2023-12-01'),
      lastActivity: new Date('2024-02-15')
    }
  ]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      const matchesSearch =
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
      const matchesRegion = filterRegion === 'all' || location.region === filterRegion;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [locations, searchQuery, filterStatus, filterRegion]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const activeLocations = locations.filter(l => l.status === 'active');
    const totalRevenue = activeLocations.reduce((sum, l) => sum + (l.metrics?.revenue || 0), 0);
    const totalTransactions = activeLocations.reduce((sum, l) => sum + (l.metrics?.transactions || 0), 0);
    const totalInventoryValue = activeLocations.reduce((sum, l) => sum + (l.metrics?.inventoryValue || 0), 0);

    return {
      totalLocations: activeLocations.length,
      totalRevenue,
      averageRevenuePerLocation: activeLocations.length > 0 ? totalRevenue / activeLocations.length : 0,
      totalTransactions,
      totalInventoryValue
    };
  }, [locations]);

  // Get regions
  const regions = useMemo(() => {
    const regionSet = new Set(locations.map(l => l.region).filter(Boolean));
    return Array.from(regionSet);
  }, [locations]);

  // Performance by region
  const regionPerformance = useMemo(() => {
    const regionData: { [key: string]: { revenue: number; transactions: number; locations: number } } = {};

    locations.forEach(location => {
      if (location.status === 'active' && location.region) {
        if (!regionData[location.region]) {
          regionData[location.region] = { revenue: 0, transactions: 0, locations: 0 };
        }
        regionData[location.region].revenue += location.metrics?.revenue || 0;
        regionData[location.region].transactions += location.metrics?.transactions || 0;
        regionData[location.region].locations += 1;
      }
    });

    return Object.entries(regionData).map(([region, data]) => ({
      region,
      revenue: parseFloat(data.revenue.toFixed(2)),
      transactions: data.transactions,
      locations: data.locations,
      avgRevenuePerLocation: parseFloat((data.revenue / data.locations).toFixed(2))
    }));
  }, [locations]);

  // Location type distribution
  const locationTypeDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    locations.forEach(location => {
      distribution[location.type] = (distribution[location.type] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));
  }, [locations]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusBadge = (status: LocationStatus) => {
    const config = {
      active: { label: 'Active', variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      inactive: { label: 'Inactive', variant: 'secondary' as const, icon: XCircle, color: 'text-gray-500' },
      pending: { label: 'Pending', variant: 'outline' as const, icon: AlertCircle, color: 'text-orange-500' }
    };

    const { label, variant, icon: Icon, color } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className={`w-3 h-3 ${color}`} />
        {label}
      </Badge>
    );
  };

  const getTypeIcon = (type: LocationType) => {
    const icons = {
      store: Store,
      warehouse: Warehouse,
      'pop-up': Building,
      mobile: Navigation
    };
    return icons[type] || Store;
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setShowAddDialog(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setShowAddDialog(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(l => l.id !== locationId));
      toast.success('Location deleted successfully');
    }
  };

  const handleSaveLocation = () => {
    if (editingLocation) {
      toast.success('Location updated successfully');
    } else {
      toast.success('Location created successfully');
    }
    setShowAddDialog(false);
    setEditingLocation(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Multi-Location Management
          </h1>
          <p className="text-muted-foreground">
            Manage all locations, track performance, and optimize operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleAddLocation}>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Locations</CardTitle>
            <MapPin className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryMetrics.totalLocations}</div>
            <p className="text-xs text-muted-foreground">
              {locations.filter(l => l.status === 'inactive').length} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${summaryMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all active locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg per Location</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${summaryMetrics.averageRevenuePerLocation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">
              Average revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Inventory Value</CardTitle>
            <Package className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${summaryMetrics.totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total inventory across locations
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
                  placeholder="Search locations..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region || 'none'}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations ({filteredLocations.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Region</CardTitle>
                <CardDescription>Revenue comparison across regions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="region" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Location Types</CardTitle>
                <CardDescription>Distribution by location type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={locationTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationTypeDistribution.map((entry, index) => (
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

            {/* Top Performing Locations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Locations</CardTitle>
                <CardDescription>Ranked by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredLocations
                    .filter(l => l.status === 'active')
                    .sort((a, b) => (b.metrics?.revenue || 0) - (a.metrics?.revenue || 0))
                    .slice(0, 5)
                    .map((location, index) => {
                      const Icon = getTypeIcon(location.type);
                      return (
                        <div key={location.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                              {index + 1}
                            </Badge>
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>{location.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {location.address.city}, {location.address.state}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono">${location.metrics?.revenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {location.metrics?.transactions.toLocaleString()} transactions
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map(location => {
                const Icon = getTypeIcon(location.type);
                return (
                  <Card key={location.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <div>
                            <CardTitle className="text-base">{location.name}</CardTitle>
                            <CardDescription className="text-xs">{location.code}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(location.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPinned className="w-4 h-4" />
                          <span>{location.address.city}, {location.address.state}</span>
                        </div>
                        {location.region && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <span>Region: {location.region}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{location.contact.manager}</span>
                        </div>
                      </div>

                      {location.status === 'active' && location.metrics && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Revenue</p>
                              <p className="font-mono">${location.metrics.revenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Orders</p>
                              <p className="font-mono">{location.metrics.transactions}</p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditLocation(location)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map(location => {
                      const Icon = getTypeIcon(location.type);
                      return (
                        <TableRow key={location.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p>{location.name}</p>
                                <p className="text-xs text-muted-foreground">{location.code}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{location.type}</TableCell>
                          <TableCell>{getStatusBadge(location.status)}</TableCell>
                          <TableCell>{location.region || '-'}</TableCell>
                          <TableCell>{location.address.city}, {location.address.state}</TableCell>
                          <TableCell className="font-mono">
                            {location.metrics ? `$${location.metrics.revenue.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="font-mono">
                            {location.metrics?.transactions.toLocaleString() || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditLocation(location)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteLocation(location.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance Comparison</CardTitle>
              <CardDescription>Compare key metrics across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>AOV</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations
                      .filter(l => l.status === 'active')
                      .sort((a, b) => (b.metrics?.revenue || 0) - (a.metrics?.revenue || 0))
                      .map((location, index) => (
                        <TableRow key={location.id}>
                          <TableCell>
                            <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                              {index + 1}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{location.name}</p>
                              <p className="text-xs text-muted-foreground">{location.address.city}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            ${location.metrics?.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono">
                            {location.metrics?.transactions.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono">
                            ${location.metrics?.averageOrderValue.toFixed(2)}
                          </TableCell>
                          <TableCell className="font-mono">
                            ${location.metrics?.inventoryValue.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {index === 0 ? (
                              <Badge variant="default" className="gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Top
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                Average
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Transfers</CardTitle>
              <CardDescription>Transfer inventory between locations (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <div className="text-center">
                  <ArrowRightLeft className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Inventory transfer functionality coming soon</p>
                  <p className="text-sm">Transfer products between locations seamlessly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Location Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </DialogTitle>
            <DialogDescription>
              {editingLocation 
                ? 'Update location details and settings'
                : 'Create a new location for your business'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Location Name</label>
                <Input placeholder="e.g., Downtown Store" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Location Code</label>
                <Input placeholder="e.g., DT-001" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Type</label>
                <Select defaultValue="store">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="pop-up">Pop-Up</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Region</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm">Street Address</label>
              <Input placeholder="123 Main St" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm">City</label>
                <Input placeholder="New York" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">State</label>
                <Input placeholder="NY" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">ZIP Code</label>
                <Input placeholder="10001" />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Phone</label>
                <Input placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Email</label>
                <Input type="email" placeholder="location@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Manager Name</label>
              <Input placeholder="John Smith" />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Timezone</label>
                <Select defaultValue="America/New_York">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Tax Rate (%)</label>
                <Input type="number" step="0.01" placeholder="8.875" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLocation}>
                {editingLocation ? 'Update Location' : 'Create Location'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
