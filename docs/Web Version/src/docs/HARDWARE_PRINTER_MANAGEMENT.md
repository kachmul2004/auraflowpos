# Hardware & Printer Management Plugin

**Phase**: 2.5 - Week 8 (Days 4-7)  
**Status**: ✅ Network Printing Working  
**Goal**: Square-competitive printer & hardware management  

---

## 🎯 Overview

Professional printer and hardware management for multi-station environments. Inspired by Square's simple but powerful approach to hardware configuration.

### Core Features

1. **Printer Configuration**
   - Receipt printers (front-of-house)
   - Kitchen printers (back-of-house)
   - Label printers (optional)
   - Test printing

2. **Kitchen Routing**
   - Auto-route items by category
   - Multiple kitchen stations
   - Priority & timing rules
   - Fire delayed items

3. **Receipt Customization**
   - Logo upload
   - Header/footer text
   - Font size options
   - Paper size (58mm, 80mm)

4. **Hardware Diagnostics**
   - Printer status monitoring
   - Connection testing
   - Error logging
   - Health dashboard

---

## 🏗️ Architecture

### Plugin Structure

```
/plugins/hardware-printer-management/
  ├── index.ts                          # Plugin registration
  ├── components/
  │   ├── HardwareManagement.tsx        # Main admin UI
  │   ├── PrinterConfigDialog.tsx       # Add/edit printers
  │   ├── KitchenRoutingConfig.tsx      # Category routing
  │   ├── ReceiptCustomizer.tsx         # Receipt design
  │   ├── HardwareDiagnostics.tsx       # Status & testing
  │   └── TestPrintDialog.tsx           # Test print UI
  └── lib/
      ├── printer.types.ts              # TypeScript types
      ├── printer.service.ts            # Printer operations
      ├── escpos.utils.ts               # ESC/POS formatting
      └── receipt.template.ts           # Receipt generation
```

---

## 🖥️ Platform Support

### Connection Methods by Platform

| Connection Method | Desktop (Chrome/Edge) | Mobile Browsers | Native Android App | Notes |
|------------------|----------------------|-----------------|-------------------|-------|
| **Network (WiFi/Ethernet)** | ✅ Full Support | ✅ Full Support | ✅ Full Support | **Recommended for all platforms** |
| **USB** | ✅ Full Support | ❌ Not Supported | ✅ Full Support | Desktop browser or native app only |
| **Bluetooth** | 🚧 Planned | 🚧 Planned | 🚧 Planned | Future enhancement |
| **Simulator** | ✅ Full Support | ✅ Full Support | ✅ Full Support | Testing mode - works everywhere |

### Recommendations

**For Mobile Browsers (iOS & Android):**
- ✅ Use **Network printers** - fully supported on all mobile browsers
- ❌ USB not supported in web browsers (use native Android app for USB)
- ✅ Simulator mode for testing

**For Desktop:**
- ✅ USB printers work great with Chrome, Edge, and Chromium browsers
- ✅ Network printers recommended for multi-device flexibility
- ✅ Auto-discovery available for USB devices
- ✅ All connection types fully supported

**For Native Android App:**
- ✅ USB printers with OTG cable fully supported
- ✅ Network printers fully supported
- ✅ All desktop features available

**Best Practices:**
- 🌟 **Network printers provide the most flexibility** across all devices
- 🖥️ Set up printers from desktop browser for easiest configuration
- 📱 Use same printer setup from any device (desktop, tablet, phone)
- 🔄 Keep backup network printer configured for redundancy
- 💡 Start with Simulator mode for testing before buying hardware
- 📲 Use native Android app if you need USB printer support on mobile

---

## 📋 Data Models

### Printer Configuration

```typescript
interface Printer {
  id: string;
  name: string;
  type: 'receipt' | 'kitchen' | 'label';
  connection: PrinterConnection;
  station?: string;              // Kitchen station name
  categories?: string[];         // Auto-route these categories
  status: 'online' | 'offline' | 'error';
  paperSize: '58mm' | '80mm';
  enabled: boolean;
  testPrintCount: number;
  lastUsed?: Date;
  errorLog: PrinterError[];
}

interface PrinterConnection {
  method: 'usb' | 'network' | 'bluetooth' | 'simulator';
  address?: string;              // IP address or USB path
  port?: number;                 // Network port
  deviceId?: string;             // USB device ID
}

interface PrinterError {
  timestamp: Date;
  error: string;
  resolved: boolean;
}
```

### Kitchen Routing Rules

```typescript
interface KitchenRoutingRule {
  id: string;
  name: string;
  printerId: string;             // Target printer
  categories: string[];          // Product categories
  priority: number;              // 1-5 (5=highest)
  autoFire: boolean;             // Print immediately
  delayMinutes?: number;         // Fire after delay
  courseTiming?: 'appetizer' | 'entree' | 'dessert';
}
```

### Receipt Settings

