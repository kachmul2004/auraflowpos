# Database Architecture - AuraFlowPOS

**Status:** ✅ **Implementing**  
**Last Updated:** December 2024

---

## 📊 Overview

AuraFlowPOS uses a **dual-database strategy** with a **unified abstraction layer** to support all
platforms while preparing for future Room Wasm support.

### **Platform-Specific Implementations**

| Platform | Database Solution | Status | Storage Location |
|----------|------------------|--------|------------------|
| **Android** | Room + SQLite | ✅ **Stable** | `/data/data/com.theauraflow.pos/databases/auraflow.db` |
| **iOS** | Room + SQLite | ⚠️ **Alpha** | `~/Library/Application Support/auraflow.db` |
| **Desktop** | Room + JDBC SQLite | ⚠️ **Alpha** | Platform-specific app data folder |
| **Web/Wasm** | IndexedDB Wrapper | ✅ **Stable** | Browser IndexedDB storage |
| **Server** | PostgreSQL + Exposed | ✅ **Stable** | Production database |

---

## 🏗️ Architecture Design

### **1. Three-Layer Architecture**

```
┌─────────────────────────────────────────────────────┐
│          Repository Layer (Data Layer)              │
│    ProductRepositoryImpl, OrderRepositoryImpl       │
│            ↓ depends on                             │
│         PosDatabase Interface                       │
│         (Abstraction Layer)                         │
└─────────────────────────────────────────────────────┘
                      ↓ implemented by
        ┌─────────────────────────────────┐
        │    Platform-Specific Impl       │
        │  ┌─────────────┬───────────────┐│
        │  │ Room        │ IndexedDB     ││
        │  │ (Native)    │ (Web/Wasm)    ││
        │  └─────────────┴───────────────┘│
        └─────────────────────────────────┘
```

### **2. Common Database Interface (`PosDatabase`)**

```kotlin
// shared/src/commonMain/kotlin/.../database/PosDatabase.kt

interface PosDatabase {
    // Product operations
    suspend fun insertProduct(product: ProductEntity)
    suspend fun getAllProducts(): List<ProductEntity>
    fun observeAllProducts(): Flow<List<ProductEntity>>
    
    // Order operations
    suspend fun insertOrder(order: OrderEntity): Long
    suspend fun insertOrderItems(items: List<OrderItemEntity>)
    
    // Transaction support
    suspend fun <R> withTransaction(block: suspend () -> R): R
    
    // ... and more
}
```

**Key Benefits:**

- ✅ Repositories depend on interface, not implementation
- ✅ Easy to swap implementations without changing repository code
- ✅ Same API across all platforms
- ✅ When Room supports Wasm, only need to change builder code

### **3. Entity Design (Dual-Purpose)**

All entities are plain `@Serializable` data classes in `commonMain`:

```kotlin
// shared/src/commonMain/kotlin/.../entity/ProductEntity.kt

@Serializable  // For IndexedDB
data class ProductEntity(
    val id: String,
    val name: String,
    val price: Double,
    // ... more fields
)

// Mapper functions
fun ProductEntity.toDomain(): Product { ... }
fun Product.toEntity(): ProductEntity { ... }
```

**Why This Works:**

- ✅ Room (native platforms): Maps to `@Entity` annotated class in platform-specific code
- ✅ IndexedDB (web/wasm): Uses directly via `kotlinx.serialization`
- ✅ No duplication
- ✅ Type-safe mappers

---

## 🗄️ Database Schema

### **Tables**

#### **1. Products**

```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT,
    barcode TEXT,
    price REAL NOT NULL,
    cost REAL,
    category_id TEXT,
    category_name TEXT,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    image_url TEXT,
    description TEXT,
    tax_rate REAL DEFAULT 0.0,
    is_active INTEGER DEFAULT 1,
    has_variations INTEGER DEFAULT 0,
    has_modifiers INTEGER DEFAULT 0,
    variation_type_id TEXT,
    variation_type_name TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
)
```

#### **2. Product Variations**

```sql
CREATE TABLE product_variations (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,  -- Foreign key to products
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT,
    barcode TEXT,
    image_url TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)
```

#### **3. Modifiers**

```sql
CREATE TABLE modifiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    group_id TEXT,
    group_name TEXT,
    is_required INTEGER DEFAULT 0
)
```

#### **4. Categories**

```sql
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    parent_category_id TEXT,
    FOREIGN KEY (parent_category_id) REFERENCES categories(id)
)
```

#### **5. Orders**

```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_id TEXT,
    customer_name TEXT,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    discount REAL DEFAULT 0.0,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    order_status TEXT NOT NULL,
    notes TEXT,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
)
```

#### **6. Order Items**

```sql
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,  -- Foreign key to orders
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL,
    variation_id TEXT,
    variation_name TEXT,
    variation_price REAL,
    quantity INTEGER NOT NULL,
    modifiers_json TEXT,  -- Serialized CartItemModifier list
    discount_json TEXT,   -- Serialized Discount object
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)
```

#### **7. Customers**

```sql
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    loyalty_points INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0.0,
    order_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    notes TEXT
)
```

