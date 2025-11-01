package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.OrderItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface OrderItemDao {

    @Query("SELECT * FROM order_items WHERE orderId = :orderId")
    suspend fun getByOrderId(orderId: String): List<OrderItemEntity>

    @Query("SELECT * FROM order_items WHERE orderId = :orderId")
    fun observeByOrderId(orderId: String): Flow<List<OrderItemEntity>>

    @Query("SELECT * FROM order_items WHERE id = :id")
    suspend fun getById(id: String): OrderItemEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: OrderItemEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<OrderItemEntity>)

    @Update
    suspend fun update(item: OrderItemEntity)

    @Delete
    suspend fun delete(item: OrderItemEntity)

    @Query("DELETE FROM order_items WHERE orderId = :orderId")
    suspend fun deleteByOrderId(orderId: String)

    @Query("DELETE FROM order_items")
    suspend fun deleteAll()
}