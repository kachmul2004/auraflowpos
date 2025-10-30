# Database Patterns: Exposed ORM & Room

## Exposed ORM (Server-Side)

### Table Definition

```kotlin
object ProductsTable : Table("products") {
    val id = varchar("id", 36)
    val name = varchar("name", 255)
    val sku = varchar("sku", 100).uniqueIndex().nullable()
    val price = decimal("price", 10, 2)
    val cost = decimal("cost", 10, 2).nullable()
    val stockQuantity = integer("stock_quantity").default(0)
    val isActive = bool("is_active").default(true)
    val createdAt = datetime("created_at").clientDefault { 
        Clock.System.now().toLocalDateTime(TimeZone.UTC) 
    }
    val updatedAt = datetime("updated_at").clientDefault { 
        Clock.System.now().toLocalDateTime(TimeZone.UTC) 
    }
    
    override val primaryKey = PrimaryKey(id)
}
```

### Database Configuration

```kotlin
fun configureDatabaseimport com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun configureDatabase() {
    val jdbcUrl = System.getenv("DATABASE_URL") 
        ?: "jdbc:postgresql://localhost:5432/auraflow_pos"
    val dbUser = System.getenv("DATABASE_USER") ?: "postgres"
    val dbPassword = System.getenv("DATABASE_PASSWORD") ?: "postgres"
    
    // HikariCP connection pool
    val config = HikariConfig().apply {
        jdbcUrl = jdbcUrl
        username = dbUser
        password = dbPassword
        driverClassName = "org.postgresql.Driver"
        maximumPoolSize = 10
        isAutoCommit = false
        transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        validate()
    }
    
    val dataSource = HikariDataSource(config)
    Database.connect(dataSource)
    
    // Create tables
    transaction {
        SchemaUtils.create(
            UsersTable,
            ProductsTable,
            OrdersTable,
            // ... other tables
        )
    }
}
```

### Transaction Helper

```kotlin
suspend fun <T> dbQuery(block: () -> T): T = withContext(Dispatchers.IO) {
    transaction { block() }
}

suspend fun <T> dbQueryResult(block: () -> T): Result<T> = withContext(Dispatchers.IO) {
    try {
        Result.success(transaction { block() })
    } catch (e: Exception) {
        Result.failure(DatabaseException(e.message, e))
    }
}
```

### Repository Pattern

```kotlin
class ProductRepository(private val database: Database) {
    
    suspend fun getAll(): List<ProductDto> = dbQuery {
        ProductsTable.selectAll()
            .where { ProductsTable.isActive eq true }
            .map { it.toDto() }
    }
    
    suspend fun getById(id: String): ProductDto? = dbQuery {
        ProductsTable.selectAll()
            .where { (ProductsTable.id eq id) and (ProductsTable.isActive eq true) }
            .singleOrNull()
            ?.toDto()
    }
    
    suspend fun create(dto: CreateProductDto): ProductDto = dbQuery {
        val id = UUID.randomUUID().toString()
        
        ProductsTable.insert {
            it[ProductsTable.id] = id
            it[name] = dto.name
            it[price] = dto.price
            it[stockQuantity] = dto.stockQuantity
        }
        
        ProductsTable.selectAll()
            .where { ProductsTable.id eq id }
            .single()
            .toDto()
    }
    
    suspend fun update(id: String, dto: UpdateProductDto): ProductDto? = dbQuery {
        val updated = ProductsTable.update({ ProductsTable.id eq id }) {
            dto.name?.let { name -> it[ProductsTable.name] = name }
            dto.price?.let { price -> it[ProductsTable.price] = price }
            it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        }
        
        if (updated > 0) {
            ProductsTable.selectAll()
                .where { ProductsTable.id eq id }
                .single()
                .toDto()
        } else null
    }
    
    suspend fun delete(id: String): Boolean = dbQuery {
        // Soft delete
        ProductsTable.update({ ProductsTable.id eq id }) {
            it[isActive] = false
            it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        } > 0
    }
}

// Mapper extension
fun ResultRow.toDto() = ProductDto(
    id = this[ProductsTable.id],
    name = this[ProductsTable.name],
    price = this[ProductsTable.price],
    stockQuantity = this[ProductsTable.stockQuantity],
    createdAt = this[ProductsTable.createdAt].toString(),
    updatedAt = this[ProductsTable.updatedAt].toString()
)
```

### Exposed Best Practices

**DO ✅**

