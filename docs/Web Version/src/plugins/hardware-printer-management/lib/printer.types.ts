// Hardware & Printer Management - Type Definitions

export type PrinterType = 'receipt' | 'kitchen' | 'label';
export type PrinterStatus = 'online' | 'offline' | 'error';
export type ConnectionMethod = 'usb' | 'network' | 'bluetooth' | 'simulator';
export type PaperSize = '58mm' | '80mm';
export type FontSize = 'small' | 'medium' | 'large';
export type CourseTiming = 'appetizer' | 'entree' | 'dessert' | 'beverage';

export interface PrinterConnection {
  method: ConnectionMethod;
  address?: string;              // IP address or USB path
  port?: number;                 // Network port (default: 9100)
  deviceId?: string;             // USB device ID
}

export interface PrinterError {
  id: string;
  timestamp: Date;
  error: string;
  details?: string;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface Printer {
  id: string;
  name: string;
  type: PrinterType;
  connection: PrinterConnection;
  station?: string;              // Kitchen station name (for kitchen printers)
  categories?: string[];         // Auto-route these categories
  status: PrinterStatus;
  paperSize: PaperSize;
  enabled: boolean;
  testPrintCount: number;
  totalPrints: number;
  lastUsed?: Date;
  errorLog: PrinterError[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KitchenRoutingRule {
  id: string;
  name: string;
  printerId: string;             // Target printer
  categories: string[];          // Product categories to route
  priority: number;              // 1-5 (5=highest, used for conflicts)
  autoFire: boolean;             // Print immediately when item added
  delayMinutes?: number;         // Fire after delay (for course timing)
  courseTiming?: CourseTiming;   // Optional course-based timing
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceiptSettings {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;
  logo?: string;                 // Base64 encoded image
  logoWidth?: number;            // Logo width in pixels
  headerText?: string;           // Custom header message
  footerText?: string;           // Custom footer message
  fontSize: FontSize;
  paperSize: PaperSize;
  showItemDetails: boolean;      // Show SKU, category, etc.
  showBarcode: boolean;          // Show transaction barcode
  showQRCode: boolean;           // Show QR code for digital receipt
  taxIdNumber?: string;          // Tax ID / EIN
  showTaxBreakdown: boolean;     // Show tax details
  showPaymentMethod: boolean;    // Show how customer paid
  showCashierName: boolean;      // Show who processed sale
  receiptCopies: number;         // Number of copies to print
  updatedAt: Date;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  printerId: string;
  items: KitchenTicketItem[];
  station: string;
  priority: number;
  courseTiming?: CourseTiming;
  fireAt?: Date;                 // When to print (for delayed items)
  printedAt?: Date;
  status: 'pending' | 'printed' | 'failed';
  retryCount: number;
}

export interface KitchenTicketItem {
  productId: string;
  name: string;
  quantity: number;
  modifiers?: string[];
  specialInstructions?: string;
  category: string;
}

export interface PrintJob {
  id: string;
  printerId: string;
  type: 'receipt' | 'kitchen' | 'test';
  content: string;               // ESC/POS formatted content
  status: 'queued' | 'printing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  retryCount: number;
}

export interface PrinterStats {
  printerId: string;
  printerName: string;
  printsToday: number;
  printsThisWeek: number;
  printsThisMonth: number;
  totalPrints: number;
  lastPrintTime?: Date;
  averagePrintTime: number;      // milliseconds
  errorRate: number;             // percentage
  uptime: number;                // percentage
}

export interface HardwareDiagnostics {
  printers: PrinterDiagnostic[];
  systemStatus: 'healthy' | 'degraded' | 'critical';
  lastChecked: Date;
  totalPrintsToday: number;
  errorCount: number;
  warnings: string[];
}

export interface PrinterDiagnostic {
  printer: Printer;
  isOnline: boolean;
  isPaperLow: boolean;
  lastError?: PrinterError;
  stats: PrinterStats;
  connectionLatency?: number;    // milliseconds
  queueLength: number;
}

// Printing service interfaces
export interface IPrinterService {
  print(printerId: string, content: string): Promise<void>;
  testPrint(printerId: string): Promise<boolean>;
  checkStatus(printerId: string): Promise<PrinterStatus>;
  getStats(printerId: string): Promise<PrinterStats>;
}

export interface IReceiptGenerator {
  generateReceipt(transaction: any, settings: ReceiptSettings): string;
  generateKitchenTicket(ticket: KitchenTicket, settings: ReceiptSettings): string;
  generateTestReceipt(printer: Printer): string;
}
