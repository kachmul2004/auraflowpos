# Implementation Roadmap - KMP POS System

**Date:** October 30, 2025  
**Strategy:** Follow Options 1 → 2 → 3 for systematic feature completion  
**Current Status:** ✅ Phase 0 Complete (Infrastructure + ProductGrid)

---

## 🎯 Complete Flow Understanding

### How Cart Works in Web Version

```
1. User clicks product → Added to cart (1 quantity)
2. Cart shows: "1× Product Name $10.00"
3. User clicks cart item → Opens EditCartItemDialog
4. Dialog has 4 tabs:
   ├─ Quantity (+ / - buttons, stock limit)
   ├─ Variations (size, color, etc.) - if product has variations
   ├─ Modifiers (add-ons like "Extra cheese") - if available
   └─ Pricing (discount, price override)
5. User makes changes → "Save Changes" button
6. Cart updates with new quantity/modifiers/price
7. User clicks "Charge" → Opens PaymentDialog
8. Select payment method → Complete transaction
9. Receipt displayed → Print/Email options
```

**Key Insight:** Cart items are **clickable** - tapping opens a full editing modal!

---

## 📋 OPTION 1: Minimum Viable POS (2 weeks)

**Goal:** Complete end-to-end transaction flow with mock data

### Week 1: Core Cart & Checkout

#### 1. Update ShoppingCart Component (2-3 days) ⭐⭐⭐

**File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/components/ShoppingCart.kt`

**Tasks:**

- [x] Cart items list (already exists)
- [x] Make cart items **clickable** (open edit dialog)
- [ ] Add "Customer" button (opens CustomerSelectionDialog)
- [ ] Add "Order Notes" button (opens NotesDialog)
- [ ] Add "Discount" button (opens DiscountDialog)
- [ ] Show proper totals:
  ```
  Subtotal:  $25.00
  Discount:  -$2.50 (10%)
  Tax (8%):  $1.80
  ─────────────────
  Total:     $24.30
  ```
- [ ] Add action buttons at bottom:
    - Clear Cart (trash icon)
    - Park Sale (with badge if parked sales exist)
    - **Charge** button (green, opens PaymentDialog)

**Reference:** `docs/Web Version/src/components/ShoppingCart.tsx`

---

#### 2. Create EditCartItemDialog (3-4 days) ⭐⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/EditCartItemDialog.kt`

**Features:**

- **Tabs Navigation** (Left sidebar):
    - Quantity tab (always shown)
    - Variations tab (if product has variations)
    - Modifiers tab (if product has modifiers)
    - Pricing tab (discount, override)

**Tab 1: Quantity**

```kotlin
[ - ]  [ 5 ]  [ + ]

Available Stock: 50 units
```

- Minus button (disabled if qty = 1)
- Number input (editable)
- Plus button (disabled if qty = stock limit)

**Tab 2: Variations** (optional)

```kotlin
Select Size:
[Small]  [Medium*]  [Large]

*currently selected
```

- Radio button grid
- Show price differences
- Show out-of-stock status

**Tab 3: Modifiers** (optional)

```kotlin
Extra Cheese          [ Add ]
+ $1.50              [ - ] 2 [ + ]
```

- List of available modifiers
- Add button → changes to quantity controls
- Show modifier price

**Tab 4: Pricing**

```kotlin
Price Override
$ [__10.00__]  [X clear]
Original: $10.00

Discount
[Percentage*] [Fixed Amount]
[__10__] %  [X clear]

Summary:
Subtotal (5×): $50.00
Discount:      -$5.00
───────────────────────
Total:         $45.00
```

**Bottom Actions:**

- [Void Item] (red, left)
- [Cancel] [Save Changes] (right)

**Reference:** `docs/Web Version/src/components/EditCartItemDialog.tsx`

---

#### 3. Create PaymentDialog (2-3 days) ⭐⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/PaymentDialog.kt`

**Layout:**

```kotlin
┌──────────────────────────────────────┐
│  Total to Charge: $24.30             │
├──────────────────────────────────────┤
│  Payment Method:                      │
│  [ Cash* ] [ Card ] [ Digital ]      │
├──────────────────────────────────────┤
│  Amount Received: $__________        │
│  Change: $0.00                       │
├──────────────────────────────────────┤
│  [Cancel] [Complete Transaction]     │
└──────────────────────────────────────┘
```

**Features:**

- Payment method tabs (Cash, Card, Digital Wallet, etc.)
- For Cash: Show calculator for amount received + change
- For Card: Show "Processing..." simulation (mock)
- For Digital: Show QR code simulation (mock)
- Complete button → Creates order → Shows receipt
- Error handling (insufficient payment, etc.)

**Reference:** `docs/Web Version/src/components/PaymentDialogEnhanced.tsx`

