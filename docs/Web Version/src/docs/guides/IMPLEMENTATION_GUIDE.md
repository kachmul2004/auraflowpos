# AuraFlow POS - Implementation Guide

**Version**: 2.0.0  
**Last Updated**: October 24, 2025  
**Purpose**: Technical reference for implementing and understanding key features

---

## 📋 Table of Contents

1. [Customer Management](#customer-management)
2. [Receipt Printing & Email](#receipt-printing--email)
3. [Reporting System](#reporting-system)
4. [Restaurant Features](#restaurant-features)
5. [Industry Adaptation](#industry-adaptation)
6. [Export System](#export-system)

---

## Customer Management

### Overview
Complete CRM system integrated into POS with analytics, purchase history, and marketing opt-in tracking.

### Key Components
- `/components/admin/CustomersModule.tsx` - Customer management UI
- `/components/CustomerSelectionDialog.tsx` - POS customer selection
- `store.ts` - Customer data and analytics functions

### Features
- **CRUD Operations**: Create, read, update, delete customers
- **Customer Fields**: Name, email, phone, address, birthday, notes, tags
- **Analytics**: Total spent, visit count, average order value, lifetime value
- **Tags**: VIP, Wholesale, Local, etc.
- **Marketing**: Opt-in/opt-out tracking
- **POS Integration**: Attach customer to order, quick lookup

### Store Functions
```typescript
// Get all customers
const customers = useStore(state => state.customers)

// Add customer
addCustomer(customer: Customer): void

// Update customer
updateCustomer(id: string, updates: Partial<Customer>): void

// Delete customer
deleteCustomer(id: string): void

// Get customer analytics
const analytics = getCustomerAnalytics(customerId: string)
```

### Usage in POS
```typescript
// In ShoppingCart.tsx
const { selectedCustomer } = useStore()

// Attach customer to order
<CustomerSelectionDialog
  onSelect={(customer) => setSelectedCustomer(customer)}
/>
```

---

## Receipt Printing & Email

### Overview
Comprehensive receipt system with thermal printer support and email delivery.

### Key Components
- `/components/ReceiptTemplate.tsx` - Receipt display component
- `/components/PrintReceiptDialog.tsx` - Print interface
- `/components/EmailReceiptDialog.tsx` - Email interface
- `/lib/receiptUtils.ts` - Receipt generation utilities
- `/lib/escposUtils.ts` - ESC/POS thermal printer commands

### Features
- **Print Receipt**: Browser print API integration
- **Email Receipt**: Email dialog with customer email collection
- **Thermal Printers**: ESC/POS protocol support
- **Receipt Templates**: Customizable business branding
- **Reprint**: Access receipts from transaction history
- **Z-Reports**: End-of-shift reports

### Receipt Template Structure
```typescript
interface ReceiptData {
  businessName: string
  address: string
  phone: string
  email: string
  orderNumber: string
  date: string
  items: CartItem[]
  subtotal: number
  tax: number
  discount: number
  tip: number
  total: number
  payments: Payment[]
  change: number
}
```

### Thermal Printer Commands
```typescript
// From escposUtils.ts
export const ESC_POS = {
  INIT: '\\x1B\\x40',           // Initialize printer
  TEXT_NORMAL: '\\x1B\\x21\\x00', // Normal text
  TEXT_BOLD: '\\x1B\\x21\\x08',   // Bold text
  TEXT_LARGE: '\\x1B\\x21\\x30',  // Large text
  ALIGN_LEFT: '\\x1B\\x61\\x00',  // Left align
  ALIGN_CENTER: '\\x1B\\x61\\x01', // Center align
  CUT_PAPER: '\\x1D\\x56\\x00'    // Cut paper
}
```

### Usage
```typescript
// Print receipt
printReceipt(receiptData: ReceiptData): void

// Email receipt
emailReceipt(receiptData: ReceiptData, email: string): Promise<void>

// Generate Z-Report
generateZReport(shift: Shift): ReceiptData
```

---

## Reporting System

### Overview
Comprehensive reporting with sales, inventory, financial, and staff analytics.

### Key Components
- `/components/admin/ReportsModule.tsx` - Reports UI
- `store.ts` - Aggregation functions

### Report Types

#### 1. Sales Reports
- Daily/weekly/monthly sales trends
- Sales by category
- Sales by product
- Sales by employee
- Sales by terminal
- Hourly breakdown

#### 2. Inventory Reports
- Stock levels
- Low stock alerts
- Out of stock items
- Stock movement
- Valuation

#### 3. Financial Reports
- Revenue summary
- Payment method breakdown
- Tax collected
- Discounts given
- Refunds processed

#### 4. Staff Reports
- Performance by employee
- Average transaction value
- Transactions per hour
- Shift summaries

#### 5. Void & Return Reports
- Voided items with reasons
- Returned orders
- Refund amounts
- Manager overrides

#### 6. Customer Reports
- New customers
- Top customers
- Customer lifetime value
- Average order value

### Data Aggregation
```typescript
// Sales by date range
const sales = getAllTransactions()
  .filter(t => t.type === 'sale')
  .filter(t => isWithinDateRange(t.timestamp, startDate, endDate))
  .reduce((sum, t) => sum + t.total, 0)

// Sales by category
const categoryData = products.map(category => ({
  category: category.name,
  revenue: getSalesByCategory(category.id)
}))
```

---

## Restaurant Features

### Overview
6 restaurant-specific plugins for full-service dining.

### Plugins

#### 1. Table Management (`table-management`)
**Component**: `/plugins/table-management/components/TableManagementDialog.tsx`

**Features**:
- Table list with status (Available, Occupied, Reserved)
- Assign cart to table
- Server assignment
- Capacity tracking
- Section organization

**Usage**:
```typescript
const { isActive } = usePlugins()
{isActive('table-management') && <TableManagementButton />}
```

#### 2. Kitchen Display System (`kitchen-display`)
**Component**: `/plugins/kitchen-display/components/KitchenDisplaySystem.tsx`

**Features**:
- Real-time order display
- Status workflow (New → Preparing → Ready → Served)
- Priority-based sorting
- Auto-refresh every 5 seconds
- Time tracking
- Filter by status

**Status Flow**:
```
New → Preparing → Ready → Served
```

#### 3. Split Checks (`split-checks`)
**Component**: `/plugins/split-checks/components/SplitCheckDialog.tsx`

**Features**:
- By Seat: Assign items to seats 1-6
- Even Split: Divide equally among N people
- Custom Split: Select specific items per check
- Real-time calculation
- Individual receipts

#### 4. Course Management (`course-management`)
**Component**: `/plugins/course-management/components/CoursesDialog.tsx`

**Features**:
- 4 course types: Beverages, Appetizers, Main, Desserts
- Fire control (send to kitchen)
- Color-coded organization
- Timing management

#### 5. Order Types (`order-types`)
**Component**: `/plugins/order-types/components/OrderTypeSelector.tsx`

**Features**:
- Dine-in
- Takeout
- Delivery
- Type-specific workflows

#### 6. Open Tabs (`open-tabs`)
**Component**: `/plugins/open-tabs/components/OpenTabsView.tsx`

**Features**:
- Active order overview
- Table status grid
- Search and filter
- Quick actions (view, pay, close)

---

## Industry Adaptation

### Overview
Dynamic POS configuration based on business type.

### Key Files
- `/lib/industryConfig.ts` - Industry configurations
- `/presets/*.preset.ts` - Business profile presets

### Industry Types

#### Restaurant
- ✅ Table management
- ✅ Order types (dine-in, takeout, delivery)
- ✅ Tipping
- ✅ Kitchen display
- ✅ Split checks
- ✅ Course management

#### Retail
- ❌ No table management
- ❌ No order types
- ❌ No tipping
- ✅ Barcode scanner (when implemented)
- ✅ Layaway (when implemented)

#### Cafe
- ❌ No table management
- ✅ Order types (for pickup vs dine-in)
- ✅ Tipping
- ❌ Simplified workflow

#### Pharmacy
- ❌ No restaurant features
- ✅ Prescription tracking (when implemented)
- ✅ Age verification (when implemented)

#### Salon
- ❌ No restaurant features
- ✅ Appointments (when implemented)
- ✅ Service packages (when implemented)

### Switching Industries
```typescript
// In SettingsModule.tsx
const setBusinessProfile = useStore(state => state.setBusinessProfile)

// Change to restaurant
setBusinessProfile('restaurant')

// This automatically activates restaurant plugins
```

### Feature Visibility
```typescript
// Check if plugin is active
const { isActive } = usePlugins()

// Conditional rendering
{isActive('table-management') && <TableButton />}
{isActive('order-types') && <OrderTypeSelector />}
```

---

## Export System

### Overview
Export data to CSV, Excel (CSV with BOM), and JSON formats.

### Key Files
- `/lib/exportUtils.ts` - Export utility functions
- `/components/ExportDialog.tsx` - Export UI

### Supported Modules
- Orders
- Transactions
- Shifts
- (Future: Customers, Products, Inventory)

### Export Functions
```typescript
// Export orders
exportOrders(orders: Order[], format: 'csv' | 'excel' | 'json'): void

// Export transactions
exportTransactions(transactions: Transaction[], format): void

// Export shifts
exportShifts(shifts: Shift[], format): void
```

### CSV Format
```csv
Order #,Date,Customer,Items,Total,Status
1001,2025-10-24,John Doe,3,$45.50,Completed
1002,2025-10-24,Jane Smith,1,$12.99,Completed
```

### Excel Format
- Same as CSV but with UTF-8 BOM for proper encoding
- Opens correctly in Excel with special characters

### JSON Format
```json
[
  {
    "orderNumber": "1001",
    "date": "2025-10-24",
    "customer": "John Doe",
    "items": 3,
    "total": 45.50,
    "status": "Completed"
  }
]
```

### Usage in Admin Modules
```typescript
import { ExportDialog } from '@/components/ExportDialog'

<ExportDialog
  data={filteredOrders}
  filename="orders"
  exportFunction={exportOrders}
/>
```

---

## Best Practices

### State Management
- Use Zustand store for global state
- Keep component state local when possible
- Use selectors for performance

### Component Organization
- Core POS: `/components/`
- Admin: `/components/admin/`
- Plugins: `/plugins/{plugin-name}/components/`
- UI Library: `/components/ui/`

### Plugin Development
```typescript
// Plugin manifest: /plugins/my-plugin/index.ts
export const myPlugin: Plugin = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'Does something useful',
  category: 'retail',
  tier: 'professional',
  dependencies: [],
  components: {
    SettingsPage: () => import('./components/SettingsPage')
  }
}
```

### Type Safety
- Always use TypeScript types
- Define interfaces for data structures
- Use type guards when necessary

---

## Troubleshooting

### Common Issues

**Plugin not showing up**
- Check if plugin is registered in `/plugins/_registry.ts`
- Verify plugin is included in user's package tier
- Check if business profile preset includes the plugin

**Export not working**
- Verify browser allows downloads
- Check data format is correct
- Ensure export function is imported correctly

**Receipt not printing**
- Check browser print permissions
- Verify printer is connected and selected
- Test with browser print preview first

---

## Further Reading

- [Plugin Architecture](../architecture/PLUGIN_ARCHITECTURE.md) - Plugin system design
- [Admin Guide](ADMIN_GUIDE.md) - Using admin dashboard
- [Overall Roadmap](../planning/OVERALL_ROADMAP.md) - Future plans

---

**Last Updated**: October 24, 2025  
**Version**: 2.0.0
