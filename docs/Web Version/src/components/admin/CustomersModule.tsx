import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Customer } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ExportDialog } from '../ExportDialog';
import { exportCustomers, ExportOptions, filterByDateRange } from '../../lib/exportUtils';
import { 
  UserCircle, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Tag, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Eye,
  X,
  FileDown,
  Pencil
} from 'lucide-react';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';

export function CustomersModule() {
  const customers = useStore((state) => state.customers);
  const addCustomer = useStore((state) => state.addCustomer);
  const updateCustomer = useStore((state) => state.updateCustomer);
  const deleteCustomer = useStore((state) => state.deleteCustomer);
  const getCustomerAnalytics = useStore((state) => state.getCustomerAnalytics);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewAnalytics, setViewAnalytics] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    birthday: '',
    notes: '',
    tags: [] as string[],
    marketingOptIn: false,
  });

  const [newTag, setNewTag] = useState('');
  const [exportOptions, setExportOptions] = useState({
    format: 'csv' as 'csv' | 'excel',
    startDate: '',
    endDate: '',
    includeTags: true,
    includeNotes: true,
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      birthday: '',
      notes: '',
      tags: [],
      marketingOptIn: false,
    });
    setNewTag('');
    setEditingCustomer(null);
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.zipCode || '',
        birthday: customer.birthday || '',
        notes: customer.notes || '',
        tags: customer.tags || [],
        marketingOptIn: customer.marketingOptIn || false,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (!formData.email.trim() || !formData.phone.trim()) {
      toast.error('Email and phone are required');
      return;
    }

    try {
      if (editingCustomer) {
        updateCustomer(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        addCustomer(formData);
        toast.success('Customer created successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Delete customer "${customer.name}"?`)) {
      deleteCustomer(customer.id);
      toast.success('Customer deleted');
    }
  };

  const handleViewAnalytics = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewAnalytics(true);
  };

  // Handle export
  const handleExport = (options: ExportOptions) => {
    try {
      let dataToExport = [...customers];
      
      // Apply date range filter if specified
      if (options.dateRange) {
        dataToExport = filterByDateRange(dataToExport, options.dateRange.start, options.dateRange.end);
      }
      
      exportCustomers(dataToExport, options);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export data');
    }
  };

  // Get available fields for export
  const getExportFields = () => {
    return [
      { value: 'Customer ID', label: 'Customer ID' },
      { value: 'Name', label: 'Full Name' },
      { value: 'First Name', label: 'First Name' },
      { value: 'Last Name', label: 'Last Name' },
      { value: 'Email', label: 'Email' },
      { value: 'Phone', label: 'Phone' },
      { value: 'Address', label: 'Address' },
      { value: 'City', label: 'City' },
      { value: 'State', label: 'State' },
      { value: 'Zip Code', label: 'Zip Code' },
      { value: 'Birthday', label: 'Birthday' },
      { value: 'Total Spent', label: 'Total Spent' },
      { value: 'Visit Count', label: 'Visit Count' },
      { value: 'Average Order', label: 'Average Order Value' },
      { value: 'Last Visit', label: 'Last Visit' },
      { value: 'Tags', label: 'Tags' },
      { value: 'Marketing Opt-in', label: 'Marketing Opt-in' },
      { value: 'Notes', label: 'Notes' },
    ];
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Calculate stats
  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.tags?.includes('VIP')).length;
  const marketingOptInCount = customers.filter(c => c.marketingOptIn).length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs">
              {row.original.firstName[0]}{row.original.lastName[0]}
            </span>
          </div>
          <div>
            <div>{row.original.name}</div>
            {row.original.tags && row.original.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {row.original.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {row.original.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{row.original.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          {row.original.phone}
        </div>
      ),
    },
    {
      accessorKey: 'totalSpent',
      header: 'Total Spent',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span>${(row.original.totalSpent || 0).toFixed(2)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'visitCount',
      header: 'Visits',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.visitCount || 0} visits
        </Badge>
      ),
    },
    {
      accessorKey: 'lastVisit',
      header: 'Last Visit',
      cell: ({ row }) => {
        if (!row.original.lastVisit) return <span className="text-muted-foreground">Never</span>;
        return (
          <span className="text-sm">
            {new Date(row.original.lastVisit).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewAnalytics(row.original)}
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Customer Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage your customer database and view analytics
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-3xl">{totalCustomers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>VIP Customers</CardDescription>
            <CardTitle className="text-3xl">{vipCustomers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Marketing Opt-In</CardDescription>
            <CardTitle className="text-3xl">{marketingOptInCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">${totalRevenue.toFixed(0)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customers..."
      />

      {/* Customer Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer
                ? 'Update customer information'
                : 'Add a new customer to your database'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  maxLength={2}
                  placeholder="IL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="62701"
                />
              </div>
            </div>

            {/* Birthday */}
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g., VIP, Wholesale, Local"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Customer preferences, special requirements, etc."
                rows={3}
              />
            </div>

            {/* Marketing Opt-in */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketingOptIn"
                checked={formData.marketingOptIn}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, marketingOptIn: checked as boolean })
                }
              />
              <Label htmlFor="marketingOptIn" className="cursor-pointer">
                Customer has opted in to marketing communications
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCustomer ? 'Update Customer' : 'Create Customer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={viewAnalytics} onOpenChange={setViewAnalytics}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Analytics</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (() => {
            const analytics = getCustomerAnalytics(selectedCustomer.id);
            return (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {selectedCustomer.phone}
                  </div>
                  {selectedCustomer.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {selectedCustomer.address}
                      {selectedCustomer.city && `, ${selectedCustomer.city}`}
                      {selectedCustomer.state && `, ${selectedCustomer.state}`}
                      {selectedCustomer.zipCode && ` ${selectedCustomer.zipCode}`}
                    </div>
                  )}
                  {selectedCustomer.birthday && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Birthday: {new Date(selectedCustomer.birthday).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Analytics Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Spent</CardDescription>
                      <CardTitle className="text-2xl">
                        ${analytics.totalSpent.toFixed(2)}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Visit Count</CardDescription>
                      <CardTitle className="text-2xl">{analytics.visitCount}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Average Order</CardDescription>
                      <CardTitle className="text-2xl">
                        ${analytics.averageOrderValue.toFixed(2)}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Last Visit</CardDescription>
                      <CardTitle className="text-lg">
                        {analytics.lastVisit
                          ? new Date(analytics.lastVisit).toLocaleDateString()
                          : 'Never'}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                {/* Tags */}
                {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-2">
                      {selectedCustomer.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedCustomer.notes && (
                  <div>
                    <Label>Notes</Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                )}

                {/* Marketing Status */}
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  {selectedCustomer.marketingOptIn ? (
                    <>
                      <Badge className="bg-emerald-600 dark:bg-emerald-600">Opted In</Badge>
                      <span className="text-sm">Customer receives marketing communications</span>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">Not Opted In</Badge>
                      <span className="text-sm">Customer does not receive marketing</span>
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          <DialogFooter>
            <Button onClick={() => setViewAnalytics(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Customers</DialogTitle>
            <DialogDescription>
              Choose the format and options for exporting your customer data
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <select
                id="format"
                value={exportOptions.format}
                onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as 'csv' | 'excel' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <div className="flex gap-2">
                <Input
                  id="startDate"
                  type="date"
                  value={exportOptions.startDate}
                  onChange={(e) => setExportOptions({ ...exportOptions, startDate: e.target.value })}
                />
                <Input
                  id="endDate"
                  type="date"
                  value={exportOptions.endDate}
                  onChange={(e) => setExportOptions({ ...exportOptions, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Include Tags */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTags"
                checked={exportOptions.includeTags}
                onCheckedChange={(checked) =>
                  setExportOptions({ ...exportOptions, includeTags: checked as boolean })
                }
              />
              <Label htmlFor="includeTags" className="cursor-pointer">
                Include Tags
              </Label>
            </div>

            {/* Include Notes */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNotes"
                checked={exportOptions.includeNotes}
                onCheckedChange={(checked) =>
                  setExportOptions({ ...exportOptions, includeNotes: checked as boolean })
                }
              />
              <Label htmlFor="includeNotes" className="cursor-pointer">
                Include Notes
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => exportCustomers(customers, exportOptions)}>
                Export
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </ExportDialog>
    </div>
  );
}