---

#### 4. Create ReceiptDialog (1-2 days) ⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/ReceiptDialog.kt`

**Features:**

- Display completed transaction
- Store logo/name
- Date/time, transaction ID
- Cashier name
- Line items with quantities and prices
- Subtotal, tax, total
- Payment method
- Change given (if cash)
- Actions:
    - Print (mock - toast message)
    - Email (mock - toast message)
    - New Transaction (close dialog, clear cart)

**Reference:** `docs/Web Version/src/components/ReceiptDialog.tsx`

---

### Week 2: Essential Features

#### 5. Create ItemSearchBar (2 days) ⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/components/ItemSearchBar.kt`

**Features:**

- Search input with icon
- Search by: Name, SKU, Barcode
- Show dropdown with results (max 10)
- Click result → Add to cart
- Enter key → Add first result
- Escape → Close dropdown
- Keyboard shortcut: F3 or Ctrl+K to focus

**Reference:** `docs/Web Version/src/components/ItemSearchBar.tsx`

---

#### 6. Create CustomerSelectionDialog (2 days) ⭐⭐

**New File:**
`composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/CustomerSelectionDialog.kt`

**Features:**

- Search customers by name, phone, email
- List of matching customers
- Show customer info: Name, phone, loyalty points
- [Select] button per customer
- [Create New Customer] button (for later)
- Selected customer shows in cart header

**Reference:** `docs/Web Version/src/components/CustomerSelectionDialog.tsx`

---

#### 7. Update POSScreen Layout (1 day) ⭐⭐

**File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/POSScreen.kt`

**Add:**

- ItemSearchBar at top (desktop only)
- Proper 70/30 split (products left, cart right)
- Make layout responsive

---

#### 8. Add Simple Dialogs (2 days) ⭐

**New Files:**

- `NotesDialog.kt` - Add order notes
- `DiscountDialog.kt` - Apply order-level discount
- `ParkedSalesDialog.kt` - View/recall parked sales

---

### ✅ OPTION 1 Deliverable

**What Works:**

- ✅ Login → Browse products → Click product → Add to cart
- ✅ Click cart item → Edit quantity/modifiers/price
- ✅ Add customer to order
- ✅ Add order notes
- ✅ Apply discounts
- ✅ Search for products
- ✅ Click Charge → Select payment → Complete
- ✅ View receipt → Print/Email (mock)
- ✅ Clear cart, park sale

**Result:** **Full working POS with mock data!** 🎉

---

## 📋 OPTION 2: Essential Features (Week 3-4)

**Goal:** Add professional POS capabilities

### Week 3: Navigation & Views

#### 9. Create ActionBar (2 days) ⭐⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/components/ActionBar.kt`

**Layout:**

```kotlin
┌────────────────────────────────────────────────┐
│ [Transactions] [Returns] [Orders] [Lock] [End Day] │
└────────────────────────────────────────────────┘
```

**Features:**

- Fixed at bottom of screen
- Icon + label buttons
- Badge on buttons if needed (e.g., pending returns count)
- Navigate to full-screen views

**Reference:** `docs/Web Version/src/components/ActionBar.tsx`

---

#### 10. Create TransactionsPage (2 days) ⭐⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/TransactionsPage.kt`

**Features:**

- List all completed transactions
- Search by: Order ID, customer name, date
- Filter by: Date range, payment method, cashier
- Click transaction → View details
- [Back to POS] button
- Pagination for large lists

**Reference:** `docs/Web Version/src/components/TransactionsPage.tsx`

---

#### 11. Add Keyboard Shortcuts (2 days) ⭐⭐

**Update:** Multiple files to handle keyboard events

**Shortcuts to Add:**

- F1: Show keyboard shortcuts help
- F2: Quick payment (Cash)
- F3 / Ctrl+K: Focus search bar
- F10: No sale (open drawer - mock)
- F11: Toggle fullscreen
- Ctrl+L: Lock screen
- Ctrl+N: Clear cart (with confirmation)
- Ctrl+P: Print last receipt
- Ctrl+Shift+T: Toggle training mode
- Enter: Process barcode (if barcode scanner active)
- Escape: Cancel current action

**Create:**

- `KeyboardShortcutsDialog.kt` - Shows all shortcuts (F1)
- `KeyboardHandler.kt` - Central keyboard event handler

**Reference:** POSView.tsx lines 182-300

---

#### 12. Create LockScreen (1 day) ⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/LockScreen.kt`

**Features:**

- Full-screen overlay
- User's name displayed
- PIN entry (4-6 digits)
- Unlock button
- Clock showing current time
- "Locked since X:XX AM" message
- Correct PIN → Unlock → Resume
- Wrong PIN → Error message, retry

**Reference:** `docs/Web Version/src/components/LockScreen.tsx`

