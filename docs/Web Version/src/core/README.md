# AuraFlow POS - Core Module

This directory contains the industry-agnostic core functionality of AuraFlow POS.

## Structure

- `/components` - Core UI components for POS and Admin
- `/lib` - Business logic, utilities, and services  
- `/config` - Core configuration files

## Principles

1. **Industry Agnostic**: Nothing in this module should assume a specific industry
2. **Extensible**: All core features should be extendable by industry modules
3. **Self-Contained**: Core should work standalone with basic POS functionality

## Key Components

### POS Components (`/components/pos`)
- ProductGrid - Display and select products
- ShoppingCart - Cart management and display
- PaymentDialog - Payment processing
- ActionBar - Core POS actions

### Admin Components (`/components/admin`)
- OrdersModule - Order management
- ProductsModule - Product catalog
- CustomersModule - Customer database
- ReportsModule - Analytics and reports

### Common Components (`/components/common`)
- DataTable - Reusable data table
- ExportDialog - Data export functionality
- NumericKeypad - Number input

## Usage

```typescript
// Import core components
import { ProductGrid } from '@/core/components/pos';
import { OrdersModule } from '@/core/components/admin';

// Import core utilities
import { exportOrders } from '@/core/lib/utils/exportUtils';

// Import core types
import type { Order, Product } from '@/core/lib/types';
```

## Extension Pattern

Industry modules extend core functionality:

```typescript
// Core order type
interface CoreOrder {
  id: string;
  items: CartItem[];
  total: number;
}

// Restaurant extends core
interface RestaurantOrder extends CoreOrder {
  tableId?: string;
  server?: string;
  courses?: Course[];
}
```
