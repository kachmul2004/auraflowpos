package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.Table
import com.theauraflow.pos.domain.model.TableStatus
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for managing restaurant tables.
 */
interface TableRepository {
    /**
     * Observe all tables with real-time updates.
     */
    fun observeTables(): Flow<List<Table>>

    /**
     * Get a specific table by ID.
     */
    suspend fun getTableById(id: String): Result<Table>

    /**
     * Update table status.
     */
    suspend fun updateTableStatus(tableId: String, status: TableStatus): Result<Unit>

    /**
     * Assign an order to a table.
     */
    suspend fun assignOrderToTable(tableId: String, orderId: String): Result<Unit>

    /**
     * Clear a table (remove current order and set to available).
     */
    suspend fun clearTable(tableId: String): Result<Unit>

    /**
     * Create or update a table.
     */
    suspend fun saveTable(table: Table): Result<Unit>

    /**
     * Delete a table.
     */
    suspend fun deleteTable(tableId: String): Result<Unit>
}
