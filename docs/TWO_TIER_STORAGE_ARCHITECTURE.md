# Two-Tier Storage Architecture

**Date:** Current session  
**Status:** ✅ In Implementation

---

## 🎯 Overview

Implementing a **two-tier storage strategy** across all platforms:

### **Tier 1: Heavy Data → SQL Database**

- **Data:** Orders, Transactions, Products, Customers, Inventory
- **Why:** Structured data, complex queries, relationships, large datasets
- **Implementation:**
    - **Android/iOS/Desktop:** Room Database (SQLite)
    - **JS/Wasm:** IndexedDB (browser native)

### **Tier 2: Lightweight Data → Key-Value Storage**

- **Data:** Settings, preferences, auth tokens, cache flags
- **Why:** Simple key-value pairs, fast access, small data
- **Implementation:**
    - **Android:** SharedPreferences
    - **iOS:** UserDefaults
    - **Desktop:** Java Preferences
    - **JS:** localStorage
    - **Wasm:** InMemoryStorage

---

## 📊 Data Classification

| Data Type | Category | Storage | Size | Queries |
|-----------|----------|---------|------|---------|
| **Orders** | Heavy | SQL/IndexedDB | Large | Complex |
| **Transactions** | Heavy | SQL/IndexedDB | Large | Complex |
| **Products** | Heavy | SQL/IndexedDB | Large | Complex |
| **Customers** | Heavy | SQL/IndexedDB | Large | Complex |
| **Inventory** | Heavy | SQL/IndexedDB | Medium | Complex |
| **Cart Items** | Heavy | SQL/IndexedDB | Small | Simple |
| **Settings** | Lightweight | KV Store | Tiny | Key-only |
| **Auth Tokens** | Lightweight | KV Store | Tiny | Key-only |
| **Preferences** | Lightweight | KV Store | Tiny | Key-only |
| **Cache Flags** | Lightweight | KV Store | Tiny | Key-only |

---

## 🏗️ Architecture

### **Current State (Before)**

```
CommonMain:
  - OrderRepositoryImpl → LocalStorage (JSON strings)
  - TransactionRepositoryImpl → LocalStorage (JSON strings)
  - SettingsRepositoryImpl → LocalStorage (key-value)

Platform-Specific:
  - Android → SharedPreferences (all data)
  - iOS → In-memory (no persistence!)
  - Desktop → Java Preferences (all data)
  - JS → IndexedDB (all data)
  - Wasm → In-memory (all data)
```

**Issues:**

- ❌ Mixing heavy and lightweight data in same storage
- ❌ No SQL queries for complex data
- ❌ JSON serialization overhead
- ❌ iOS has no persistence!
- ❌ Wasm loses data on refresh

---

### **New State (After)**

```
CommonMain:
  - OrderRepository (interface)
  - TransactionRepository (interface)
  - SettingsRepository (interface)

NativeMain (Android + iOS + Desktop):
  - Room Database (SQLite)
    ├── OrderEntity + OrderDao
    ├── TransactionEntity + TransactionDao
    ├── ProductEntity + ProductDao
    └── CustomerEntity + CustomerDao
  - Platform KV Storage (SharedPreferences/UserDefaults/Preferences)
    └── SettingsRepository → Simple settings

JSMain:
  - IndexedDB (JuulLabs library)
    └── All heavy data (orders, transactions, products)
  - localStorage
    └── Simple settings

WasmMain:
  - In-memory storage (development only)
  - Future: IndexedDB when library supports it
```

---

## 🔧 Implementation Plan

### **Phase 1: Room Database Setup** ✅

1. ✅ Create `TransactionEntity`
2. ✅ Create `TransactionDao`
3. ✅ Update `AppDatabase` to v2 (add transactions table)
4. ⏳ Create Room-based `TransactionRepositoryImpl` in `nativeMain`
5. ⏳ Create Room-based `OrderRepositoryImpl` in `nativeMain`

### **Phase 2: Keep LocalStorage for Settings** ⏳

1. Keep `SettingsRepositoryImpl` using `LocalStorage`
2. Keep auth tokens in platform KV storage
3. Keep simple preferences in platform KV storage

### **Phase 3: Platform-Specific Storage** ⏳

#### **Android:**

- Heavy data: Room Database (SQLite) ✅
- Lightweight: SharedPreferences ✅

#### **iOS:**

- Heavy data: Room Database (SQLite) ✅
- Lightweight: UserDefaults (needs implementation)

#### **Desktop:**

- Heavy data: Room Database (SQLite) ✅
- Lightweight: Java Preferences ✅

#### **JS:**

- Heavy data: IndexedDB (JuulLabs) ✅
- Lightweight: localStorage ✅

#### **Wasm:**

- Heavy data: InMemoryStorage (temporary)
- Lightweight: InMemoryStorage (temporary)

