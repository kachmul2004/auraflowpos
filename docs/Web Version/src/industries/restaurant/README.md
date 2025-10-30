# Restaurant & Food Service Industry Module

Full-featured restaurant POS system with table management, kitchen display, and advanced order handling.

## Features

### ✅ Table Management
- Visual floor plan
- Table status tracking (available, occupied, reserved)
- Server assignment
- Table combining/splitting
- Section management

### ✅ Kitchen Display System (KDS)
- Real-time order display for kitchen staff
- Order status workflow (new → preparing → ready)
- Timer tracking for food preparation
- Priority indicators
- Multi-station support

### ✅ Order Types
- **Dine-In**: Full table service with courses
- **Takeout**: Quick pickup orders
- **Delivery**: Address and delivery tracking

### ✅ Course Management
- Appetizers
- Entrées
- Desserts
- Beverages
- Custom courses
- Fire by course (send to kitchen in sequence)

### ✅ Split Checks
- Split by item
- Split by seat
- Split evenly
- Custom splits
- Separate payments per split

### ✅ Open Tabs
- Keep orders open
- Add items over time
- View all open tabs
- Quick tab lookup

## Components

### Primary Components

#### `KitchenDisplaySystem.tsx`
Real-time kitchen order display with status management.

```typescript
import { KitchenDisplaySystem } from '@/industries/restaurant/components';

<KitchenDisplaySystem />
```

#### `TableManagementDialog.tsx`
Visual table layout and management interface.

```typescript
import { TableManagementDialog } from '@/industries/restaurant/components';

<TableManagementDialog
  open={showTableDialog}
  onClose={() => setShowTableDialog(false)}
  onSelectTable={(table) => assignTable(table)}
/>
```

#### `OrderTypeSelector.tsx`
Select order type before starting an order.

```typescript
import { OrderTypeSelector } from '@/industries/restaurant/components';

<OrderTypeSelector
  onSelect={(type) => setOrderType(type)}
/>
```

#### `SplitCheckDialog.tsx`
Interface for splitting checks multiple ways.

```typescript
import { SplitCheckDialog } from '@/industries/restaurant/components';

<SplitCheckDialog
  order={currentOrder}
  onSplit={(splits) => processSplits(splits)}
/>
```

#### `CoursesDialog.tsx`
Manage courses for dine-in orders.

```typescript
import { CoursesDialog } from '@/industries/restaurant/components';

<CoursesDialog
  items={orderItems}
  onAssignCourse={(itemId, course) => assignCourse(itemId, course)}
/>
```

#### `OpenTabsView.tsx`
View and manage all open customer tabs.

```typescript
import { OpenTabsView } from '@/industries/restaurant/components';

<OpenTabsView
  onSelectTab={(tab) => loadTab(tab)}
/>
```

## Configuration

### Restaurant Config (`/config/restaurant.config.ts`)

```typescript
export const restaurantConfig = {
  features: {
    tableManagement: true,
    kitchenDisplay: true,
    courseManagement: true,
    splitChecks: true,
    openTabs: true,
    serverAssignment: true,
    tableReservations: false, // Coming soon
  },
  
  orderTypes: [
    { id: 'dine-in', label: 'Dine In', icon: 'utensils' },
    { id: 'takeout', label: 'Takeout', icon: 'package' },
    { id: 'delivery', label: 'Delivery', icon: 'truck' },
  ],
  
  courses: [
    { id: 'appetizer', label: 'Appetizer', order: 1 },
    { id: 'entree', label: 'Entrée', order: 2 },
    { id: 'dessert', label: 'Dessert', order: 3 },
    { id: 'beverage', label: 'Beverage', order: 0 },
  ],
  
  kitchenSettings: {
    autoAdvanceTimer: 30, // seconds
    playSound: true,
    showAllOrders: true,
    defaultView: 'priority',
  },
  
  tableSettings: {
    enableSections: true,
    maxGuestsPerTable: 12,
    defaultTables: 20,
  },
};
```

## State Management

### Restaurant Store (`/lib/restaurant.store.ts`)

```typescript
interface RestaurantState {
  // Tables
  tables: Table[];
  selectedTable: Table | null;
  
  // Kitchen
  kitchenOrders: KitchenOrder[];
  
  // Tabs
  openTabs: Tab[];
  currentTab: Tab | null;
  
  // Actions
  assignTable: (orderId: string, tableId: string) => void;
  updateKitchenOrder: (orderId: string, status: OrderStatus) => void;
  openTab: (customerId: string) => void;
  closeTab: (tabId: string) => void;
}
```

## Type Definitions

### Extended Types (`/lib/restaurant.types.ts`)

