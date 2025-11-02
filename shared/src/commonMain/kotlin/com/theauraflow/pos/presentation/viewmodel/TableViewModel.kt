package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.core.util.UiText
import com.theauraflow.pos.domain.model.Table
import com.theauraflow.pos.domain.model.TableStatus
import com.theauraflow.pos.domain.repository.TableRepository
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

/**
 * ViewModel for managing restaurant tables.
 */
class TableViewModel(
    private val tableRepository: TableRepository,
    private val viewModelScope: CoroutineScope
) {

    // All tables with real-time updates
    private val _tablesState = MutableStateFlow<UiState<List<Table>>>(UiState.Loading())
    val tablesState: StateFlow<UiState<List<Table>>> = _tablesState.asStateFlow()

    // Currently selected table (for details view)
    private val _selectedTable = MutableStateFlow<Table?>(null)
    val selectedTable: StateFlow<Table?> = _selectedTable.asStateFlow()

    init {
        observeTables()
    }

    /**
     * Observe all tables from repository.
     */
    private fun observeTables() {
        viewModelScope.launch(Dispatchers.Default) {
            tableRepository.observeTables()
                .catch { error ->
                    _tablesState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Failed to load tables")
                    )
                }
                .collect { tables ->
                    _tablesState.value = UiState.Success(tables)
                }
        }
    }

    /**
     * Select a table for viewing details.
     */
    fun selectTable(table: Table?) {
        _selectedTable.value = table
    }

    /**
     * Update table status.
     */
    fun updateTableStatus(tableId: String, status: TableStatus) {
        viewModelScope.launch(Dispatchers.Default) {
            tableRepository.updateTableStatus(tableId, status)
                .onFailure { error ->
                    // TODO: Show error toast
                    println("Failed to update table status: ${error.message}")
                }
        }
    }

    /**
     * Clear a table (set to available, remove order).
     */
    fun clearTable(tableId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            tableRepository.clearTable(tableId)
                .onSuccess {
                    // Table cleared successfully
                    _selectedTable.value = null
                }
                .onFailure { error ->
                    // TODO: Show error toast
                    println("Failed to clear table: ${error.message}")
                }
        }
    }

    /**
     * Get table by ID.
     */
    suspend fun getTableById(id: String): Table? {
        return tableRepository.getTableById(id).getOrNull()
    }

    /**
     * Save or update a table.
     */
    fun saveTable(table: Table) {
        viewModelScope.launch(Dispatchers.Default) {
            tableRepository.saveTable(table)
                .onFailure { error ->
                    // TODO: Show error toast
                    println("Failed to save table: ${error.message}")
                }
        }
    }

    /**
     * Delete a table.
     */
    fun deleteTable(tableId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            tableRepository.deleteTable(tableId)
                .onFailure { error ->
                    // TODO: Show error toast
                    println("Failed to delete table: ${error.message}")
                }
        }
    }
}
