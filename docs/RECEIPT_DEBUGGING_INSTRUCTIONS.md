# Receipt Debugging Instructions

**Problem:** Receipt dialog shows no items after checkout

**Solution:** I've added comprehensive debug logging throughout the order creation flow. Follow
these steps to identify where data is lost.

---

## 🔍 Step-by-Step Debugging

### Step 1: Run the Application

**For JS (easiest for browser console):**

```bash
cd /Volumes/Storage/AndroidStudioProjects/AuraFlowPOS
./gradlew :composeApp:jsBrowserDevelopmentRun
```

**For Wasm:**

```bash
./gradlew :composeApp:wasmJsBrowserDevelopmentRun
```

**For Android:**

```bash
./gradlew :composeApp:installDebug
# Then check Logcat in Android Studio
```

---

### Step 2: Open Browser Console

1. Open your browser (Chrome/Firefox/Edge)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Clear console (click 🚫 or Ctrl+L)

---

### Step 3: Perform Checkout

1. **Add a product to cart** (e.g., Coffee)
2. **Click Checkout**
3. **Select Cash payment**
4. **Enter amount** (e.g., $50)
5. **Click "Complete Payment"**

---

### Step 4: Check Console Output

You should see this sequence of messages:

```
🏁 CHECKOUT STARTED
   Cart items: 1
     - Coffee x1 = $4.99
   Payment: cash, Amount: 50.0

📞 Calling orderViewModel.createOrder()...

🚀 OrderViewModel.createOrder() - START
   Payment: CASH, Amount: 50.0

🏁 OrderRepository.createOrder() - START
🛒 Cart has 1 items:
   - Coffee x1 = $4.99
💰 Cart totals: subtotal=$4.99, tax=$0.50, total=$5.49

✅ Order created: ORD-1001
   Items: 1
   - Coffee x1
   Total: $5.49
📦 Added to cache. Cache now has 1 orders
💾 Saving to storage...
✅ Saved to storage successfully

✅ OrderViewModel: Order created successfully
   Order: ORD-1001
   Items: 1
     - Coffee x1
📋 Set lastCreatedOrder with 1 items

🧾 Opening receipt dialog...
✅ CHECKOUT COMPLETED

🔄 LaunchedEffect: lastCreatedOrder changed
   Order: ORD-1001
   Items: 1
     - Coffee x1

🧾 Receipt dialog state changed: true
   Receipt dialog opened
   lastCreatedOrder items: 1

📄 ReceiptDialog opened
   Order: ORD-1001
   Items: 1
     - Coffee x1
   Total: $5.49
   Payment: cash, Received: $50.0
```

---

## 🎯 Diagnosis Guide

### ✅ Good Output - Everything Works

If you see **ALL** the messages above with correct item counts, the receipt **SHOULD** show items.
If it doesn't, it's a UI rendering issue.

---

### ❌ Bad Output #1: No Cart Items

```
🏁 CHECKOUT STARTED
   Cart items: 0     <-- PROBLEM: Cart is empty!
```

**Cause:** Cart is empty when checkout is clicked  
**Solution:** Verify products are actually being added to cart. Check `CartViewModel.addToCart()`
logging.

---

### ❌ Bad Output #2: Order Has No Items

```
✅ Order created: ORD-1001
   Items: 0          <-- PROBLEM: Order created with no items!
```

**Cause:** Cart items not being copied to order  
**Solution:** Check `OrderRepositoryImpl.createOrder()` - the line `items = cartItems` should copy
cart items to order.

---

### ❌ Bad Output #3: lastCreatedOrder is Null

```
🔄 LaunchedEffect: lastCreatedOrder changed
   lastCreatedOrder is NULL    <-- PROBLEM: Order not set in ViewModel!
```

**Cause:** `_lastCreatedOrder.value = order` not being executed  
**Solution:** Check if order creation failed (look for `❌ OrderViewModel: Order creation failed`)

---

### ❌ Bad Output #4: Receipt Gets Empty Items

```
📄 ReceiptDialog opened
   Order: ORD-1001
   Items: 0          <-- PROBLEM: ReceiptDialog receives 0 items!
```

**Cause:** `lastCreatedOrder?.items` is empty when passed to ReceiptDialog  
**Solution:** Check timing - receipt might be opening before order is created (async issue)

---

## 🔧 Common Fixes

### Fix 1: Async Timing Issue

If order is created but receipt gets empty data, it's a timing issue.

**Add delay before showing receipt:**

```kotlin
// In POSScreen.kt onCheckout:
orderViewModel.createOrder(...)

// Wait for order to be set
delay(100) // Give coroutine time to set lastCreatedOrder

println("🧾 Opening receipt dialog...")
showReceiptDialog = true
```

---

### Fix 2: Cart Cleared Too Early

If cart is cleared before order copies items:

**Check CreateOrderUseCase:**

```kotlin
// Should be:
return orderRepository.createOrder(...)
    .onSuccess {
        // Clear cart AFTER order is created
        cartRepository.clearCart()
    }
```

---

### Fix 3: Receipt Gets Stale Data

If receipt opens with old data:

**Force refresh before opening:**

```kotlin
// In POSScreen.kt onCheckout:
orderViewModel.createOrder(...)

// Ensure we have fresh data
viewModelScope.launch {
    // Wait for lastCreatedOrder to update
    orderViewModel.lastCreatedOrder.first { it != null }
    
    // Now open receipt with fresh data
    showReceiptDialog = true
}
```

---

## 📊 Test Scenarios

### Scenario 1: Single Item

1. Add Coffee ($4.99)
2. Checkout with Cash $10
3. **Expected:** Receipt shows Coffee x1, Change $5.01

### Scenario 2: Multiple Items

1. Add Coffee x2
2. Add Pizza x1
3. Checkout with Card
4. **Expected:** Receipt shows both items with quantities

### Scenario 3: With Modifiers

1. Add Coffee with Oat Milk modifier
2. Checkout
3. **Expected:** Receipt shows "+ Oat Milk" under Coffee

---

## 🐛 If All Else Fails

### Last Resort: Direct State Access

Add this to ReceiptDialog to force-fetch order:

```kotlin
val orderFromViewModel = orderViewModel.lastCreatedOrder.collectAsState()

ReceiptDialog(
    open = showReceiptDialog,
    orderNumber = orderFromViewModel.value?.orderNumber ?: "",
    items = orderFromViewModel.value?.items ?: emptyList(),
    // ... rest of params from orderFromViewModel.value
)
```

---

## 📋 Checklist

- [ ] Console shows "🏁 CHECKOUT STARTED" with cart items
- [ ] Console shows "🛒 Cart has X items"
- [ ] Console shows "✅ Order created" with X items
- [ ] Console shows "📋 Set lastCreatedOrder with X items"
- [ ] Console shows "📄 ReceiptDialog opened" with X items
- [ ] Receipt UI actually displays the items

If all ✅ but receipt UI is blank, it's a rendering issue - check ReceiptDialog's LazyColumn is
visible.

---

## 🎯 Next Steps

1. **Run the app with console open**
2. **Perform checkout**
3. **Copy all console output** and paste here
4. I'll analyze exactly where the data is lost

---

**Expected Outcome:** With this logging, we'll identify the **EXACT** point where items disappear,
then apply targeted fix.

**Regarding IndexedDB/OPFS:** We can implement that for better persistence, but let's first fix the
receipt issue which is likely unrelated to storage.
