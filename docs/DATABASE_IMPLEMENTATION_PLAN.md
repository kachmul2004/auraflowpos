# Database Implementation Plan

**Status:** 📋 Planned  
**Current:** InMemoryLocalStorage with JSON serialization  
**Target:** File-based storage → Room + Server API

---

## 🎯 Why Offline-First Matters

You're absolutely right! Since we're building an **offline-first POS system**, we need proper
persistent storage from the start. Here's the implementation plan:

---

## 🗂️ Storage Strategy

### **Phase 1: File-Based Storage with Okio ⏳ NEXT**

**Why Okio First:**

- ✅ Battle-tested (used by OkHttp, Retrofit, etc.)
- ✅ Fully KMP compatible
- ✅ Simple JSON file storage
- ✅ Works on all platforms (Android, iOS, Desktop, Web)
- ✅ Zero setup complexity
- ✅ Can be implemented in 1-2 hours

**Implementation:**

```kotlin
class FileLocalStorage(basePath: String) : LocalStorage {
    private val fileSystem = FileSystem.SYSTEM
    
    override suspend fun saveString(key: String, value: String) {
        fileSystem.write("$basePath/$key.json") {
            writeUtf8(value)
        }
    }
    
    override suspend fun getString(key: String): String? {
        val path = "$basePath/$key.json".toPath()
        return if (fileSystem.exists(path)) {
            fileSystem.read(path) { readUtf8() }
        } else null
    }
}
```

**Platform-Specific Paths:**

- Android: `context.filesDir.absolutePath`
- iOS: `NSDocumentDirectory`
- Desktop: `System.getProperty("user.home")/.auraflowpos`
- Web: LocalStorage API fallback

**Benefits:**

- Data persists across app restarts ✅
- No build complexity
- Easy to debug (human-readable JSON files)
- Can sync files to server

---

### **Phase 2: Room Database 🎯 RECOMMENDED**

**Why Room:**

- ✅ Official Android library
- ✅ **NEW:** Room 2.8+ has KMP support (alpha/beta)
- ✅ Type-safe queries
- ✅ Compile-time verification
- ✅ Built-in migrations
- ✅ Reactive queries with Flow
- ✅ Works with Kotlin coroutines

**Setup:**

```kotlin
// shared/build.gradle.kts
plugins {
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
}

dependencies {
    implementation(libs.room.runtime)
    ksp(libs.room.compiler)
}
```

**Entities:**

```kotlin
@Entity(tableName = "held_carts")
data class HeldCartEntity(
    @PrimaryKey val id: String,
    val items: String, // JSON
    val createdAt: Long,
    val total: Double
)

@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey val id: String,
    val orderNumber: String,
    val items: String, // JSON
    val total: Double,
    val status: String,
    val createdAt: Long
)
```

**Database:**

```kotlin
@Database(
    entities = [HeldCartEntity::class, OrderEntity::class],
    version = 1
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun heldCartDao(): HeldCartDao
    abstract fun orderDao(): OrderDao
}
```

**DAOs:**

```kotlin
@Dao
interface HeldCartDao {
    @Query("SELECT * FROM held_carts ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<HeldCartEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(cart: HeldCartEntity)
    
    @Delete
    suspend fun delete(cart: HeldCartEntity)
}
```

**Current Status:**

- ⚠️ Room KMP is in **alpha/beta** (2.8.x)
- ⚠️ Some platforms may have limited support
- ⚠️ Build complexity with KSP
- ✅ Works great on Android
- ⏳ iOS support improving

---

### **Phase 3: SQLDelight (Alternative to Room)**

**If Room KMP has issues:**

```kotlin
// Alternative: SQLDelight (mature KMP SQL library)
plugins {
    alias(libs.plugins.sqldelight)
}

sqldelight {
    databases {
        create("AppDatabase") {
            packageName.set("com.theauraflow.pos.db")
        }
    }
}
```

**SQL Definitions:**

```sql
-- HeldCart.sq
CREATE TABLE held_carts (
    id TEXT PRIMARY KEY,
    items TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    total REAL NOT NULL
);

selectAll:
SELECT * FROM held_carts ORDER BY created_at DESC;

insert:
INSERT OR REPLACE INTO held_carts VALUES (?, ?, ?, ?);
```

**Benefits:**

- ✅ Mature KMP support
- ✅ SQL-first approach
- ✅ Type-safe generated code
- ✅ Very fast
- ✅ Small library size

---

### **Phase 4: Server Sync + Offline-First Architecture**

