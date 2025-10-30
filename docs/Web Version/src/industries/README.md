# AuraFlow POS - Industry Modules

This directory contains industry-specific extensions and features for AuraFlow POS.

## Current Industries

### Restaurant & Food Service (`/restaurant`)
Full-featured restaurant POS with:
- Table management
- Kitchen display system
- Course management (appetizers, entrées, desserts)
- Split checks
- Open tabs
- Order types (dine-in, takeout, delivery)

### Bar & Nightclub (`/bar`)
Optimized for bars, pubs, nightclubs, and lounges with:
- Age verification with compliance logging
- Open tabs with credit card holds
- Split checks (by item, evenly, custom amount)
- Table/section management (bar, lounge, VIP)
- Quick drink ordering with modifiers
- Bottle service tracking
- Alcohol sales hours compliance
- Responsible service features

## Future Industries (Planned)

### Retail (`/retail`)
- Barcode scanner integration
- Inventory tracking
- Layaway/hold functionality
- Price checker
- Multi-location support

### Services (`/services`)
- Appointment scheduling
- Service packages
- Resource booking
- Time tracking
- Recurring billing

### Hospitality/Hotels (`/hospitality`)
- Room booking
- Guest folio management
- Minibar charges
- Housekeeping integration

## Industry Module Structure

Each industry follows this pattern:

```
/industries/[industry-name]/
├── /components          # Industry-specific UI components
├── /lib                 # Business logic and state
│   ├── *.store.ts      # Industry state management
│   ├── *.service.ts    # Industry services
│   └── *.types.ts      # Industry type definitions
├── /hooks               # Custom React hooks
├── /config              # Industry configuration
└── README.md            # Industry documentation
```

## Creating a New Industry Module

### 1. Create Directory Structure
```bash
mkdir -p industries/[name]/{components,lib,hooks,config}
```

### 2. Create Industry Configuration

```typescript
// industries/[name]/config/index.ts
import { IndustryConfig } from '@/core/lib/types';

export const [name]Config: IndustryConfig = {
  id: '[name]',
  name: '[Display Name]',
  features: {
    // Enable/disable features
    customFeature1: true,
    customFeature2: false,
  },
  orderTypes: ['type1', 'type2'],
  components: {
    // Register industry components
  },
};
```

### 3. Implement Components

```typescript
// industries/[name]/components/CustomFeature.tsx
export function CustomFeature() {
  // Industry-specific UI
}
```

### 4. Extend Core Types

```typescript
// industries/[name]/lib/types.ts
import { Order } from '@/core/lib/types';

export interface [Name]Order extends Order {
  // Add industry-specific fields
  customField: string;
}
```

### 5. Register Industry

```typescript
// App.tsx or industry registry
import { [name]Config } from '@/industries/[name]/config';

registerIndustry([name]Config);
```

## Best Practices

### 1. Extend, Don't Modify Core
```typescript
// ✅ Good: Extend core types
interface RestaurantOrder extends CoreOrder {
  tableId: string;
}

// ❌ Bad: Modify core directly
// Don't add restaurant fields to CoreOrder
```

### 2. Use Composition Over Inheritance

```typescript
// ✅ Good: Compose with core components
function RestaurantPOSView() {
  return (
    <>
      <CorePOSView />
      <TableManagement />
      <OrderTypeSelector />
    </>
  );
}
```

### 3. Industry-Specific State

```typescript
// Keep industry state separate
const restaurantStore = create<RestaurantState>((set) => ({
  tables: [],
  currentTable: null,
  // ...
}));
```

### 4. Clear Dependencies

```typescript
// ✅ Explicit dependencies
import { Order } from '@/core/lib/types';
import { useStore } from '@/core/lib/store';

// ❌ Avoid cross-industry dependencies
// Don't import from /industries/other-industry
```

## Feature Flags

Control industry features dynamically:

```typescript
const features = useIndustryFeatures();

{features.tableManagement && <TableSelector />}
{features.kitchenDisplay && <KitchenView />}
```

## Testing

Each industry should have:
- Unit tests for services
- Component tests
- Integration tests with core
- E2E tests for critical workflows

```
/industries/restaurant/
├── __tests__/
│   ├── components/
│   ├── services/
│   └── integration/
```

## Documentation

Each industry module should include:
- README.md with feature overview
- Setup instructions
- Configuration options
- API documentation
- User guides (in `/docs`)

## Migration from Core

When moving components from core to industry:

1. ✅ Update imports throughout the app
2. ✅ Move associated tests
3. ✅ Update documentation
4. ✅ Add to industry config
5. ✅ Test functionality

## Support Multiple Industries

The app can support multiple industries simultaneously:

```typescript
// User selects industry during setup
const selectedIndustry = useIndustryStore(state => state.current);

// Load industry-specific features
const IndustryModule = industryModules[selectedIndustry];

return <IndustryModule />;
```

## Contributing

When adding industry features:
1. Discuss architecture in GitHub Issues
2. Follow existing patterns
3. Add comprehensive tests
4. Document all features
5. Provide migration guide if needed

## Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Feature-Sliced Design](https://feature-sliced.design/)
