# 📦 Storage Strategy - What Goes Where?

**Complete breakdown of data storage across all platforms**

---

## 🎯 **Two-Tier Storage Philosophy**

### **Heavy Data** → SQL Database (Room/IndexedDB)

- Complex structured data
- Large datasets (thousands of records)
- Needs querying, filtering, sorting
- Relational data with foreign keys
- **Examples:** Orders, Transactions, Products, Customers

### **Lightweight Data** → Key-Value Storage (SharedPrefs/UserDefaults/localStorage)

- Simple settings and preferences
- Auth tokens
- Small flags and state
- No complex queries needed
- **Examples:** Dark mode, sound enabled, last selected category

---

## 📊 **Current Implementation (As of Now)**

### **🗄️ What's in Database (Room/IndexedDB)**

**Ready but NOT YET USED** - Entities exist, but repositories still use JSON for now:

| Entity | Fields | Used For | Platform |
|--------|--------|----------|----------|
| **ProductEntity** | id, name, sku, price, category, stock, images | Product catalog | Android/iOS/Desktop ⏳ |
| **OrderEntity** | id, orderNumber, customerId, total, status, createdAt | Order history | Android/iOS/Desktop ⏳ |
| **TransactionEntity** | id, orderId, amount, paymentMethod, type, status | Payment records | Android/iOS/Desktop ⏳ |
| **CustomerEntity** | id, name, email, phone, loyaltyPoints | Customer database | Android/iOS/Desktop ⏳ |
| **CategoryEntity** | id, name, description, imageUrl | Product categories | Android/iOS/Desktop ⏳ |
| **ProductVariationEntity** | id, productId, name, price, sku | Product variants | Android/iOS/Desktop ⏳ |
| **ModifierEntity** | id, name, price, type | Product add-ons | Android/iOS/Desktop ⏳ |
| **UserEntity** | id, username, role, permissions | Employee accounts | Android/iOS/Desktop ⏳ |

**Status:** ✅ Schema ready, ⏳ **Repositories still using JSON (not migrated yet)**

---

### **🔑 What's in Key-Value Storage (Currently ACTIVE)**

**Currently in use via LocalStorage/SharedPreferences/UserDefaults/localStorage/IndexedDB:**

#### **1. Orders** 📦

- **Key:** `"orders"`
- **Value:** JSON array of Order objects
- **Size:** ~1-2KB per order
- **Storage:**
    - Android: SharedPreferences ✅
    - iOS: UserDefaults ✅
    - Desktop: Java Preferences ✅
    - JS: IndexedDB ✅
    - Wasm: InMemory (temp)
- **Example:**
  ```json
  [
    {
      "id": "local-12345",
      "orderNumber": "ORD-1000",
      "items": [...],
      "total": 45.99,
      "createdAt": 1704068201000
    }
  ]
  ```

#### **2. Transactions** 💳

- **Key:** `"transactions"`
- **Value:** JSON array of Transaction objects
- **Size:** ~300-500 bytes per transaction
- **Storage:** Same as orders
- **Example:**
  ```json
  [
    {
      "id": "txn_local-12345",
      "orderId": "local-12345",
      "amount": 45.99,
      "paymentMethod": "CASH"
    }
  ]
  ```

#### **3. Held Carts** 🛒

- **Key:** `"held_carts"`
- **Value:** JSON array of saved carts
- **Size:** ~500 bytes per cart
- **Storage:** Same as orders
- **Example:**
  ```json
  [
    {
      "id": "cart-1",
      "name": "Table 5",
      "items": [...],
      "createdAt": 1704068201000
    }
  ]
  ```

#### **4. Settings** ⚙️

- **Keys:**
    - `"dark_mode"` → `"true"` / `"false"`
    - `"sound_enabled"` → `"true"` / `"false"`
    - `"auto_print_receipts"` → `"true"` / `"false"`
    - `"last_category"` → `"beverages"` / `"food"` / etc.
- **Size:** <10 bytes each
- **Storage:** Same as orders

---

## 🏗️ **Platform-Specific Storage Details**

### **Android** 🤖

| Data Type | Current Storage | Future Migration |
|-----------|----------------|------------------|
| **Orders** | SharedPreferences (JSON) ✅ | → Room Database ⏳ |
| **Transactions** | SharedPreferences (JSON) ✅ | → Room Database ⏳ |
| **Products** | N/A (API only) | → Room Database ⏳ |
| **Settings** | SharedPreferences ✅ | → Keep in SharedPreferences ✅ |
| **Auth Tokens** | SharedPreferences ✅ | → Keep in SharedPreferences ✅ |

**Files:**

- `/data/data/com.theauraflow.pos/shared_prefs/auraflow_prefs.xml` (all data)
- `/data/data/com.theauraflow.pos/databases/auraflowpos.db` (Room - ready but unused)

