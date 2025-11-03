package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

/**
 * Orders table with sync support.
 * Stores order data with metadata for preventing duplicates and handling conflicts.
 */
object SyncOrdersTable : Table("sync_orders") {
    val id = varchar("id", 36)
    val localId = varchar("local_id", 36).uniqueIndex() // Client-generated UUID (unique per device)
    val orderNumber = varchar("order_number", 50).uniqueIndex()
    val customerId = varchar("customer_id", 36).nullable()
    val customerName = varchar("customer_name", 255).nullable()
    val tableId = varchar("table_id", 36).nullable()
    val orderTableName = varchar("table_name", 255).nullable()
    val subtotal = decimal("subtotal", 10, 2)
    val tax = decimal("tax", 10, 2)
    val discount = decimal("discount", 10, 2).default(0.toBigDecimal())
    val total = decimal("total", 10, 2)
    val paymentMethod = varchar("payment_method", 50)
    val paymentStatus = varchar("payment_status", 50)
    val orderStatus = varchar("order_status", 50)
    val notes = text("notes").nullable()

    // Sync metadata
    val deviceId = varchar("device_id", 36) // Device that created this order
    val syncVersion = integer("sync_version").default(1) // Incremented on each modification
    val serverHash = varchar("server_hash", 64).nullable() // For conflict detection

    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val completedAt = datetime("completed_at").nullable()
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)

    override val primaryKey = PrimaryKey(id)
}

/**
 * Order items table (normalized).
 */
object SyncOrderItemsTable : Table("sync_order_items") {
    val id = varchar("id", 36)
    val orderId = varchar("order_id", 36).references(SyncOrdersTable.id)
    val productId = varchar("product_id", 36)
    val productName = varchar("product_name", 255)
    val quantity = integer("quantity")
    val unitPrice = decimal("unit_price", 10, 2)
    val subtotal = decimal("subtotal", 10, 2)
    val notes = text("notes").nullable()

    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)

    override val primaryKey = PrimaryKey(id)
}
