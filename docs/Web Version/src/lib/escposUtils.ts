import { Order } from './types';

/**
 * ESC/POS Command Utilities for Thermal Printers
 * Supports common thermal printer commands for receipt printing
 */

// ESC/POS Command Constants
export const ESC = '\x1B';
export const GS = '\x1D';
export const LF = '\x0A';
export const FF = '\x0C';

/**
 * ESC/POS Commands
 */
export const Commands = {
  // Initialize printer
  INIT: ESC + '@',
  
  // Text formatting
  BOLD_ON: ESC + 'E' + '\x01',
  BOLD_OFF: ESC + 'E' + '\x00',
  UNDERLINE_ON: ESC + '-' + '\x01',
  UNDERLINE_OFF: ESC + '-' + '\x00',
  DOUBLE_WIDTH_ON: ESC + '!' + '\x20',
  DOUBLE_HEIGHT_ON: ESC + '!' + '\x10',
  DOUBLE_SIZE_ON: ESC + '!' + '\x30',
  TEXT_NORMAL: ESC + '!' + '\x00',
  
  // Alignment
  ALIGN_LEFT: ESC + 'a' + '\x00',
  ALIGN_CENTER: ESC + 'a' + '\x01',
  ALIGN_RIGHT: ESC + 'a' + '\x02',
  
  // Line spacing
  LINE_SPACING_DEFAULT: ESC + '2',
  LINE_SPACING_NARROW: ESC + '3' + '\x20',
  
  // Paper
  PAPER_CUT: GS + 'V' + '\x41' + '\x00',
  PAPER_CUT_PARTIAL: GS + 'V' + '\x42' + '\x00',
  
  // Drawer
  OPEN_DRAWER: ESC + 'p' + '\x00' + '\x19' + '\xFA',
  
  // Feed
  FEED_LINE: LF,
  FEED_LINES: (n: number) => ESC + 'd' + String.fromCharCode(n),
};

/**
 * Generate ESC/POS commands for a receipt
 */
