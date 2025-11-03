# IndexedDB Debugging Guide

**Date:** Current session  
**Issue:** Orders and transactions not persisting in JS build after refresh

---

## 🐛 Symptoms

1. ❌ Orders show in history when created
2. ❌ After refresh, orders are gone (count: 0)
3. ❌ Transactions also not persisting
4. ❌ Console shows: "Orders count: 0"

---

## 🔍 Debugging Steps Added

### **1. Enhanced Logging**

Added detailed logs to track IndexedDB operations:

```kotlin
private suspend fun loadAllToCache() {
    println("🔄 IndexedDB: Loading all data from store '$storeName'...")
    
    store.openCursor(autoContinue = true).collect { cursor ->
        val key = cursor.key.toString()
        val value = cursor.value
        println("📥 IndexedDB: Cursor entry - key=$key, valueType=${value::class.simpleName}")
        
        // Handle different value types
        val stringValue = when (value) {
            is String -> value
            else -> value.toString()
        }
        cache[key] = stringValue
    }
    
    println("📂 IndexedDB: Loaded ${cache.size} items into cache")
    cache.keys.forEach { key ->
        println("   - $key (${cache[key]?.length ?: 0} chars)")
    }
}
```

### **2. Save Operation Logging**

```kotlin
override suspend fun saveString(key: String, value: String) {
    println("💾 IndexedDB: Saving to cache[$key]: ${value.take(100)}... (${value.length} chars)")
    cache[key] = value
    saveToIndexedDB(key, value)
}

private suspend fun saveToIndexedDB(key: String, value: String) {
    val db = database ?: run {
        println("⚠️ IndexedDB: Database not initialized, cannot save $key")
        return
    }
    println("💾 IndexedDB: Writing to database - key=$key, valueLength=${value.length}")
    db.writeTransaction(storeName) {
        store.put(value, Key(key))
    }
    println("✅ IndexedDB: Saved $key successfully to database")
}
```

---

## 🧪 Testing Instructions

### **Step 1: Clear Existing Data**

Open browser DevTools and run:

```javascript
// Delete the database to start fresh
indexedDB.deleteDatabase('AuraFlowPOS');
// Refresh the page
location.reload();
```

### **Step 2: Create an Order**

1. Add products to cart
2. Click checkout
3. Complete payment
4. **Watch the console logs** - you should see:
   ```
   💾 IndexedDB: Saving to cache[orders]: [{"id":"local-12345"... (1234 chars)
   💾 IndexedDB: Writing to database - key=orders, valueLength=1234
   ✅ IndexedDB: Saved orders successfully to database
   ```

### **Step 3: Verify Data is Saved**

Open DevTools → Application → IndexedDB → AuraFlowPOS → keyValueStore

You should see:

- **Key:** `orders`
- **Value:** JSON string of orders array

Or in console:

```javascript
const request = indexedDB.open('AuraFlowPOS', 1);
request.onsuccess = (event) => {
  const db = event.target.result;
  const tx = db.transaction('keyValueStore', 'readonly');
  const store = tx.objectStore('keyValueStore');
  const getRequest = store.get('orders');
  getRequest.onsuccess = () => {
    console.log('Orders in IndexedDB:', getRequest.result);
  };
};
```

### **Step 4: Refresh and Check Loading**

1. Refresh the page (F5)
2. **Watch the console logs** - you should see:
   ```
   🔄 IndexedDB: Loading all data from store 'keyValueStore'...
   📥 IndexedDB: Cursor entry #1 - key=orders, valueType=String
      ✓ Stored in cache: [{"id":"local-12345","orderNumber":"ORD-1000"...
   📂 IndexedDB: Loaded 1 items into cache
      - orders (1234 chars)
   ```

3. Navigate to History → Orders
4. Should see orders loaded from cache

---

## 🔧 Potential Issues & Solutions

### **Issue 1: Database Not Initialized**

**Symptom:**

```
⚠️ IndexedDB: Database not initialized, cannot save orders
```

**Cause:** Save operation called before database opened

