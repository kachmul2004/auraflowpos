# Multi-Subscription Architecture Guide

## Overview

AuraFlow-POS now supports **multiple active subscriptions** allowing businesses to combine different industry packages (e.g., Restaurant + Bar + Retail) in a **unified interface**. All products and features from subscribed packages are available simultaneously.

## Architecture

### Subscription System

Businesses can subscribe to multiple industry packages:
- `restaurant` - Full-service restaurants with table management
- `bar` - Bars & nightclubs with age verification and tabs
- `cafe` - Coffee shops and quick-service cafes
- `retail` - General retail stores
- `pharmacy` - Pharmacies with prescription tracking
- `salon` - Salons and spas with appointments
- `ultimate` - All-in-one package with every feature

### Unified Product Display

When a business has multiple subscriptions, **ALL products from all subscribed presets are shown in one unified grid**:

```typescript
// Store state
subscribedPresets: ['restaurant', 'bar'] // Multiple active subscriptions

// UI shows BOTH restaurant AND bar categories:
// - Appetizers, Entrees, Desserts (from restaurant)
// - Beer, Wine, Cocktails, Spirits (from bar)
// All in the same product grid!
```

### Quick Bar Mode (Optional)

For high-speed bar service, businesses can optionally enable **Quick Bar Mode** - a specialized layout optimized for rapid drink ordering:

```typescript
quickBarMode: false // Default: unified grid
quickBarMode: true  // Optional: bar-optimized layout
```

**Important:** Quick Bar Mode is an OPTIONAL specialized view, not the default. It's designed for busy bar service periods when speed is critical.

## Bar & Nightclub Order Types

When the bar preset is active (`activePresetView === 'bar'`), the following custom order types are available:

### Order Types Configuration

From `/presets/bar.preset.ts`:

```typescript
types: [
  { id: 'bar', label: 'Bar', icon: '🍺' },
  { id: 'table', label: 'Table Service', icon: '🍽️' },
  { id: 'bottle-service', label: 'Bottle Service', icon: '🍾' },
  { id: 'to-go', label: 'To-Go', icon: '🥤' },
]
```

### Order Type Details

1. **Bar (🍺)**
   - Direct service at the bar counter
   - Quick ordering and payment
   - Typically cash/card immediate payment
   - Default for walk-up customers

2. **Table Service (🍽️)**
   - Seated table service
   - Can open tabs
   - Server assignment available
   - Standard tipping flow

3. **Bottle Service (🍾)**
   - VIP/premium service
   - Typically reserved sections
   - Higher minimum spends
   - Auto-gratuity may apply
   - Bottle presentation workflow

4. **To-Go (🥤)**
   - Takeaway drinks (where legal)
   - Sealed containers required
   - May require special permits
   - Different tax rates may apply

## Product Categories

The bar preset filters products to show only bar-relevant categories:

- **Beer** - Draft, bottles, cans
- **Wine** - Red, white, rosé, sparkling
- **Spirits** - Whiskey, vodka, rum, tequila, gin
- **Cocktails** - Mixed drinks and house specials
- **Shots** - Single-serve spirits
- **Non-Alcoholic** - Mocktails, sodas, energy drinks
- **Food** - Bar snacks and appetizers

## Feature Integration

### Age Verification
- Automatically prompts for ID verification for alcoholic beverages
- 21+ badges shown on alcoholic products
- Verification logged for compliance
- Can scan IDs or manually verify

### Open Tabs
- Customer can open tabs with credit card hold
- $1.00 pre-authorization
- Auto-gratuity at 18% for 6+ drinks
- Warning at $200 threshold
- 12-hour max tab duration

### Split Checks
- Split by item (by drink)
- Split evenly
- Custom amount splits
- Quick 2-way, 3-way, 4-way buttons

### Sections/Floor Plan
- Main Bar
- High Tops
- Lounge
- Patio
- VIP

## Real-World Example

### Restaurant + Bar Combo

A business that operates both a restaurant and bar subscribes to both packages:

```typescript
subscribedPresets: ['restaurant', 'bar']
```

**What the cashier sees:**
- **Product Grid** shows ALL categories:
  - 🍽️ Appetizers, Entrees, Desserts (restaurant)
  - 🍺 Beer, Wine, Cocktails, Spirits (bar)
  - 🍔 Food (bar snacks)
- **Order Types** include both:
  - Dine-In, Takeout (restaurant)
  - Bar Service, Bottle Service (bar)
- **Features** from both presets:
  - Table management (restaurant)
  - Age verification (bar)
  - Open tabs (bar)

**Workflow:**
1. Customer orders a burger (restaurant category)
2. Same order, add a beer (bar category)
3. One unified cart, one checkout
4. Age verification automatically triggered for alcohol
5. Order can be for Dine-In (restaurant) or Bar Service (bar)

### Quick Bar Mode Toggle

During busy bar hours, toggle Quick Bar Mode for rapid drink ordering:

```typescript
// Toggle quick bar mode
setQuickBarMode(true);

// UI switches to bar-optimized layout
{quickBarMode && subscribedPresets.includes('bar') ? (
  <BarProductArea /> // Fast drink ordering interface
) : (
  <ProductGrid /> // Unified product grid
)}
```

