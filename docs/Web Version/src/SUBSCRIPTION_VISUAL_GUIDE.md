# Multi-Subscription Visual Guide

## Before vs. After

### ❌ OLD WAY (View Switching - WRONG)

```
┌─────────────────────────────────────────┐
│ [Restaurant Mode ▼] Switch to Bar Mode │  ← Dropdown to switch
├─────────────────────────────────────────┤
│                                         │
│  RESTAURANT PRODUCTS ONLY:              │
│  ┌──────────┐ ┌──────────┐             │
│  │ Burger   │ │ Salad    │             │
│  │ $12.00   │ │ $9.00    │             │
│  └──────────┘ └──────────┘             │
│                                         │
│  Want beer? Must switch mode! ❌       │
│                                         │
└─────────────────────────────────────────┘

User clicks "Switch to Bar Mode"...

┌─────────────────────────────────────────┐
│ [Bar Mode ▼] Switch to Restaurant Mode  │
├─────────────────────────────────────────┤
│                                         │
│  BAR PRODUCTS ONLY:                     │
│  ┌──────────┐ ┌──────────┐             │
│  │ Beer     │ │ Wine     │             │
│  │ $8.00    │ │ $12.00   │             │
│  └──────────┘ └──────────┘             │
│                                         │
│  Want burger? Must switch back! ❌     │
│                                         │
└─────────────────────────────────────────┘
```

**Problems:**
- Can't see all products at once
- Must switch views to add different item types
- Slow and confusing
- Cart might get lost during switching

---

### ✅ NEW WAY (Unified Display - CORRECT)

```
┌─────────────────────────────────────────────────┐
│ [🍽️] [🍺] [⚡ Quick Bar Mode]                  │  ← Badges + Optional toggle
├─────────────────────────────────────────────────┤
│                                                 │
│  ALL PRODUCTS FROM ALL SUBSCRIPTIONS:           │
│                                                 │
│  Restaurant Items:                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Burger   │ │ Salad    │ │ Pasta    │       │
│  │ $12.00   │ │ $9.00    │ │ $15.00   │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  Bar Items:                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Beer 🍺  │ │ Wine 🍷  │ │Cocktail🍸│       │
│  │ $8.00    │ │ $12.00   │ │ $14.00   │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  ✅ Click any item, add to cart immediately    │
│  ✅ Mix and match freely                       │
│  ✅ No mode switching needed                   │
│                                                 │
└──��──────────────────────────────────────────────┘
```

**Benefits:**
- See everything at once
- Add any items to same order
- Fast and intuitive
- Natural workflow

---

## Category Filtering

### Single Subscription: `['restaurant']`

```
Categories shown:
├── Coffee ☕
├── Restaurant 🍽️
└── Beverages 🥤
```

### Multi-Subscription: `['restaurant', 'bar']`

```
Categories shown (MERGED):
├── Coffee ☕          (from restaurant)
├── Restaurant 🍽️     (from restaurant)
├── Beverages 🥤      (from restaurant)
├── Beer 🍺           (from bar)
├── Wine 🍷           (from bar)
├── Spirits 🥃        (from bar)
├── Cocktails 🍸      (from bar)
├── Shots 🔥          (from bar)
├── Non-Alcoholic 💧  (from bar)
└── Food 🍔           (from bar)
```

---

## Quick Bar Mode (Optional)

When you need maximum speed for bar service, toggle Quick Bar Mode:

### Standard View (Default)
```
┌─────────────────────────────────────────┐
│ [⚡ Quick Bar Mode]  ← Click to enable  │
├─────────────────────────────────────────┤
│                                         │
│  Standard product grid                  │
│  All categories visible                 │
│  Good for: Mixed orders                 │
│                                         │
└─────────────────────────────────────────┘
```