export function generateESCPOSReceipt(order: Order, options: {
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  autoCut?: boolean;
  copies?: number;
}): string {
  const {
    businessName = 'AuraFlow POS Demo Store',
    businessAddress = '123 Main Street, New York, NY 10001',
    businessPhone = '(555) 123-4567',
    autoCut = true,
    copies = 1,
  } = options;

  let receipt = '';

  // Initialize printer
  receipt += Commands.INIT;
  
  // Header - Business Name (Large, Bold, Centered)
  receipt += Commands.ALIGN_CENTER;
  receipt += Commands.DOUBLE_SIZE_ON;
  receipt += Commands.BOLD_ON;
  receipt += businessName + LF;
  receipt += Commands.TEXT_NORMAL;
  receipt += Commands.BOLD_OFF;
  
  // Business Address (Small, Centered)
  receipt += businessAddress + LF;
  receipt += businessPhone + LF;
  receipt += LF;
  
  // Receipt Title
  receipt += Commands.BOLD_ON;
  receipt += 'RECEIPT' + LF;
  receipt += Commands.BOLD_OFF;
  receipt += Commands.ALIGN_LEFT;
  
  // Separator
  receipt += '--------------------------------' + LF;
  
  // Order Information
  receipt += `Order #: ${order.orderNumber}` + LF;
  receipt += `Date: ${new Date(order.dateCreated).toLocaleDateString()}` + LF;
  receipt += `Time: ${new Date(order.dateCreated).toLocaleTimeString()}` + LF;
  
  if (order.cashier) {
    receipt += `Cashier: ${order.cashier}` + LF;
  }
  
  if (order.table) {
    receipt += `Table: ${order.table}` + LF;
  }
  
  if (order.customer) {
    receipt += `Customer: ${order.customer.name}` + LF;
  }
  
  receipt += '--------------------------------' + LF;
  
  // Items Header
  receipt += Commands.BOLD_ON;
  receipt += 'ITEMS' + LF;
  receipt += Commands.BOLD_OFF;
  
  // Items
  order.items.forEach(item => {
    const itemName = `${item.quantity}x ${item.name}`;
    const itemPrice = `$${(item.price * item.quantity).toFixed(2)}`;
    const itemLine = formatLine(itemName, itemPrice, 32);
    receipt += itemLine + LF;
    
    // Variation
    if (item.variation) {
      receipt += `  (${item.variation.name})` + LF;
    }
    
    // Modifiers
    if (item.modifiers && item.modifiers.length > 0) {
      item.modifiers.forEach(mod => {
        const modLine = `  + ${mod.name}`;
        if (mod.price > 0) {
          receipt += formatLine(modLine, `$${mod.price.toFixed(2)}`, 32) + LF;
        } else {
          receipt += modLine + LF;
        }
      });
    }
    
    // Notes
    if (item.notes) {
      receipt += `  Note: ${item.notes}` + LF;
    }
  });
  
  receipt += '--------------------------------' + LF;
  
  // Totals
  receipt += formatLine('Subtotal:', `$${order.subtotal.toFixed(2)}`, 32) + LF;
  
  if (order.discount && order.discount > 0) {
    receipt += formatLine('Discount:', `-$${order.discount.toFixed(2)}`, 32) + LF;
  }
  
  receipt += formatLine('Tax:', `$${order.tax.toFixed(2)}`, 32) + LF;
  
  if (order.tip && order.tip > 0) {
    receipt += formatLine('Tip:', `$${order.tip.toFixed(2)}`, 32) + LF;
  }
  
  receipt += '================================' + LF;
  
  // Total (Bold, Large)
  receipt += Commands.DOUBLE_WIDTH_ON;
  receipt += Commands.BOLD_ON;
  receipt += formatLine('TOTAL:', `$${order.total.toFixed(2)}`, 16) + LF;
  receipt += Commands.TEXT_NORMAL;
  receipt += Commands.BOLD_OFF;
  
  receipt += '================================' + LF;
  receipt += LF;
  
  // Payment
  receipt += Commands.BOLD_ON;
  receipt += 'PAYMENT' + LF;
  receipt += Commands.BOLD_OFF;
  
  if (order.payments && order.payments.length > 0) {
    order.payments.forEach(payment => {
      receipt += formatLine(
        payment.method.charAt(0).toUpperCase() + payment.method.slice(1) + ':',
        `$${payment.amount.toFixed(2)}`,
        32
      ) + LF;
    });
  } else if (order.paymentMethod) {
    receipt += formatLine(
      order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) + ':',
      `$${order.total.toFixed(2)}`,
      32
    ) + LF;
  }
  
  if (order.changeGiven && order.changeGiven > 0) {
    receipt += LF;
    receipt += Commands.BOLD_ON;
    receipt += formatLine('Change:', `$${order.changeGiven.toFixed(2)}`, 32) + LF;
    receipt += Commands.BOLD_OFF;
  }
  
  receipt += LF;
  
  // Return Policy
  receipt += '--------------------------------' + LF;
  receipt += Commands.ALIGN_CENTER;
  receipt += 'RETURN POLICY' + LF;
  receipt += Commands.ALIGN_LEFT;
  receipt += 'Items may be returned within 30' + LF;
  receipt += 'days with receipt.' + LF;
  
  // Training Mode Warning
  if (order.isTrainingMode) {
    receipt += LF;
    receipt += Commands.ALIGN_CENTER;
    receipt += Commands.BOLD_ON;
    receipt += '*** TRAINING MODE ***' + LF;
    receipt += 'NOT A REAL TRANSACTION' + LF;
    receipt += Commands.BOLD_OFF;
    receipt += Commands.ALIGN_LEFT;
  }
  
  receipt += LF;
  
  // Thank You
  receipt += Commands.ALIGN_CENTER;
  receipt += Commands.BOLD_ON;
  receipt += 'Thank You For Your Business!' + LF;
  receipt += Commands.BOLD_OFF;
  receipt += 'Please Visit Us Again!' + LF;
  receipt += LF;
  
  // Footer
  receipt += `Order #${order.orderNumber}` + LF;
  
  // Feed and cut
  receipt += LF + LF + LF;
  
  if (autoCut) {
    receipt += Commands.PAPER_CUT;
  }
  
  return receipt;
}

