# Action Buttons Implementation Plan

## 📋 Overview

Need to implement functionality for 6 action buttons in the ActionBar:

1. Clock Out (Green)
2. Lock (Red)
3. Cash Drawer (Blue)
4. Transactions (Pink)
5. Returns (Orange)
6. Orders (Yellow)

---

## ✅ Already Exists

### ShiftStatusDialog

- **File:** `ui/dialog/ShiftStatusDialog.kt`
- **Used for:** Clock Out button
- **Status:** ✅ Complete
- **Shows:** Shift summary, transactions, cash balance

---

## 🔨 Need to Create

### 1. Cash Drawer Dialog ⭐ PRIORITY

**Component:** `CashDrawerDialog.kt`
**Purpose:** Add/Remove cash from drawer
**Features:**

- Current cash balance display
- Tabs: Cash In / Cash Out
- Amount input
- Reason textarea
- Submit/Cancel buttons

**Web Reference:** `docs/Web Version/src/components/CashDrawerDialog.tsx`

---

### 2. Lock Screen ⭐ PRIORITY

**Component:** `LockScreen.kt`
**Purpose:** Lock POS when stepping away
**Features:**

- Full-screen overlay
- Shows locked message
- PIN input to unlock
- Clock display
- Cannot dismiss without PIN

**Web Reference:** `docs/Web Version/src/components/LockScreen.tsx`

---

### 3. Transactions Page

**Component:** `TransactionsScreen.kt`
**Purpose:** View order history
**Features:**

- List of all orders
- Search/filter by date, order number, customer
- Order details view
- Void/Return options
- Export to CSV/PDF

**Web Reference:** `docs/Web Version/src/components/TransactionsPage.tsx`

---

### 4. Returns Page

**Component:** `ReturnsScreen.kt`
**Purpose:** Process returns/exchanges
**Features:**

- Search order by number/customer
- Select items to return
- Reason for return
- Refund method selection
- Print return receipt

**Web Reference:** `docs/Web Version/src/components/ReturnsPage.tsx`

---

### 5. Orders/Parked Sales Dialog

**Component:** `ParkedSalesDialog.kt`
**Purpose:** View and resume parked sales
**Features:**

- List of parked orders
- Order timestamp and user
- Load order to cart
- Delete parked order
- Park current sale

**Web Reference:** `docs/Web Version/src/components/ParkedSalesDialog.tsx`

---

## 📐 Implementation Order

### Phase 1: Dialogs (Immediate)

1. ✅ **CashDrawerDialog** - Most used, simple to implement
2. ✅ **LockScreen** - Security feature, high priority
3. ✅ **ParkedSalesDialog** - Useful for busy periods

### Phase 2: Full Screens (Next Sprint)

4. **TransactionsScreen** - Complex, needs navigation
5. **ReturnsScreen** - Complex, needs order search
6. **OrdersPage** - May merge with Parked Sales

---

## 🔧 Technical Requirements

### State Management

All dialogs need access to:

- `currentShift` - For shift-related operations
- `currentUser` - For permissions/logging
- `cart` - For parked sales
- ViewModels for data operations

### Navigation

Full screens (Transactions, Returns, Orders) need:

- Navigation from POSScreen
- Back button to return to POS
- Maintain state when switching

### Permissions

Some actions require permissions:

- Cash transactions - `manage_cash`
- Void orders - `void_transactions`
- Process returns - `process_returns`

---

## 📝 Implementation Checklist

### Cash Drawer Dialog

- [ ] Create CashDrawerDialog.kt
- [ ] Add tabs for Cash In/Cash Out
- [ ] Display current balance
- [ ] Amount and reason inputs
- [ ] Wire up to shift ViewModel
- [ ] Show in POSScreen when button clicked

### Lock Screen

- [ ] Create LockScreen.kt
- [ ] Full-screen overlay
- [ ] PIN input field
- [ ] Clock display
- [ ] Unlock verification
- [ ] Show from POSScreen

### Parked Sales Dialog

- [ ] Create ParkedSalesDialog.kt
- [ ] List parked orders
- [ ] Load order action
- [ ] Delete order action
- [ ] Park current sale action
- [ ] Wire up to cart ViewModel

### Transactions Screen

- [ ] Create TransactionsScreen.kt
- [ ] Order list with pagination
- [ ] Search/filter controls
- [ ] Order detail view
- [ ] Export functionality
- [ ] Navigation from POSScreen

### Returns Screen

- [ ] Create ReturnsScreen.kt
- [ ] Order search
- [ ] Item selection
- [ ] Return reason dialog
- [ ] Refund processing
- [ ] Return receipt

### Orders Page

- [ ] Decide if separate from Parked Sales
- [ ] Create OrdersScreen.kt if needed
- [ ] Order management UI
- [ ] Navigation from POSScreen

---

## 🎯 Success Criteria

Each component must:

1. ✅ Match web version design
2. ✅ Use correct colors from theme
3. ✅ Handle light/dark modes
4. ✅ Show loading states
5. ✅ Display error messages
6. ✅ Work with mock data
7. ✅ Build without errors
8. ✅ Have proper documentation

---

## 📚 Web Version Files to Reference

```
docs/Web Version/src/components/
├── CashDrawerDialog.tsx
├── LockScreen.tsx
├── ParkedSalesDialog.tsx
├── TransactionsPage.tsx
├── ReturnsPage.tsx
└── HeldOrdersDialog.tsx (similar to Orders)
```

---

## 🚀 Let's Start!

**Next Step:** Implement Phase 1 - Dialogs

1. CashDrawerDialog
2. LockScreen
3. ParkedSalesDialog

These are highest priority and can be completed quickly!