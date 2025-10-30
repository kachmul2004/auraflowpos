import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ReceiptTemplate } from './ReceiptTemplate';
import { Order } from '../lib/types';
import { Printer, FileDown, Mail, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { printReceiptBrowser, testPrint } from '../lib/receiptUtils';
import { generateESCPOSReceipt, sendToPrinter } from '../lib/escposUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useStore } from '../lib/store';

interface PrintReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onEmailClick?: () => void;
}

export function PrintReceiptDialog({
  open,
  onClose,
  order,
  onEmailClick,
}: PrintReceiptDialogProps) {
  const printers = useStore(state => state.printers);
  const [printing, setPrinting] = useState(false);
  const [printerType, setPrinterType] = useState<'browser' | 'thermal'>('browser');

  const handlePrint = async () => {
    setPrinting(true);
    
    try {
      if (printerType === 'browser') {
        // Print using browser print dialog
        const receiptElement = document.getElementById('receipt-preview');
        if (!receiptElement) {
          throw new Error('Receipt element not found');
        }
        
        printReceiptBrowser(receiptElement.outerHTML);
        toast.success('Print dialog opened');
      } else {
        // Print to thermal printer
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🖨️  CASHIER RECEIPT PRINT REQUEST');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Find default receipt printer
        const receiptPrinter = printers.find(p => 
          p.type === 'receipt' && 
          p.enabled && 
          p.connection.method === 'network'
        );
        
        console.log('Available printers:', printers.length);
        console.log('Receipt printer found:', receiptPrinter ? receiptPrinter.name : 'None');
        
        if (!receiptPrinter) {
          console.error('❌ No network receipt printer configured');
          throw new Error('No network printer configured. Please configure a printer in Admin → Hardware Management.');
        }
        
        if (!receiptPrinter.connection.address) {
          console.error('❌ Printer has no address:', receiptPrinter);
          throw new Error(`Printer "${receiptPrinter.name}" has no network address configured.`);
        }
        
        console.log('Using printer:', {
          name: receiptPrinter.name,
          address: receiptPrinter.connection.address,
          port: receiptPrinter.connection.port || 9100,
        });
        
        const escposCommands = generateESCPOSReceipt(order, {
          businessName: 'AuraFlow POS Demo Store',
          businessAddress: '123 Main Street, New York, NY 10001',
          businessPhone: '(555) 123-4567',
          autoCut: true,
        });
        
        console.log('Generated ESC/POS commands:', escposCommands.length, 'bytes');
        console.log('Sending to printer...');
        
        await sendToPrinter(
          escposCommands,
          receiptPrinter.connection.address,
          receiptPrinter.connection.port || 9100
        );
        
        console.log('✅ Receipt sent successfully');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        toast.success('Receipt sent to printer', {
          description: `Printed to ${receiptPrinter.name}`,
        });
      }
      
      // Close dialog after short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print receipt');
    } finally {
      setPrinting(false);
    }
  };

  const handleTestPrint = () => {
    testPrint();
    toast.info('Test print sent');
  };

  const handleDownloadPDF = () => {
    toast.info('PDF download will be available soon');
    // Future: Implement PDF generation
  };

  const handleEmail = () => {
    if (onEmailClick) {
      onEmailClick();
    } else {
      toast.info('Email receipt feature coming soon');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Print Receipt
          </DialogTitle>
          <DialogDescription>
            Preview and print receipt for Order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={printerType} onValueChange={(v) => setPrinterType(v as any)} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browser">
              <Printer className="w-4 h-4 mr-2" />
              Browser Print
            </TabsTrigger>
            <TabsTrigger value="thermal">
              <Printer className="w-4 h-4 mr-2" />
              Thermal Printer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="flex-1 overflow-auto mt-4">
            <div className="bg-gray-100 p-6 rounded-lg overflow-auto max-h-[500px]">
              <div id="receipt-preview" className="bg-white shadow-lg mx-auto" style={{ width: 'fit-content' }}>
                <ReceiptTemplate
                  order={order}
                  showLogo={true}
                  showTaxId={true}
                  showThankYou={true}
                  receiptType="sale"
                  forPrint={true}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="thermal" className="flex-1 overflow-auto mt-4">
            <div className="bg-gray-900 p-6 rounded-lg overflow-auto max-h-[500px]">
              <div className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                {/* Preview of thermal printer output */}
                <div className="bg-black p-4 rounded border border-green-500">
                  <div className="text-center">
                    <div className="text-lg font-bold">AURAFLOW POS DEMO STORE</div>
                    <div>123 Main Street</div>
                    <div>New York, NY 10001</div>
                    <div>(555) 123-4567</div>
                    <div className="my-2">--------------------------------</div>
                  </div>
                  
                  <div>
                    <div>Order #: {order.orderNumber}</div>
                    <div>Date: {new Date(order.dateCreated).toLocaleDateString()}</div>
                    <div>Time: {new Date(order.dateCreated).toLocaleTimeString()}</div>
                    {order.cashier && <div>Cashier: {order.cashier}</div>}
                    <div className="my-2">--------------------------------</div>
                  </div>
                  
                  <div>
                    <div className="font-bold">ITEMS</div>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="my-2">--------------------------------</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    {order.tip && order.tip > 0 && (
                      <div className="flex justify-between">
                        <span>Tip:</span>
                        <span>${order.tip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="my-2">================================</div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>TOTAL:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="my-2">================================</div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <div className="font-bold">Thank You For Your Business!</div>
                    <div>Please Visit Us Again!</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              {(() => {
                const receiptPrinter = printers.find(p => 
                  p.type === 'receipt' && 
                  p.enabled && 
                  p.connection.method === 'network'
                );
                
                if (receiptPrinter) {
                  return (
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">✅ Network Printer Configured</p>
                      <p><strong>Printer:</strong> {receiptPrinter.name}</p>
                      <p><strong>Address:</strong> {receiptPrinter.connection.address}:{receiptPrinter.connection.port || 9100}</p>
                      <p className="mt-2 text-xs">Receipt will be sent to this printer when you click Print.</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">⚠️ No Network Printer Configured</p>
                      <p>Please configure a network receipt printer in:</p>
                      <p className="font-medium mt-1">Admin → Hardware Management</p>
                    </div>
                  );
                }
              })()}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestPrint}
            >
              Test Print
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            <Button
              variant="outline"
              onClick={handleEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            
            <Button
              onClick={handlePrint}
              disabled={printing}
            >
              <Printer className="w-4 h-4 mr-2" />
              {printing ? 'Printing...' : 'Print'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