**Full Production Setup:**

```kotlin
class OrderRepository(
    private val orderDao: OrderDao,
    private val apiClient: OrderApiClient,
    private val networkMonitor: NetworkMonitor
) {
    // Offline-first: Always read from local DB
    fun observeOrders(): Flow<List<Order>> {
        return orderDao.observeAll()
            .map { entities -> entities.map { it.toDomain() } }
    }
    
    // Create order: Save locally, sync when online
    suspend fun createOrder(order: Order): Result<Order> {
        // 1. Save to local DB immediately
        orderDao.insert(order.toEntity())
        
        // 2. Try to sync to server
        if (networkMonitor.isOnline()) {
            try {
                val synced = apiClient.createOrder(order.toDto())
                // Update local with server ID
                orderDao.update(synced.toEntity())
            } catch (e: Exception) {
                // Mark for sync later
                orderDao.markForSync(order.id)
            }
        }
        
        return Result.success(order)
    }
    
    // Background sync
    suspend fun syncPendingOrders() {
        val pending = orderDao.getPendingSync()
        pending.forEach { order ->
            try {
                apiClient.syncOrder(order.toDto())
                orderDao.markSynced(order.id)
            } catch (e: Exception) {
                // Will retry later
            }
        }
    }
}
```

**WorkManager for Background Sync:**

```kotlin
class SyncWorker : CoroutineWorker() {
    override suspend fun doWork(): Result {
        orderRepository.syncPendingOrders()
        heldCartRepository.syncToServer()
        return Result.success()
    }
}
```

---

## 📊 Implementation Timeline

### **Week 1: File Storage (Okio)**

- ✅ Day 1-2: Implement FileLocalStorage
- ✅ Day 3: Platform-specific paths (expect/actual)
- ✅ Day 4-5: Integration & testing
- ✅ **Result:** Data persists across restarts

### **Week 2: Room Database**

- ✅ Day 1-2: Set up Room entities & DAOs
- ✅ Day 3: Implement repositories with Room
- ✅ Day 4: Migration from FileStorage
- ✅ Day 5: Testing & optimization

### **Week 3-4: Server Integration**

- ✅ Day 1-3: REST API implementation
- ✅ Day 4-6: Offline-first sync logic
- ✅ Day 7-8: WebSocket real-time updates
- ✅ Day 9-10: Testing & conflict resolution

---

## 🎯 Immediate Action: Add Okio File Storage

**Step 1:** Add Okio dependency ✅ DONE

```toml
okio = "3.9.1"
```

**Step 2:** Create FileLocalStorage (IN PROGRESS)

- Implement file read/write
- Handle platform-specific paths
- Add error handling

**Step 3:** Update DI Module

```kotlin
single<LocalStorage> { 
    FileLocalStorage(basePath = getStorageDirectory())
}
```

**Step 4:** Test

- Park a sale → Restart app → Verify loaded
- Create order → Restart app → Verify loaded

---

## 🔄 Migration Strategy

```kotlin
class LocalStorageMigration(
    private val oldStorage: InMemoryLocalStorage,
    private val newStorage: FileLocalStorage
) {
    suspend fun migrate() {
        // Copy data from memory to files
        val keys = listOf("held_carts", "orders")
        keys.forEach { key ->
            oldStorage.getString(key)?.let { value ->
                newStorage.saveString(key, value)
            }
        }
    }
}
```

---

## ✅ Recommendation

**For immediate implementation:**

1. ✅ **Use Okio for file storage** (1-2 hours)
    - Simple, reliable, works everywhere
    - Data persists across restarts
    - Easy to implement

2. ⏳ **Add Room later** (1-2 days)
    - When Room KMP is more stable
    - For complex queries
    - For better performance

3. ⏳ **Server sync** (1-2 weeks)
    - After local storage is solid
    - Implement offline-first
    - Add background sync

---

## 📝 Current Status

**What We Have:**

- ✅ LocalStorage interface
- ✅ InMemoryLocalStorage (works but data lost on restart)
- ✅ JSON serialization
- ✅ Repository integration

**What's Next:**

- ⏳ FileLocalStorage with Okio (implement actual file persistence)
- ⏳ Platform-specific storage paths (expect/actual)
- ⏳ Room database (when ready for production)
- ⏳ Server API integration

---

**TLDR:** Yes, we should implement database/file storage NOW! File-based storage with Okio is the
quickest path to offline-first persistence (1-2 hours). Room can come later when KMP support is more
mature.

Let me implement FileLocalStorage with Okio right now! 🚀
