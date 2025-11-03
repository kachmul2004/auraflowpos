package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

/**
 * Transactions table for financial tracking with sync support.
 */
object TransactionsTable : Table("transactions") {
    val id = varchar("id", 36)
    val localId = varchar("local_id", 36).uniqueIndex() // Client-generated UUID
    val referenceNumber = varchar("reference_number", 50).uniqueIndex()
    val orderId = varchar("order_id", 36).nullable()
    val orderNumber = varchar("order_number", 50).nullable()
    val type = varchar("type", 50) // SALE, REFUND, CASH_IN, CASH_OUT, VOID, ADJUSTMENT
    val amount = decimal("amount", 10, 2)
    val paymentMethod = varchar("payment_method", 50)
    val status = varchar("status", 50) // PENDING, COMPLETED, FAILED, REVERSED
    val userId = varchar("user_id", 36)
    val userName = varchar("user_name", 255)
    val notes = text("notes").nullable()

    // Sync metadata
    val deviceId = varchar("device_id", 36) // Device that created this transaction
    val syncVersion = integer("sync_version").default(1) // Incremented on each modification
    val serverHash = varchar("server_hash", 64).nullable() // For conflict detection

    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val completedAt = datetime("completed_at").nullable()
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)

    override val primaryKey = PrimaryKey(id)
}
