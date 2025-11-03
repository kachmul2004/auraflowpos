package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

/**
 * Categories table for product organization.
 */
object CategoriesTable : Table("categories") {
    val id = varchar("id", 36)
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val color = varchar("color", 20).nullable() // Hex color for UI
    val icon = varchar("icon", 100).nullable() // Icon name
    val sortOrder = integer("sort_order").default(0)
    val parentId = varchar("parent_id", 36).nullable() // For nested categories
    val isActive = bool("is_active").default(true)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)

    override val primaryKey = PrimaryKey(id)
}