- Use `Table` objects for type-safe queries
- Use HikariCP for connection pooling
- Wrap queries in `transaction` blocks
- Use `dbQuery` helper for suspend functions
- Map `ResultRow` to DTOs
- Use soft deletes (isActive flag)
- Add timestamps (createdAt, updatedAt)
- Use proper indexing (uniqueIndex, etc.)
- Handle errors with Result wrapper
- Use Dispatchers.IO for database operations

**DON'T ❌**

- Use raw SQL unless necessary
- Forget transaction blocks
- Expose database entities directly to API
- Block main thread with database calls
- Skip error handling
- Hardcode database credentials
- Use synchronous operations

---

## Room (Client-Side)

### Database Definition

```kotlin
@Database(
    entities = [
        ProductEntity::class,
        CartItemEntity::class,
        CustomerEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun productDao(): ProductDao
    abstract fun cartDao(): CartDao
    abstract fun customerDao(): CustomerDao
}
```

### Entity

```kotlin
@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey 
    val id: String,
    
    @ColumnInfo(name = "name") 
    val name: String,
    
    @ColumnInfo(name = "price") 
    val price: Double,
    
    @ColumnInfo(name = "sku") 
    val sku: String?,
    
    @ColumnInfo(name = "image_url") 
    val imageUrl: String?,
    
    @ColumnInfo(name = "stock_quantity") 
    val stockQuantity: Int,
    
    @ColumnInfo(name = "is_synced") 
    val isSynced: Boolean = false,
    
    @ColumnInfo(name = "created_at") 
    val createdAt: Long,
    
    @ColumnInfo(name = "updated_at") 
    val updatedAt: Long
)

// Mapper to domain model
fun ProductEntity.toDomain(): Product = Product(
    id = id,
    name = name,
    price = price,
    sku = sku,
    imageUrl = imageUrl,
    stockQuantity = stockQuantity
)

fun Product.toEntity(): ProductEntity = ProductEntity(
    id = id,
    name = name,
    price = price,
    sku = sku,
    imageUrl = imageUrl,
    stockQuantity = stockQuantity,
    isSynced = false,
    createdAt = Clock.System.now().toEpochMilliseconds(),
    updatedAt = Clock.System.now().toEpochMilliseconds()
)
```

### DAO

```kotlin
@Dao
interface ProductDao {
    
    @Query("SELECT * FROM products WHERE id = :id")
    suspend fun getById(id: String): ProductEntity?
    
    @Query("SELECT * FROM products ORDER BY name ASC")
    fun observeAll(): Flow<List<ProductEntity>>
    
    @Query("SELECT * FROM products WHERE name LIKE '%' || :query || '%'")
    suspend fun search(query: String): List<ProductEntity>
    
    @Query("SELECT * FROM products WHERE is_synced = 0")
    suspend fun getUnsyncedProducts(): List<ProductEntity>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(products: List<ProductEntity>)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(product: ProductEntity)
    
    @Update
    suspend fun update(product: ProductEntity)
    
    @Delete
    suspend fun delete(product: ProductEntity)
    
    @Query("DELETE FROM products")
    suspend fun deleteAll()
    
    @Query("UPDATE products SET is_synced = 1 WHERE id = :id")
    suspend fun markAsSynced(id: String)
}
```

### Database Factory (Expect/Actual)

```kotlin
// In commonMain
expect object DatabaseFactory {
    fun create(): RoomDatabase.Builder<AppDatabase>
}

// In androidMain
actual object DatabaseFactory {
    actual fun create(): RoomDatabase.Builder<AppDatabase> {
        val appContext = ApplicationContext.get()
        val dbFile = appContext.getDatabasePath("auraflow.db")
        return Room.databaseBuilder<AppDatabase>(
            context = appContext,
            name = dbFile.absolutePath
        )
    }
}

// In iosMain
actual object DatabaseFactory {
    actual fun create(): RoomDatabase.Builder<AppDatabase> {
        val dbFilePath = NSHomeDirectory() + "/auraflow.db"
        return Room.databaseBuilder<AppDatabase>(
            name = dbFilePath,
            factory = { AppDatabase::class.instantiateImpl() }
        )
    }
}

// In jvmMain (Desktop)
actual object DatabaseFactory {
    actual fun create(): RoomDatabase.Builder<AppDatabase> {
        val dbFile = File(System.getProperty("java.io.tmpdir"), "auraflow.db")
        return Room.databaseBuilder<AppDatabase>(
            name = dbFile.absolutePath
        )
    }
}
```

### Usage in Repository

