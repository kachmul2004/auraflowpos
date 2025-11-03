# Debugging Guide - Receipt & Order Issues

**Problem Reports:**

1. Receipt doesn't show items
2. No orders in history
3. No transactions showing
4. Change value not visible
5. Issues on JS/Wasm/Android/JVM

---

## 🔍 Root Cause Analysis

### Issue 1: Receipt Shows No Items

**Symptoms:** Receipt dialog opens but items list is empty

**Possible Causes:**

1. `lastCreatedOrder` is null or has empty items
2. Cart was empty when order was created
3. Order creation failed silently
4. Items not being copied to order

**Debug Steps:**

```kotlin
// In POSScreen.kt, add logging around line 720-725:
onCheckout = { paymentMethodString, amountReceived ->
    println("🛒 DEBUG: Cart items before checkout: ${cartItems.size}")
    cartItems.forEach { item ->
        println("  - ${item.product.name} x${item.quantity}")
    }
    
    val paymentMethod = when (paymentMethodString.lowercase()) {
        "cash" -> PaymentMethod.CASH
        "card" -> PaymentMethod.CARD
        else -> PaymentMethod.OTHER
    }
    
    println("💳 DEBUG: Payment method: $paymentMethod, Amount: $amountReceived")
    
    orderViewModel.createOrder(
        customerId = selectedCustomer?.id,
        paymentMethod = paymentMethod,
        amountPaid = if (paymentMethod == PaymentMethod.CASH) amountReceived else null,
        notes = orderNotes
    )
    
    // After order creation, check lastCreatedOrder
    println("📦 DEBUG: Last created order items: ${lastCreatedOrder?.items?.size}")
}
```

**Verification in Browser Console (JS/Wasm):**

- Open DevTools → Console
- Look for `🛒 DEBUG` messages
- Verify cart has items before checkout
- Check if order was created with items

---

### Issue 2: Orders Not in History

**Symptoms:** History screen shows "No orders yet"

**Possible Causes:**

1. Orders not persisting to localStorage
2. localStorage not being read on page load
3. Observable flow not updating UI
4. Orders being created but not saved

**Debug Steps:**

**A. Check localStorage (Browser):**

```javascript
// In browser console:
console.log('Orders in storage:', localStorage.getItem('orders'));

// Should show JSON array of orders
// If null or "[]", no orders are persisting
```

**B. Check OrderRepositoryImpl initialization:**

```kotlin
// In OrderRepositoryImpl.kt init block (line 31-35):
init {
    kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.Default).launch {
        println("📂 DEBUG: Loading orders from storage...")
        loadOrdersFromStorage()
        println("📂 DEBUG: Loaded ${_ordersCache.value.size} orders")
    }
}
```

**C. Check order creation:**

```kotlin
// In OrderRepositoryImpl.createOrder (after line 93):
println("✅ DEBUG: Order created: ${order.orderNumber}, Items: ${order.items.size}")
println("📂 DEBUG: Saving to storage...")
saveOrdersToStorage()
println("📂 DEBUG: Cache now has ${_ordersCache.value.size} orders")
```

---

### Issue 3: Change Value Not Showing

**Symptoms:** Change due card doesn't appear or shows $0.00

**Root Cause:** The change due card **IS** implemented correctly in `PaymentDialog.kt` lines
343-384.

**The card shows when:**

- `amountReceived.isNotBlank() && receivedAmount > 0.0` (line 344)
- User enters an amount in the text field

**Possible UI Issues:**

1. Card is rendering but not visible (color issue?)
2. Amount calculation is correct but display is wrong
3. Card is below fold (scrolling needed)

**Fix - Make Change Card More Visible:**

```kotlin
// In PaymentDialog.kt, replace lines 343-384:
// Change Due Card - ALWAYS VISIBLE with large text
Card(
    modifier = Modifier.fillMaxWidth(),
    colors = CardDefaults.cardColors(
        containerColor = if (amountReceived.isBlank() || receivedAmount == 0.0) {
            MaterialTheme.colorScheme.surfaceVariant
        } else if (receivedAmount < total) {
            MaterialTheme.colorScheme.errorContainer
        } else {
            Color(0xFF22C55E).copy(alpha = 0.2f) // Bright green background
        }
    ),
    elevation = CardDefaults.cardElevation(4.dp)
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            if (amountReceived.isBlank() || receivedAmount == 0.0) {
                "Enter amount to see change"
            } else if (receivedAmount < total) {
                "INSUFFICIENT PAYMENT"
            } else {
                "CHANGE DUE"
            },
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = if (receivedAmount < total) {
                MaterialTheme.colorScheme.error
            } else {
                Color(0xFF22C55E) // Bright green text
            }
        )
        
        Text(
            if (amountReceived.isBlank() || receivedAmount == 0.0) {
                "$0.00"
            } else if (receivedAmount < total) {
                "-${MoneyUtils.formatWithSymbol(total - receivedAmount)}"
            } else {
                MoneyUtils.formatWithSymbol(changeDue)
            },
            fontSize = 32.sp, // VERY LARGE
            fontWeight = FontWeight.Black,
            color = if (receivedAmount < total) {
                MaterialTheme.colorScheme.error
            } else if (receivedAmount > 0.0) {
                Color(0xFF22C55E) // Bright green
            } else {
                MaterialTheme.colorScheme.onSurface
            }
        )
    }
}
```

