import { ReceiptSettings, KitchenTicket, Printer, IReceiptGenerator } from './printer.types';
import { format } from 'date-fns';

/**
 * Receipt Template Generator
 * Generates ESC/POS formatted receipts for thermal printers
 */
export class ReceiptGenerator implements IReceiptGenerator {
  /**
   * Generate customer receipt
   */
  generateReceipt(transaction: any, settings: ReceiptSettings): string {
    const lines: string[] = [];
    const width = settings.paperSize === '80mm' ? 48 : 32;

    // Header with logo placeholder
    if (settings.logo) {
      lines.push('[LOGO]'); // Logo would be rendered as bitmap
      lines.push('');
    }

    // Business info
    lines.push(this.center(settings.businessName, width));
    lines.push(this.center(settings.address, width));
    lines.push(this.center(`${settings.city}, ${settings.state} ${settings.zipCode}`, width));
    lines.push(this.center(settings.phone, width));
    
    if (settings.email) {
      lines.push(this.center(settings.email, width));
    }
    
    if (settings.website) {
      lines.push(this.center(settings.website, width));
    }

    if (settings.taxIdNumber) {
      lines.push(this.center(`Tax ID: ${settings.taxIdNumber}`, width));
    }

    lines.push('');
    lines.push(this.separator(width));
    lines.push('');

    // Custom header text
    if (settings.headerText) {
      lines.push(this.center(settings.headerText, width));
      lines.push('');
    }

    // Transaction info
    lines.push(`Order #: ${transaction.orderNumber || transaction.id}`);
    lines.push(`Date: ${format(new Date(transaction.dateCreated || transaction.timestamp), 'MMM dd, yyyy')}`);
    lines.push(`Time: ${format(new Date(transaction.dateCreated || transaction.timestamp), 'hh:mm a')}`);
    
    if (settings.showCashierName && transaction.cashier) {
      lines.push(`Cashier: ${transaction.cashier}`);
    }

    if (transaction.customer) {
      lines.push(`Customer: ${transaction.customer.name || 'Guest'}`);
    }

    if (transaction.orderType) {
      lines.push(`Type: ${this.capitalize(transaction.orderType)}`);
    }

    lines.push('');
    lines.push(this.separator(width));
    lines.push('');

    // Items
    lines.push(this.row('ITEM', 'QTY', 'PRICE', width));
    lines.push(this.separator(width, '-'));

    (transaction.items || []).forEach((item: any) => {
      const name = item.name || item.product?.name || 'Unknown';
      const qty = item.quantity || 1;
      const price = (item.totalPrice || item.unitPrice * qty).toFixed(2);

      lines.push(this.itemRow(name, qty, price, width));

      // Show modifiers if enabled
      if (settings.showItemDetails && item.modifiers && item.modifiers.length > 0) {
        item.modifiers.forEach((mod: any) => {
          lines.push(`  + ${mod.name}${mod.price ? ` ($${mod.price.toFixed(2)})` : ''}`);
        });
      }

      // Show SKU if enabled
      if (settings.showItemDetails && item.sku) {
        lines.push(`    SKU: ${item.sku}`);
      }

      // Special instructions
      if (item.specialInstructions) {
        lines.push(`    Note: ${item.specialInstructions}`);
      }
    });

    lines.push('');
    lines.push(this.separator(width, '-'));

    // Subtotal
    const subtotal = transaction.subtotal || 0;
    lines.push(this.amountRow('Subtotal:', subtotal, width));

    // Discounts
    if (transaction.discount && transaction.discount > 0) {
      lines.push(this.amountRow('Discount:', -transaction.discount, width));
    }

    // Tax
    if (settings.showTaxBreakdown && transaction.tax) {
      lines.push(this.amountRow(`Tax (${((transaction.taxRate || 0.08) * 100).toFixed(1)}%):`, transaction.tax, width));
    } else if (transaction.tax) {
      lines.push(this.amountRow('Tax:', transaction.tax, width));
    }

    // Tip
    if (transaction.tip && transaction.tip > 0) {
      lines.push(this.amountRow('Tip:', transaction.tip, width));
    }

    lines.push(this.separator(width));
    lines.push('');

    // Total
    const total = transaction.total || 0;
    lines.push(this.amountRow('TOTAL:', total, width, true));

    lines.push('');
    lines.push(this.separator(width));
    lines.push('');

    // Payment method
    if (settings.showPaymentMethod && transaction.paymentMethods) {
      transaction.paymentMethods.forEach((pm: any) => {
        const method = this.capitalize(pm.method || pm);
        const amount = pm.amount || total;
        lines.push(this.amountRow(`Paid (${method}):`, amount, width));
      });
      lines.push('');
    }

    // Change
    if (transaction.change && transaction.change > 0) {
      lines.push(this.amountRow('Change:', transaction.change, width));
      lines.push('');
    }

    // Barcode
    if (settings.showBarcode) {
      lines.push(this.center('[BARCODE]', width));
      lines.push(this.center(transaction.id || transaction.orderNumber, width));
      lines.push('');
    }

    // QR Code
    if (settings.showQRCode) {
      lines.push(this.center('[QR CODE]', width));
      lines.push('');
    }

    // Custom footer text
    if (settings.footerText) {
      lines.push(this.center(settings.footerText, width));
      lines.push('');
    }

    // Standard footer
    lines.push(this.separator(width));
    lines.push(this.center('Thank you for your business!', width));
    lines.push(this.center('Please come again', width));
    lines.push(this.separator(width));

    // Feed extra paper for tear-off
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Generate kitchen ticket
   */
  generateKitchenTicket(ticket: KitchenTicket, settings: ReceiptSettings): string {
    const lines: string[] = [];
    const width = settings.paperSize === '80mm' ? 48 : 32;

    // Header
    lines.push(this.separator(width, '='));
    lines.push(this.center('** KITCHEN TICKET **', width));
    lines.push(this.separator(width, '='));
    lines.push('');

    // Order info
    lines.push(`Order #: ${ticket.orderId}`);
    lines.push(`Station: ${ticket.station}`);
    lines.push(`Time: ${format(new Date(), 'hh:mm a')}`);
    
    if (ticket.courseTiming) {
      lines.push(`Course: ${this.capitalize(ticket.courseTiming)}`);
    }

    if (ticket.priority > 3) {
      lines.push('');
      lines.push(this.center('!!! PRIORITY !!!', width));
    }

    lines.push('');
    lines.push(this.separator(width, '-'));
    lines.push('');

    // Items
    ticket.items.forEach(item => {
      const qty = item.quantity;
      const name = item.name;

      lines.push(`${qty}x ${name}`);

      // Modifiers
      if (item.modifiers && item.modifiers.length > 0) {
        item.modifiers.forEach(mod => {
          lines.push(`  + ${mod}`);
        });
      }

      // Special instructions
      if (item.specialInstructions) {
        lines.push('');
        lines.push(`  *** ${item.specialInstructions.toUpperCase()} ***`);
        lines.push('');
      }

      lines.push('');
    });

    lines.push(this.separator(width, '='));
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Generate test receipt
   */
  generateTestReceipt(printer: Printer): string {
    const lines: string[] = [];
    const width = printer.paperSize === '80mm' ? 48 : 32;

    lines.push(this.separator(width, '='));
    lines.push(this.center('TEST PRINT', width));
    lines.push(this.separator(width, '='));
    lines.push('');
    lines.push(`Printer: ${printer.name}`);
    lines.push(`Type: ${this.capitalize(printer.type)}`);
    lines.push(`Connection: ${this.capitalize(printer.connection.method)}`);
    lines.push(`Paper Size: ${printer.paperSize}`);
    lines.push('');
    lines.push(this.separator(width, '='));
    lines.push(`Date: ${format(new Date(), 'MMM dd, yyyy')}`);
    lines.push(`Time: ${format(new Date(), 'hh:mm:ss a')}`);
    lines.push(this.separator(width, '='));
    lines.push('');
    lines.push('This is a test print to verify');
    lines.push('that your printer is configured');
    lines.push('correctly and working properly.');
    lines.push('');
    lines.push('✓ If you can read this, your');
    lines.push('  printer is working!');
    lines.push('');
    lines.push(this.separator(width, '='));
    lines.push(this.center('AuraFlow POS', width));
    lines.push(this.separator(width, '='));
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }

  // Helper functions
  private separator(width: number, char: string = '='): string {
    return char.repeat(width);
  }

  private center(text: string, width: number): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  private row(col1: string, col2: string, col3: string, width: number): string {
    const col1Width = Math.floor(width * 0.5);
    const col2Width = Math.floor(width * 0.15);
    const col3Width = width - col1Width - col2Width;

    return (
      col1.padEnd(col1Width) +
      col2.padStart(col2Width) +
      col3.padStart(col3Width)
    );
  }

  private itemRow(name: string, qty: number, price: string, width: number): string {
    // Truncate name if too long
    const maxNameLength = width - 15;
    const truncatedName = name.length > maxNameLength 
      ? name.substring(0, maxNameLength - 3) + '...'
      : name;

    const qtyStr = qty.toString();
    const priceStr = `$${price}`;

    const col1Width = width - qtyStr.length - priceStr.length - 2;

    return (
      truncatedName.padEnd(col1Width) +
      ' ' +
      qtyStr.padStart(3) +
      ' ' +
      priceStr.padStart(8)
    );
  }

  private amountRow(label: string, amount: number, width: number, bold: boolean = false): string {
    const amountStr = `$${Math.abs(amount).toFixed(2)}`;
    const prefix = amount < 0 ? '-' : '';
    const labelWidth = width - amountStr.length - prefix.length - 1;

    let row = label.padEnd(labelWidth) + ' ' + prefix + amountStr;

    if (bold) {
      row = row.toUpperCase();
    }

    return row;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

// Singleton instance
export const receiptGenerator = new ReceiptGenerator();