```typescript
import { Order, CartItem } from '@/core/lib/types';

export interface RestaurantOrder extends Order {
  orderType: 'dine-in' | 'takeout' | 'delivery';
  tableId?: string;
  server?: string;
  guestCount?: number;
}

export interface RestaurantCartItem extends CartItem {
  course?: Course;
  seatNumber?: number;
  specialInstructions?: string;
  fireTime?: Date;
}

export interface Table {
  id: string;
  number: number;
  section?: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
  server?: string;
}

export interface KitchenOrder {
  orderId: string;
  orderNumber: string;
  items: KitchenItem[];
  status: 'new' | 'preparing' | 'ready' | 'served';
  tableNumber?: number;
  orderType: string;
  timestamp: Date;
  priority: number;
}

export interface Tab {
  id: string;
  customerId: string;
  orders: Order[];
  total: number;
  openedAt: Date;
  server?: string;
}
```

## Workflows

### Dine-In Order Flow

1. Select "Dine In" order type
2. Assign table and server
3. Add items to cart
4. Assign courses to items (optional)
5. Fire order to kitchen
6. Kitchen prepares items by course
7. Server delivers food
8. Customer requests check
9. Option to split check
10. Process payment(s)
11. Close order and free table

### Takeout Order Flow

1. Select "Takeout" order type
2. Add items to cart
3. Customer provides name/phone
4. Fire order to kitchen
5. Kitchen prepares order
6. Mark as ready for pickup
7. Customer arrives
8. Process payment
9. Complete order

### Kitchen Display Flow

1. New order appears in KDS
2. Kitchen staff marks as "Preparing"
3. Timer tracks preparation time
4. Mark as "Ready" when complete
5. Server marks as "Served"
6. Order removed from KDS

### Split Check Flow

1. Customer requests split
2. Open Split Check Dialog
3. Choose split method:
   - By item (drag items to splits)
   - By seat (split by seat numbers)
   - Evenly (divide total equally)
   - Custom (manual amounts)
4. Process separate payments
5. Combine into single order record

## Integration with Core

### Extends Core Components

```typescript
// Restaurant POS View extends Core POS View
export function RestaurantPOSView() {
  const { currentTable, orderType } = useRestaurantStore();
  
  return (
    <CorePOSView>
      {/* Add restaurant-specific UI */}
      <OrderTypeIndicator type={orderType} />
      <TableIndicator table={currentTable} />
      <QuickActions>
        <SplitCheckButton />
        <ViewTabsButton />
        <KitchenViewButton />
      </QuickActions>
    </CorePOSView>
  );
}
```

### Extends Core Order Type

```typescript
// Core order + restaurant fields
const order: RestaurantOrder = {
  ...coreOrderData,
  orderType: 'dine-in',
  tableId: 'table-5',
  server: 'John Doe',
  guestCount: 4,
};
```

## Setup

### Enable Restaurant Module

```typescript
// In your app configuration
import { restaurantConfig } from '@/industries/restaurant/config';

export const appConfig = {
  industry: 'restaurant',
  config: restaurantConfig,
};
```

### Initialize Restaurant Store

```typescript
import { useRestaurantStore } from '@/industries/restaurant/lib/restaurant.store';

// In your app initialization
const { initializeTables } = useRestaurantStore();
initializeTables(20); // Create 20 tables
```

## Testing

Run restaurant-specific tests:
```bash
npm test industries/restaurant
```

Test coverage:
- Component rendering
- Table assignment
- Kitchen order flow
- Check splitting
- Tab management

## API Reference

See inline JSDoc comments in each component and service file.

## Troubleshooting

### Kitchen orders not appearing
- Check WebSocket connection
- Verify order status is "paid"
- Ensure order type requires kitchen prep

### Table status not updating
- Check restaurant store state
- Verify table assignment logic
- Review order lifecycle

### Split checks not calculating correctly
- Verify item prices
- Check tax calculation
- Review split algorithm

## Future Enhancements

- [ ] Table reservations with calendar
- [ ] Online ordering integration
- [ ] Loyalty program for restaurants
- [ ] Menu management with time-based availability
- [ ] Staff scheduling
- [ ] Ingredient-level inventory tracking
- [ ] Recipe management
- [ ] Multi-location support
- [ ] Customer wait list
- [ ] Table-side ordering (QR codes)

## Related Documentation

- [Restaurant Quick Start Guide](/docs/RESTAURANT_QUICK_START.md)
- [Restaurant Workflow Testing](/docs/RESTAURANT_WORKFLOW_TESTING.md)
- [Restaurant Features Overview](/docs/RESTAURANT_FEATURES.md)
- [V1.7 Restaurant Release Notes](/docs/V1.7_RESTAURANT_RELEASE.md)
