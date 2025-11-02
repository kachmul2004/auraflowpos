# Remaining UI Improvements

**Date:** November 2, 2024  
**Status:** ✅ **Dialogs Created** | 🚧 **Wiring Needed**

---

## ✅ **Completed**

### 1. **Created Split Check Dialog**

**File:** `SplitCheckDialog.kt` (206 lines)

- Split bill between 2-10 customers
- Quick split options
- Shows all items

### 2. **Created Courses Dialog**

**File:** `CoursesDialog.kt` (206 lines)

- Assign items to courses (Appetizer, Main, Dessert, Beverage)
- Per-item course selection
- Kitchen firing management

---

## 🚧 **To Complete**

### **1. Wire Dialogs to POSScreen** (5 min)

Add to `POSScreen.kt`:

```kotlin
import com.theauraflow.pos.ui.dialog.SplitCheckDialog
import com.theauraflow.pos.ui.dialog.CoursesDialog

// Add state
var showSplitCheckDialog by remember { mutableStateOf(false) }
var showCoursesDialog by remember { mutableStateOf(false) }

// Update ActionBar callbacks (line ~648):
onSplitCheck = { showSplitCheckDialog = true },
onCourses = { showCoursesDialog = true },

// Add dialogs before closing brace:
if (showSplitCheckDialog) {
    SplitCheckDialog(
        open = showSplitCheckDialog,
        cartItems = cartState.let { 
            if (it is UiState.Success) it.data.items else emptyList()
        },
        onDismiss = { showSplitCheckDialog = false }
    )
}

if (showCoursesDialog) {
    CoursesDialog(
        open = showCoursesDialog,
        cartItems = cartState.let {
            if (it is UiState.Success) it.data.items else emptyList()
        },
        onDismiss = { showCoursesDialog = false }
    )
}
```

### **2. Create Unified History Screen** (30 min)

Replace 3 separate buttons (Orders, Returns, Transactions) with ONE "History" button that opens a
tabbed screen.

**File:** Create `UnifiedHistoryScreen.kt` with 3 tabs:

- **Orders Tab**: Shows completed orders
- **Returns Tab**: Shows returned/refunded orders
- **Transactions Tab**: Shows all transactions

**Update ActionBar:**

- Remove separate `onOrders`, `onReturns`, `onTransactions` buttons
- Add single `onHistory` button

### **3. Add Locale Support for Check/Cheque** (10 min)

**File:** Create `util/LocaleStrings.kt`:

```kotlin
object LocaleStrings {
    // TODO: Get locale from system or settings
    private const val LOCALE = "en_US" // or "en_GB"
    
    val checkWord: String
        get() = if (LOCALE == "en_GB") "Cheque" else "Check"
    
    fun splitCheck() = "Split $checkWord"
}
```

**Update:** `SplitCheckDialog.kt`:

```kotlin
import com.theauraflow.pos.util.LocaleStrings

Text(
    text = LocaleStrings.splitCheck(), // Instead of "Split Check"
    ...
)
```

---

## 📝 **Summary**

**What's Working:**

- ✅ Split Check Dialog UI complete
- ✅ Courses Dialog UI complete
- ✅ Build successful

**What's Needed:**

- 🚧 Wire dialogs to POSScreen (5 min)
- 🚧 Create Unified History Screen (30 min)
- 🚧 Add locale support (10 min)

**Total Time:** ~45 minutes to complete all improvements

---

## 🎯 **Quick Implementation Steps**

1. Open `POSScreen.kt`
2. Add imports for new dialogs
3. Add state variables
4. Update ActionBar callbacks
5. Add dialog composables
6. Test Split Check and Courses buttons
7. Create UnifiedHistoryScreen (optional - can be done later)
8. Add LocaleStrings (optional - can be done later)

**Priority:** Wire dialogs first (highest value, lowest effort)
