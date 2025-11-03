package com.theauraflow.pos.server.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

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
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime)

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
