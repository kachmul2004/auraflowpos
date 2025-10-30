import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Users, 
  Circle,
  Plus,
  Clock,
  DollarSign,
  Wine
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BarSection {
  id: string;
  name: string;
  color: string;
  tables: BarTable[];
}

interface BarTable {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  customerName?: string;
  orderTotal?: number;
  orderTime?: Date;
  hasTab?: boolean;
}

const SECTIONS: BarSection[] = [
  {
    id: 'main-bar',
    name: 'Main Bar',
    color: '#8B4513',
    tables: [
      { id: 'bar-1', number: 1, seats: 2, status: 'occupied', customerName: 'John D.', orderTotal: 45.50, orderTime: new Date(Date.now() - 30 * 60000), hasTab: true },
      { id: 'bar-2', number: 2, seats: 2, status: 'available' },
      { id: 'bar-3', number: 3, seats: 3, status: 'occupied', customerName: 'Sarah K.', orderTotal: 28.00, orderTime: new Date(Date.now() - 15 * 60000) },
      { id: 'bar-4', number: 4, seats: 2, status: 'available' },
      { id: 'bar-5', number: 5, seats: 2, status: 'occupied', customerName: 'Mike R.', orderTotal: 67.25, orderTime: new Date(Date.now() - 45 * 60000), hasTab: true },
    ]
  },
  {
    id: 'high-tops',
    name: 'High Tops',
    color: '#4A5568',
    tables: [
      { id: 'ht-1', number: 11, seats: 4, status: 'occupied', customerName: 'Party of 4', orderTotal: 156.00, orderTime: new Date(Date.now() - 60 * 60000), hasTab: true },
      { id: 'ht-2', number: 12, seats: 4, status: 'available' },
      { id: 'ht-3', number: 13, seats: 4, status: 'reserved', customerName: 'Smith Party' },
      { id: 'ht-4', number: 14, seats: 6, status: 'occupied', customerName: 'Birthday Group', orderTotal: 234.75, orderTime: new Date(Date.now() - 90 * 60000), hasTab: true },
    ]
  },
  {
    id: 'lounge',
    name: 'Lounge',
    color: '#805AD5',
    tables: [
      { id: 'lng-1', number: 21, seats: 4, status: 'available' },
      { id: 'lng-2', number: 22, seats: 6, status: 'occupied', customerName: 'Corporate Group', orderTotal: 445.00, orderTime: new Date(Date.now() - 120 * 60000), hasTab: true },
      { id: 'lng-3', number: 23, seats: 4, status: 'available' },
    ]
  },
  {
    id: 'patio',
    name: 'Patio',
    color: '#38A169',
    tables: [
      { id: 'pat-1', number: 31, seats: 2, status: 'occupied', customerName: 'Couple', orderTotal: 52.00, orderTime: new Date(Date.now() - 25 * 60000) },
      { id: 'pat-2', number: 32, seats: 4, status: 'available' },
      { id: 'pat-3', number: 33, seats: 4, status: 'occupied', customerName: 'Friends', orderTotal: 89.50, orderTime: new Date(Date.now() - 40 * 60000) },
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    color: '#D69E2E',
    tables: [
      { id: 'vip-1', number: 101, seats: 8, status: 'occupied', customerName: 'VIP Party', orderTotal: 1250.00, orderTime: new Date(Date.now() - 150 * 60000), hasTab: true },
      { id: 'vip-2', number: 102, seats: 6, status: 'reserved', customerName: 'Bachelor Party' },
    ]
  }
];

export function BarSectionView() {
  const [sections] = useState<BarSection[]>(SECTIONS);
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const filteredSections = selectedSection === 'all' 
    ? sections 
    : sections.filter(s => s.id === selectedSection);

  const getTableDuration = (orderTime?: Date) => {
    if (!orderTime) return null;
    const minutes = Math.floor((Date.now() - orderTime.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const handleTableClick = (table: BarTable, section: BarSection) => {
    if (table.status === 'available') {
      toast.info('Seat customers', {
        description: `${section.name} - Table ${table.number}`
      });
    } else if (table.status === 'occupied') {
      toast.info('View order', {
        description: `${table.customerName} - $${table.orderTotal?.toFixed(2)}`
      });
    } else {
      toast.info('Reserved', {
        description: `Table ${table.number} - ${table.customerName}`
      });
    }
  };

  const getTotalStats = () => {
    const allTables = sections.flatMap(s => s.tables);
    const occupied = allTables.filter(t => t.status === 'occupied').length;
    const available = allTables.filter(t => t.status === 'available').length;
    const reserved = allTables.filter(t => t.status === 'reserved').length;
    const totalRevenue = allTables.reduce((sum, t) => sum + (t.orderTotal || 0), 0);
    const openTabs = allTables.filter(t => t.hasTab).length;

    return { occupied, available, reserved, totalRevenue, openTabs };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Bar Sections & Tables</h2>
        <p className="text-sm text-muted-foreground">
          Floor plan view of all seating areas
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold">{stats.occupied}</p>
              </div>
              <Circle className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
              <Circle className="w-8 h-8 text-green-500 fill-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Reserved</p>
                <p className="text-2xl font-bold">{stats.reserved}</p>
              </div>
              <Circle className="w-8 h-8 text-blue-500 fill-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Open Tabs</p>
                <p className="text-2xl font-bold">{stats.openTabs}</p>
              </div>
              <Wine className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedSection === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSection('all')}
        >
          All Sections
        </Button>
        {sections.map(section => (
          <Button
            key={section.id}
            variant={selectedSection === section.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSection(section.id)}
            style={{
              borderColor: selectedSection === section.id ? section.color : undefined,
              backgroundColor: selectedSection === section.id ? section.color : undefined
            }}
          >
            {section.name}
          </Button>
        ))}
      </div>

      {/* Sections Grid */}
      <div className="space-y-6">
        {filteredSections.map(section => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <CardTitle>{section.name}</CardTitle>
                  <Badge variant="outline">
                    {section.tables.filter(t => t.status === 'occupied').length} / {section.tables.length} occupied
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {section.tables.map(table => {
                  const duration = getTableDuration(table.orderTime);
                  
                  return (
                    <Card
                      key={table.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        table.status === 'occupied' 
                          ? 'border-red-500 bg-red-500/5' 
                          : table.status === 'reserved'
                          ? 'border-blue-500 bg-blue-500/5'
                          : 'border-green-500 bg-green-500/5'
                      }`}
                      onClick={() => handleTableClick(table, section)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {/* Table Number */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                                style={{ 
                                  backgroundColor: `${section.color}20`,
                                  color: section.color
                                }}
                              >
                                {table.number}
                              </div>
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{table.seats}</span>
                            </div>
                            <Circle 
                              className={`w-3 h-3 ${
                                table.status === 'occupied' 
                                  ? 'text-red-500 fill-red-500' 
                                  : table.status === 'reserved'
                                  ? 'text-blue-500 fill-blue-500'
                                  : 'text-green-500 fill-green-500'
                              }`}
                            />
                          </div>

                          {/* Status */}
                          {table.status === 'available' ? (
                            <div className="text-center py-2">
                              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                Available
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Customer Name */}
                              <div>
                                <p className="text-xs text-muted-foreground">Customer</p>
                                <p className="text-sm font-medium truncate">
                                  {table.customerName}
                                </p>
                              </div>

                              {/* Order Info */}
                              {table.orderTotal !== undefined && (
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="text-sm font-bold text-primary">
                                      ${table.orderTotal.toFixed(2)}
                                    </p>
                                  </div>
                                  {duration && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">Time</p>
                                      <p className="text-sm font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {duration}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Tab Badge */}
                              {table.hasTab && (
                                <Badge variant="outline" className="w-full justify-center text-xs">
                                  Open Tab
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="bg-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-green-500 fill-green-500" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-red-500 fill-red-500" />
              <span className="text-muted-foreground">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
              <span className="text-muted-foreground">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <Wine className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Has Open Tab</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