/**
 * Format a line with left and right aligned text
 */
function formatLine(left: string, right: string, width: number = 32): string {
  const spaces = width - left.length - right.length;
  if (spaces <= 0) {
    // If text is too long, truncate left side
    return left.substring(0, width - right.length - 1) + ' ' + right;
  }
  return left + ' '.repeat(spaces) + right;
}

/**
 * Center text within a given width
 */
export function centerText(text: string, width: number = 32): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Generate test receipt
 */
export function generateTestReceipt(): string {
  let receipt = '';
  
  receipt += Commands.INIT;
  receipt += Commands.ALIGN_CENTER;
  receipt += Commands.DOUBLE_SIZE_ON;
  receipt += Commands.BOLD_ON;
  receipt += 'TEST PRINT' + LF;
  receipt += Commands.TEXT_NORMAL;
  receipt += Commands.BOLD_OFF;
  receipt += LF;
  
  receipt += Commands.ALIGN_LEFT;
  receipt += 'Normal text' + LF;
  receipt += Commands.BOLD_ON + 'Bold text' + LF + Commands.BOLD_OFF;
  receipt += Commands.UNDERLINE_ON + 'Underlined text' + LF + Commands.UNDERLINE_OFF;
  receipt += LF;
  
  receipt += Commands.ALIGN_CENTER;
  receipt += '================================' + LF;
  receipt += 'If you can read this clearly,' + LF;
  receipt += 'your printer is working!' + LF;
  receipt += '================================' + LF;
  receipt += LF + LF + LF;
  
  receipt += Commands.PAPER_CUT;
  
  return receipt;
}

/**
 * Send ESC/POS commands to printer
 * Uses the network print backend service
 */
export async function sendToPrinter(commands: string, printerAddress?: string, printerPort?: number): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🖨️  SENDING TO PRINTER');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Content length:', commands.length, 'bytes');
  console.log('Printer address:', printerAddress || 'Not specified');
  console.log('Printer port:', printerPort || 9100);
  
  // Import the printer API
  const { sendPrintJob } = await import('./api/printer.api');
  
  try {
    if (!printerAddress) {
      console.error('❌ No printer address provided');
      throw new Error('No printer address provided. This is a programming error - printer info should be passed to sendToPrinter().');
    }
    
    const address = printerAddress;
    const port = printerPort || 9100;
    
    console.log('📡 Sending to network printer:', `${address}:${port}`);
    
    const response = await sendPrintJob({
      printerId: 'default-receipt-printer',
      content: commands,
      printerAddress: address,
      printerPort: port,
      contentType: 'text',
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Print job failed');
    }
    
    console.log('✅ Print job sent successfully');
    console.log('Job ID:', response.jobId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error: any) {
    console.error('❌ Print failed:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
}

/**
 * Check if WebUSB is supported
 */
export function isWebUSBSupported(): boolean {
  return 'usb' in navigator;
}

/**
 * Request USB printer access
 */
export async function requestPrinterAccess(): Promise<USBDevice | null> {
  if (!isWebUSBSupported()) {
    throw new Error('WebUSB is not supported in this browser');
  }
  
  try {
    // Request access to USB devices (thermal printers typically use vendor-specific class)
    const device = await (navigator as any).usb.requestDevice({
      filters: [
        { classCode: 0x07 }, // Printer class
      ],
    });
    
    return device;
  } catch (error) {
    console.error('Failed to access printer:', error);
    return null;
  }
}