```kotlin
class ProductLocalDataSource(private val database: AppDatabase) {
    
    private val dao = database.productDao()
    
    suspend fun getProducts(): List<Product> {
        return dao.observeAll()
            .first() // Get current value
            .map { it.toDomain() }
    }
    
    fun observeProducts(): Flow<List<Product>> {
        return dao.observeAll()
            .map { entities -> entities.map { it.toDomain() } }
    }
    
    suspend fun saveProducts(products: List<Product>) {
        dao.insertAll(products.map { it.toEntity() })
    }
    
    suspend fun saveProduct(product: Product) {
        dao.insert(product.toEntity())
    }
    
    suspend fun deleteProduct(productId: String) {
        dao.getById(productId)?.let { entity ->
            dao.delete(entity)
        }
    }
    
    suspend fun searchProducts(query: String): List<Product> {
        return dao.search(query).map { it.toDomain() }
    }
    
    suspend fun getUnsyncedProducts(): List<Product> {
        return dao.getUnsyncedProducts().map { it.toDomain() }
    }
    
    suspend fun markAsSynced(productId: String) {
        dao.markAsSynced(productId)
    }
}
```

### Room Best Practices

**DO ✅**

- Use `@Entity` for database tables
- Use `@Dao` for data access objects
- Use `Flow<T>` for observable queries
- Use `suspend` for single-shot queries
- Implement expect/actual for database creation
- Use `OnConflictStrategy.REPLACE` for upserts
- Add indexes for frequently queried columns
- Use migrations for schema changes
- Map entities to domain models
- Track sync status (isSynced flag)
- Use `@ColumnInfo` for explicit column names
- Add timestamps for offline sync

**DON'T ❌**

- Run database operations on main thread
- Forget `@PrimaryKey`
- Use blocking calls (use suspend)
- Expose entities directly to UI
- Skip migrations
- Store sensitive data unencrypted
- Use complex queries (keep them simple)

---

## Offline-First Pattern

```kotlin
class ProductRepositoryImpl(
    private val remoteDataSource: ProductApiClient,
    private val localDataSource: ProductLocalDataSource
) : ProductRepository {
    
    override suspend fun getProducts(): Result<List<Product>> {
        return try {
            // 1. Fetch from remote
            val remoteProducts = remoteDataSource.getProducts()
            
            // 2. Cache locally
            localDataSource.saveProducts(remoteProducts.map { it.toDomain() })
            
            // 3. Return fresh data
            Result.success(remoteProducts.map { it.toDomain() })
        } catch (e: Exception) {
            // 4. Fallback to cache on error
            try {
                val cachedProducts = localDataSource.getProducts()
                Result.success(cachedProducts)
            } catch (cacheError: Exception) {
                Result.failure(e)
            }
        }
    }
    
    override fun observeProducts(): Flow<List<Product>> {
        // Always observe from local database
        return localDataSource.observeProducts()
    }
    
    override suspend fun createProduct(product: Product): Result<Product> {
        return try {
            // 1. Try remote first
            val remoteProduct = remoteDataSource.createProduct(product.toDto())
            
            // 2. Cache locally
            localDataSource.saveProduct(remoteProduct.toDomain())
            
            Result.success(remoteProduct.toDomain())
        } catch (e: Exception) {
            // 3. Queue for sync if offline
            val unsyncedProduct = product.copy(isSynced = false)
            localDataSource.saveProduct(unsyncedProduct)
            
            Result.success(unsyncedProduct)
        }
    }
    
    suspend fun syncPendingChanges() {
        val unsyncedProducts = localDataSource.getUnsyncedProducts()
        
        unsyncedProducts.forEach { product ->
            try {
                remoteDataSource.createProduct(product.toDto())
                localDataSource.markAsSynced(product.id)
            } catch (e: Exception) {
                // Keep in queue for next sync
            }
        }
    }
}
```

---

## Summary

### Exposed (Server)

- ✅ Use Table objects for schema
- ✅ HikariCP for connection pooling
- ✅ Wrap queries in transactions
- ✅ Use dbQuery helper
- ✅ Map to DTOs
- ✅ Handle errors with Result

### Room (Client)

- ✅ Use @Entity, @Dao
- ✅ Flow for observables
- ✅ Suspend for single-shot
- ✅ Expect/actual for factory
- ✅ Map to domain models
- ✅ Track sync status

### Offline-First

- ✅ Fetch remote → cache → fallback
- ✅ Observe from local database
- ✅ Queue failed operations
- ✅ Sync when online
- ✅ Always return quickly
