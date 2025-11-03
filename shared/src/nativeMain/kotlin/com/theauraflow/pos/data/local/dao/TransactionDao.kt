package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.TransactionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface TransactionDao {

    @Query("SELECT * FROM transactions ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE id = :id")
    suspend fun getById(id: String): TransactionEntity?

    @Query("SELECT * FROM transactions WHERE referenceNumber = :referenceNumber")
    suspend fun getByReferenceNumber(referenceNumber: String): TransactionEntity?

    @Query("SELECT * FROM transactions WHERE orderId = :orderId ORDER BY createdAt DESC")
    suspend fun getByOrderId(orderId: String): List<TransactionEntity>

    @Query("SELECT * FROM transactions WHERE type = :type ORDER BY createdAt DESC")
    fun observeByType(type: String): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE status = :status ORDER BY createdAt DESC")
    fun observeByStatus(status: String): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE userId = :userId ORDER BY createdAt DESC")
    fun observeByUser(userId: String): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE createdAt >= :startTime AND createdAt <= :endTime ORDER BY createdAt DESC")
    suspend fun getByDateRange(startTime: Long, endTime: Long): List<TransactionEntity>

    @Query("SELECT * FROM transactions WHERE createdAt >= :startTime ORDER BY createdAt DESC LIMIT :limit")
    suspend fun getRecent(startTime: Long, limit: Int): List<TransactionEntity>

    @Query("SELECT * FROM transactions ORDER BY createdAt DESC")
    suspend fun getAll(): List<TransactionEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(transaction: TransactionEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(transactions: List<TransactionEntity>)

    @Update
    suspend fun update(transaction: TransactionEntity)

    @Delete
    suspend fun delete(transaction: TransactionEntity)

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM transactions")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM transactions")
    suspend fun count(): Int

    @Query("SELECT SUM(amount) FROM transactions WHERE type = 'SALE' AND status = 'COMPLETED'")
    suspend fun getTotalSalesRevenue(): Double?

    @Query("SELECT SUM(amount) FROM transactions WHERE type = 'REFUND' AND status = 'COMPLETED'")
    suspend fun getTotalRefunds(): Double?
}