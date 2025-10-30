# Multi-Subscription Architecture - Design Decisions

## The Problem

A business operates both a restaurant and a bar. They need to:
- Sell food items (burgers, appetizers, desserts)
- Sell beverages (beer, wine, cocktails)
- Often on the SAME order for the SAME customer

**Bad UX:** Forcing cashiers to switch between "Restaurant Mode" and "Bar Mode" every time they want to add different item types.

**Good UX:** Show all products in a unified interface. Add burger, add beer, checkout. Simple.

## The Solution: Unified Multi-Subscription Display

### Core Concept

When a business subscribes to multiple industry packages, **all products and features are merged into one unified interface**.

```typescript
subscribedPresets: ['restaurant', 'bar']
```

### What the Cashier Sees

**Product Grid Categories:**
```
All Categories ▼
├── Appetizers       (from restaurant)
├── Entrees          (from restaurant)
├── Desserts         (from restaurant)
├── Beverages        (from restaurant)
├── Beer            (from bar) 🍺
├── Wine            (from bar) 🍷
├── Cocktails       (from bar) 🍸
├── Spirits         (from bar) 🥃
├── Shots           (from bar) 🔥
├── Non-Alcoholic   (from bar) 💧
└── Food            (from bar - snacks) 🍟
```

**Order Types:**
```
Available Order Types:
├── Dine-In         (restaurant)
├── Takeout         (restaurant)
├── Delivery        (restaurant)
├── Bar Service     (bar)
├── Table Service   (bar)
├── Bottle Service  (bar)
└── To-Go           (bar)
```

**Features:**
```
Active Features:
├── Table Management     (restaurant)
├── Server Assignment    (restaurant)
├── Age Verification     (bar)
├── Open Tabs           (bar)
├── Split Checks        (bar)
└── Tipping             (both)
```

## Workflow Example

### Scenario: Customer Orders Food + Drinks

1. **Cashier clicks "Burger" from Entrees category**
   - Added to cart: $12.00

2. **Cashier clicks "IPA Draft" from Beer category**
   - Age verification prompt appears (bar feature)
   - After verification, added to cart: $8.50

3. **Cashier clicks "Margarita" from Cocktails category**
   - Already verified, added to cart: $12.00

4. **Single Checkout**
   - Total: $32.50
   - One order, one transaction
   - Order type: "Dine-In" or "Bar Service" (cashier chooses)

**No view switching. No mode changes. Just works.**

## Quick Bar Mode (Optional Specialization)

For high-speed bar service during busy periods, businesses can optionally enable **Quick Bar Mode**.

### When to Use Quick Bar Mode

- **Late night bar rush** - Need maximum drink ordering speed
- **Happy hour** - High volume drink orders
- **Special events** - Bottle service, VIP sections
- **Dedicated bar terminal** - Terminal only used for bar service

### What Quick Bar Mode Provides

**Bar-Optimized Layout:**
```
┌─────────────────────────────────────┐
│ 🍺 Quick Order  |  Open Tabs  |  Sections │
├─────────────────────────────────────┤
│                                     │
│  [Beer]  [Wine]  [Cocktails]       │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ IPA  │ │Marg. │ │Vodka │       │
│  │ $8.50│ │$12.00│ │Soda  │       │
│  └──────┘ └──────┘ │$10.00│       │
│                     └──────┘       │
│                                     │
│  [QuickDrinkBuilder]               │
│  Build custom drinks fast          │
└─────────────────────────────────────┘
```

**Features:**
- Larger drink buttons for speed
- QuickDrinkBuilder for custom drinks
- Open Tabs management integrated
- Section/table selection
- Common modifiers always visible

### Toggling Quick Bar Mode

```typescript
// Button in header (only visible if bar subscription active)
<Button onClick={() => setQuickBarMode(!quickBarMode)}>
  <Zap /> {quickBarMode ? 'Standard View' : 'Quick Bar Mode'}
</Button>
```

**Important:** This is an OPTIONAL specialized view, not the default. Most businesses will use the unified product grid and only toggle Quick Bar Mode when needed.

## Implementation Details

### Store State

```typescript
interface Store {
  // Multi-subscription support
  subscribedPresets: string[];  // ['restaurant', 'bar']
  
  // Optional quick mode
  quickBarMode: boolean;  // false by default
  
  // Legacy single profile (for backward compatibility)
  businessProfile: BusinessProfile;
}
```

