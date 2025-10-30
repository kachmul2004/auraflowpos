# AuraFlow POS - Plugin Architecture Design

**Version**: 2.0.0  
**Date**: October 24, 2025  
**Status**: Implemented

---

## 🎯 Core Principle

> **Features are plugins. Industries are configurations of plugins.**

Any feature can be used by any industry. Delete a plugin folder = remove that feature completely from the system.

---

## 🏗️ Directory Structure

```
auraflow-pos/
│
├── /plugins                        # 🔌 Pluggable Features
│   ├── /barcode-scanner           # Can be used by ANY industry
│   ├── /table-management          # Restaurant, bar, cafe
│   ├── /kitchen-display           # Restaurant, cafe, catering
│   ├── /split-checks              # Restaurant, bar
│   ├── /course-management         # Fine dining, catering
│   ├── /order-types               # Restaurant, cafe, bakery
│   ├── /open-tabs                 # Restaurant, bar, salon
│   ├── /loyalty-program           # Retail, restaurant, any
│   ├── /inventory-advanced        # Retail, pharmacy, grocery
│   ├── /appointments              # Salon, medical, services
│   ├── /price-checker             # Retail, grocery
│   ├── /layaway                   # Retail, furniture
│   ├── /age-verification          # Pharmacy, liquor, tobacco
│   ├── /prescription-tracking     # Pharmacy only
│   ├── /analytics-reporting       # Advanced analytics
│   ├── /employee-performance      # Employee tracking
│   ├── /multi-location            # Multi-location support
│   ├── /customer-management-advanced  # Advanced customer features
│   ├── /discount-management       # Advanced discounts
│   ├── /hardware-printer-management   # Printer management
│   ├── /inventory-management-advanced # Advanced inventory
│   ├── /offline-mode              # Offline capabilities
│   └── /reporting-export-advanced # Advanced reporting
│
├── /presets                        # 🎨 Industry Configurations
│   ├── index.ts                   # Registry of all presets
│   ├── restaurant.preset.ts       # Full-service restaurant
│   ├── cafe.preset.ts             # Coffee shop, cafe
│   ├── retail.preset.ts           # Standard retail
│   ├── pharmacy.preset.ts         # Pharmacy
│   ├── salon.preset.ts            # Hair salon, spa
│   ├── general.preset.ts          # General purpose
│   └── ultimate.preset.ts         # All features enabled
│
└── /core                           # Core plugin infrastructure
    ├── /contexts
    │   └── PluginContext.tsx      # Plugin context provider
    ├── /hooks
    │   ├── usePlugin.ts           # Single plugin hook
    │   └── usePlugins.ts          # Multiple plugins hook
    └── /lib
        ├── plugin-manager.ts      # Plugin management
        └── /types
            └── plugin.types.ts    # Plugin type definitions
```

---

## 🔌 Plugin System Design

### Plugin Structure

Every plugin follows this structure:

```
/plugins/example-plugin/
├── index.ts                 # Plugin manifest (exports plugin definition)
├── components/              # React components
│   └── ExampleComponent.tsx
├── lib/                     # Business logic
│   ├── example.service.ts  # Services
│   └── example.types.ts    # TypeScript types
└── hooks/                   # Custom hooks (optional)
    └── useExample.ts
```

### Plugin Manifest (`index.ts`)

```typescript
import { Plugin } from '@/core/lib/types/plugin.types';

export const examplePlugin: Plugin = {
  id: 'example-plugin',
  name: 'Example Plugin',
  version: '1.0.0',
  description: 'Description of what this plugin does',
  category: 'core' | 'industry' | 'integration' | 'analytics' | 'hardware',
  
  // UI Integration Points
  cashierActions: [],        // Actions in cashier view
  adminMenuItems: [],        // Admin dashboard menu items
  settingsPanel: null,       // Settings component
  
  // Dependencies
  requiredDependencies: [],  // Other plugins required
  
  // Lifecycle hooks
  onInstall: () => {},
  onEnable: () => {},
  onDisable: () => {},
};

export default examplePlugin;
```

---

## 🎨 Industry Presets

Presets are pre-configured bundles of plugins for specific industries:

### Restaurant Preset

```typescript
export const restaurantPreset = {
  name: 'Restaurant',
  plugins: [
    'table-management',
    'kitchen-display',
    'split-checks',
    'course-management',
    'order-types',
    'open-tabs',
  ],
};
```

### Retail Preset

```typescript
export const retailPreset = {
  name: 'Retail',
  plugins: [
    'barcode-scanner',
    'loyalty-program',
    'layaway',
    'price-checker',
    'inventory-advanced',
  ],
};
```

