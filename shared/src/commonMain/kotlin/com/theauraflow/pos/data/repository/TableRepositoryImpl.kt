package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.Table
import com.theauraflow.pos.domain.model.TableStatus
import com.theauraflow.pos.domain.repository.TableRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.map

/**
 * Mock implementation of TableRepository using in-memory storage.
 * TODO: Replace with Room database implementation.
 */
class TableRepositoryImpl : TableRepository {

    private val _tables = MutableStateFlow(generateMockTables())

    override fun observeTables(): Flow<List<Table>> = _tables

    override suspend fun getTableById(id: String): Result<Table> {
        return try {
            val table = _tables.value.find { it.id == id }
            if (table != null) {
                Result.success(table)
            } else {
                Result.failure(NoSuchElementException("Table not found: $id"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateTableStatus(tableId: String, status: TableStatus): Result<Unit> {
        return try {
            _tables.value = _tables.value.map { table ->
                if (table.id == tableId) {
                    table.copy(status = status)
                } else {
                    table
                }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun assignOrderToTable(tableId: String, orderId: String): Result<Unit> {
        return try {
            _tables.value = _tables.value.map { table ->
                if (table.id == tableId) {
                    table.copy(
                        status = TableStatus.OCCUPIED,
                        currentOrderId = orderId
                    )
                } else {
                    table
                }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun clearTable(tableId: String): Result<Unit> {
        return try {
            _tables.value = _tables.value.map { table ->
                if (table.id == tableId) {
                    table.copy(
                        status = TableStatus.AVAILABLE,
                        currentOrderId = null,
                        server = null
                    )
                } else {
                    table
                }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun saveTable(table: Table): Result<Unit> {
        return try {
            val existingIndex = _tables.value.indexOfFirst { it.id == table.id }
            _tables.value = if (existingIndex >= 0) {
                _tables.value.toMutableList().apply { set(existingIndex, table) }
            } else {
                _tables.value + table
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteTable(tableId: String): Result<Unit> {
        return try {
            _tables.value = _tables.value.filter { it.id != tableId }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun generateMockTables(): List<Table> {
        return listOf(
            // Main Dining Section
            Table(
                id = "t1",
                number = 1,
                section = "Main Dining",
                seats = 4,
                status = TableStatus.AVAILABLE
            ),
            Table(
                id = "t2",
                number = 2,
                section = "Main Dining",
                seats = 2,
                status = TableStatus.OCCUPIED,
                server = "John"
            ),
            Table(
                id = "t3",
                number = 3,
                section = "Main Dining",
                seats = 6,
                status = TableStatus.RESERVED
            ),
            Table(
                id = "t4",
                number = 4,
                section = "Main Dining",
                seats = 4,
                status = TableStatus.AVAILABLE
            ),
            Table(
                id = "t5",
                number = 5,
                section = "Main Dining",
                seats = 8,
                status = TableStatus.OCCUPIED,
                server = "Sarah"
            ),

            // Patio Section
            Table(
                id = "t6",
                number = 6,
                section = "Patio",
                seats = 2,
                status = TableStatus.AVAILABLE
            ),
            Table(
                id = "t7",
                number = 7,
                section = "Patio",
                seats = 4,
                status = TableStatus.CLEANING
            ),
            Table(
                id = "t8",
                number = 8,
                section = "Patio",
                seats = 6,
                status = TableStatus.AVAILABLE
            ),

            // Bar Area
            Table(
                id = "t9",
                number = 9,
                section = "Bar Area",
                seats = 2,
                status = TableStatus.OCCUPIED,
                server = "Mike"
            ),
            Table(
                id = "t10",
                number = 10,
                section = "Bar Area",
                seats = 2,
                status = TableStatus.AVAILABLE
            ),
            Table(
                id = "t11",
                number = 11,
                section = "Bar Area",
                seats = 2,
                status = TableStatus.AVAILABLE
            ),
            Table(
                id = "t12",
                number = 12,
                section = "Bar Area",
                seats = 2,
                status = TableStatus.AVAILABLE
            ),
        )
    }
}
