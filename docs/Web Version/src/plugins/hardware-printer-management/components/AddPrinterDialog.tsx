import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Printer, ConnectionMethod, PrinterType } from '../lib/printer.types';

interface AddPrinterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (printer: Omit<Printer, 'id' | 'status' | 'totalPrints' | 'testPrintCount' | 'lastUsed' | 'errorLog'>) => void;
  editingPrinter?: Printer | null;
}

export function AddPrinterDialog({ open, onOpenChange, onSave, editingPrinter }: AddPrinterDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PrinterType>('receipt');
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>('network');
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [usbVendorId, setUsbVendorId] = useState('');
  const [usbProductId, setUsbProductId] = useState('');
  const [paperSize, setPaperSize] = useState<'80mm' | '58mm'>('80mm');
  const [station, setStation] = useState('Main');
  const [enabled, setEnabled] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Update form when editingPrinter changes
  useEffect(() => {
    if (editingPrinter) {
      setName(editingPrinter.name || '');
      setType(editingPrinter.type || 'receipt');
      setConnectionMethod(editingPrinter.connection.method || 'network');
      setIpAddress(editingPrinter.connection.address || '');
      setPort(editingPrinter.connection.port?.toString() || '');
      setUsbVendorId(editingPrinter.connection.usbVendorId || '');
      setUsbProductId(editingPrinter.connection.usbProductId || '');
      setPaperSize(editingPrinter.paperSize || '80mm');
      setStation(editingPrinter.station || 'Main');
      setEnabled(editingPrinter.enabled ?? true);
      setAutoPrint(editingPrinter.autoPrint ?? false);
    } else if (!open) {
      // Reset form when dialog closes
      setName('');
      setType('receipt');
      setConnectionMethod('network');
      setIpAddress('');
      setPort('');
      setUsbVendorId('');
      setUsbProductId('');
      setPaperSize('80mm');
      setStation('Main');
      setEnabled(true);
      setAutoPrint(false);
    }
  }, [editingPrinter, open]);

  const handleDiscoverUSB = async () => {
    setIsDiscovering(true);
    
    try {
      // Check if Web USB API is supported
      if (!('usb' in navigator)) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        toast.error('USB API not supported', {
          description: isMobile 
            ? 'USB printers are not supported on mobile browsers. Please use Network printers or configure from desktop. Our native Android app supports USB printers.'
            : 'Your browser does not support Web USB. Try Chrome or Edge on desktop.',
          duration: 5000,
        });
        setIsDiscovering(false);
        return;
      }

      // Request USB device
      const device = await (navigator as any).usb.requestDevice({
        filters: [
          // Common thermal printer vendors
          { vendorId: 0x0416 }, // Citizen
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x067b }, // Prolific
          { vendorId: 0x0519 }, // Star Micronics
          { vendorId: 0x0dd4 }, // Seiko Instruments
          { vendorId: 0x28e9 }, // GoDEX
          { vendorId: 0x0493 }, // MAXStick
          { vendorId: 0x04da }, // Panasonic
          { vendorId: 0x1504 }, // Bixolon
        ],
      });

      // Convert vendor and product IDs to hex strings
      const vendorIdHex = '0x' + device.vendorId.toString(16).padStart(4, '0');
      const productIdHex = '0x' + device.productId.toString(16).padStart(4, '0');

      setUsbVendorId(vendorIdHex);
      setUsbProductId(productIdHex);

      // Set a default name if empty
      if (!name) {
        setName(`${device.productName || 'USB Printer'}`);
      }

      toast.success('USB device discovered', {
        description: `Found: ${device.productName || 'Unknown Printer'}`,
      });
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        toast.error('No device selected', {
          description: 'Please select a USB printer from the dialog.',
        });
      } else {
        toast.error('Failed to discover USB device', {
          description: error.message,
        });
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      toast.error('Please enter a printer name');
      return;
    }

    if (connectionMethod === 'network') {
      if (!ipAddress.trim()) {
        toast.error('Please enter an IP address');
        return;
      }
      // Port is optional, will default to 9100 if not provided
    }

    if (connectionMethod === 'usb') {
      if (!usbVendorId.trim() || !usbProductId.trim()) {
        toast.error('Please discover or enter USB device IDs');
        return;
      }
    }

    const printerConfig: Omit<Printer, 'id' | 'status' | 'totalPrints' | 'testPrintCount' | 'lastUsed' | 'errorLog'> = {
      name: name.trim(),
      type,
      connection: {
        method: connectionMethod,
        address: connectionMethod === 'network' ? ipAddress.trim() : undefined,
        port: connectionMethod === 'network' && port.trim() ? parseInt(port) : undefined,
        usbVendorId: connectionMethod === 'usb' ? usbVendorId.trim() : undefined,
        usbProductId: connectionMethod === 'usb' ? usbProductId.trim() : undefined,
      },
      paperSize,
      station: type === 'kitchen' ? station : undefined,
      enabled,
      autoPrint,
    };

    onSave(printerConfig);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPrinter ? 'Edit Printer' : 'Add New Printer'}</DialogTitle>
          <DialogDescription>
            Configure a new printer for receipts, kitchen tickets, or labels
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="printer-name">Printer Name</Label>
              <Input
                id="printer-name"
                placeholder="e.g., Main Receipt Printer, Kitchen Station 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="printer-type">Printer Type</Label>
                <Select value={type} onValueChange={(value: PrinterType) => setType(value)}>
                  <SelectTrigger id="printer-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">Receipt Printer</SelectItem>
                    <SelectItem value="kitchen">Kitchen Printer</SelectItem>
                    <SelectItem value="label">Label Printer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paper-size">Paper Size</Label>
                <Select value={paperSize} onValueChange={(value: '80mm' | '58mm') => setPaperSize(value)}>
                  <SelectTrigger id="paper-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80mm">80mm (3.15")</SelectItem>
                    <SelectItem value="58mm">58mm (2.28")</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {type === 'kitchen' && (
              <div className="space-y-2">
                <Label htmlFor="station">Kitchen Station</Label>
                <Input
                  id="station"
                  placeholder="e.g., Main, Grill, Salad, Desserts"
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Connection Settings */}
          <div className="space-y-4">
            <Label>Connection Method</Label>
            <Select value={connectionMethod} onValueChange={(value: ConnectionMethod) => setConnectionMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="network">Network (WiFi/Ethernet)</SelectItem>
                <SelectItem value="usb">USB Connection</SelectItem>
                <SelectItem value="bluetooth">Bluetooth</SelectItem>
                <SelectItem value="simulator">Simulator (Testing)</SelectItem>
              </SelectContent>
            </Select>

            {connectionMethod === 'network' && (
              <>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    Enter the printer's IP address (found in printer settings). Port is optional - leave blank to use port 9100, the industry-standard AppSocket port that 99% of thermal receipt printers use by default.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="ip-address">IP Address *</Label>
                    <Input
                      id="ip-address"
                      placeholder="192.168.1.100"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port (Optional)</Label>
                    <Input
                      id="port"
                      placeholder="9100"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {connectionMethod === 'usb' && (
              <>
                {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? (
                  <Alert className="bg-orange-500/10 border-orange-500/20">
                    <Info className="w-4 h-4 text-orange-500" />
                    <AlertDescription className="text-xs">
                      <strong>Mobile Device Detected:</strong> USB printers are not supported in mobile browsers. 
                      Please use <strong>Network (WiFi)</strong> printers instead, or configure from a desktop computer.
                      <br /><br />
                      <strong>Note:</strong> Our native Android app supports USB printers with OTG cables.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        Click "Discover USB Device" to automatically detect your printer, or manually enter vendor and product IDs.
                      </AlertDescription>
                    </Alert>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDiscoverUSB}
                      disabled={isDiscovering}
                      className="w-full"
                    >
                      {isDiscovering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Discover USB Device
                    </Button>
                  </>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-id">Vendor ID</Label>
                    <Input
                      id="vendor-id"
                      placeholder="0x04b8"
                      value={usbVendorId}
                      onChange={(e) => setUsbVendorId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-id">Product ID</Label>
                    <Input
                      id="product-id"
                      placeholder="0x0e28"
                      value={usbProductId}
                      onChange={(e) => setUsbProductId(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {connectionMethod === 'bluetooth' && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Bluetooth printing will be supported in a future update. Use network or USB for now.
                </AlertDescription>
              </Alert>
            )}

            {connectionMethod === 'simulator' && (
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <Info className="w-4 h-4 text-blue-500" />
                <AlertDescription className="text-xs">
                  Simulator mode will show receipts in your browser instead of printing. Perfect for testing!
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Printer</Label>
                <p className="text-xs text-muted-foreground">
                  Printer will be active and ready to use
                </p>
              </div>
              <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-print">Auto-Print</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically print when orders are completed
                </p>
              </div>
              <Switch id="auto-print" checked={autoPrint} onCheckedChange={setAutoPrint} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingPrinter ? 'Save Changes' : 'Add Printer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