```typescript
interface ReceiptSettings {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  logo?: string;                 // Base64 image
  headerText?: string;
  footerText?: string;
  fontSize: 'small' | 'medium' | 'large';
  paperSize: '58mm' | '80mm';
  showItemDetails: boolean;
  showBarcode: boolean;
  showQRCode: boolean;
  taxIdNumber?: string;
}
```

---

## 🎨 User Interface

### Admin Dashboard Tab

**Location**: Admin → Settings → Hardware & Printers

#### Tab Structure

```
┌─ Hardware & Printers ──────────────────────────────┐
│                                                     │
│  [Printers] [Kitchen Routing] [Receipt] [Diagnostics]
│                                                     │
│  ┌─ Printers Tab ────────────────────────────┐    │
│  │                                             │    │
│  │  🖨️ Receipt Printer                        │    │
│  │  Main Register - USB - Online   [Edit] [Test] │
│  │                                             │    │
│  │  🍳 Kitchen Printer                        │    │
│  │  Kitchen Station - Network - Online [Edit]  │    │
│  │                                             │    │
│  │  [+ Add Printer]                           │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Plan

### Day 4: Core Infrastructure

**Morning (4 hours)**:
1. Create plugin structure
2. Define TypeScript types
3. Add printer state to Zustand store
4. Build basic printer service

**Tasks**:
```typescript
// lib/store.ts additions
interface StoreState {
  // ... existing state
  printers: Printer[];
  receiptSettings: ReceiptSettings;
  kitchenRoutes: KitchenRoutingRule[];
  addPrinter: (printer: Printer) => void;
  updatePrinter: (id: string, updates: Partial<Printer>) => void;
  deletePrinter: (id: string) => void;
  testPrinter: (id: string) => Promise<boolean>;
}
```

**Afternoon (4 hours)**:
1. Build HardwareManagement.tsx (main UI)
2. Create PrinterConfigDialog.tsx
3. Add printer list display
4. Implement add/edit/delete

**Deliverables**:
- ✅ Plugin structure created
- ✅ Types defined
- ✅ Store updated
- ✅ Basic UI working

---

### Day 5: Kitchen Routing

**Morning (4 hours)**:
1. Build KitchenRoutingConfig.tsx
2. Category → Printer mapping UI
3. Auto-fire rules
4. Priority system

**UI Mock**:
```
┌─ Kitchen Routing ─────────────────────────────┐
│                                                │
│  Beverages      → ☕ Bar Printer               │
│  Hot Food       → 🍳 Kitchen Printer           │
│  Salads         → 🥗 Cold Station              │
│  Desserts       → 🍰 Pastry Station            │
│                                                │
│  [+ Add Routing Rule]                          │
│                                                │
│  ⚙️ Advanced Settings:                         │
│  □ Auto-fire immediately                       │
│  □ Course-based timing                         │
│  ⏱️ Delay: [5] minutes                         │
└────────────────────────────────────────────────┘
```

**Afternoon (4 hours)**:
1. Implement routing logic in cart
2. Test multi-printer routing
3. Handle routing errors
4. Add routing preview

**Deliverables**:
- ✅ Kitchen routing UI
- ✅ Auto-routing logic
- ✅ Multi-printer support
- ✅ Error handling

---

### Day 6: Receipt Customization & Printing

**Morning (4 hours)**:
1. Build ReceiptCustomizer.tsx
2. Logo upload
3. Header/footer editor
4. Live preview

**UI Mock**:
```
┌─ Receipt Customization ───────────────────────┐
│                                                │
│  Business Info:                                │
│  Name:     [AuraFlow Cafe____________]        │
│  Address:  [123 Main St_____________]         │
│  Phone:    [(555) 123-4567__________]         │
│                                                │
│  Logo:     [Upload Image]  [Remove]           │
│            [Preview: 📷]                       │
│                                                │
│  Header:   [Thank you for your visit!]        │
│  Footer:   [Visit us again soon!_____]        │
│                                                │
│  Font Size: ○ Small  ⦿ Medium  ○ Large        │
│  Paper:     ⦿ 58mm   ○ 80mm                   │
│                                                │
│  [Preview Receipt]  [Save]                     │
└────────────────────────────────────────────────┘
```

**Afternoon (4 hours)**:
1. Implement receipt.template.ts
2. ESC/POS formatting
3. Test printing service
4. Simulator for testing

**Deliverables**:
- ✅ Receipt customization UI
- ✅ Logo support
- ✅ Receipt template engine
- ✅ Test printing works

---

### Day 7: Diagnostics & Polish

**Morning (4 hours)**:
1. Build HardwareDiagnostics.tsx
2. Printer status monitoring
3. Connection testing
4. Error log display

**UI Mock**:
```
┌─ Hardware Diagnostics ────────────────────────┐
│                                                │
│  System Status: 🟢 All Systems Operational     │
│                                                │
│  🖨️ Receipt Printer (Main)                    │
│  Status: Online                                │
│  Last Used: 2 minutes ago                      │
│  Prints Today: 127                             │
│  [Test Connection] [View Logs]                 │
│                                                │
│  🍳 Kitchen Printer                            │
│  Status: ⚠️ Warning - Low Paper                │
│  Last Used: 5 minutes ago                      │
│  Prints Today: 89                              │
│  [Test Connection] [View Logs]                 │
│                                                │
│  Recent Errors: None                           │
└────────────────────────────────────────────────┘
```

**Afternoon (4 hours)**:
1. Integration testing
2. Fix bugs
3. Update documentation
4. Create user guide

**Deliverables**:
- ✅ Diagnostics dashboard
- ✅ All features tested
- ✅ Documentation complete
- ✅ Week 8 complete!

---

## 🖨️ Printing Logic

### Receipt Printing Flow

```typescript
// When checkout completes
async function printReceipt(transaction: Transaction) {
  const printer = printers.find(p => p.type === 'receipt' && p.enabled);
  
  if (!printer) {
    toast.warning('No receipt printer configured');
    return;
  }
  
  try {
    const receipt = generateReceipt(transaction, receiptSettings);
    await sendToPrinter(printer, receipt);
    toast.success('Receipt printed');
  } catch (error) {
    toast.error('Print failed', { description: error.message });
    logPrinterError(printer.id, error);
  }
}
```

### Kitchen Printing Flow

```typescript
// When item added to cart
function routeToKitchen(item: CartItem) {
  const rules = kitchenRoutes.filter(r => 
    r.categories.includes(item.product.category)
  );
  
  if (rules.length === 0) return;
  
  // Sort by priority
  const sortedRules = rules.sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    const printer = printers.find(p => p.id === rule.printerId);
    
    if (printer && printer.enabled) {
      if (rule.autoFire) {
        // Print immediately
        printKitchenTicket(printer, item);
      } else {
        // Queue for later
        queueKitchenTicket(printer, item, rule.delayMinutes);
      }
      break; // Only route to first matching printer
    }
  }
}
```

---

## 🧪 Testing Strategy

### Manual Tests

1. **Printer Configuration**
   - [ ] Add USB printer
   - [ ] Add network printer
   - [ ] Edit printer settings
   - [ ] Delete printer
   - [ ] Test print successful

2. **Kitchen Routing**
   - [ ] Create routing rule
   - [ ] Auto-fire works
   - [ ] Multiple printers route correctly
   - [ ] Category filtering works

3. **Receipt Customization**
   - [ ] Upload logo
   - [ ] Edit header/footer
   - [ ] Change font size
   - [ ] Preview updates live
   - [ ] Save settings persist

4. **Diagnostics**
   - [ ] Status shows correctly
   - [ ] Connection test works
   - [ ] Error logging works
   - [ ] Stats accurate

### Edge Cases

- No printers configured
- Printer offline during print
- Network printer unreachable
- Invalid receipt settings
- Multiple simultaneous prints

---

## 📱 Printer Simulator

For testing without physical hardware:

```typescript
class PrinterSimulator {
  async print(data: string): Promise<void> {
    console.log('🖨️ SIMULATOR PRINT:', data);
    
    // Show in modal
    showSimulatorPreview(data);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Promise.resolve();
  }
  
