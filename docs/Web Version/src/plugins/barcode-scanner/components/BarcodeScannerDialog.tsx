import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Badge } from '../../../components/ui/badge';
import { useStore } from '../../../lib/store';
import { Camera, Keyboard, History, X, CheckCircle2, XCircle, Scan } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BarcodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BarcodeScannerDialog({ open, onOpenChange }: BarcodeScannerDialogProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'history'>('manual');
  const [manualInput, setManualInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const manualInputRef = useRef<HTMLInputElement>(null);
  
  const addProductByBarcode = useStore(state => state.addProductByBarcode);
  const recentScans = useStore(state => state.getRecentScans(20));
  const clearScanHistory = useStore(state => state.clearScanHistory);

  // Focus manual input when dialog opens or tab changes
  useEffect(() => {
    if (open && activeTab === 'manual' && manualInputRef.current) {
      setTimeout(() => {
        manualInputRef.current?.focus();
      }, 100);
    }
  }, [open, activeTab]);

  // Handle keyboard wedge input (USB barcode scanner)
  useEffect(() => {
    if (!open || activeTab !== 'manual') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // USB scanners typically send Enter after barcode
      if (e.key === 'Enter' && manualInput.length > 0) {
        e.preventDefault();
        handleScan(manualInput);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [open, activeTab, manualInput]);

  const handleScan = (barcode: string) => {
    if (!barcode.trim()) {
      toast.error('Please enter a barcode');
      return;
    }

    setScanning(true);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      const success = addProductByBarcode(barcode.trim());
      
      if (success) {
        toast.success('Product added to cart!', {
          description: barcode,
          icon: <CheckCircle2 className="size-4" />,
        });
        setManualInput('');
      } else {
        toast.error('Product not found', {
          description: `Barcode: ${barcode}`,
          icon: <XCircle className="size-4" />,
        });
      }
      
      setScanning(false);
    }, 300);
  };

  const handleManualScan = () => {
    handleScan(manualInput);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="size-5" />
            Barcode Scanner
          </DialogTitle>
          <DialogDescription>
            Scan barcodes to quickly add products to your cart
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Keyboard className="size-4" />
              Manual / USB
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2" disabled>
              <Camera className="size-4" />
              Camera
              <Badge variant="secondary" className="ml-1">Soon</Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="size-4" />
              History
              {recentScans.length > 0 && (
                <Badge variant="secondary">{recentScans.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Manual / USB Scanner Tab */}
          <TabsContent value="manual" className="flex-1 flex flex-col gap-4 mt-4">
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6 border-2 border-dashed border-border">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                    <Scan className="size-10 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Using a USB barcode scanner? Just scan! 
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Or enter the barcode manually below
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  ref={manualInputRef}
                  type="text"
                  placeholder="Enter barcode or SKU..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleManualScan();
                    }
                  }}
                  className="flex-1 h-12 text-lg"
                  autoFocus
                  disabled={scanning}
                />
                <Button
                  onClick={handleManualScan}
                  disabled={!manualInput.trim() || scanning}
                  size="lg"
                  className="px-8"
                >
                  {scanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="size-4 mr-2" />
                      Scan
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Keyboard className="size-4" />
                  USB Scanner Instructions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Connect your USB barcode scanner</li>
                  <li>Click in the input field above</li>
                  <li>Scan any product barcode</li>
                  <li>Product will be added automatically</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Camera Tab (Coming Soon) */}
          <TabsContent value="camera" className="flex-1 flex flex-col gap-4 mt-4">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mx-auto">
                  <Camera className="size-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3>Camera Scanning</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Camera-based barcode scanning coming in the next update. Use manual entry or a USB scanner for now.
                  </p>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {recentScans.length} recent {recentScans.length === 1 ? 'scan' : 'scans'}
              </p>
              {recentScans.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearScanHistory();
                    toast.success('Scan history cleared');
                  }}
                >
                  Clear History
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1 -mx-6 px-6">
              {recentScans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <History className="size-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No scan history yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scanned barcodes will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        scan.success
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${scan.success ? 'text-green-500' : 'text-red-500'}`}>
                        {scan.success ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <XCircle className="size-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono">{scan.barcode}</code>
                          <Badge variant={scan.success ? 'default' : 'destructive'} className="text-xs">
                            {scan.success ? 'Success' : 'Not Found'}
                          </Badge>
                        </div>
                        {scan.productName && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {scan.productName}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(scan.timestamp)}
                        </p>
                      </div>
                      {scan.success && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleScan(scan.barcode)}
                          className="flex-shrink-0"
                        >
                          Scan Again
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Tip: USB scanners work like a keyboard - just scan!
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
