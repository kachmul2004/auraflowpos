package com.theauraflow.pos.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.theauraflow.pos.data.local.entity.ModifierEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ModifierDao {

    @Query("SELECT * FROM modifiers ORDER BY name ASC")
    fun observeAll(): Flow<List<ModifierEntity>>

    @Query("SELECT * FROM modifiers ORDER BY name ASC")
    suspend fun getAll(): List<ModifierEntity>

    @Query("SELECT * FROM modifiers WHERE id = :id")
    suspend fun getById(id: String): ModifierEntity?

    @Query("SELECT * FROM modifiers WHERE groupId = :groupId")
    suspend fun getByGroupId(groupId: String): List<ModifierEntity>

    @Query("SELECT * FROM modifiers WHERE id IN (:ids)")
    suspend fun getByIds(ids: List<String>): List<ModifierEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(modifier: ModifierEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(modifiers: List<ModifierEntity>)

    @Update
    suspend fun update(modifier: ModifierEntity)

    @Delete
    suspend fun delete(modifier: ModifierEntity)

    @Query("DELETE FROM modifiers WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM modifiers")
    suspend fun deleteAll()
}