### Pharmacy Preset

```typescript
export const pharmacyPreset = {
  name: 'Pharmacy',
  plugins: [
    'barcode-scanner',
    'prescription-tracking',
    'age-verification',
    'inventory-advanced',
    'loyalty-program',
  ],
};
```

---

## 🔧 How It Works

### 1. Plugin Loading

The Plugin Manager loads active plugins based on the selected preset:

```typescript
import { PluginManager } from '@/core/lib/plugin-manager';

// Initialize with a preset
const manager = new PluginManager();
manager.loadPreset('restaurant');

// Or load specific plugins
manager.loadPlugins(['barcode-scanner', 'loyalty-program']);
```

### 2. Using Plugins in Components

```typescript
import { usePlugin } from '@/core/hooks/usePlugin';

function MyComponent() {
  const barcodeScanner = usePlugin('barcode-scanner');
  
  if (!barcodeScanner.enabled) {
    return null; // Plugin not active
  }
  
  return (
    <button onClick={() => barcodeScanner.actions.scan()}>
      Scan Barcode
    </button>
  );
}
```

### 3. Conditional Rendering

```typescript
import { usePlugins } from '@/core/hooks/usePlugins';

function POSView() {
  const { isEnabled } = usePlugins();
  
  return (
    <div>
      {/* Core features always available */}
      <ProductGrid />
      <ShoppingCart />
      
      {/* Plugin features conditionally rendered */}
      {isEnabled('order-types') && <OrderTypeSelector />}
      {isEnabled('table-management') && <TableSelector />}
      {isEnabled('barcode-scanner') && <BarcodeScannerButton />}
    </div>
  );
}
```

---

## 🗑️ Adding/Removing Plugins

### Adding a Plugin

1. Create plugin folder in `/plugins`
2. Create `index.ts` with plugin manifest
3. Implement components and logic
4. Add to preset configuration

### Removing a Plugin

1. Remove from preset configuration
2. Optionally delete plugin folder
3. App automatically disables that feature

**No code changes needed!** The plugin system handles everything.

---

## 📦 Current Plugins

### Core Features
- **barcode-scanner** - Barcode scanning (USB & camera)
- **offline-mode** - Offline capabilities with queue
- **discount-management** - Advanced discount system
- **hardware-printer-management** - Printer management

### Restaurant Features
- **table-management** - Table and floor plan management
- **kitchen-display** - Kitchen Display System (KDS)
- **split-checks** - Split bills among guests
- **course-management** - Multi-course ordering
- **order-types** - Dine-in, takeout, delivery
- **open-tabs** - Keep tabs open for customers

### Retail Features
- **loyalty-program** - Customer loyalty and rewards
- **layaway** - Layaway payment plans
- **price-checker** - Quick price lookup
- **age-verification** - Age verification for restricted items

### Specialized Features
- **prescription-tracking** - Pharmacy prescriptions
- **appointments** - Appointment scheduling
- **multi-location** - Multi-location support

### Analytics & Reporting
- **analytics-reporting** - Advanced analytics
- **employee-performance** - Employee tracking
- **reporting-export-advanced** - Advanced reporting

### Advanced Management
- **customer-management-advanced** - Advanced customer features
- **inventory-management-advanced** - Advanced inventory tracking

---

## 🎯 Benefits

### For Development
✅ Clean separation - Each plugin is independent  
✅ Easy testing - Test plugins in isolation  
✅ No conflicts - Plugins don't interfere  
✅ Clear dependencies - Explicit requirements  

### For Deployment
✅ Smaller bundles - Only ship active plugins  
✅ Easy updates - Update one plugin at a time  
✅ A/B testing - Enable/disable dynamically  
✅ White labeling - Customize per customer  

### For Customers
✅ Pay for what they use - Modular pricing  
✅ Easy customization - Enable/disable in settings  
✅ Future-proof - Add plugins without migration  
✅ No bloat - Only see relevant features  

---

## 📝 Plugin Development Guidelines

### 1. Keep Plugins Independent

Plugins should work regardless of which other plugins are enabled.

### 2. Use Dependency Injection

Declare dependencies explicitly in the plugin manifest.

### 3. Provide Clear Configuration

Every plugin should have sensible defaults and configurable options.

### 4. Document Thoroughly

Each plugin should document:
- What it does
- How to use it
- Configuration options
- Dependencies
- Recommended industries

---

## 🚀 Future Enhancements

- Plugin marketplace
- Dynamic plugin loading (runtime)
- Plugin versioning and updates
- Custom plugin development SDK
- Plugin analytics and usage tracking

---

**Last Updated:** October 28, 2025  
**Version:** 2.0.0
