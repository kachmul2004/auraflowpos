import { Order } from './types';

/**
 * Print utilities for receipt printing
 */

export interface PrintOptions {
  autoCut?: boolean;
  copies?: number;
  printerType?: 'browser' | 'thermal' | 'standard';
}

/**
 * Print receipt using browser print dialog
 */
export const printReceiptBrowser = (receiptHtml: string, options: PrintOptions = {}) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Could not open print window. Please allow popups.');
  }

  const styles = `
    <style>
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Courier New', monospace;
        }
        .receipt-template {
          width: 80mm;
          padding: 5mm;
        }
        .no-print {
          display: none !important;
        }
      }
      body {
        font-family: 'Courier New', monospace;
        padding: 20px;
      }
    </style>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt</title>
        ${styles}
      </head>
      <body>
        ${receiptHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      
      // Close window after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    }, 250);
  };
};

/**
 * Generate receipt HTML for printing
 */
export const generateReceiptHTML = (order: Order, businessInfo?: any, options?: any): string => {
  // This would render the ReceiptTemplate to HTML string
  // For now, return a basic template
  return `
    <div class="receipt-template">
      <h2 style="text-align: center;">${businessInfo?.name || 'AuraFlow POS'}</h2>
      <p style="text-align: center;">Order #${order.orderNumber}</p>
      <!-- Receipt content would be generated here -->
    </div>
  `;
};

/**
 * Download receipt as PDF
 */
export const downloadReceiptPDF = async (order: Order, businessInfo?: any) => {
  // This would use a library like jsPDF to generate PDF
  // For now, we'll prepare the structure
  console.log('PDF generation would happen here for order:', order.orderNumber);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, filename: `receipt-${order.orderNumber}.pdf` });
    }, 1000);
  });
};

/**
 * Check if browser supports printing
 */
export const checkPrintSupport = (): boolean => {
  return typeof window !== 'undefined' && 'print' in window;
};

/**
 * Get printer status (for thermal printers)
 */
export const getPrinterStatus = async (): Promise<'online' | 'offline' | 'unknown'> => {
  // This would check thermal printer connection
  // For now, return unknown
  return 'unknown';
};

/**
 * Format receipt text for thermal printer
 */
export const formatForThermal = (order: Order): string[] => {
  const lines: string[] = [];
  
  // Center align function
  const center = (text: string, width: number = 32): string => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  // Right align for prices
  const rightAlign = (label: string, value: string, width: number = 32): string => {
    const spaces = width - label.length - value.length;
    return label + ' '.repeat(Math.max(1, spaces)) + value;
  };

  // Header
  lines.push(center('AuraFlow POS Demo Store'));
  lines.push(center('123 Main Street'));
  lines.push(center('New York, NY 10001'));
  lines.push(center('(555) 123-4567'));
  lines.push('--------------------------------');
  
  // Order info
  lines.push(`Order #: ${order.orderNumber}`);
  lines.push(`Date: ${new Date(order.dateCreated).toLocaleDateString()}`);
  lines.push(`Time: ${new Date(order.dateCreated).toLocaleTimeString()}`);
  lines.push('--------------------------------');
  
  // Items
  lines.push('ITEMS');
  order.items.forEach(item => {
    const itemLine = `${item.quantity}x ${item.name}`;
    const price = `$${(item.price * item.quantity).toFixed(2)}`;
    lines.push(rightAlign(itemLine, price));
    
    // Modifiers
    if (item.modifiers && item.modifiers.length > 0) {
      item.modifiers.forEach(mod => {
        lines.push(`  + ${mod.name}`);
      });
    }
  });
  
  lines.push('--------------------------------');
  
  // Totals
  lines.push(rightAlign('Subtotal:', `$${order.subtotal.toFixed(2)}`));
  lines.push(rightAlign('Tax:', `$${order.tax.toFixed(2)}`));
  if (order.tip && order.tip > 0) {
    lines.push(rightAlign('Tip:', `$${order.tip.toFixed(2)}`));
  }
  lines.push('================================');
  lines.push(rightAlign('TOTAL:', `$${order.total.toFixed(2)}`));
  lines.push('================================');
  
  // Payment
  lines.push('');
  lines.push(`Payment: ${order.paymentMethod}`);
  
  if (order.changeGiven && order.changeGiven > 0) {
    lines.push(rightAlign('Change:', `$${order.changeGiven.toFixed(2)}`));
  }
  
  lines.push('');
  lines.push(center('Thank You!'));
  lines.push('');
  lines.push('');
  
  return lines;
};

/**
 * Test print functionality
 */
export const testPrint = () => {
  const testContent = `
    <div style="font-family: monospace; padding: 20px; max-width: 80mm; margin: 0 auto;">
      <h2 style="text-align: center;">TEST PRINT</h2>
      <p style="text-align: center;">If you can read this, printing works!</p>
      <div style="margin-top: 20px;">
        <p>Line 1: Normal text</p>
        <p><strong>Line 2: Bold text</strong></p>
        <p style="font-size: 10px;">Line 3: Small text</p>
        <p style="font-size: 16px;">Line 4: Large text</p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p>===========================</p>
        <p>TEST SUCCESSFUL</p>
        <p>===========================</p>
      </div>
    </div>
  `;
  
  printReceiptBrowser(testContent);
};
