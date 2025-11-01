package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.ProductVariationEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductVariationDao {

    @Query("SELECT * FROM product_variations WHERE productId = :productId")
    suspend fun getByProductId(productId: String): List<ProductVariationEntity>

    @Query("SELECT * FROM product_variations WHERE productId = :productId")
    fun observeByProductId(productId: String): Flow<List<ProductVariationEntity>>

    @Query("SELECT * FROM product_variations WHERE id = :id")
    suspend fun getById(id: String): ProductVariationEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(variation: ProductVariationEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(variations: List<ProductVariationEntity>)

    @Update
    suspend fun update(variation: ProductVariationEntity)

    @Delete
    suspend fun delete(variation: ProductVariationEntity)

    @Query("DELETE FROM product_variations WHERE productId = :productId")
    suspend fun deleteByProductId(productId: String)

    @Query("DELETE FROM product_variations")
    suspend fun deleteAll()
}