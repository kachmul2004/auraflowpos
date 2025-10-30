package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/**
 * Orders table for transaction management.
 */
object OrdersTable : Table("orders") {
    val id = varchar("id", 36)
    val orderNumber = varchar("order_number", 50).uniqueIndex()
    val customerId = varchar("customer_id", 36).nullable()
    val userId = varchar("user_id", 36) // Cashier/employee who created the order
    val subtotal = decimal("subtotal", 10, 2)
    val tax = decimal("tax", 10, 2).default(0.toBigDecimal())
    val discount = decimal("discount", 10, 2).default(0.toBigDecimal())
    val total = decimal("total", 10, 2)
    val paymentMethod = varchar("payment_method", 50) // CASH, CARD, MOBILE, etc.
    val paymentStatus =
        varchar("payment_status", 50).default("PENDING") // PENDING, COMPLETED, REFUNDED
    val orderStatus =
        varchar("order_status", 50).default("COMPLETED") // COMPLETED, CANCELLED, REFUNDED
    val notes = text("notes").nullable()
    val createdAt =
        datetime("created_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }
    val updatedAt =
        datetime("updated_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }

    override val primaryKey = PrimaryKey(id)
}

/**
 * Order status enum.
 */
enum class OrderStatus(val value: String) {
    PENDING("PENDING"),
    COMPLETED("COMPLETED"),
    CANCELLED("CANCELLED"),
    REFUNDED("REFUNDED");

    companion object {
        fun fromString(value: String): OrderStatus? {
            return entries.find { it.value == value.uppercase() }
        }
    }
}

/**
 * Payment method enum.
 */
enum class PaymentMethod(val value: String) {
    CASH("CASH"),
    CARD("CARD"),
    MOBILE("MOBILE"),
    OTHER("OTHER");

    companion object {
        fun fromString(value: String): PaymentMethod? {
            return entries.find { it.value == value.uppercase() }
        }
    }
}
