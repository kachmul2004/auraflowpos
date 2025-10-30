package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/**
 * Users table for authentication and user management.
 */
object UsersTable : Table("users") {
    val id = varchar("id", 36)
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val name = varchar("name", 255)
    val role = varchar("role", 50) // "ADMIN", "MANAGER", "CASHIER"
    val isActive = bool("is_active").default(true)
    val createdAt =
        datetime("created_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }
    val updatedAt =
        datetime("updated_at").clientDefault { Clock.System.now().toLocalDateTime(TimeZone.UTC) }

    override val primaryKey = PrimaryKey(id)
}

/**
 * User roles enum.
 */
enum class UserRole(val value: String) {
    ADMIN("ADMIN"),
    MANAGER("MANAGER"),
    CASHIER("CASHIER");

    companion object {
        fun fromString(value: String): UserRole? {
            return entries.find { it.value == value.uppercase() }
        }
    }
}