### Quick Bar Mode (Toggled ON)
```
┌─────────────────────────────────────────┐
│ [⚡ Quick Bar Mode]  ← Click to disable │
├─────────────────────────────────────────┤
│ Quick Order | Open Tabs | Sections      │
├─────────────────────────────────────────┤
│                                         │
│  Bar-optimized layout:                  │
│  ┌─────────────┐ ┌─────────────┐      │
│  │   IPA Draft │ │  Margarita  │      │
│  │             │ │             │      │
│  │   $8.50     │ │   $12.00    │      │
│  └─────────────┘ └─────────────┘      │
│                                         │
│  [QuickDrinkBuilder]                    │
│  [Open Tabs Management]                 │
│                                         │
│  Good for: High-speed drink service     │
│                                         │
└─────────────────────────────────────────┘
```

**When to use:**
- Busy bar hours (happy hour, late night rush)
- Dedicated bar terminal
- Special events (bottle service, VIP)
- Need maximum drink ordering speed

**When NOT to use:**
- Mixed food + drink orders
- Daytime service
- Training new staff
- General restaurant service

---

## Real-World Scenarios

### Scenario 1: Restaurant + Bar Combo

**Setup:**
```typescript
subscribedPresets: ['restaurant', 'bar']
quickBarMode: false  // Default
```

**Customer Order:**
1. Customer sits at table
2. Orders appetizer, entree, and 2 beers
3. Cashier workflow:
   - Select "Dine-In" order type
   - Click "Wings" (Food category) → Cart
   - Click "Steak" (Restaurant category) → Cart  
   - Click "IPA Draft" (Beer category) → Age verification → Cart
   - Click "IPA Draft" again → Cart (2nd beer)
   - Checkout → Total $54.50

**Result:** ✅ One smooth workflow, no mode switching

---

### Scenario 2: Busy Bar Night

**Setup:**
```typescript
subscribedPresets: ['restaurant', 'bar']
quickBarMode: true  // Toggled for speed
```

**Customer Orders:**
1. Customer at bar orders 3 drinks quickly
2. Bartender workflow:
   - Quick Bar Mode enabled (large drink buttons)
   - Tap "Margarita" → Cart
   - Tap "Beer" → Select IPA → Cart
   - Tap "Shot" → Select Tequila → Cart
   - Checkout → Total $26.00
   - 10 seconds total

**Result:** ✅ Maximum speed with bar-optimized layout

---

### Scenario 3: Mixed Service

**Setup:**
```typescript
subscribedPresets: ['restaurant', 'bar']
quickBarMode: false  // Standard view
```

**Table Order (Food + Drinks):**
1. Table of 4 orders dinner + drinks
2. Server workflow:
   - Select "Dine-In" order type
   - Select Table 5
   - Add all items in any order:
     - 2x Burger (Restaurant)
     - 1x Salad (Restaurant)
     - 1x Pasta (Restaurant)
     - 2x Beer (Bar)
     - 1x Wine (Bar)
     - 1x Non-Alcoholic (Bar)
   - Checkout → Total $87.50

**Result:** ✅ Natural workflow, all items visible together

---

## Migration Path

### Existing Restaurant-Only Business

**Current:**
```typescript
businessProfile: 'restaurant'
subscribedPresets: ['restaurant']
```

**Adding Bar Subscription:**
```typescript
businessProfile: 'restaurant'  // Legacy field
subscribedPresets: ['restaurant', 'bar']  // ← Updated
```

**What Changes:**
- ✅ Bar categories appear in product grid
- ✅ Bar products become orderable
- ✅ Quick Bar Mode toggle appears
- ✅ Age verification activates
- ✅ Open tabs feature available
- ✅ Subscription badges show 🍽️ 🍺

**What Stays Same:**
- ✅ All restaurant features still work
- ✅ Existing products still visible
- ✅ Table management unchanged
- ✅ Order types keep working

---

## Summary

**The key insight:** Multi-service businesses don't need separate "modes" - they need a unified interface that shows ALL their products together, with optional specialized layouts for specific high-speed workflows.

**Default behavior:** Unified product grid with all categories
**Optional behavior:** Quick Bar Mode for bar service speed

This matches real-world workflows where cashiers frequently mix item types in the same order.
