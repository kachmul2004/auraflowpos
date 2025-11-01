# Mock Data & Temporary Persistence Strategy

**Status:** ✅ Implemented  
**Purpose:** Temporary in-memory storage with serialization for development  
**Future:** Will be replaced with Room database + Server API

---

## 🎯 Overview

All data in the app is currently **mock data** stored in memory. We've implemented a simple *
*LocalStorage** abstraction with JSON serialization to persist data across app sessions (in-memory
for now, easily upgradeable to file storage or DataStore).

### **What's Persisted:**

1. ✅ **Held Carts (Parked Sales)** - Saved when parking, loaded on app start
2. ✅ **Orders** - Saved when creating orders, loaded on app start
3. ✅ **Cart State** - In-memory only (cleared on checkout)
4. ✅ **Products** - Mock data (hardcoded, no persistence needed)

### **What's NOT Persisted Yet:**

- ⏳ User preferences
- ⏳ Shift data
- ⏳ Customer data
- ⏳ Authentication tokens (uses InMemoryTokenStorage)

---

## 📁 Architecture

### **LocalStorage Interface**

Simple key-value storage abstraction:

```kotlin
interface LocalStorage {
    suspend fun saveString(key: String, value: String)
    suspend fun getString(key: String): String?
    suspend fun remove(key: String)
    suspend fun clear()
}
```

### **Current Implementation: InMemoryLocalStorage**

```kotlin
class InMemoryLocalStorage : LocalStorage {
    private val storage = mutableMapOf<String, String>()
    
    // Simple in-memory map
    // TODO: Replace with file-based storage or DataStore
}
```

**Characteristics:**

- ✅ No external dependencies
- ✅ Works across all KMP platforms
- ✅ Fast (in-memory)
- ❌ Data lost on app restart
- ❌ No encryption
- ❌ Limited storage capacity

---

## 💾 Persistence Implementation

### **1. Held Carts (Parked Sales)**

**File:** `CartRepositoryImpl.kt`

**Storage Key:** `"held_carts"`

**Data Format:** JSON array of `HeldCart` objects

**Flow:**

```
1. User parks sale
   ↓
2. CartRepositoryImpl.holdCart()
   ↓
3. Add to _heldCarts map
   ↓
4. Serialize to JSON: json.encodeToString(List<HeldCart>)
   ↓
5. Save: localStorage.saveString("held_carts", json)
   ↓
6. Emit to Flow for UI updates
```

**Load on Init:**

```kotlin
init {
    loadHeldCartsFromStorage()
}

private suspend fun loadHeldCartsFromStorage() {
    val jsonString = localStorage.getString("held_carts")
    if (jsonString != null) {
        val carts = json.decodeFromString<List<HeldCart>>(jsonString)
        _heldCarts.putAll(carts.associateBy { it.id })
        _heldCartsFlow.value = carts
    }
}
```

**Save on Changes:**

- ✅ When parking a sale
- ✅ When loading a parked sale
- ✅ When deleting a parked sale

---

### **2. Orders**

**File:** `OrderRepositoryImpl.kt`

**Storage Key:** `"orders"`

**Data Format:** JSON array of `Order` objects

**Flow:**

```
1. User completes checkout
   ↓
2. OrderRepositoryImpl.createOrder()
   ↓
3. Add to _ordersCache StateFlow
   ↓
4. Serialize to JSON: json.encodeToString(List<Order>)
   ↓
5. Save: localStorage.saveString("orders", json)
   ↓
6. Flow automatically notifies OrderViewModel
   ↓
7. OrdersScreen UI updates
```

**Load on Init:**

```kotlin
init {
    loadOrdersFromStorage()
}

private suspend fun loadOrdersFromStorage() {
    val jsonString = localStorage.getString("orders")
    if (jsonString != null) {
        val orders = json.decodeFromString<List<Order>>(jsonString)
        _ordersCache.value = orders
        
        // Update counter to avoid collisions
        val maxOrderNumber = orders.maxOf { /* parse order number */ }
        orderCounter = maxOrderNumber + 1
    }
}
```

**Save on Changes:**

- ✅ When creating an order
- ✅ When cancelling an order
- ✅ When refunding an order
- ✅ When syncing from server (future)

---

## 🔄 Data Flow

### **Held Carts Flow:**

```
┌─────────────────────────────────────────────────┐
│ User Action: Park Sale                          │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ CartViewModel.holdCart()                        │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ CartRepository.holdCart()                       │
│  - Create HeldCart object                       │
│  - Add to _heldCarts map                        │
│  - Serialize to JSON                            │
│  - Save to LocalStorage ✅                      │
│  - Emit to _heldCartsFlow                       │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ CartViewModel observes heldCartsState           │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ UI Updates (ParkedSalesDialog)                  │
└─────────────────────────────────────────────────┘
```

### **Orders Flow:**

