import { Printer, PrintJob, PrinterStatus, IPrinterService } from './printer.types';
import { toast } from 'sonner@2.0.3';

/**
 * Printer Service
 * Handles communication with physical printers and print job management
 */
export class PrinterService implements IPrinterService {
  private printQueue: Map<string, PrintJob[]> = new Map();
  private statusCache: Map<string, PrinterStatus> = new Map();

  /**
   * Send content to printer
   */
  async print(printerId: string, content: string): Promise<void> {
    const printer = this.getPrinterById(printerId);
    
    if (!printer) {
      throw new Error(`Printer not found: ${printerId}`);
    }

    if (!printer.enabled) {
      throw new Error(`Printer is disabled: ${printer.name}`);
    }

    // Check printer status
    const status = await this.checkStatus(printerId);
    if (status === 'offline') {
      throw new Error(`Printer is offline: ${printer.name}`);
    }

    // Create print job
    const job: PrintJob = {
      id: `job-${Date.now()}-${Math.random()}`,
      printerId,
      type: 'receipt',
      content,
      status: 'queued',
      createdAt: new Date(),
      retryCount: 0,
    };

    // Add to queue
    const queue = this.printQueue.get(printerId) || [];
    queue.push(job);
    this.printQueue.set(printerId, queue);

    // Process queue
    await this.processPrintQueue(printerId);
  }

  /**
   * Test printer connection and print test page (accepts printer object directly)
   */
  async testPrintWithPrinter(printer: Printer): Promise<boolean> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🖨️  PRINTER TEST INITIATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('✅ Printer object received:', {
      id: printer.id,
      name: printer.name,
      type: printer.type,
      connection: printer.connection,
      enabled: printer.enabled,
      paperSize: printer.paperSize,
    });