**Capacity:**

- SharedPreferences: ~10MB practical limit
- Room Database: **GBs** available

---

### **iOS** 🍎

| Data Type | Current Storage | Future Migration |
|-----------|----------------|------------------|
| **Orders** | UserDefaults (JSON) ✅ | → Room Database ⏳ |
| **Transactions** | UserDefaults (JSON) ✅ | → Room Database ⏳ |
| **Products** | N/A (API only) | → Room Database ⏳ |
| **Settings** | UserDefaults ✅ | → Keep in UserDefaults ✅ |
| **Auth Tokens** | UserDefaults ✅ | → Keep in UserDefaults ✅ |

**Files:**

- `Library/Preferences/com.theauraflow.pos.plist` (all data)
- `Library/Application Support/auraflowpos.db` (Room - ready but unused)

**Capacity:**

- UserDefaults: ~1MB practical limit
- Room Database: **GBs** available

---

### **Desktop** 🖥️

| Data Type | Current Storage | Future Migration |
|-----------|----------------|------------------|
| **Orders** | Java Preferences (JSON) ✅ | → Room Database ⏳ |
| **Transactions** | Java Preferences (JSON) ✅ | → Room Database ⏳ |
| **Products** | N/A (API only) | → Room Database ⏳ |
| **Settings** | Java Preferences ✅ | → Keep in Java Preferences ✅ |
| **Auth Tokens** | Java Preferences ✅ | → Keep in Java Preferences ✅ |

**Files:**

- **Windows:** `HKEY_CURRENT_USER\Software\JavaSoft\Prefs\com\theauraflow\pos`
- **macOS:** `~/Library/Preferences/com.apple.java.util.prefs.plist`
- **Linux:** `~/.java/.userPrefs/com/theauraflow/pos/prefs.xml`
- Room DB: `~/.auraflowpos/auraflowpos.db` (ready but unused)

**Capacity:**

- Java Preferences: ~1MB practical limit
- Room Database: **GBs** available

---

### **JS (Web)** 🌐

| Data Type | Current Storage | Future Plan |
|-----------|----------------|-------------|
| **Orders** | IndexedDB (JSON) ✅ | → Keep in IndexedDB ✅ |
| **Transactions** | IndexedDB (JSON) ✅ | → Keep in IndexedDB ✅ |
| **Products** | N/A (API only) | → Could add to IndexedDB |
| **Settings** | IndexedDB ✅ | → Could move to localStorage |
| **Auth Tokens** | IndexedDB ✅ | → Could move to localStorage |

**Browser Storage:**

- IndexedDB: `AuraFlowPOS` database → `keyValueStore` object store
- Access: DevTools → Application → IndexedDB

**Capacity:**

- IndexedDB: **50MB - 1GB+** (browser dependent)
- localStorage: ~5-10MB (not used currently)

**Data Structure:**

```javascript
// IndexedDB structure
AuraFlowPOS
  └── keyValueStore
      ├── orders: "[{...}, {...}]"           // ~2KB per order
      ├── transactions: "[{...}, {...}]"     // ~500B per transaction
      ├── held_carts: "[{...}]"              // ~500B per cart
      ├── dark_mode: "true"                  // <10B
      ├── sound_enabled: "true"              // <10B
      └── auto_print_receipts: "false"       // <10B
```

---

### **Wasm** 🎯

| Data Type | Storage | Persists? |
|-----------|---------|-----------|
| **All Data** | In-Memory Map | ❌ NO |

**Note:** Wasm target is for development/testing only. Not production-ready.

---

## 📈 **Storage Capacity Summary**

| Platform | Current Usage | Current Limit | After Room Migration |
|----------|--------------|---------------|---------------------|
| **Android** | SharedPreferences (~1MB) | ~10MB | Room: **GBs** ✅ |
| **iOS** | UserDefaults (~500KB) | ~1MB | Room: **GBs** ✅ |
| **Desktop** | Java Preferences (~500KB) | ~1MB | Room: **GBs** ✅ |
| **JS** | IndexedDB (~2MB) | **50MB-1GB** | Already good! ✅ |

---

## 🔄 **Migration Plan (Future)**

### **Phase 1: Foundation** ✅ COMPLETE

- ✅ Create Room entities (ProductEntity, OrderEntity, etc.)
- ✅ Create Room DAOs (ProductDao, OrderDao, etc.)
- ✅ Set up AppDatabase v2
- ✅ Add TransactionEntity and TransactionDao
- ✅ Fix iOS UserDefaults persistence
- ✅ Fix JS IndexedDB persistence

### **Phase 2: Repository Migration** ⏳ NEXT

