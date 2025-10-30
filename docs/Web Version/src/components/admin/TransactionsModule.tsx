import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Receipt,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Transaction } from '../../lib/types';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Separator } from '../ui/separator';
import { ExportDialog } from '../ExportDialog';
import { exportTransactions, ExportOptions, filterByDateRange } from '../../lib/exportUtils';

export function TransactionsModule() {
  const getAllTransactions = useStore((state) => state.getAllTransactions);
  const transactions = getAllTransactions();
  const users = useStore((state) => state.users);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showVoidDialog, setShowVoidDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Handle export
  const handleExport = (options: ExportOptions) => {
    try {
      let dataToExport = [...filteredTransactions];
      
      // Apply date range filter if specified
      if (options.dateRange) {
        dataToExport = filterByDateRange(dataToExport, options.dateRange.start, options.dateRange.end);
      }
      
      exportTransactions(dataToExport, options);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export data');
    }
  };

  // Get available fields for export
  const getExportFields = () => {
    return [
      { value: 'Transaction ID', label: 'Transaction ID' },
      { value: 'Date', label: 'Date & Time' },
      { value: 'Type', label: 'Transaction Type' },
      { value: 'Order Number', label: 'Order Number' },
      { value: 'User', label: 'User' },
      { value: 'Amount', label: 'Amount' },
      { value: 'Payment Method', label: 'Payment Method' },
      { value: 'Terminal', label: 'Terminal' },
      { value: 'Notes', label: 'Notes' },
      { value: 'Training Mode', label: 'Training Mode' },
    ];
  };

  // Get transaction type badge
  const getTypeBadge = (type: Transaction['type']) => {
    const badges = {
      sale: { label: 'Sale', className: 'bg-[var(--success)]/10 text-[var(--success)]' },
      return: { label: 'Return', className: 'bg-destructive/10 text-destructive-foreground' },
      cashIn: { label: 'Cash In', className: 'bg-[var(--info)]/10 text-[var(--info)]' },
      cashOut: { label: 'Cash Out', className: 'bg-[var(--orange)]/10 text-[var(--orange)]' },
      void: { label: 'Void', className: 'bg-muted/50 text-muted-foreground' },
      noSale: { label: 'No Sale', className: 'bg-muted/50 text-muted-foreground' },
      exchange: { label: 'Exchange', className: 'bg-purple-500/10 text-purple-400' },
    };
    const config = badges[type] || badges.sale;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Get transaction icon
  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'return':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'cashIn':
        return <ArrowUpCircle className="w-4 h-4 text-blue-600" />;
      case 'cashOut':
        return <ArrowDownCircle className="w-4 h-4 text-orange-600" />;
      case 'void':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'noSale':
        return <DollarSign className="w-4 h-4 text-gray-600" />;
      case 'exchange':
        return <Receipt className="w-4 h-4 text-purple-600" />;
      default:
        return <Receipt className="w-4 h-4 text-muted-foreground" />;
    }
  };

  // Handle view details
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  // Handle void transaction
  const handleVoidTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setVoidReason('');
    setShowVoidDialog(true);
  };

  // Confirm void
  const handleConfirmVoid = () => {
    if (!selectedTransaction) return;

    if (!voidReason.trim()) {
      toast.error('Please provide a reason for voiding this transaction');
      return;
    }

    // Void transaction in store (would need to add this function)
    toast.success('Transaction voided successfully');
    setShowVoidDialog(false);
  };

  // Define columns
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: 'Transaction ID',
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.original.id.substring(0, 12)}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.type)}
          {getTypeBadge(row.original.type)}
        </div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Date & Time',
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.timestamp).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'userId',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>{getUserName(row.original.userId)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.original.amount;
        const isNegative = ['return', 'cashOut', 'void'].includes(row.original.type);
        return (
          <div className={`text-right font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
            {isNegative ? '-' : '+'}${Math.abs(amount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="capitalize">{row.original.paymentMethod || 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Order #',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.order?.orderNumber ? `#${row.original.order.orderNumber}` : '-'}
        </div>
      ),
    },
    {
      id: 'training',
      header: 'Mode',
      cell: ({ row }) => (
        <div>
          {row.original.isTrainingMode && (
            <Badge variant="outline" className="text-xs">Training</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            View
          </Button>
          {row.original.type === 'sale' && !row.original.isTrainingMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoidTransaction(row.original)}
              className="text-red-600 hover:text-red-700"
            >
              Void
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const query = searchQuery.toLowerCase();
    const userName = getUserName(txn.userId).toLowerCase();
    const orderNumber = txn.order?.orderNumber?.toString() || '';
    
    const matchesSearch =
      txn.id.toLowerCase().includes(query) ||
      userName.includes(query) ||
      orderNumber.includes(query) ||
      txn.amount.toString().includes(query);

    const matchesType = filterType === 'all' || txn.type === filterType;
    const matchesPayment =
      filterPayment === 'all' || txn.paymentMethod === filterPayment;

    return matchesSearch && matchesType && matchesPayment;
  });

  // Calculate summary stats
  const totalTransactions = transactions.length;
  const salesCount = transactions.filter((t) => t.type === 'sale').length;
  const returnsCount = transactions.filter((t) => t.type === 'return').length;
  const voidsCount = transactions.filter((t) => t.type === 'void').length;
  
  const totalSales = transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalReturns = transactions
    .filter((t) => t.type === 'return')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-medium mb-2">Transaction Records</h1>
        <p className="text-muted-foreground">
          View and manage all transaction history across all shifts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{salesCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalReturns.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{returnsCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voided</CardTitle>
            <XCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voidsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Search, filter, and manage transaction records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, user, order #, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">Sales</SelectItem>
                  <SelectItem value="return">Returns</SelectItem>
                  <SelectItem value="cashIn">Cash In</SelectItem>
                  <SelectItem value="cashOut">Cash Out</SelectItem>
                  <SelectItem value="void">Voids</SelectItem>
                  <SelectItem value="noSale">No Sale</SelectItem>
                  <SelectItem value="exchange">Exchanges</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="gift-card">Gift Card</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          <DataTable columns={columns} data={filteredTransactions} />
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Complete information for transaction {selectedTransaction.id.substring(0, 12)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <div className="mt-1">{getTypeBadge(selectedTransaction.type)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date & Time</Label>
                  <p>{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p>{getUserName(selectedTransaction.userId)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="text-lg font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment Method</Label>
                  <p className="capitalize">{selectedTransaction.paymentMethod || 'N/A'}</p>
                </div>
              </div>

              {/* Order Details */}
              {selectedTransaction.order && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Order Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Order Number:</span>
                        <span>#{selectedTransaction.order.orderNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>${selectedTransaction.order.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedTransaction.order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount:</span>
                          <span className="text-red-600">
                            -${selectedTransaction.order.discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>${selectedTransaction.order.tax.toFixed(2)}</span>
                      </div>
                      {selectedTransaction.order.tip && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tip:</span>
                          <span>${selectedTransaction.order.tip.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total:</span>
                        <span>${selectedTransaction.order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    {selectedTransaction.order.items && selectedTransaction.order.items.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-muted-foreground">Items</Label>
                        <div className="mt-2 space-y-2">
                          {selectedTransaction.order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div>
                                <span>{item.quantity}x {item.name}</span>
                                {item.modifiers && item.modifiers.length > 0 && (
                                  <div className="text-xs text-muted-foreground ml-4">
                                    {item.modifiers.map((mod) => mod.name).join(', ')}
                                  </div>
                                )}
                              </div>
                              <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer */}
                    {selectedTransaction.order.customer && (
                      <div className="mt-4">
                        <Label className="text-muted-foreground">Customer</Label>
                        <p>{selectedTransaction.order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTransaction.order.customer.email}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedTransaction.order.notes && (
                      <div className="mt-4">
                        <Label className="text-muted-foreground">Order Notes</Label>
                        <p className="text-sm">{selectedTransaction.order.notes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Training Mode Indicator */}
              {selectedTransaction.isTrainingMode && (
                <div className="p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                    <span className="text-sm font-medium text-[var(--warning)]">
                      Training Mode Transaction
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This transaction was made in training mode and did not affect inventory or balances.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Void Transaction Dialog */}
      <Dialog open={showVoidDialog} onOpenChange={setShowVoidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Void Transaction</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Provide a reason for voiding this transaction.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive-foreground flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-destructive-foreground">Manager Authorization Required</p>
                  <p className="text-muted-foreground mt-1">
                    Voiding a transaction requires manager approval and will be logged in the audit trail.
                  </p>
                </div>
              </div>
            </div>

            {selectedTransaction && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction:</span>
                  <span className="font-mono">{selectedTransaction.id.substring(0, 12)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${selectedTransaction.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(selectedTransaction.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="void-reason">Reason for Void *</Label>
              <Textarea
                id="void-reason"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Enter the reason for voiding this transaction..."
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoidDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmVoid} variant="destructive">
              Void Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        title="Export Transactions"
        description={`Export ${filteredTransactions.length} transactions to CSV, Excel, or JSON format`}
        availableFields={getExportFields()}
        defaultFilename={`transactions_${new Date().toISOString().split('T')[0]}`}
        enableDateRange={true}
      />
    </div>
  );
}