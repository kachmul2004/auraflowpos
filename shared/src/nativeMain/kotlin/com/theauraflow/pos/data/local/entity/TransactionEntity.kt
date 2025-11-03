package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.Transaction
import com.theauraflow.pos.domain.model.TransactionType
import com.theauraflow.pos.domain.model.TransactionStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import kotlinx.serialization.Serializable

/**
 * Database entity for Transaction.
 * Stores financial transactions for all orders.
 */
@Entity(tableName = "transactions")
@Serializable
data class TransactionEntity(
    @PrimaryKey
    val id: String,
    val referenceNumber: String,
    val orderId: String? = null,
    val orderNumber: String? = null,
    val type: String, // "SALE", "REFUND", "VOID"
    val amount: Double,
    val paymentMethod: String, // "CASH", "CARD", "MOBILE", etc.
    val status: String, // "COMPLETED", "PENDING", "FAILED", "REVERSED"
    val userId: String,
    val userName: String,
    val notes: String? = null,
    val createdAt: Long,
    val completedAt: Long? = null
)

fun TransactionEntity.toDomain(): Transaction {
    return Transaction(
        id = id,
        referenceNumber = referenceNumber,
        orderId = orderId,
        orderNumber = orderNumber,
        type = TransactionType.valueOf(type),
        amount = amount,
        paymentMethod = PaymentMethod.valueOf(paymentMethod),
        status = TransactionStatus.valueOf(status),
        userId = userId,
        userName = userName,
        notes = notes,
        createdAt = createdAt,
        completedAt = completedAt
    )
}

fun Transaction.toEntity(): TransactionEntity {
    return TransactionEntity(
        id = id,
        referenceNumber = referenceNumber,
        orderId = orderId,
        orderNumber = orderNumber,
        type = type.name,
        amount = amount,
        paymentMethod = paymentMethod.name,
        status = status.name,
        userId = userId,
        userName = userName,
        notes = notes,
        createdAt = createdAt,
        completedAt = completedAt
    )
}