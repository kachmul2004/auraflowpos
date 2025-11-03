package com.theauraflow.pos.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.ConstructedBy
import androidx.room.RoomDatabaseConstructor
import com.theauraflow.pos.data.local.dao.*
import com.theauraflow.pos.data.local.entity.*

/**
 * Main Room Database for AuraFlowPOS.
 *
 * This database is used on Android, iOS, and Desktop platforms.
 * Web/Wasm uses IndexedDB instead (Room doesn't support Wasm yet).
 */
@Database(
    entities = [
        ProductEntity::class,
        ProductVariationEntity::class,
        ModifierEntity::class,
        CategoryEntity::class,
        OrderEntity::class,
        OrderItemEntity::class,
        CustomerEntity::class,
        UserEntity::class,
        TransactionEntity::class
    ],
    version = 2, // Increment version for schema change
    exportSchema = true
)
@ConstructedBy(AppDatabaseConstructor::class)
abstract class AppDatabase : RoomDatabase() {

    abstract fun productDao(): ProductDao
    abstract fun productVariationDao(): ProductVariationDao
    abstract fun modifierDao(): ModifierDao
    abstract fun categoryDao(): CategoryDao
    abstract fun orderDao(): OrderDao
    abstract fun orderItemDao(): OrderItemDao
    abstract fun customerDao(): CustomerDao
    abstract fun userDao(): UserDao
    abstract fun transactionDao(): TransactionDao
}

/**
 * The Room compiler generates the actual implementations.
 * This is an expect/actual pattern for Room KMP.
 */
@Suppress("NO_ACTUAL_FOR_EXPECT")
expect object AppDatabaseConstructor : RoomDatabaseConstructor<AppDatabase> {
    override fun initialize(): AppDatabase
}