- ⏳ Create `nativeMain/data/repository/OrderRepositoryImpl.kt` using Room
- ⏳ Create `nativeMain/data/repository/TransactionRepositoryImpl.kt` using Room
- ⏳ Update DI modules to inject Room-based repositories on native platforms
- ⏳ Keep JS using IndexedDB (already works well)

### **Phase 3: Settings Optimization** 💡 FUTURE

- Move settings from IndexedDB to localStorage on JS (faster access)
- Keep settings in SharedPreferences/UserDefaults on native (already optimal)

---

## 🎯 **Why This Strategy?**

### **Current (JSON in KV Storage):**

- ✅ Simple to implement
- ✅ Works on all platforms
- ✅ Good for small datasets (<100 orders)
- ❌ Slow for large datasets (deserialize entire JSON array)
- ❌ Limited capacity (1-10MB)
- ❌ Can't query/filter efficiently
- ❌ No indexing

### **Future (Room Database for Native):**

- ✅ **GBs** of storage capacity
- ✅ Fast queries with indexes
- ✅ Filter, sort, paginate efficiently
- ✅ Relational data (foreign keys)
- ✅ Observable queries (Flow)
- ✅ ACID transactions
- ✅ Migrations for schema changes

### **JS (IndexedDB):**

- ✅ Already has **50MB-1GB** capacity (enough for web POS)
- ✅ Browser-native, no dependencies
- ✅ Async API with proper Kotlin wrappers (JuulLabs)
- ✅ Type-safe with suspend functions
- ✅ No migration needed (already working)

---

## 🧪 **Check Your Storage**

### **Android:**

```bash
# View SharedPreferences
adb shell "run-as com.theauraflow.pos cat /data/data/com.theauraflow.pos/shared_prefs/*.xml"

# Check Room database (when migrated)
adb shell "run-as com.theauraflow.pos ls -lh /data/data/com.theauraflow.pos/databases/"
```

### **iOS:**

```bash
# Find your app's container in iOS Simulator
xcrun simctl get_app_container booted com.theauraflow.pos data

# Then browse to Library/Preferences/
cat ~/Library/Developer/CoreSimulator/Devices/.../Library/Preferences/*.plist
```

### **Desktop:**

```bash
# macOS
defaults read com.theauraflow.pos

# Linux
cat ~/.java/.userPrefs/com/theauraflow/pos/prefs.xml

# Check Room database (when exists)
ls -lh ~/.auraflowpos/
```

### **JS (Browser):**

1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **IndexedDB** → **AuraFlowPOS** → **keyValueStore**
4. Click on any key to see the JSON data

---

## 📊 **Current Data Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                     User Action                              │
│                  (Create Order / Update Setting)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  ViewModel (UI Layer)                        │
│              (OrderViewModel, SettingsViewModel)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Repository (Domain Layer)                       │
│      (OrderRepositoryImpl, TransactionRepositoryImpl)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              LocalStorage Interface                          │
│            (saveString / getString)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┬───────────────┬────────┐
        ▼                             ▼               ▼        ▼
┌───────────────┐  ┌─────────────┐  ┌────────────┐  ┌────────────┐
│ SharedPrefs   │  │ UserDefaults│  │  Java      │  │ IndexedDB  │
│  (Android)    │  │   (iOS)     │  │  Prefs     │  │   (JS)     │
│               │  │             │  │ (Desktop)  │  │            │
│ JSON String   │  │ JSON String │  │ JSON String│  │ JSON String│
└───────────────┘  └─────────────┘  └────────────┘  └────────────┘
```

---

## 🎉 **Summary**

### **What's Currently Used:**

| Data | Storage Type | Format | Persists? | Capacity |
|------|-------------|--------|-----------|----------|
| **Orders** | KV Storage (SharedPrefs/UserDefaults/Preferences/IndexedDB) | JSON | ✅ YES | 1-10MB |
| **Transactions** | KV Storage | JSON | ✅ YES | 1-10MB |
| **Held Carts** | KV Storage | JSON | ✅ YES | 1-10MB |
| **Settings** | KV Storage | String | ✅ YES | <1KB |

### **What's Ready (Not Yet Used):**

| Entity | Storage Type | Format | Capacity |
|--------|-------------|--------|----------|
| **ProductEntity** | Room (native) | SQL | **GBs** |
| **OrderEntity** | Room (native) | SQL | **GBs** |
| **TransactionEntity** | Room (native) | SQL | **GBs** |
| **CustomerEntity** | Room (native) | SQL | **GBs** |

### **Why Two Tiers?**

- **Heavy data** (orders, transactions) will move to **SQL** for better performance & capacity
- **Light data** (settings, tokens) stays in **KV storage** for simplicity & speed
- **JS platform** already uses IndexedDB (50MB-1GB) which is sufficient for web POS

**The foundation is ready for scaling to thousands of orders!** 🚀
