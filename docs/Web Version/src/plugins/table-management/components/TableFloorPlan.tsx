import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useStore } from '../../../lib/store';
import { TableDetailsDialog } from './TableDetailsDialog';
import { 
  Users, 
  Clock, 
  DollarSign, 
  ChefHat, 
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { RestaurantTable } from '../../../lib/types';

interface TableFloorPlanProps {
  onTableSelect?: (tableId: string) => void;
  onClose?: () => void;
}

export function TableFloorPlan({ onTableSelect, onClose }: TableFloorPlanProps) {
  const tables = useStore((state) => state.tables);
  const assignCartToTable = useStore((state) => state.assignCartToTable);
  const cart = useStore((state) => state.cart);
  const getTableOrders = useStore((state) => state.getTableOrders);
  const currentShift = useStore((state) => state.currentShift);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Group tables by section
  const tablesBySection = tables.reduce((acc, table) => {
    const section = table.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(table);
    return acc;
  }, {} as Record<string, RestaurantTable[]>);

  const sections = Object.keys(tablesBySection);

  // Calculate table statistics
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;

  const handleTableClick = (table: RestaurantTable) => {
    setSelectedTable(table);
  };

  const handleTableAssign = (tableId: string) => {
    if (cart.items.length === 0) {
      toast.error('Add items to cart before assigning to a table');
      return;
    }

    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    if (table.status === 'occupied' && cart.tableId !== tableId) {
      toast.error(`Table ${table.number} is already occupied`);
      return;
    }

    assignCartToTable(tableId);
    toast.success(`Assigned to Table ${table.number}`);
    
    if (onTableSelect) {
      onTableSelect(tableId);
    }
    
    if (onClose) {
      onClose();
    }
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-500/20 hover:bg-emerald-500/30 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30',
          border: 'border-emerald-500 dark:border-emerald-500',
          text: 'text-emerald-600 dark:text-emerald-600'
        };
      case 'occupied':
        return {
          bg: 'bg-red-500/20 hover:bg-red-500/30 dark:bg-red-500/20 dark:hover:bg-red-500/30',
          border: 'border-red-500 dark:border-red-500',
          text: 'text-red-600 dark:text-red-600'
        };
      case 'reserved':
        return {
          bg: 'bg-amber-500/20 hover:bg-amber-500/30 dark:bg-amber-500/20 dark:hover:bg-amber-500/30',
          border: 'border-amber-500 dark:border-amber-500',
          text: 'text-amber-600 dark:text-amber-600'
        };
      default:
        return {
          bg: 'bg-muted hover:bg-muted/80',
          border: 'border-border',
          text: 'text-muted-foreground'
        };
    }
  };

  const getTableStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'occupied':
        return <XCircle className="w-4 h-4" />;
      case 'reserved':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const TableCard = ({ table }: { table: RestaurantTable }) => {
    const orders = getTableOrders(table.id);
    const colors = getTableStatusColor(table.status);
    const isSelected = selectedTable?.id === table.id;
    const isCurrentCart = cart.tableId === table.id;
    
    // Calculate total for occupied tables
    const tableTotal = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Get oldest order time for occupied tables
    const oldestOrder = orders.length > 0 
      ? orders.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime())[0]
      : null;
    
    const timeOccupied = oldestOrder 
      ? Math.floor((Date.now() - new Date(oldestOrder.dateCreated).getTime()) / 60000)
      : 0;

    return (
      <Card
        className={`
          relative p-4 cursor-pointer transition-all
          ${colors.bg} ${colors.border} border-2
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${isCurrentCart ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          hover:shadow-lg
        `}
        onClick={() => handleTableClick(table)}
        onDoubleClick={() => handleTableAssign(table.id)}
      >
        {/* Table Number Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${colors.text}`}>
              {table.number}
            </span>
            {isCurrentCart && (
              <Badge variant="default" className="text-xs bg-blue-600">
                Current
              </Badge>
            )}
          </div>
          <Badge variant="outline" className={`${colors.text} ${colors.border} border`}>
            {getTableStatusIcon(table.status)}
            <span className="ml-1 capitalize">{table.status}</span>
          </Badge>
        </div>

        {/* Table Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{table.seats} seats</span>
          </div>

          {table.server && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate">{table.server}</span>
            </div>
          )}

          {table.status === 'occupied' && (
            <>
              {orders.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChefHat className="w-4 h-4" />
                  <span>{orders.length} order{orders.length > 1 ? 's' : ''}</span>
                </div>
              )}

              {tableTotal > 0 && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  <span>${tableTotal.toFixed(2)}</span>
                </div>
              )}

              {timeOccupied > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{timeOccupied} min</span>
                </div>
              )}
            </>
          )}

          {table.status === 'reserved' && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span>Reserved</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {table.status === 'available' || isCurrentCart ? (
          <Button
            size="sm"
            className="w-full mt-3"
            variant={isCurrentCart ? "secondary" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              handleTableAssign(table.id);
            }}
          >
            {isCurrentCart ? 'Current Table' : 'Assign Table'}
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full mt-3"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTable(table);
              setShowDetailsDialog(true);
            }}
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}
      </Card>
    );
  };

  const FloorPlanView = () => (
    <Tabs defaultValue={sections[0]} className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-muted/50 p-2">
        {sections.map((section) => (
          <TabsTrigger key={section} value={section} className="flex items-center gap-2">
            {section}
            <Badge variant="secondary" className="ml-1 text-xs">
              {tablesBySection[section].length}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent key={section} value={section} className="mt-4">
          <ScrollArea className="h-[500px] w-full pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tablesBySection[section].map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );

  const ListView = () => (
    <ScrollArea className="h-[500px] w-full pr-4">
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section}>
            <h3 className="mb-3 flex items-center gap-2 text-lg">
              {section}
              <Badge variant="outline" className="text-xs">
                {tablesBySection[section].length} tables
              </Badge>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tablesBySection[section].map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-4">
      {/* Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tables</p>
              <p className="text-2xl">{tables.length}</p>
            </div>
            <Users className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/50 dark:border-emerald-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-600">Available</p>
              <p className="text-2xl text-emerald-600 dark:text-emerald-600">{availableTables}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-red-500/10 dark:bg-red-500/10 border-red-500/50 dark:border-red-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-600">Occupied</p>
              <p className="text-2xl text-red-600 dark:text-red-600">{occupiedTables}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/50 dark:border-amber-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-600">Reserved</p>
              <p className="text-2xl text-amber-600 dark:text-amber-600">{reservedTables}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {cart.tableId && (
            <span>
              Current cart assigned to{' '}
              <strong>Table {tables.find((t) => t.id === cart.tableId)?.number}</strong>
            </span>
          )}
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'floor' | 'list')}>
          <TabsList>
            <TabsTrigger value="floor">Floor Plan</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      {viewMode === 'floor' ? <FloorPlanView /> : <ListView />}

      {/* Help Text */}
      <div className="text-sm text-muted-foreground text-center p-4 bg-muted/50 rounded-lg">
        <p>
          <strong>Tip:</strong> Click a table to select, double-click to assign.
          {cart.items.length === 0 && ' Add items to cart before assigning to a table.'}
        </p>
      </div>

      {/* Table Details Dialog */}
      <TableDetailsDialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        table={selectedTable}
      />
    </div>
  );
}