**Solution:** The `ensureInitialized()` method should wait for init

**Check:**

```kotlin
private suspend fun ensureInitialized() {
    initDeferred.await() // This blocks until init completes
}
```

---

### **Issue 2: Value Type Mismatch**

**Symptom:**

```
📥 IndexedDB: Cursor entry - key=orders, valueType=Object
```

**Cause:** IndexedDB might store/retrieve data as JS objects, not strings

**Solution:** Added type handling:

```kotlin
val stringValue = when (value) {
    is String -> value
    else -> value.toString()
}
```

**Alternative Fix (if needed):**

```kotlin
// Force convert to string using unsafeCast
val stringValue = (value.unsafeCast<String>())
// Or use JSON serialization
val stringValue = JSON.stringify(value)
```

---

### **Issue 3: Cursor Not Collecting**

**Symptom:** No cursor entries logged

**Cause:** Flow might not be collecting properly

**Solution:** Try using `getAll()` instead of cursor:

```kotlin
private suspend fun loadAllToCache() {
    val db = database ?: return
    db.transaction(storeName) {
        val store = objectStore(storeName)
        val allKeys = store.getAllKeys()
        allKeys.forEach { key ->
            val value = store.get(key)
            cache[key.toString()] = value.toString()
        }
    }
}
```

---

### **Issue 4: Transaction Not Committing**

**Symptom:** Data saved but not persisting

**Cause:** Transaction might not be completing

**Solution:** Add explicit success callback:

```kotlin
db.writeTransaction(storeName) {
    val store = objectStore(storeName)
    store.put(value, Key(key))
}.also {
    println("✅ Transaction completed")
}
```

---

## 📊 Expected Console Output

### **On Initial Load (no data):**

```
✅ IndexedDB: Database opened successfully
🔄 IndexedDB: Loading all data from store 'keyValueStore'...
📂 IndexedDB: Loaded 0 items into cache
```

### **On Save:**

```
💾 IndexedDB: Saving to cache[orders]: [{"id":"local-12345"... (1234 chars)
💾 IndexedDB: Writing to database - key=orders, valueLength=1234
✅ IndexedDB: Saved orders successfully to database
```

### **On Refresh (with data):**

```
✅ IndexedDB: Database opened successfully
🔄 IndexedDB: Loading all data from store 'keyValueStore'...
📥 IndexedDB: Cursor entry #1 - key=orders, valueType=String
   ✓ Stored in cache: [{"id":"local-12345"...
📥 IndexedDB: Cursor entry #2 - key=transactions, valueType=String
   ✓ Stored in cache: [{"id":"txn-12345"...
📂 IndexedDB: Loaded 2 items into cache
   - orders (1234 chars)
   - transactions (567 chars)
```

---

## 🎯 What to Report Back

Please share:

1. **Console logs** after creating an order
2. **Console logs** after refreshing the page
3. **DevTools → Application → IndexedDB** screenshot
4. **Any error messages**

This will help identify exactly where the data is being lost.

---

## 🔄 Quick Fix to Try

If the issue persists, try this temporary fix using `localStorage` as fallback:

```kotlin
actual fun createPlatformLocalStorage(): LocalStorage {
    return try {
        IndexedDBLocalStorage()
    } catch (e: Exception) {
        println("⚠️ IndexedDB failed, falling back to localStorage")
        LocalStorageKVStorage() // Simple localStorage wrapper
    }
}
```

Where `LocalStorageKVStorage` is:

```kotlin
class LocalStorageKVStorage : LocalStorage {
    override suspend fun saveString(key: String, value: String) {
        kotlinx.browser.window.localStorage.setItem(key, value)
    }
    
    override suspend fun getString(key: String): String? {
        return kotlinx.browser.window.localStorage.getItem(key)
    }
}
```

---

## ✅ Success Criteria

- ✅ Orders saved to IndexedDB
- ✅ Transactions saved to IndexedDB
- ✅ Data persists after refresh
- ✅ Console shows successful load from cache
- ✅ History screen shows correct count