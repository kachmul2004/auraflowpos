# UI Improvements Implementation

**Date:** November 2, 2024

---

## 🎯 **Issues to Fix**

### 1. **Non-functional Buttons** ✅

- ❌ Split Check button (empty TODO)
- ❌ Courses button (empty TODO)

### 2. **Localization** 🚧

- Use "Check" for US English
- Use "Cheque" for British English

### 3. **Screen Consolidation** 🚧

- Combine Returns + Transactions into one screen with tabs
- Better UX - related functionality together

---

## ✅ **What's Been Done**

### **1. Created Split Check Dialog**

**File:** `SplitCheckDialog.kt`

**Features:**

- Split bill between 2-10 customers
- Quick split options (Equal split, By seat)
- Shows all cart items with totals
- Modern Material3 design

### **2. Created Courses Dialog**

**File:** `CoursesDialog.kt`

**Features:**

- Assign items to courses (Appetizer, Main, Dessert, Beverage)
- Kitchen firing management
- Per-item course selection
- FilterChip UI for course assignment

---

## 🚧 **Next Steps**

### **Step 1: Wire Dialogs to POSScreen**

```kotlin
// POSScreen.kt
var showSplitCheckDialog by remember { mutableStateOf(false) }
var showCoursesDialog by remember { mutableStateOf(false) }

// In ActionBar call:
onSplitCheck = { showSplitCheckDialog = true },
onCourses = { showCoursesDialog = true },

// Dialog calls:
if (showSplitCheckDialog) {
    SplitCheckDialog(
        open = showSplitCheckDialog,
        cartItems = cartItems,
        onDismiss = { showSplitCheckDialog = false }
    )
}

if (showCoursesDialog) {
    CoursesDialog(
        open = showCoursesDialog,
        cartItems = cartItems,
        onDismiss = { showCoursesDialog = false }
    )
}
```

### **Step 2: Create Unified History Screen**

**New Screen:** `OrderHistoryScreen.kt` (replace existing)

**Tabs:**

1. **Orders** - All completed orders
2. **Returns** - Returned/refunded orders
3. **Transactions** - All transactions (sales, voids, returns, cash in/out)

**Benefits:**

- Single navigation point
- Related data together
- Less buttons in ActionBar
- Better UX

**Design:**

```
┌─────────────────────────────────────────┐
│ Order History                   [Close] │
├─────────────────────────────────────────┤
│ [Orders] [Returns] [Transactions]       │ ← Tabs
├─────────────────────────────────────────┤
│                                         │
│  Content based on selected tab          │
│                                         │
└─────────────────────────────────────────┘
```

### **Step 3: Add Locale Support**

**Create:** `LocaleStrings.kt`

```kotlin
object LocaleStrings {
    val locale = Locale.current // or from settings
    
    val checkWord: String
        get() = when (locale.language) {
            "en_GB" -> "Cheque"
            else -> "Check"
        }
    
    fun splitCheck() = "Split $checkWord"
}
```

**Usage:**

```kotlin
// Instead of hardcoded "Split Check"
Text(LocaleStrings.splitCheck())
```

---

## 📝 **Files Created**

1. ✅ `SplitCheckDialog.kt` (206 lines)
2. ✅ `CoursesDialog.kt` (206 lines)
3. 🚧 `OrderHistoryScreen.kt` (unified - to modify)
4. 🚧 `LocaleStrings.kt` (to create)

---

## 🎨 **Design Decisions**

### **Split Check**

- Supports 2-10 way splits
- Quick actions: Equal split, By seat
- Shows item breakdown
- Can assign items to different checks (future)

### **Courses**

- 4 course types (standard for restaurants)
- FilterChip UI for quick selection
- Per-item assignment
- Fires to kitchen in sequence

### **Unified History**

- TabRow with 3 tabs
- Consistent design
- Single screen reduces complexity
- Better for mobile/desktop

---

## ⏱️ **Time Estimates**

- ✅ Create dialogs: 30 min (DONE)
- Wire to POSScreen: 10 min
- Unified History screen: 30 min
- Locale support: 15 min
- Testing: 15 min

**Total:** ~1.5 hours

---

## 🎯 **Expected Result**

### **Before:**

- ❌ Split Check button does nothing
- ❌ Courses button does nothing
- Separate Returns + Transactions buttons
- Hardcoded "Check" (US only)

### **After:**

- ✅ Split Check opens functional dialog
- ✅ Courses opens functional dialog
- ✅ Single "History" button with tabs
- ✅ Locale-aware terminology (Check/Cheque)

---

## 💡 **Future Enhancements**

### **Split Check:**

- Actually split payments
- Generate separate receipts
- Track split history

### **Courses:**

- Save course preferences per item
- Auto-assign by category
- Course timing (delays between courses)

### **History:**

- Export to CSV/PDF
- Advanced filtering
- Date range selection

---

Ready to wire these up and complete the implementation!
