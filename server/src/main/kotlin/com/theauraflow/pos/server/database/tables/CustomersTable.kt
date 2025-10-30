package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/**
 * Customers table for customer management and loyalty.
 */
object CustomersTable : Table("customers") {
    val id = varchar("id", 36)
    val name = varchar("name", 255)
    val email = varchar("email", 255).nullable()
    val phone = varchar("phone", 50).nullable()
    val address = text("address").nullable()
    val loyaltyPoints = integer("loyalty_points").default(0)
    val totalSpent = decimal("total_spent", 10, 2).default(0.toBigDecimal())
    val totalOrders = integer("total_orders").default(0)
    val notes = text("notes").nullable()
    val isActive = bool("is_active").default(true)
    val createdAt =
        datetime("created_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }
    val updatedAt =
        datetime("updated_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }

    override val primaryKey = PrimaryKey(id)
}