  getStatus(): PrinterStatus {
    return {
      online: true,
      paperLevel: 80,
      errors: []
    };
  }
}
```

---

## 🔌 Hardware Integration (Future)

### Supported Hardware (Planned)

**Receipt Printers**:
- Epson TM-T88 series
- Star Micronics TSP series
- Citizen CT-S series

**Connection Methods**:
- USB (via WebUSB API)
- Network (ESC/POS over TCP/IP)
- Bluetooth (via Web Bluetooth)

**Current Implementation**:
- Simulator mode (for testing)
- Network TCP/IP (basic)
- Future: USB/Bluetooth via browser APIs

---

## 📊 Success Metrics

**Day 4 Success**:
- Plugin structure complete
- Basic printer CRUD works
- Store integration done

**Day 5 Success**:
- Kitchen routing functional
- Auto-fire working
- Multi-printer support

**Day 6 Success**:
- Receipt customization works
- Test prints successful
- Preview accurate

**Day 7 Success**:
- Diagnostics dashboard live
- All tests passing
- Documentation complete

---

## 🚀 Future Enhancements (Post-Week 8)

- Real hardware integration (USB/Bluetooth)
- Label printer support
- Kitchen display sync
- Print queue management
- Advanced routing (time-based, staff-based)
- Multi-language receipts
- QR code payment integration

---

## 📚 References

- **Square Hardware**: inspiration for simplicity
- **ESC/POS Protocol**: receipt printer standard
- **Toast POS**: kitchen printing best practices
- **Clover**: hardware diagnostics approach

---

**Status**: Day 4 starting  
**ETA**: Complete by end of Day 7  
**Next**: Build core infrastructure