---

#### 13. Add Park/Hold Orders (2 days) ⭐⭐

**Features:**

- "Park Sale" button in cart
- Save current cart with a name
- Badge on button showing parked count
- ParkedSalesDialog shows list
- Click parked sale → Restore to cart
- Option to delete parked sales

---

### Week 4: Header & Settings

#### 14. Create Header Components (2 days) ⭐⭐

**Update:** `POSScreen.kt` header

**Add:**

- App title "AuraFlow-POS"
- User profile dropdown:
    - User name
    - Role badge
    - [Settings] menu item
    - [Keyboard Shortcuts] menu item
    - [Lock Screen] menu item
    - [Clock Out] menu item
- Theme toggle button (Dark/Light)
- Training mode switch
- Shift status badge (if clocked in)

**Create:**

- `UserProfileDropdown.kt`

**Reference:** `docs/Web Version/src/components/UserProfileDropdown.tsx`

---

#### 15. Create QuickSettingsDialog (1 day) ⭐

**New File:**
`composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/QuickSettingsDialog.kt`

**Features:**

- Receipt printer settings
- Sound effects toggle
- Keyboard shortcuts toggle
- Training mode toggle
- Auto-lock timeout
- [Save] button

---

#### 16. Add Training Mode (1 day) ⭐

**Features:**

- Toggle in header
- Badge showing "Training Mode" when active
- Transactions don't affect real data
- Visual indicator (orange/yellow theme?)
- Warning when completing transactions
- Easy to turn on/off

---

### ✅ OPTION 2 Deliverable

**What Works:**

- Everything from Option 1 ✅
- Full navigation (Transactions, Returns, Orders)
- Keyboard shortcuts for speed
- Lock screen for security
- Park/hold orders for interruptions
- Professional header with user menu
- Training mode for safe testing

**Result:** **Professional POS ready for real use!** 🎉

---

## 📋 OPTION 3: Advanced Features (Week 5-6)

**Goal:** Add shift management and advanced features

### Week 5: Shift Management

#### 17. Create ShiftDialog (2 days) ⭐⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/ShiftDialog.kt`

**Features:**

- Clock In:
    - Select terminal
    - Enter starting cash
    - [Start Shift] button
- Clock Out:
    - Show shift summary (sales, transactions, etc.)
    - Count cash drawer
    - Generate Z-Report
    - [End Shift] button

**Reference:** `docs/Web Version/src/components/ShiftDialog.tsx`

---

#### 18. Create ZReportDialog (2 days) ⭐⭐⭐

