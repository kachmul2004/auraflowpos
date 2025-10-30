import React, { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import {
  Printer,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Settings,
  Info,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Printer as PrinterType, ReceiptSettings } from '../lib/printer.types';
import { KitchenRoutingConfig } from './KitchenRoutingConfig';
import { ReceiptCustomizer } from './ReceiptCustomizer';
import { DiagnosticsPanel } from './DiagnosticsPanel';
import { AddPrinterDialog } from './AddPrinterDialog';

export function HardwareManagement() {
  const printers = useStore(state => state.printers);
  const addPrinter = useStore(state => state.addPrinter);
  const updatePrinter = useStore(state => state.updatePrinter);
  const deletePrinter = useStore(state => state.deletePrinter);
  const testPrinter = useStore(state => state.testPrinter);
  
  const [activeTab, setActiveTab] = useState('printers');
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<any>(null);

  const handleSavePrinter = (printerConfig: any) => {
    if (editingPrinter) {
      // Update existing printer
      updatePrinter(editingPrinter.id, printerConfig);
      toast.success('Printer updated successfully', {
        description: `${printerConfig.name} has been updated`,
      });
      setEditingPrinter(null);
    } else {
      // Add new printer
      const newPrinter = {
        ...printerConfig,
        id: `printer-${Date.now()}`,
        status: 'offline' as const,
        totalPrints: 0,
        testPrintCount: 0,
        lastUsed: null,
        errorLog: [],
      };
      
      addPrinter(newPrinter);
      toast.success('Printer added successfully', {
        description: `${newPrinter.name} is ready to use`,
      });
    }
  };

  const handleEditPrinter = (printer: any) => {
    setEditingPrinter(printer);
    setShowAddPrinter(true);
  };

  const handleTestPrinter = async (id: string) => {
    const printer = printers.find(p => p.id === id);
    if (!printer) return;

    toast.loading('Testing printer...', { id: 'test-printer' });
    
    try {
      const success = await testPrinter(id);
      if (success) {
        toast.success('Test successful!', {
          id: 'test-printer',
          description: `${printer.name} is working correctly`,
        });
        updatePrinter(id, { 
          testPrintCount: (printer.testPrintCount || 0) + 1,
          lastUsed: new Date(),
        });
      } else {
        toast.error('Test failed', {
          id: 'test-printer',
          description: 'Could not connect to printer',
        });
      }
    } catch (error: any) {
      console.error('Test printer error:', error);
      
      // Better error messages
      let description = error?.message || 'An error occurred during testing';
      
      // Check if it's a backend connection error
      if (description.includes('Cannot connect to print service')) {
        description = 'Backend service not running. Run: cd backend && npm start';
      } else if (description.includes('Failed to connect to printer')) {
        description = 'Printer offline or wrong IP address';
      }
      
      toast.error('Test failed', {
        id: 'test-printer',
        description: description,
      });
    }
  };

  const handleDeletePrinter = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deletePrinter(id);
      toast.success('Printer deleted', {
        description: `${name} has been removed`,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-2">
            <Printer className="w-8 h-8" />
            Hardware & Printers
          </h1>
          <p className="text-muted-foreground">
            Configure printers, kitchen routing, and receipt customization
          </p>
        </div>
        <Button onClick={() => setShowAddPrinter(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Printer
        </Button>
      </div>

      {/* Info Banner */}
      {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? (
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="w-4 h-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Mobile Device:</strong> USB printers are not supported in mobile browsers. 
            Please use <strong>Network (WiFi/Ethernet)</strong> printers for the best experience. 
            Our native Android app supports USB printers. Simulator mode works on all devices for testing.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="w-4 h-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Getting Started:</strong> Connect your receipt and kitchen printers to automate 
            printing. Use the simulator mode for testing without physical hardware.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="printers">
            <Printer className="w-4 h-4 mr-2" />
            Printers
          </TabsTrigger>
          <TabsTrigger value="kitchen-routing">
            Kitchen Routing
          </TabsTrigger>
          <TabsTrigger value="receipt">
            Receipt Design
          </TabsTrigger>
          <TabsTrigger value="diagnostics">
            Diagnostics
          </TabsTrigger>
        </TabsList>

        {/* Printers Tab */}
        <TabsContent value="printers" className="space-y-4">
          {printers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Printer className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg mb-2">No printers configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first printer to start printing receipts and kitchen tickets
                  </p>
                  <Button onClick={() => setShowAddPrinter(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Printer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {printers.map((printer: any) => (
                <Card key={printer.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          printer.type === 'receipt' ? 'bg-blue-500/10' :
                          printer.type === 'kitchen' ? 'bg-green-500/10' :
                          'bg-purple-500/10'
                        }`}>
                          <Printer className={`w-6 h-6 ${
                            printer.type === 'receipt' ? 'text-blue-500' :
                            printer.type === 'kitchen' ? 'text-green-500' :
                            'text-purple-500'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle>{printer.name}</CardTitle>
                            {printer.status === 'online' ? (
                              <Badge variant="default" className="gap-1 bg-green-500">
                                <Wifi className="w-3 h-3" />
                                Online
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <WifiOff className="w-3 h-3" />
                                Offline
                              </Badge>
                            )}
                            {!printer.enabled && (
                              <Badge variant="secondary">Disabled</Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1">
                            {printer.type === 'receipt' && 'Receipt Printer'}
                            {printer.type === 'kitchen' && `Kitchen Station: ${printer.station || 'Main'}`}
                            {printer.type === 'label' && 'Label Printer'}
                            {' • '}
                            {printer.connection.method === 'network' && `Network (${printer.connection.address}:${printer.connection.port || 9100})`}
                            {printer.connection.method === 'usb' && 'USB Connection'}
                            {printer.connection.method === 'bluetooth' && 'Bluetooth'}
                            {printer.connection.method === 'simulator' && 'Simulator (Testing)'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPrinter(printer)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleTestPrinter(printer.id)}>
                          <TestTube className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePrinter(printer.id, printer.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Paper Size</p>
                        <p className="font-medium">{printer.paperSize}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Prints</p>
                        <p className="font-medium">{printer.totalPrints || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Test Prints</p>
                        <p className="font-medium">{printer.testPrintCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Used</p>
                        <p className="font-medium">
                          {printer.lastUsed 
                            ? new Date(printer.lastUsed).toLocaleString() 
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                    
                    {printer.errorLog && printer.errorLog.length > 0 && (
                      <div className="mt-4 p-3 border border-orange-500/20 bg-orange-500/5 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                              Recent Errors ({printer.errorLog.length})
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Last error: {printer.errorLog[printer.errorLog.length - 1]?.error}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Logs
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Kitchen Routing Tab */}
        <TabsContent value="kitchen-routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kitchen Routing Rules</CardTitle>
              <CardDescription>
                Auto-route menu items to specific kitchen printers based on category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KitchenRoutingConfig />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt Design Tab */}
        <TabsContent value="receipt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Customization</CardTitle>
              <CardDescription>
                Customize your receipt design, logo, and footer text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptCustomizer />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnostics Tab */}
        <TabsContent value="diagnostics" className="space-y-4">
          <DiagnosticsPanel />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Printer Dialog */}
      <AddPrinterDialog
        open={showAddPrinter}
        onOpenChange={(open) => {
          setShowAddPrinter(open);
          if (!open) setEditingPrinter(null);
        }}
        onSave={handleSavePrinter}
        editingPrinter={editingPrinter}
      />
    </div>
  );
}