    try {
      const testContent = this.generateTestReceipt(printer);
      console.log('📄 Generated test receipt content:');
      console.log(testContent);
      
      if (printer.connection.method === 'simulator') {
        console.log('🎭 Using SIMULATOR mode');
        // Show simulator dialog
        this.showSimulatorPreview(printer, testContent);
        console.log('✅ Simulator preview displayed');
        return true;
      }

      console.log(`🔌 Attempting to send to ${printer.connection.method.toUpperCase()} printer...`);
      
      // For real printers, attempt actual print
      await this.sendToPrinter(printer, testContent);
      
      console.log('✅ Test print sent successfully!');
      toast.success(`Test print sent to ${printer.name}`);
      return true;
    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ TEST PRINT FAILED');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error('Test print failed', {
        description: error.message,
      });
      return false;
    } finally {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  }

  /**
   * Test printer connection and print test page (deprecated - use testPrintWithPrinter)
   */
  async testPrint(printerId: string): Promise<boolean> {
    console.log('⚠️  testPrint(id) called - this requires store integration');
    console.log('   Printer ID:', printerId);
    
    const printer = this.getPrinterById(printerId);
    
    if (!printer) {
      console.error('❌ Printer not found for ID:', printerId);
      toast.error('Printer not found - store not integrated');
      return false;
    }

    return this.testPrintWithPrinter(printer);
  }

  /**
   * Check printer status
   */
  async checkStatus(printerId: string): Promise<PrinterStatus> {
    const printer = this.getPrinterById(printerId);
    
    if (!printer) {
      return 'offline';
    }

    // Check cache first (avoid constant pinging)
    const cached = this.statusCache.get(printerId);
    if (cached) {
      return cached;
    }

    // For simulator, always online
    if (printer.connection.method === 'simulator') {
      this.statusCache.set(printerId, 'online');
      return 'online';
    }

    // For real printers, attempt connection test
    try {
      const status = await this.pingPrinter(printer);
      this.statusCache.set(printerId, status);
      
      // Cache for 30 seconds
      setTimeout(() => {
        this.statusCache.delete(printerId);
      }, 30000);
      
      return status;
    } catch (error) {
      return 'error';
    }
  }

  /**
   * Get printer statistics
   */
  async getStats(printerId: string): Promise<any> {
    const printer = this.getPrinterById(printerId);
    
    if (!printer) {
      throw new Error('Printer not found');
    }

    return {
      printerId: printer.id,
      printerName: printer.name,
      printsToday: printer.totalPrints, // This would be calculated from actual data
      printsThisWeek: printer.totalPrints,
      printsThisMonth: printer.totalPrints,
      totalPrints: printer.totalPrints,
      lastPrintTime: printer.lastUsed,
      averagePrintTime: 1200, // ms
      errorRate: printer.errorLog.length > 0 ? 5 : 0, // percentage
      uptime: 99.5, // percentage
    };
  }

  /**
   * Private: Process print queue for a printer
   */
  private async processPrintQueue(printerId: string): Promise<void> {
    const queue = this.printQueue.get(printerId) || [];
    const pendingJobs = queue.filter(job => job.status === 'queued');

    for (const job of pendingJobs) {
      try {
        job.status = 'printing';
        
        const printer = this.getPrinterById(printerId);
        if (!printer) continue;

        await this.sendToPrinter(printer, job.content);
        
        job.status = 'completed';
        job.completedAt = new Date();
      } catch (error: any) {
        job.status = 'failed';
        job.error = error.message;
        job.retryCount++;

        // Retry logic (up to 3 times)
        if (job.retryCount < 3) {
          setTimeout(() => {
            job.status = 'queued';
            this.processPrintQueue(printerId);
          }, 5000 * job.retryCount); // Exponential backoff
        }
      }
    }

    // Clean up completed jobs older than 1 hour
    const oneHourAgo = new Date(Date.now() - 3600000);
    const filteredQueue = queue.filter(job => 
      job.status !== 'completed' || 
      (job.completedAt && job.completedAt > oneHourAgo)
    );
    
    this.printQueue.set(printerId, filteredQueue);
  }

  /**
   * Private: Send content to physical printer
   */
  private async sendToPrinter(printer: Printer, content: string): Promise<void> {
    console.log('📤 sendToPrinter() called');
    console.log('   Connection method:', printer.connection.method);
    
    if (printer.connection.method === 'simulator') {
      console.log('   Simulating print delay (500ms)...');
      // Simulate print delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('🖨️ SIMULATED PRINT:', content);
      return;
    }

    if (printer.connection.method === 'network') {
      console.log('   Routing to: printToNetworkPrinter()');
      // Network printer (ESC/POS over TCP/IP)
      await this.printToNetworkPrinter(printer, content);
    } else if (printer.connection.method === 'usb') {
      console.log('   Routing to: printToUSBPrinter()');
      // USB printer (requires WebUSB API)
      await this.printToUSBPrinter(printer, content);
    } else if (printer.connection.method === 'bluetooth') {
      console.log('   Routing to: printToBluetoothPrinter()');
      // Bluetooth printer (requires Web Bluetooth API)
      await this.printToBluetoothPrinter(printer, content);
    }
  }

  /**
   * Private: Print to network printer
   */
  private async printToNetworkPrinter(printer: Printer, content: string): Promise<void> {
    console.log('🌐 printToNetworkPrinter() called');
    
    const { address, port = 9100 } = printer.connection;
    
    console.log('   Network config:', {
      address: address || '(not set)',
      port: port,
      hasAddress: !!address,
    });
    
    if (!address) {
      console.error('   ❌ No address configured');
      throw new Error('Network printer address not configured');
    }

    console.log(`   Target: ${address}:${port}`);
    console.log('   Content length:', content.length, 'characters');
    
    // Import the printer API
    const { sendPrintJob } = await import('../../../lib/api/printer.api');
    
    console.log('   📡 Sending to backend service...');
    
    try {
      const response = await sendPrintJob({
        printerId: printer.id,
        content: content,
        printerAddress: address,
        printerPort: port,
        contentType: 'text', // ESC/POS commands in the future
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Print job failed');
      }
      
      console.log('   ✅ Print job sent successfully');
      console.log('   Job ID:', response.jobId);
      
    } catch (error: any) {
      console.error('   ❌ Print job failed:', error.message);
      throw error;
    }
  }

  /**
   * Private: Print to USB printer
   */
  private async printToUSBPrinter(printer: Printer, content: string): Promise<void> {
    console.log('🔌 printToUSBPrinter() called');
    
    // WebUSB API implementation (browser-based)
    const hasWebUSB = 'usb' in navigator;
    console.log('   WebUSB available:', hasWebUSB);
    
    if (!hasWebUSB) {
      console.error('   ❌ WebUSB not supported in this browser');
      throw new Error('WebUSB not supported in this browser');
    }

    console.log('   USB config:', {
      vendorId: printer.connection.usbVendorId,
      productId: printer.connection.usbProductId,
    });
    console.log('   Content length:', content.length, 'characters');
    
    console.warn('   ⚠️  USB printing not yet implemented');
    console.warn('   ⚠️  Would request USB device');
    console.warn('   ⚠️  Would send ESC/POS commands via USB');
    
    throw new Error('USB printing implementation coming soon');
  }

  /**
   * Private: Print to Bluetooth printer
   */
  private async printToBluetoothPrinter(printer: Printer, content: string): Promise<void> {
    console.log('📶 printToBluetoothPrinter() called');
    
    // Web Bluetooth API implementation
    const hasBluetooth = 'bluetooth' in navigator;
    console.log('   Web Bluetooth available:', hasBluetooth);
    
    if (!hasBluetooth) {
      console.error('   ❌ Web Bluetooth not supported in this browser');
      throw new Error('Web Bluetooth not supported in this browser');
    }

    console.log('   Content length:', content.length, 'characters');
    
    console.warn('   ⚠️  Bluetooth printing not yet implemented');
    console.warn('   ⚠️  Would scan for Bluetooth devices');
    console.warn('   ⚠️  Would send ESC/POS commands via Bluetooth');
    
    throw new Error('Bluetooth printing implementation coming soon');
  }

  /**
   * Private: Ping printer to check status
   */
  private async pingPrinter(printer: Printer): Promise<PrinterStatus> {
    try {
      if (printer.connection.method === 'network') {
        // In real implementation, would ping the network address
        // For now, assume online
        return 'online';
      }
      
      return 'online';
    } catch (error) {
      return 'offline';
    }
  }

  /**
   * Private: Get printer from store (would use Zustand in real implementation)
   */
  private getPrinterById(printerId: string): Printer | null {
    console.log('🔍 getPrinterById() called');
    console.log('   Looking for printer ID:', printerId);
    
    // This would actually fetch from the Zustand store
    // For now, return null (will be implemented when integrated)
    console.error('   ❌ PrinterService not integrated with Zustand store yet');
    console.error('   ❌ This method always returns null');
    console.error('   ❌ Need to pass store reference to PrinterService');
    
    return null;
  }

  /**
   * Private: Generate test receipt content
   */
  private generateTestReceipt(printer: Printer): string {
    return `
=================================
        TEST PRINT
=================================

Printer: ${printer.name}
Type: ${printer.type}
Connection: ${printer.connection.method}
Paper Size: ${printer.paperSize}

=================================
Date: ${new Date().toLocaleString()}
=================================

This is a test print to verify
that your printer is configured
correctly and working properly.

✓ If you can read this, your
  printer is working!

=================================
       AuraFlow POS
=================================
    `.trim();
  }

  /**
   * Private: Show simulator preview dialog
   */
  private showSimulatorPreview(printer: Printer, content: string): void {
    // This would open a modal dialog showing the print preview
    console.log(`
╔═══════════════════════════════╗
║   PRINTER SIMULATOR           ║
╟───────────────────────────────╢
║ ${printer.name.padEnd(29)} ║
╟───────────────────────────────╢
${content.split('\n').map(line => `║ ${line.padEnd(29)} ║`).join('\n')}
╚═══════════════════════════════╝
    `);
  }
}

// Singleton instance
export const printerService = new PrinterService();