---

## 📁 File Structure

```
shared/
├── commonMain/
│   ├── domain/
│   │   ├── model/
│   │   │   ├── Order.kt
│   │   │   ├── Transaction.kt
│   │   │   └── ...
│   │   └── repository/
│   │       ├── OrderRepository.kt (interface)
│   │       ├── TransactionRepository.kt (interface)
│   │       └── SettingsRepository.kt (interface)
│   └── data/
│       ├── local/
│       │   ├── LocalStorage.kt (interface)
│       │   └── LocalStorageFactory.kt (expect)
│       └── repository/
│           └── SettingsRepositoryImpl.kt (uses LocalStorage)
│
├── nativeMain/ (Android + iOS + Desktop)
│   ├── data/
│   │   ├── local/
│   │   │   ├── AppDatabase.kt
│   │   │   ├── entity/
│   │   │   │   ├── OrderEntity.kt
│   │   │   │   ├── TransactionEntity.kt ✅ NEW
│   │   │   │   └── ...
│   │   │   └── dao/
│   │   │       ├── OrderDao.kt
│   │   │       ├── TransactionDao.kt ✅ NEW
│   │   │       └── ...
│   │   └── repository/
│   │       ├── OrderRepositoryImpl.kt (uses Room) ⏳ NEW
│   │       └── TransactionRepositoryImpl.kt (uses Room) ⏳ NEW
│   └── ...
│
├── jsMain/
│   ├── data/
│   │   ├── local/
│   │   │   └── LocalStorageFactory.js.kt (IndexedDB) ✅
│   │   └── repository/
│   │       ├── OrderRepositoryImpl.kt (uses IndexedDB) ⏳
│   │       └── TransactionRepositoryImpl.kt (uses IndexedDB) ⏳
│   └── ...
│
└── [androidMain, iosMain, jvmMain, wasmJsMain]/
    └── data/local/LocalStorageFactory.kt (platform-specific KV)
```

---

## 🎯 Benefits

### **Performance**

- ✅ SQL queries instead of deserializing entire JSON
- ✅ Indexed lookups
- ✅ Efficient filtering and sorting
- ✅ Lazy loading

### **Storage Capacity**

- ✅ Android: SQLite (GBs)
- ✅ iOS: SQLite (GBs)
- ✅ Desktop: SQLite (GBs)
- ✅ JS: IndexedDB (GBs)

### **Data Integrity**

- ✅ Foreign keys and constraints
- ✅ ACID transactions
- ✅ Type safety
- ✅ Schema migrations

### **Developer Experience**

- ✅ Type-safe queries
- ✅ Compile-time SQL validation
- ✅ Auto-generated DAO implementations
- ✅ Observable queries (Flow)

---

## 📝 Migration Path

### **Orders & Transactions**

**Before:**

```kotlin
// All platforms used LocalStorage with JSON
localStorage.saveString("orders", json.encodeToString(orders))
```

**After:**

```kotlin
// Native platforms use Room
orderDao.insertAll(orders.map { it.toEntity() })

// JS uses IndexedDB
database.writeTransaction("orders") {
    orders.forEach { store.put(it, Key(it.id)) }
}
```

### **Settings**

**Before & After:** (No change - still uses LocalStorage)

```kotlin
localStorage.saveString("dark_mode", enabled.toString())
```

---

## ✅ Status

- ✅ TransactionEntity created
- ✅ TransactionDao created
- ✅ AppDatabase updated to v2
- ✅ IndexedDB working for JS
- ⏳ Native repository implementations
- ⏳ iOS UserDefaults implementation
- ⏳ DI module updates

---

## 🧪 Testing Plan

1. **Android:**
    - Create orders → Check SQLite database
    - Create transactions → Check SQLite database
    - Change settings → Check SharedPreferences

2. **iOS:**
    - Create orders → Check SQLite database
    - Create transactions → Check SQLite database
    - Change settings → Check UserDefaults

3. **Desktop:**
    - Create orders → Check SQLite database
    - Create transactions → Check SQLite database
    - Change settings → Check Java Preferences

4. **JS:**
    - Create orders → Check IndexedDB
    - Create transactions → Check IndexedDB
    - Change settings → Check localStorage

---

## 📖 References

- **Room Documentation:** https://developer.android.com/training/data-storage/room
- **Room KMP:** https://developer.android.com/kotlin/multiplatform/room
- **JuulLabs IndexedDB:** https://github.com/JuulLabs/indexeddb
- **SharedPreferences:** https://developer.android.com/training/data-storage/shared-preferences
- **UserDefaults:** https://developer.apple.com/documentation/foundation/userdefaults
- **Java Preferences:** https://docs.oracle.com/javase/8/docs/technotes/guides/preferences/