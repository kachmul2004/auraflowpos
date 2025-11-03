package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.model.Transaction
import com.theauraflow.pos.domain.repository.TransactionRepository

/**
 * Use case for creating transaction records.
 * Transactions are created for orders, refunds, cash in/out, etc.
 */
class CreateTransactionUseCase(
    private val transactionRepository: TransactionRepository
) {
    suspend operator fun invoke(transaction: Transaction): Result<Transaction> {
        return try {
            transactionRepository.createTransaction(transaction)
            Result.success(transaction)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