### Category Filtering Logic

```typescript
// Show categories from ALL subscribed presets
const industryFilteredCategories = categories.filter(cat => {
  // Universal categories (no industry) always shown
  if (!cat.industry) return true;
  
  // Show if category industry matches any subscribed preset
  return subscribedPresets.includes(cat.industry);
});
```

### Product Grid Display Logic

```typescript
{quickBarMode && subscribedPresets.includes('bar') ? (
  // Optional bar-optimized layout
  <BarProductArea />
) : (
  // Default unified product grid
  <ProductGrid />
)}
```

## Architecture Benefits

### ✅ Natural Workflow
- Add items from any industry to same order
- No artificial separation between product types
- Matches real-world business operations

### ✅ Flexible Specialization
- Can toggle specialized layouts when needed
- Optional, not mandatory
- Quick Bar Mode for speed when bartending

### ✅ Scalable
- Easy to add more subscriptions (cafe, retail, etc.)
- Categories automatically merge
- Features intelligently combine

### ✅ Clean UI
- One product grid, not multiple separate views
- Subscription badges show active packages
- Optional specialized modes for specific workflows

## Comparison: Wrong vs. Right Approach

### ❌ Wrong Approach (View Switching)

```
User wants to order: Burger + Beer

1. Default view: Restaurant Mode
2. Click "Burger" → Added to cart ✓
3. Want to add beer... but Beer category not visible
4. Click dropdown "Switch to Bar Mode" 
5. UI completely changes, lose context
6. Find Beer category
7. Click "IPA" → Added to cart ✓
8. Switch back to Restaurant Mode to continue
9. Confusing and slow
```

### ✅ Right Approach (Unified Display)

```
User wants to order: Burger + Beer

1. See all categories: Entrees, Beer, Wine, etc.
2. Click "Burger" → Added to cart ✓
3. Click "IPA" → Age verification → Added to cart ✓
4. Done. Fast and intuitive.
```

## Edge Cases

### What if business has 5+ subscriptions?

```typescript
subscribedPresets: ['restaurant', 'bar', 'cafe', 'retail', 'salon']
```

**Result:** Many categories. Might need to implement:
- Category search/filter
- Favorites/pinned categories
- Recently used categories
- Terminal-specific category defaults

### What if business wants different terminals for different industries?

**Solution:** Add terminal-level preset filtering:

```typescript
interface Terminal {
  id: string;
  name: string;
  activePresets?: string[];  // Override which presets this terminal shows
}

// Example: Bar Terminal only shows bar products
{
  id: 'terminal-bar-1',
  name: 'Bar Terminal 1',
  activePresets: ['bar']  // Only show bar categories on this terminal
}
```

### What if categories have naming conflicts?

```
Restaurant: "Beverages" (sodas, juices)
Bar: "Beverages" (alcohol)
```

**Solution:** Rename categories to be more specific:
- Restaurant: "Soft Drinks"
- Bar: "Beer", "Wine", "Spirits" (already specific)

## Future Enhancements

### Smart Category Ordering

Order categories based on:
- Business type (restaurant categories first for restaurant+bar)
- Usage frequency (most-used categories at top)
- Time of day (bar categories promoted after 5 PM)
- Terminal type (bar terminals show bar categories first)

### Cross-Preset Combo Items

```typescript
// Example: "Burger + Beer Combo"
{
  id: 'combo-1',
  name: 'Burger & Beer Combo',
  items: [
    { preset: 'restaurant', productId: 'burger-classic' },
    { preset: 'bar', productId: 'draft-beer-house' }
  ],
  price: 18.00,  // Discounted from $12 + $8 = $20
  discount: 2.00
}
```

### Preset-Specific Workflows

Some actions only available when certain presets active:
- "Fire to Kitchen" button → Only if restaurant preset
- "Start Tab" button → Only if bar preset
- "Book Appointment" → Only if salon preset

## Summary

**Multi-subscription architecture = unified display by default, with optional specialized modes for specific workflows.**

The key insight: Don't force users to switch views for different product types. Instead, show everything in one unified interface and let them optionally switch to specialized layouts when speed matters.
