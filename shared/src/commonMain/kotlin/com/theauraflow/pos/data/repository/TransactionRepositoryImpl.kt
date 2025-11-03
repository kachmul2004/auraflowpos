package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.domain.model.Transaction
import com.theauraflow.pos.domain.model.TransactionType
import com.theauraflow.pos.domain.model.TransactionStatus
import com.theauraflow.pos.domain.repository.TransactionRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.GlobalScope
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Implementation of TransactionRepository with LocalStorage for persistence.
 */
class TransactionRepositoryImpl(
    private val localStorage: LocalStorage
) : TransactionRepository {

    private val _transactionsCache = MutableStateFlow<List<Transaction>>(emptyList())

    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = false
    }

    companion object {
        private const val TRANSACTIONS_KEY = "transactions"
    }

    init {
        // Load transactions from storage on init
        println("🏗️ TransactionRepositoryImpl: Initializing...")
        GlobalScope.launch(kotlinx.coroutines.Dispatchers.Default) {
            loadTransactionsFromStorage()
            println("📂 DEBUG: Init complete. Loaded ${_transactionsCache.value.size} transactions")
        }
    }

    private suspend fun loadTransactionsFromStorage() {
        try {
            val jsonString = localStorage.getString(TRANSACTIONS_KEY)
            if (jsonString != null) {
                val transactions = json.decodeFromString<List<Transaction>>(jsonString)
                _transactionsCache.value = transactions
                println("✅ DEBUG: Loaded ${transactions.size} transactions from storage")
            } else {
                println("ℹ️ DEBUG: No transactions in storage yet")
            }
        } catch (e: Exception) {
            println("❌ Failed to load transactions: ${e.message}")
            e.printStackTrace()
        }
    }

    private suspend fun saveTransactionsToStorage() {
        try {
            val jsonString = json.encodeToString(_transactionsCache.value)
            localStorage.saveString(TRANSACTIONS_KEY, jsonString)
            println("💾 Saved ${_transactionsCache.value.size} transactions to storage")
        } catch (e: Exception) {
            println("❌ Failed to save transactions: ${e.message}")
            e.printStackTrace()
        }
    }

    override suspend fun createTransaction(transaction: Transaction): Result<Unit> {
        return try {
            println("💳 Creating transaction: ${transaction.referenceNumber}")

            // Add to cache at the beginning (newest first)
            _transactionsCache.value = listOf(transaction) + _transactionsCache.value

            // Persist to storage
            saveTransactionsToStorage()

            println("✅ Transaction created and saved")
            Result.success(Unit)
        } catch (e: Exception) {
            println("❌ Transaction creation failed: ${e.message}")
            e.printStackTrace()
            Result.failure(e)
        }
    }

    override suspend fun getAllTransactions(): Result<List<Transaction>> {
        return try {
            Result.success(_transactionsCache.value)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTransactionsForOrder(orderId: String): Result<List<Transaction>> {
        return try {
            val transactions = _transactionsCache.value.filter { it.orderId == orderId }
            Result.success(transactions)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTransactionsByType(type: TransactionType): Result<List<Transaction>> {
        return try {
            val transactions = _transactionsCache.value.filter { it.type == type }
            Result.success(transactions)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTransactionsByStatus(status: TransactionStatus): Result<List<Transaction>> {
        return try {
            val transactions = _transactionsCache.value.filter { it.status == status }
            Result.success(transactions)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun observeTransactions(): Flow<List<Transaction>> {
        return _transactionsCache.asStateFlow()
    }
}
