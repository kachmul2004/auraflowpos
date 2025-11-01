package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.UserEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {

    @Query("SELECT * FROM users WHERE isActive = 1 ORDER BY name ASC")
    fun observeAll(): Flow<List<UserEntity>>

    @Query("SELECT * FROM users")
    suspend fun getAll(): List<UserEntity>

    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getById(id: String): UserEntity?

    @Query("SELECT * FROM users WHERE email = :email")
    suspend fun getByEmail(email: String): UserEntity?

    @Query("SELECT * FROM users WHERE role = :role AND isActive = 1")
    fun observeByRole(role: String): Flow<List<UserEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: UserEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(users: List<UserEntity>)

    @Update
    suspend fun update(user: UserEntity)

    @Delete
    suspend fun delete(user: UserEntity)

    @Query("DELETE FROM users WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM users")
    suspend fun deleteAll()

    @Query("SELECT COUNT(*) FROM users WHERE isActive = 1")
    suspend fun countActive(): Int
}