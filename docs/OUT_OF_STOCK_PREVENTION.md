# Out-of-Stock Prevention Implementation

**Date:** December 2024  
**Status:** ✅ Complete  
**Build:** ✅ Successful

---

## 🎯 **Feature Overview**

Implemented **strict out-of-stock prevention** matching the web version's behavior. Products cannot
be added to cart when available stock reaches 0, preventing overselling.

---

## 🐛 **Problem**

Products were being added to cart even when stock reached 0. This could lead to:

- **Overselling** - Selling items that don't exist
- **Fulfillment issues** - Unable to complete orders
- **Customer dissatisfaction** - Orders that can't be fulfilled

**Expected Behavior:**

- Products with 0 available stock should be disabled
- Clicking should not add them to cart
- Clear visual indication they're unavailable

---

## ✅ **Solution Implemented**

### **1. Available Stock Calculation**

```kotlin
Available Stock = Total Stock - Items in Cart
```

**Example:**

- Product: Coffee Beans
- Total Stock: 10 units
- In Cart: 7 units
- **Available Stock: 3 units** ✅

### **2. Stock Check in Use Cases**

#### **AddToCartUseCase**

```kotlin
// Calculate available stock
val currentCart = cartRepository.getCart().getOrNull() ?: emptyList()
val quantityInCart = currentCart
    .filter { it.product.id == product.id }
    .sumOf { it.quantity }
val availableStock = product.stockQuantity - quantityInCart

// Prevent adding if insufficient stock
if (availableStock < quantity) {
    return Result.failure(
        IllegalStateException("Insufficient stock. Available: $availableStock")
    )
}
```

#### **UpdateCartItemUseCase**

```kotlin
// When increasing quantity, check available stock
if (newQuantity > currentItem.quantity) {
    val otherItemsQuantity = currentCart
        .filter { it.product.id == product.id && it.id != cartItemId }
        .sumOf { it.quantity }
    val availableStock = product.stockQuantity - otherItemsQuantity

    if (availableStock < newQuantity) {
        return Result.failure(
            IllegalStateException("Insufficient stock. Available: $availableStock")
        )
    }
}
```

### **3. UI Visual Feedback**

#### **ProductGridCard Updates:**

- **Disabled clicks** when `availableStock <= 0`
- **50% opacity** on out-of-stock products
- **"Out" badge** instead of quantity number
- **Red badge** for out-of-stock state
- **No elevation** on disabled cards

```kotlin
Card(
    onClick = {
        if (!isOutOfStock) { // Only allow clicks if stock is available
            onClick()
        }
    },
    enabled = !isOutOfStock, // Disable the card
    elevation = if (isOutOfStock) 0.dp else 2.dp
) {
    Row(
        modifier = Modifier
            .alpha(if (isOutOfStock) 0.5f else 1f) // 50% opacity
    ) {
        // ... content
    }
}
```

---

## 📊 **Stock Badge States**

| Available Stock | Badge Color | Badge Text | Clickable |
|----------------|-------------|------------|-----------|
| 6+ units       | 🟢 Green    | "12"       | ✅ Yes    |
| 1-5 units      | 🟡 Amber    | "3"        | ✅ Yes    |
| 0 units        | 🔴 Red      | "Out"      | ❌ No     |

---

## 🔄 **User Flow**

### **Scenario 1: Adding Product to Cart**

1. User views product with 5 units in stock
2. Badge shows "5" in green
3. User clicks → 1 unit added to cart
4. Badge updates to "4" (yellow, low stock)
5. User clicks 4 more times
6. Badge updates to "Out" (red)
7. Card becomes disabled and grayed out
8. User can no longer add this product

### **Scenario 2: Updating Cart Quantity**

1. Cart has 3 units of product with 5 total stock
2. Available: 2 units
3. User tries to increase cart quantity to 6
4. System prevents: "Insufficient stock. Available: 2"
5. User can only increase to max 5 total

### **Scenario 3: Multiple Cart Interactions**

1. Product has 10 units total stock
2. User adds 7 to cart
3. Available: 3 units
4. User adds 3 more
5. Available: 0 units
6. Badge shows "Out", card disabled
7. User cannot add more

---

## 🎨 **Visual Design**

### **In-Stock Product**

