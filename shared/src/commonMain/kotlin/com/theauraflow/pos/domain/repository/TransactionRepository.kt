package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.Transaction
import com.theauraflow.pos.domain.model.TransactionType
import com.theauraflow.pos.domain.model.TransactionStatus
import kotlinx.coroutines.flow.Flow

/**
 * Repository for transaction management.
 * Handles all financial transaction records.
 */
interface TransactionRepository {
    /**
     * Create a new transaction.
     */
    suspend fun createTransaction(transaction: Transaction): Result<Unit>

    /**
     * Get all transactions.
     */
    suspend fun getAllTransactions(): Result<List<Transaction>>

    /**
     * Get transactions for a specific order.
     */
    suspend fun getTransactionsForOrder(orderId: String): Result<List<Transaction>>

    /**
     * Get transactions by type.
     */
    suspend fun getTransactionsByType(type: TransactionType): Result<List<Transaction>>

    /**
     * Get transactions by status.
     */
    suspend fun getTransactionsByStatus(status: TransactionStatus): Result<List<Transaction>>

    /**
     * Observe transactions reactively.
     */
    fun observeTransactions(): Flow<List<Transaction>>
}