---

### Issue 4: localStorage Not Working (JS/Wasm)

**Symptoms:** Orders disappear after page refresh

**Verification:**

**A. Test JS localStorage:**

```javascript
// In browser console:
localStorage.setItem('test', 'hello');
console.log(localStorage.getItem('test')); // Should show 'hello'
localStorage.removeItem('test');
```

**B. Check Kotlin/JS implementation:**

```kotlin
// In LocalStorageFactory.js.kt:
import kotlinx.browser.localStorage as browserStorage

class BrowserLocalStorage : LocalStorage {
    override suspend fun saveString(key: String, value: String) {
        try {
            println("💾 DEBUG: Saving to localStorage[$key]: ${value.take(100)}...")
            browserStorage.setItem(key, value)
            println("✅ DEBUG: Saved successfully")
        } catch (e: Exception) {
            println("❌ DEBUG: Save failed: ${e.message}")
        }
    }
    
    override suspend fun getString(key: String): String? {
        return try {
            val result = browserStorage.getItem(key)
            println("📖 DEBUG: Read from localStorage[$key]: ${result?.take(100)}")
            result
        } catch (e: Exception) {
            println("❌ DEBUG: Read failed: ${e.message}")
            null
        }
    }
}
```

---

## 🔧 Quick Fixes

### Fix 1: Force Visible Change Display

Replace `PaymentDialog.kt` lines 343-384 with the enhanced version above (with `fontSize = 32.sp`).

### Fix 2: Add Console Logging

Add all the `println()` debug statements listed above to trace data flow.

### Fix 3: Verify Cart Has Items Before Checkout

```kotlin
// In ShoppingCart.kt checkout button:
Button(
    onClick = {
        if (items.isEmpty()) {
            println("❌ Cannot checkout: Cart is empty!")
            return@Button
        }
        println("🛒 Checking out with ${items.size} items")
        showPaymentDialog = true
    },
    enabled = items.isNotEmpty() // This should already prevent empty checkout
) {
    Text("Checkout")
}
```

### Fix 4: Force Order Load on History Screen

```kotlin
// In OrdersScreen.kt, line 98:
LaunchedEffect(Unit) {
    println("📜 DEBUG: Loading orders...")
    orderViewModel.loadTodayOrders()
    delay(500) // Give it time to load
    println("📜 DEBUG: Orders state: $ordersState")
}
```

---

## 🧪 Testing Checklist

### Test 1: Cart → Order → Receipt

1. Add product to cart
2. **Check console**: Should see item in cart
3. Click Checkout
4. **Check console**: Should see `🛒 DEBUG: Cart items before checkout: 1`
5. Enter cash amount $50
6. **Check card**: Should show CHANGE DUE in large green text
7. Click "Complete Payment"
8. **Check console**: Should see order created with items
9. **Check receipt**: Should show product list
10. **Check receipt**: Should show "Change: $XX.XX"

### Test 2: localStorage Persistence (JS/Wasm)

1. Create an order (follow Test 1)
2. Open DevTools Console
3. Type: `localStorage.getItem('orders')`
4. **Should see**: JSON array with 1 order
5. Refresh page (F5)
6. Go to History
7. **Should see**: Order still there

### Test 3: Change Display

1. Add $10 item to cart
2. Checkout → Cash
3. Enter $5 → Should show RED "INSUFFICIENT PAYMENT" with "-$5.00"
4. Enter $20 → Should show GREEN "CHANGE DUE" with "$10.00" in **32sp font**

---

## 🐛 Known Issues & Solutions

### Issue: "Orders always empty"

**Solution:** Check if `OrderRepositoryImpl.init()` is being called. Add logging to verify.

### Issue: "Change card not visible"

**Solution:** Card shows only when `amountReceived.isNotBlank() && receivedAmount > 0.0`. Make sure
to enter a number.

### Issue: "Receipt shows no items"

**Solution:** `lastCreatedOrder` might be null. Check that `orderViewModel.createOrder()` is being
called and succeeds.

### Issue: "localStorage doesn't work"

**Solution:**

- Verify browser supports localStorage (should work in all modern browsers)
- Check for browser extensions blocking storage
- Check for Private/Incognito mode (localStorage may be restricted)

---

## 📊 Debug Output Example

**Successful order creation should show:**

```
🛒 DEBUG: Cart items before checkout: 2
  - Coffee x1
  - Pizza x1
💳 DEBUG: Payment method: CASH, Amount: 50.0
✅ DEBUG: Order created: ORD-1001, Items: 2
📂 DEBUG: Saving to storage...
💾 DEBUG: Saving to localStorage[orders]: [{"id":"local-...
✅ DEBUG: Saved successfully
📂 DEBUG: Cache now has 1 orders
📦 DEBUG: Last created order items: 2
```

---

**Status:** Ready for debugging  
**Next:** Add println() statements and check browser console