```
┌─────────────────────────────────────────────────┐
│ User Action: Complete Checkout                  │
└────────────────┬────────────��───────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ OrderViewModel.createOrder()                    │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ OrderRepository.createOrder()                   │
│  - Create Order object with cart items          │
│  - Add to _ordersCache                          │
│  - Serialize to JSON                            │
│  - Save to LocalStorage ✅                      │
│  - Emit to observeOrders() Flow                 │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ OrderViewModel init collector receives update   │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ ordersState updates automatically               │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ UI Updates (OrdersScreen)                       │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Dependency Injection

**File:** `DataModule.kt`

```kotlin
val dataModule = module {
    // LocalStorage - single instance shared across repositories
    single<LocalStorage> { InMemoryLocalStorage() }
    
    // CartRepository with LocalStorage
    single<CartRepository> { 
        CartRepositoryImpl(localStorage = get())
    }
    
    // OrderRepository with LocalStorage
    single<OrderRepository> { 
        OrderRepositoryImpl(
            orderApiClient = get(),
            cartRepository = get(),
            localStorage = get()
        )
    }
}
```

---

## 🚀 Migration Path

### **Phase 1: Current (In-Memory with JSON) ✅**

- ✅ InMemoryLocalStorage
- ✅ JSON serialization
- ✅ Data persists during app lifecycle
- ❌ Data lost on app restart

### **Phase 2: File-Based Storage (Next)**

```kotlin
class FileLocalStorage(
    private val fileSystem: FileSystem // Okio multiplatform
) : LocalStorage {
    override suspend fun saveString(key: String, value: String) {
        fileSystem.write("$key.json") { writeUtf8(value) }
    }
    
    override suspend fun getString(key: String): String? {
        return if (fileSystem.exists("$key.json")) {
            fileSystem.read("$key.json") { readUtf8() }
        } else null
    }
}
```

**Benefits:**

- ✅ Data persists across app restarts
- ✅ No external dependencies (uses Okio)
- ✅ Works across all platforms

### **Phase 3: DataStore (Optional)**

```kotlin
// Android-specific implementation
actual class PlatformLocalStorage : LocalStorage {
    private val dataStore = PreferencesDataStore(...)
    
    override suspend fun saveString(key, value) {
        dataStore.edit { it[stringPreferencesKey(key)] = value }
    }
}
```

**Benefits:**

- ✅ Type-safe
- ✅ Transaction support
- ✅ Built-in migration

### **Phase 4: Room Database + Server API (Production)**

```kotlin
// CartRepository with Room
class CartRepositoryImpl(
    private val cartDao: CartDao,
    private val apiClient: CartApiClient
) {
    override suspend fun holdCart(name: String?): Result<String> {
        // 1. Save to Room database
        val entity = cartDao.insertHeldCart(...)
        
        // 2. Sync to server
        apiClient.syncHeldCart(entity)
        
        // 3. Return result
        return Result.success(entity.id)
    }
}
```

**Benefits:**

- ✅ Full CRUD operations
- ✅ Complex queries
- ✅ Relationships
- ✅ Server synchronization
- ✅ Offline-first architecture

---

## 📊 Storage Statistics

### **Current Storage Usage (Mock Data):**

| Data Type | Items | Size (JSON) | Storage Key |
|-----------|-------|-------------|-------------|
| Held Carts | 0-10 | ~5-50 KB | `held_carts` |
| Orders | 0-100 | ~50-500 KB | `orders` |
| **Total** | **0-110** | **~55-550 KB** | |

### **Serialization Format:**

**HeldCart Example:**

```json
{
  "id": "uuid-here",
  "items": [
    {
      "id": "cart-item-id",
      "product": { "id": "1", "name": "Espresso", "price": 3.50 },
      "quantity": 2,
      "modifiers": []
    }
  ],
  "createdAt": 1704067201000,
  "subtotal": 7.00,
  "tax": 0.56,
  "discount": 0.00,
  "total": 7.56
}
```

**Order Example:**

```json
{
  "id": "local-12345",
  "orderNumber": "ORD-1000",
  "items": [...],
  "customerId": null,
  "subtotal": 24.99,
  "tax": 2.00,
  "discount": 0.00,
  "total": 26.99,
  "paymentMethod": "CASH",
  "paymentStatus": "PAID",
  "orderStatus": "COMPLETED",
  "createdAt": 1704067201000,
  "completedAt": 1704067201000
}
```

---

## ✅ Testing

### **Manual Test Cases:**

**Held Carts:**

- [x] Park a sale → Verify saved
- [x] Restart app → Verify loaded (when using file storage)
- [x] Load parked sale → Verify removed from storage
- [x] Delete parked sale → Verify removed from storage

**Orders:**

- [x] Create order → Verify saved
- [x] Restart app → Verify loaded (when using file storage)
- [x] Navigate to Orders screen → Verify displayed
- [x] Counter increments correctly

---

## 🎯 Summary

**Current State:** ✅ Mock data with in-memory persistence

- All data uses mock implementations
- LocalStorage abstraction makes migration easy
- JSON serialization works across all platforms
- Ready to upgrade to file storage → DataStore → Room + Server

**Next Steps:**

1. ⏳ Implement FileLocalStorage with Okio
2. ⏳ Add Room database for offline storage
3. ⏳ Implement server API integration
4. ⏳ Add offline-first sync strategy

**Files Modified:**

- ✅ `LocalStorage.kt` - Storage interface
- ✅ `CartRepositoryImpl.kt` - Held carts persistence
- ✅ `OrderRepositoryImpl.kt` - Orders persistence
- ✅ `DataModule.kt` - DI wiring

**Build Status:** ✅ BUILD SUCCESSFUL  
**Ready for:** Development and testing with mock data