```
┌─────────────────────────┐
│  [5] ← Green badge     │
│                         │
│  Coffee Beans          │
│  $12.99                │
│                         │
│      [Image]           │
└─────────────────────────┘
     ✅ Clickable
     Opacity: 100%
     Elevation: 2dp
```

### **Low-Stock Product**

```
┌─────────────────────────┐
│  [2] ← Amber badge     │
│                         │
│  Coffee Beans          │
│  $12.99                │
│                         │
│      [Image]           │
└─────────────────────────┘
     ✅ Clickable
     Opacity: 100%
     Elevation: 2dp
```

### **Out-of-Stock Product**

```
┌─────────────────────────┐
│  [Out] ← Red badge     │
│                         │
│  Coffee Beans          │
│  $12.99                │
│                         │
│      [Image]           │
└─────────────────────────┘
     ❌ Not Clickable
     Opacity: 50%
     Elevation: 0dp
```

---

## 📁 **Files Modified**

### **Domain Layer:**

1. **`AddToCartUseCase.kt`**
    - Added available stock calculation
    - Check stock before adding to cart
    - Clear error messages

2. **`UpdateCartItemUseCase.kt`**
    - Check stock when increasing quantity
    - Validate in `invoke()` and `increment()` methods
    - Account for current item when calculating available stock

### **UI Layer:**

3. **`ProductGrid.kt`**
    - Calculate `quantityInCart` for each product
    - Pass to `ProductGridCard`
    - Real-time updates via cart state

4. **`ProductGridCard` (within ProductGrid.kt)**
    - Calculate `availableStock`
    - Disable clicks when out of stock
    - Apply visual styling (opacity, elevation)
    - Show "Out" text in badge

---

## ✅ **Testing Checklist**

- [x] Product with 0 stock shows "Out" badge
- [x] Out-of-stock product is disabled (no click)
- [x] Out-of-stock product has 50% opacity
- [x] Adding to cart reduces available stock
- [x] Cannot add when available stock is 0
- [x] Increasing cart quantity checks stock
- [x] Error message shows available stock
- [x] Badge updates in real-time
- [x] Multiple products tracked independently
- [x] Build compiles successfully

---

## 🚀 **Benefits**

1. ✅ **Prevents overselling** - No more selling items that don't exist
2. ✅ **Real-time feedback** - Users see availability instantly
3. ✅ **Clear UX** - Disabled state is obvious
4. ✅ **Accurate inventory** - Stock reflects reality
5. ✅ **Professional** - Matches industry standards
6. ✅ **Web parity** - Identical behavior to web version

---

## 🔮 **Future Enhancements**

### **Admin Settings (Optional)**

While the web version doesn't have this, we could add:

```kotlin
// In business settings
data class InventorySettings(
    val allowBackorders: Boolean = false,
    val allowOverselling: Boolean = false
)

// In AddToCartUseCase
if (!settings.allowBackorders && availableStock < quantity) {
    return Result.failure(...)
}
```

### **Pre-Order Support**

```kotlin
// Product model
data class Product(
    // ... existing fields
    val allowPreOrder: Boolean = false,
    val preOrderQuantity: Int = 0
)

// In AddToCartUseCase
val effectiveStock = if (product.allowPreOrder) {
    availableStock + product.preOrderQuantity
} else {
    availableStock
}
```

### **Stock Reservation**

```kotlin
// Reserve stock for X minutes when in cart
data class CartItem(
    // ... existing fields
    val reservedAt: Long? = null,
    val reservationExpiry: Long? = null
)
```

---

## 📝 **Error Messages**

| Scenario | Error Message |
|----------|--------------|
| Adding to cart | "Insufficient stock. Available: 3" |
| Updating quantity | "Insufficient stock. Available: 2" |
| Incrementing | "Insufficient stock. Available: 0" |

---

## 🎯 **Matches Web Version**

✅ **Exact Feature Parity:**

- Same stock calculation logic
- Same visual disabled state
- Same error handling
- Same user experience

**Reference:** `docs/Web Version/src/components/ProductGrid.tsx` lines 177-184

---

**Build Status:** ✅ BUILD SUCCESSFUL  
**Feature Status:** ✅ 100% Complete  
**Web Parity:** ✅ Matched