#### **8. Users**

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    pin TEXT,
    is_active INTEGER DEFAULT 1,
    last_login INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
)
```

---

## 🔄 Migration Strategy (IndexedDB → Room on Wasm)

### **Current State (2024)**

```kotlin
// Platform-specific database builder (expect/actual pattern)

// androidMain, iosMain, jvmMain
actual fun createDatabase(): PosDatabase {
    return RoomDatabaseImpl(roomDatabase)
}

// wasmJsMain
actual fun createDatabase(): PosDatabase {
    return IndexedDBDatabaseImpl(indexedDB)
}
```

### **Future State (When Room Supports Wasm)**

**Only need to change the wasmJsMain builder:**

```kotlin
// wasmJsMain - AFTER Room supports Wasm
actual fun createDatabase(): PosDatabase {
    return RoomDatabaseImpl(roomDatabase)  // ← Same as other platforms!
}
```

**That's it! No repository changes needed! 🎉**

### **Why This Works**

1. **PosDatabase interface** is platform-agnostic
2. **Repositories** depend only on the interface
3. **Entity classes** work with both Room and IndexedDB
4. **Builder code** is the only thing that needs to change
5. **Data migration** can be handled automatically

---

## 📦 File Structure

```
shared/src/
├── commonMain/kotlin/com/theauraflow/pos/
│   ├── data/
│   │   ├── local/
│   │   │   ├── database/
│   │   │   │   └── PosDatabase.kt           # ← Interface (abstraction)
│   │   │   ├── entity/
│   │   │   │   ├── ProductEntity.kt         # ← Plain data classes
│   │   │   │   ├── OrderEntity.kt
│   │   │   │   ├── CategoryEntity.kt
│   │   │   │   └── ...
│   │   │   └── DatabaseBuilder.kt           # ← expect/actual
│   │   └── repository/
│   │       └── ProductRepositoryImpl.kt     # ← Uses PosDatabase interface
│   └── domain/
│       ├── model/                           # ← Domain models
│       └── repository/                      # ← Repository interfaces
│
├── androidMain/kotlin/.../data/local/
│   ├── RoomDatabaseImpl.kt                  # ← Room implementation
│   ├── dao/
│   │   ├── ProductDao.kt                    # ← Room DAOs
│   │   └── ...
│   └── DatabaseBuilder.kt                   # ← actual for Android
│
├── iosMain/kotlin/.../data/local/
│   └── DatabaseBuilder.kt                   # ← actual for iOS
│
├── jvmMain/kotlin/.../data/local/
│   └── DatabaseBuilder.kt                   # ← actual for Desktop
│
└── wasmJsMain/kotlin/.../data/local/
    ├── IndexedDBDatabaseImpl.kt             # ← IndexedDB implementation
    ├── IndexedDBWrapper.kt                  # ← IndexedDB helper
    └── DatabaseBuilder.kt                   # ← actual for Web/Wasm
```

---

## 🚀 Implementation Status

### **Phase 1: Foundation** ✅ (Current)

- [x] Create `PosDatabase` interface
- [x] Define all entity classes in `commonMain`
- [x] Add entity-to-domain mappers
- [ ] Create `expect/actual` database builder

### **Phase 2: Room Implementation** 🚧 (Next)

- [ ] Create Room DAOs (Android/iOS/Desktop)
- [ ] Implement `RoomDatabaseImpl`
- [ ] Add Room database class with migrations
- [ ] Test on Android first

### **Phase 3: IndexedDB Implementation** ⏳ (After Room)

- [ ] Create IndexedDB external declarations
- [ ] Build Kotlin-friendly wrapper
- [ ] Implement `IndexedDBDatabaseImpl`
- [ ] Test on Web/Wasm

### **Phase 4: Repository Updates** ⏳

- [ ] Update repositories to use `PosDatabase`
- [ ] Remove in-memory storage
- [ ] Add proper error handling
- [ ] Update DI modules

### **Phase 5: Testing & Migration** ⏳

- [ ] Write unit tests
- [ ] Test data persistence across platforms
- [ ] Document migration steps
- [ ] Build verification

---

## 🎯 Key Design Principles

1. **Separation of Concerns**
    - Domain models are pure business logic
    - Entities are data storage format
    - Clear mapping between layers

2. **Platform Agnostic**
    - Repository layer doesn't know about Room or IndexedDB
    - Same repository code works everywhere
    - Platform-specific code isolated

3. **Future-Proof**
    - Easy to swap implementations
    - Prepared for Room Wasm support
    - No breaking changes needed

4. **Type Safety**
    - Compile-time verification
    - No runtime reflection (Wasm compatible)
    - Explicit mappers

5. **Offline-First**
    - Local database is source of truth
    - Sync with server later
    - Works without network

---

## 📚 Related Documentation

- [KMP_ARCHITECTURE.md](./KMP_ARCHITECTURE.md) - Overall architecture guidelines
- [SESSION_STATUS.md](./SESSION_STATUS.md) - Current implementation status
- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) - Future plans

---

**Last Updated:** December 2024  
**Author:** AI Assistant  
**Status:** ✅ Foundation Complete, 🚧 Implementation In Progress