**New File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/dialog/ZReportDialog.kt`

**Features:**

- End-of-day report
- Shows:
    - Total sales
    - Payment method breakdown
    - Number of transactions
    - Average transaction value
    - Refunds/voids
    - Cash drawer reconciliation
- [Print] [Email] [Close] buttons

**Reference:** `docs/Web Version/src/components/ZReportDialog.tsx`

---

#### 19. Add Barcode Scanner Support (2 days) ⭐⭐

**Update:** Multiple files

**Features:**

- Listen for rapid keyboard input
- Buffer alphanumeric characters
- Enter key → Process barcode
- Search products by barcode/SKU
- Auto-add to cart if found
- Sound feedback (beep on success, error on not found)
- Visual feedback (flash or animation)
- Works globally (not just in search bar)

**Reference:** POSView.tsx lines 115-180

---

#### 20. Create ReturnsPage & OrdersPage (2 days) ⭐⭐

**New Files:**

- `ReturnsPage.kt` - Process returns
- `OrdersPage.kt` - View all orders (not just transactions)

---

### Week 6: Industry Features

#### 21. Add Order Types (2 days) ⭐⭐

**Features:**

- Order type selector in cart
- Types: Dine-in, Takeout, Delivery, Pickup
- Different workflows per type
- Order type badge in cart
- Filter transactions by order type

---

#### 22. Create TableManagementPage (3 days) ⭐⭐

**New File:**
`composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/TableManagementPage.kt`

**Features:**

- Grid of tables
- Table status (Available, Occupied, Reserved)
- Tap table → View/edit order
- Assign order to table
- Split check feature
- Transfer order between tables
- Floor plan view

**Reference:** `docs/Web Version/src/components/TableManagementPage.tsx`

---

#### 23. Add Tipping (1 day) ⭐

**Update:** PaymentDialog

**Features:**

- Tip amount selector (15%, 18%, 20%, Custom)
- Add to total before payment
- Show tip in receipt
- Track tips per employee

---

### ✅ OPTION 3 Deliverable

**What Works:**

- Everything from Options 1 & 2 ✅
- Shift management (clock in/out)
- End-of-day Z-Reports
- Barcode scanner support
- Returns processing
- Order types (Dine-in, Takeout, etc.)
- Table management (for restaurants)
- Tipping support

**Result:** **Full-featured industry-ready POS!** 🎉

---

## 📊 Progress Tracking

### Current State

- ✅ Phase 0: Infrastructure (100%)
- 🚧 Option 1: Core Flow (40% - More done than expected!)
  - ✅ Login Screen (100%)
  - ✅ POSScreen Shell (100%)
  - ✅ ProductGrid (100% - WITH IMAGES!)
    - ✅ 5×5 grid layout
    - ✅ Category filtering (All, Food, Beverages, Retail)
    - ✅ Pagination (25 items per page)
    - ✅ Product images from Unsplash
    - ✅ Stock badges
    - ✅ Price display
    - ✅ Calculated row heights (matches web version)
  - ✅ Image Loading (100%)
    - ✅ Coil3 integration
    - ✅ Network support (Ktor engines per platform)
    - ✅ Loading states
    - ✅ Error handling
  - ⚠️ Basic ShoppingCart (60% - needs enhancement)
    - ✅ Display cart items
    - ✅ Show totals
    - ✅ Make items clickable
    - ✅ Edit dialog
    - ❌ Customer/Notes/Discount buttons
  - ❌ Payment flow (0%)
  - ❌ Receipt display (0%)

- ⏳ Option 2: Professional Features (0%)
- ⏳ Option 3: Advanced Features (0%)

### Components Completed (14/60+)

✅ **Infrastructure & Core (8/8)**

- [x] Gradle KMP setup with version catalogs
- [x] Koin DI with module override system
- [x] Platform entry points (Android, iOS, Desktop, WASM, JS)
- [x] Theme system (Material3 + custom colors)
- [x] Domain models (User, Product, Customer, Cart)
- [x] Mock repositories with 30 products
- [x] Image loading (Coil3 + platform Ktor engines)
- [x] All platforms building successfully

✅ **Screens (3/10)**

- [x] Login Screen with pre-filled credentials
- [x] POSScreen with 70/30 split layout
- [x] ProductGrid with images, filters, pagination

✅ **Components (3/15)**

- [x] ProductCard (in grid, with images)
- [x] Basic ShoppingCart (enhanced)
- [x] EditCartItemDialog

❌ **Dialogs (1/15)**

- [x] EditCartItemDialog
- [ ] PaymentDialog
- [ ] ReceiptDialog
- [ ] CustomerSelectionDialog
- [ ] NotesDialog
- [ ] DiscountDialog
- [ ] ParkedSalesDialog
- [ ] 
  + 8 more for Options 2 & 3

❌ **Advanced Components (0/20+)**

- [ ] ItemSearchBar
- [ ] ActionBar
- [ ] Header components
- [ ] 
  + 17 more

### Current State

- ✅ Phase 0: Infrastructure (100%)
- 🚧 Option 1: Core Flow (40% - More done than expected!)
  - ✅ Login Screen (100%)
  - ✅ POSScreen Shell (100%)
  - ✅ ProductGrid (100% - WITH IMAGES!)
    - ✅ 5×5 grid layout
    - ✅ Category filtering (All, Food, Beverages, Retail)
    - ✅ Pagination (25 items per page)
    - ✅ Product images from Unsplash
    - ✅ Stock badges
    - ✅ Price display
    - ✅ Calculated row heights (matches web version)
  - ✅ Image Loading (100%)
    - ✅ Coil3 integration
    - ✅ Network support (Ktor engines per platform)
    - ✅ Loading states
    - ✅ Error handling
  - ⚠️ Basic ShoppingCart (60% - needs enhancement)
    - ✅ Display cart items
    - ✅ Show totals
    - ✅ Make items clickable
    - ✅ Edit dialog
    - ❌ Customer/Notes/Discount buttons
  - ❌ Payment flow (0%)
  - ❌ Receipt display (0%)

- ⏳ Option 2: Professional Features (0%)
- ⏳ Option 3: Advanced Features (0%)

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Option 1** | 2 weeks | Working POS with full transaction flow |
| **Option 2** | 2 weeks | Professional features + navigation |
| **Option 3** | 2 weeks | Industry-specific advanced features |
| **Total** | **6 weeks** | **Production-ready POS system** |

---

## 💡 Key Principles

1. **Follow the web version design** - Don't reinvent, translate
2. **Make it functional first** - Polish comes later
3. **Test after each component** - Don't wait until the end
4. **Keep mock data realistic** - Makes testing meaningful
5. **Document as you go** - Future you will thank you

---

**Status:** ✅ Ready to start Option 1  
**Next:** Implement ReceiptDialog  
**ETA to Demo:** 2 weeks (Option 1 complete)  
**ETA to Production:** 6 weeks (All options complete)
