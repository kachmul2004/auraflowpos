package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.OrderEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface OrderDao {

    @Query("SELECT * FROM orders ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE id = :id")
    suspend fun getById(id: String): OrderEntity?

    @Query("SELECT * FROM orders WHERE orderNumber = :orderNumber")
    suspend fun getByOrderNumber(orderNumber: String): OrderEntity?

    @Query("SELECT * FROM orders WHERE orderStatus = :status ORDER BY createdAt DESC")
    fun observeByStatus(status: String): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE customerId = :customerId ORDER BY createdAt DESC")
    fun observeByCustomer(customerId: String): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE createdAt >= :startTime AND createdAt <= :endTime ORDER BY createdAt DESC")
    suspend fun getByDateRange(startTime: Long, endTime: Long): List<OrderEntity>

    @Query("SELECT * FROM orders WHERE createdAt >= :startTime ORDER BY createdAt DESC LIMIT :limit")
    suspend fun getRecent(startTime: Long, limit: Int): List<OrderEntity>

    @Query("SELECT * FROM orders ORDER BY createdAt DESC")
    suspend fun getAll(): List<OrderEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(order: OrderEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(orders: List<OrderEntity>)

    @Update
    suspend fun update(order: OrderEntity)

    @Delete
    suspend fun delete(order: OrderEntity)

    @Query("DELETE FROM orders WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM orders")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM orders")
    suspend fun count(): Int

    @Query("SELECT SUM(total) FROM orders WHERE paymentStatus = 'PAID'")
    suspend fun getTotalRevenue(): Double?
}