**Quick Bar Mode UI:**
- Quick Order view with drink shortcuts
- Open Tabs management
- Section/table selection
- QuickDrinkBuilder for custom drinks

### Checking Feature Access

```typescript
// Check if business has access to a specific preset
const hasBarAccess = subscribedPresets.includes('bar');

// Show Quick Bar Mode toggle only if bar subscription active
{hasBarAccess && (
  <Button onClick={() => setQuickBarMode(!quickBarMode)}>
    Quick Bar Mode
  </Button>
)}
```

## Admin Configuration

### Setting Subscriptions

Admins can configure which packages the business has subscribed to:

```typescript
// Example: Restaurant + Bar combo
setSubscribedPresets(['restaurant', 'bar']);
```

### Default View

The system defaults to the first subscribed preset:
```typescript
activePresetView: subscribedPresets[0] // 'restaurant'
```

Users can then switch to other views using the dropdown.

## Database Schema

### Subscriptions Table (Future Implementation)

```sql
CREATE TABLE business_subscriptions (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  preset_id TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### View Preferences Table

```sql
CREATE TABLE user_view_preferences (
  user_id UUID REFERENCES users(id),
  default_preset_view TEXT,
  last_used_preset_view TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Benefits

### For Multi-Service Businesses

A business that operates both a restaurant and a bar can:
1. **Add any items to the same order** - Mix food and drinks seamlessly
2. **No view switching needed** - All products visible in one grid
3. **Combined categories** - Restaurant + Bar categories shown together
4. **Unified workflow** - One checkout process for everything
5. **Optional specialization** - Toggle Quick Bar Mode during busy bar service

### Clean UI

- **Unified product grid** - All subscribed categories in one place
- **Smart category filtering** - Only shows categories from subscribed presets
- **Subscription badges** - Visual indicators (🍽️ 🍺) show active packages
- **Optional quick modes** - Specialized layouts available when needed

### Scalability

- Easy to add new industry presets
- Businesses can upgrade by adding subscriptions
- Downgrade by removing subscriptions
- Pay only for what you use

## Migration Notes

### From Single Profile

Existing businesses with `businessProfile: 'restaurant'` will:
1. Have `subscribedPresets: ['restaurant']` set
2. See only restaurant categories in product grid
3. Quick Bar Mode toggle hidden (no bar subscription)
4. Can upgrade to add more subscriptions

### Adding Bar to Existing Restaurant

```typescript
// Before
subscribedPresets: ['restaurant']
// Shows: Appetizers, Entrees, Desserts, Beverages

// After adding bar subscription
subscribedPresets: ['restaurant', 'bar']
// Shows: Appetizers, Entrees, Desserts, Beverages, Beer, Wine, Cocktails, Spirits, Food
// Plus: Quick Bar Mode toggle button appears
```

**UI Changes:**
- Product grid automatically shows new bar categories
- Quick Bar Mode toggle appears in header
- Subscription badges show both 🍽️ and 🍺
- Age verification feature activates
- Open tabs feature becomes available

## Testing

### Test Scenarios

1. **Single Subscription (Restaurant Only)**
   - ✓ Only restaurant categories visible (Appetizers, Entrees, etc.)
   - ✓ Subscription badge shows 🍽️
   - ✓ No Quick Bar Mode toggle
   - ✓ Restaurant order types only

2. **Multiple Subscriptions (Restaurant + Bar)**
   - ✓ ALL categories visible (Restaurant + Bar combined)
   - ✓ Both subscription badges show (🍽️ 🍺)
   - ✓ Quick Bar Mode toggle appears
   - ✓ Can add burger AND beer to same order
   - ✓ Order types from both presets available
   - ✓ Features from both presets active

3. **Quick Bar Mode Toggle**
   - ✓ Toggle switches to bar-optimized layout
   - ✓ Quick Order, Open Tabs, Sections views available
   - ✓ QuickDrinkBuilder accessible
   - ✓ Cart persists when toggling mode
   - ✓ Can toggle back to unified grid anytime

4. **Bar-Specific Features**
   - ✓ Age verification triggers for alcoholic products
   - ✓ Bar order types (Bar, Table Service, Bottle Service, To-Go)
   - ✓ Open tabs management works
   - ✓ Split checks by drink functionality

## Future Enhancements

1. **Per-Terminal View Lock**
   - Lock specific terminals to specific views
   - Example: Bar Terminal 1 always in Bar Mode

2. **Time-Based Auto-Switching**
   - Auto-switch to Bar Mode after 5 PM
   - Auto-switch to Restaurant Mode during lunch

3. **Cross-View Features**
   - Transfer orders between views
   - Combined reporting across all views
   - Unified inventory management

4. **Custom Preset Builder**
   - Allow businesses to create custom presets
   - Mix and match features from different industries
   - Save as reusable presets

## Support

For questions about multi-subscription architecture, see:
- `/docs/SUBSCRIPTIONS.md` - Full subscription documentation
- `/presets/` - Individual preset configurations
- `/lib/industryConfig.ts` - Industry feature mappings
