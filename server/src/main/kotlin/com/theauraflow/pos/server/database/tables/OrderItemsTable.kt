package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table

/**
 * Order items table for individual line items in orders.
 */
object OrderItemsTable : Table("order_items") {
    val id = varchar("id", 36)
    val orderId = varchar("order_id", 36)
    val productId = varchar("product_id", 36)
    val productName = varchar("product_name", 255) // Snapshot at time of order
    val quantity = integer("quantity")
    val unitPrice = decimal("unit_price", 10, 2) // Price at time of order
    val discount = decimal("discount", 10, 2).default(0.toBigDecimal())
    val tax = decimal("tax", 10, 2).default(0.toBigDecimal())
    val subtotal = decimal("subtotal", 10, 2)
    val total = decimal("total", 10, 2)
    val notes = text("notes").nullable()

    override val primaryKey = PrimaryKey(id)
}
