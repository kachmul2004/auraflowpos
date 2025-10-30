package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

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
    val createdAt =
        datetime("created_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }
    val updatedAt =
        datetime("updated_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }

    override val primaryKey = PrimaryKey(id)
}
