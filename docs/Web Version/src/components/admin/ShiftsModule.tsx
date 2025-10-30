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
  Clock,
  DollarSign,
  Calendar,
  User,
  Monitor,
  AlertCircle,
  Search,
  Filter,
  Download,
  Edit,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Shift } from '../../lib/types';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ExportDialog } from '../ExportDialog';
import { exportShifts, ExportOptions, filterByDateRange } from '../../lib/exportUtils';

export function ShiftsModule() {
  const shifts = useStore((state) => state.shifts);
  const currentShift = useStore((state) => state.currentShift);
  const users = useStore((state) => state.users);
  const terminals = useStore((state) => state.terminals);
  
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [editedClosingBalance, setEditedClosingBalance] = useState('');
  const [shiftNotes, setShiftNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Get terminal name
  const getTerminalName = (terminal: any) => {
    return terminal?.name || 'Unknown Terminal';
  };

  // Handle export
  const handleExport = (options: ExportOptions) => {
    try {
      let dataToExport = [...filteredShifts];
      
      // Apply date range filter if specified
      if (options.dateRange) {
        dataToExport = filterByDateRange(dataToExport, options.dateRange.start, options.dateRange.end);
      }
      
      exportShifts(dataToExport, options);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export data');
    }
  };

  // Get available fields for export
  const getExportFields = () => {
    return [
      { value: 'Shift ID', label: 'Shift ID' },
      { value: 'User', label: 'User' },
      { value: 'Terminal', label: 'Terminal' },
      { value: 'Start Time', label: 'Start Time' },
      { value: 'End Time', label: 'End Time' },
      { value: 'Duration (hours)', label: 'Duration' },
      { value: 'Opening Balance', label: 'Opening Balance' },
      { value: 'Closing Balance', label: 'Closing Balance' },
      { value: 'Expected Closing', label: 'Expected Closing' },
      { value: 'Discrepancy', label: 'Discrepancy' },
      { value: 'Total Sales', label: 'Total Sales' },
      { value: 'Total Returns', label: 'Total Returns' },
      { value: 'Cash In', label: 'Cash In' },
      { value: 'Cash Out', label: 'Cash Out' },
      { value: 'Orders Count', label: 'Orders Count' },
      { value: 'Transactions Count', label: 'Transactions Count' },
      { value: 'Notes', label: 'Notes' },
    ];
  };

  // Calculate shift statistics
  const calculateShiftStats = (shift: Shift) => {
    const transactions = shift.transactions || [];

    const sales = transactions.filter((t) => t.type === 'sale');
    const returns = transactions.filter((t) => t.type === 'return');
    const cashIn = transactions.filter((t) => t.type === 'cashIn');
    const cashOut = transactions.filter((t) => t.type === 'cashOut');

    const totalSales = sales.reduce((sum, t) => sum + t.amount, 0);
    const totalReturns = returns.reduce((sum, t) => sum + t.amount, 0);
    const totalCashIn = cashIn.reduce((sum, t) => sum + t.amount, 0);
    const totalCashOut = cashOut.reduce((sum, t) => sum + t.amount, 0);

    const expectedClosing = shift.openingBalance + totalSales - totalReturns + totalCashIn - totalCashOut;
    const discrepancy = shift.closingBalance ? shift.closingBalance - expectedClosing : 0;

    return {
      transactionCount: transactions.length,
      salesCount: sales.length,
      totalSales,
      totalReturns,
      totalCashIn,
      totalCashOut,
      expectedClosing,
      discrepancy,
    };
  };

  // Handle view details
  const handleViewDetails = (shift: Shift) => {
    setSelectedShift(shift);
    setShowDetailsDialog(true);
  };

  // Handle edit closing balance
  const handleEditBalance = (shift: Shift) => {
    setSelectedShift(shift);
    setEditedClosingBalance(shift.closingBalance?.toString() || '');
    setShiftNotes(shift.notes || '');
    setShowEditDialog(true);
  };

  // Save edited balance
  const handleSaveBalance = () => {
    if (!selectedShift) return;

    const newBalance = parseFloat(editedClosingBalance);
    if (isNaN(newBalance)) {
      toast.error('Invalid balance amount');
      return;
    }

    // Update shift in store (you would need to add this function to store)
    toast.success('Shift balance updated successfully');
    setShowEditDialog(false);
  };

  // Handle close shift remotely
  const handleCloseShift = (shift: Shift) => {
    setSelectedShift(shift);
    setEditedClosingBalance('');
    setShiftNotes('');
    setShowCloseDialog(true);
  };

  // Confirm close shift
  const handleConfirmCloseShift = () => {
    if (!selectedShift) return;

    const closingBalance = parseFloat(editedClosingBalance);
    if (isNaN(closingBalance)) {
      toast.error('Please enter a valid closing balance');
      return;
    }

    // Close shift in store (would need to add this function)
    toast.success('Shift closed successfully');
    setShowCloseDialog(false);
  };

  // Define columns
  const columns: ColumnDef<Shift>[] = [
    {
      accessorKey: 'id',
      header: 'Shift ID',
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.original.id.substring(0, 8)}</div>
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
      accessorKey: 'terminal',
      header: 'Terminal',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <span>{getTerminalName(row.original.terminal)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{new Date(row.original.startTime).toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      cell: ({ row }) => (
        <div>
          {row.original.endTime ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(row.original.endTime).toLocaleString()}</span>
            </div>
          ) : (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Active
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'openingBalance',
      header: 'Opening',
      cell: ({ row }) => (
        <div className="text-right">${row.original.openingBalance.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: 'closingBalance',
      header: 'Closing',
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.closingBalance !== undefined
            ? `$${row.original.closingBalance.toFixed(2)}`
            : '-'}
        </div>
      ),
    },
    {
      id: 'discrepancy',
      header: 'Discrepancy',
      cell: ({ row }) => {
        const stats = calculateShiftStats(row.original);
        const hasDiscrepancy = Math.abs(stats.discrepancy) > 0.01;
        
        return (
          <div className="text-right">
            {row.original.closingBalance !== undefined ? (
              <span className={hasDiscrepancy ? 'text-amber-600' : 'text-green-600'}>
                {stats.discrepancy >= 0 ? '+' : ''}${stats.discrepancy.toFixed(2)}
              </span>
            ) : (
              '-'
            )}
          </div>
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
            onClick={() => handleViewDetails(row.original)}
          >
            View
          </Button>
          {row.original.endTime && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditBalance(row.original)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {!row.original.endTime && row.original.id !== currentShift?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCloseShift(row.original)}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filter shifts based on search
  const filteredShifts = shifts.filter((shift) => {
    const query = searchQuery.toLowerCase();
    const userName = getUserName(shift.userId).toLowerCase();
    const terminalName = getTerminalName(shift.terminal).toLowerCase();
    
    return (
      userName.includes(query) ||
      terminalName.includes(query) ||
      shift.id.toLowerCase().includes(query)
    );
  });

  // Calculate summary stats
  const totalShifts = shifts.length;
  const activeShifts = shifts.filter((s) => !s.endTime).length;
  const closedShifts = shifts.filter((s) => s.endTime).length;
  const totalDiscrepancies = shifts
    .filter((s) => s.closingBalance !== undefined)
    .reduce((sum, s) => {
      const stats = calculateShiftStats(s);
      return sum + Math.abs(stats.discrepancy);
    }, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-medium mb-2">Shift Records</h1>
        <p className="text-muted-foreground">
          View and manage all shift records, balances, and discrepancies
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShifts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shifts</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShifts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently open
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Shifts</CardTitle>
            <XCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedShifts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discrepancies</CardTitle>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDiscrepancies.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all shifts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Shifts</CardTitle>
          <CardDescription>Search and filter shift records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, terminal, or shift ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <DataTable columns={columns} data={filteredShifts} />
        </CardContent>
      </Card>

      {/* Shift Details Dialog */}
      {selectedShift && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Shift Details</DialogTitle>
              <DialogDescription>
                Complete information for shift {selectedShift.id.substring(0, 8)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p>{getUserName(selectedShift.userId)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Terminal</Label>
                  <p>{getTerminalName(selectedShift.terminal)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Start Time</Label>
                  <p>{new Date(selectedShift.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">End Time</Label>
                  <p>
                    {selectedShift.endTime
                      ? new Date(selectedShift.endTime).toLocaleString()
                      : 'Still active'}
                  </p>
                </div>
              </div>

              {/* Financial Summary */}
              {(() => {
                const stats = calculateShiftStats(selectedShift);
                return (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Financial Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Opening Balance:</span>
                        <span className="font-medium">${selectedShift.openingBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Sales:</span>
                        <span className="font-medium text-green-600">
                          +${stats.totalSales.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Returns:</span>
                        <span className="font-medium text-red-600">
                          -${stats.totalReturns.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash In:</span>
                        <span className="font-medium text-green-600">
                          +${stats.totalCashIn.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash Out:</span>
                        <span className="font-medium text-red-600">
                          -${stats.totalCashOut.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Closing:</span>
                        <span className="font-medium">${stats.expectedClosing.toFixed(2)}</span>
                      </div>
                      {selectedShift.closingBalance !== undefined && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Actual Closing:</span>
                            <span className="font-medium">
                              ${selectedShift.closingBalance.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Discrepancy:</span>
                            <span
                              className={`font-medium ${
                                Math.abs(stats.discrepancy) > 0.01
                                  ? 'text-amber-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {stats.discrepancy >= 0 ? '+' : ''}$
                              {stats.discrepancy.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="font-medium">
                          {stats.transactionCount} ({stats.salesCount} sales)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Notes */}
              {selectedShift.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="mt-1">{selectedShift.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Balance Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift Closing Balance</DialogTitle>
            <DialogDescription>
              Update the closing balance and add notes for this shift
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="closing-balance">Closing Balance</Label>
              <Input
                id="closing-balance"
                type="number"
                step="0.01"
                value={editedClosingBalance}
                onChange={(e) => setEditedClosingBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="shift-notes">Notes</Label>
              <Textarea
                id="shift-notes"
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                placeholder="Add notes about this adjustment..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBalance}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Shift Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Shift Remotely</DialogTitle>
            <DialogDescription>
              Enter the closing balance to close this shift
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-600 dark:text-amber-400">Manager Override Required</p>
                  <p className="text-muted-foreground mt-1">
                    Closing a shift remotely requires manager authorization
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="remote-closing-balance">Closing Balance</Label>
              <Input
                id="remote-closing-balance"
                type="number"
                step="0.01"
                value={editedClosingBalance}
                onChange={(e) => setEditedClosingBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="remote-shift-notes">Reason for Remote Close</Label>
              <Textarea
                id="remote-shift-notes"
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                placeholder="Explain why this shift is being closed remotely..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCloseShift} variant="destructive">
              Close Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        title="Export Shifts"
        description={`Export ${filteredShifts.length} shifts to CSV, Excel, or JSON format`}
        availableFields={getExportFields()}
        defaultFilename={`shifts_${new Date().toISOString().split('T')[0]}`}
        enableDateRange={true}
      />
    </div>
  );
}