package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

/**
 * Products table for inventory management.
 */
object ProductsTable : Table("products") {
    val id = varchar("id", 36)
    val name = varchar("name", 255)
    val sku = varchar("sku", 100).uniqueIndex().nullable()
    val barcode = varchar("barcode", 100).nullable()
    val price = decimal("price", 10, 2)
    val cost = decimal("cost", 10, 2).nullable()
    val categoryId = varchar("category_id", 36).nullable()
    val stockQuantity = integer("stock_quantity").default(0)
    val minStockLevel = integer("min_stock_level").default(0)
    val imageUrl = varchar("image_url", 500).nullable()
    val description = text("description").nullable()
    val taxRate = decimal("tax_rate", 5, 2).default(0.toBigDecimal())
    val isActive = bool("is_active").default(true)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)

    override val primaryKey = PrimaryKey(id)
}
