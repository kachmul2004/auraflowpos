package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a financial transaction in the POS system.
 * Used for comprehensive financial tracking and audit trail.
 */
@Serializable
data class Transaction(
    val id: String,
    val referenceNumber: String,
    val orderId: String? = null, // Link to order if transaction is order-related
    val orderNumber: String? = null, // For display purposes
    val type: TransactionType,
    val amount: Double,
    val paymentMethod: PaymentMethod,
    val status: TransactionStatus,
    val userId: String,
    val userName: String,
    val notes: String? = null,
    val createdAt: Long,
    val completedAt: Long? = null
) {
    companion object {
        /**
         * Generate a unique transaction reference number.
         */
        fun generateReferenceNumber(timestamp: Long, type: TransactionType): String {
            val prefix = when (type) {
                TransactionType.SALE -> "TXN-S"
                TransactionType.REFUND -> "TXN-R"
                TransactionType.CASH_IN -> "TXN-CI"
                TransactionType.CASH_OUT -> "TXN-CO"
                TransactionType.VOID -> "TXN-V"
                TransactionType.ADJUSTMENT -> "TXN-A"
            }
            return "$prefix-${timestamp}"
        }
    }
}

/**
 * Types of financial transactions in the POS system.
 */
@Serializable
enum class TransactionType {
    SALE,        // Regular sale transaction
    REFUND,      // Refund transaction (negative amount)
    CASH_IN,     // Cash added to drawer (e.g., starting cash, tips)
    CASH_OUT,    // Cash removed from drawer (e.g., payout, deposit)
    VOID,        // Voided transaction
    ADJUSTMENT   // Manual adjustment by admin
}

/**
 * Status of a transaction.
 */
@Serializable
enum class TransactionStatus {
    PENDING,     // Transaction initiated but not completed
    COMPLETED,   // Transaction successfully completed
    FAILED,      // Transaction failed
    REVERSED     // Transaction reversed/refunded
}
