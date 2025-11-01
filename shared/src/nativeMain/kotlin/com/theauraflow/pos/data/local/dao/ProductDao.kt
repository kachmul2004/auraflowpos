package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.ProductEntity
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for Product operations.
 * Room will generate the implementation automatically.
 */
@Dao
interface ProductDao {

    @Query("SELECT * FROM products")
    fun observeAll(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products")
    suspend fun getAll(): List<ProductEntity>

    @Query("SELECT * FROM products WHERE id = :id")
    suspend fun getById(id: String): ProductEntity?

    @Query("SELECT * FROM products WHERE categoryId = :categoryId")
    fun observeByCategory(categoryId: String): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE categoryId = :categoryId")
    suspend fun getByCategory(categoryId: String): List<ProductEntity>

    @Query("SELECT * FROM products WHERE isActive = 1")
    fun observeActive(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE name LIKE '%' || :query || '%' OR sku LIKE '%' || :query || '%'")
    suspend fun search(query: String): List<ProductEntity>

    @Query("SELECT * FROM products WHERE stockQuantity <= minStockLevel")
    fun observeLowStock(): Flow<List<ProductEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(product: ProductEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(products: List<ProductEntity>)

    @Update
    suspend fun update(product: ProductEntity)

    @Delete
    suspend fun delete(product: ProductEntity)

    @Query("DELETE FROM products WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM products")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM products")
    suspend fun count(): Int
}