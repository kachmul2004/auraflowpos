package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.CustomerEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CustomerDao {

    @Query("SELECT * FROM customers ORDER BY name ASC")
    fun observeAll(): Flow<List<CustomerEntity>>

    @Query("SELECT * FROM customers ORDER BY name ASC")
    suspend fun getAll(): List<CustomerEntity>

    @Query("SELECT * FROM customers WHERE id = :id")
    suspend fun getById(id: String): CustomerEntity?

    @Query("SELECT * FROM customers WHERE email = :email")
    suspend fun getByEmail(email: String): CustomerEntity?

    @Query("SELECT * FROM customers WHERE phone = :phone")
    suspend fun getByPhone(phone: String): CustomerEntity?

    @Query("SELECT * FROM customers WHERE name LIKE '%' || :query || '%' OR email LIKE '%' || :query || '%' OR phone LIKE '%' || :query || '%'")
    suspend fun search(query: String): List<CustomerEntity>

    @Query("SELECT * FROM customers ORDER BY loyaltyPoints DESC LIMIT :limit")
    suspend fun getTopLoyaltyCustomers(limit: Int): List<CustomerEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(customer: CustomerEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(customers: List<CustomerEntity>)

    @Update
    suspend fun update(customer: CustomerEntity)

    @Delete
    suspend fun delete(customer: CustomerEntity)

    @Query("DELETE FROM customers WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM customers")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM customers")
    suspend fun count(): Int
}