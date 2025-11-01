package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.User
import com.theauraflow.pos.domain.model.UserRole
import kotlinx.datetime.Clock
import kotlinx.serialization.Serializable

/**
 * Database entity for User.
 * Note: passwordHash and pin are only stored in the database entity,
 * not exposed in the domain model for security.
 */
@Entity(tableName = "users")
@Serializable
data class UserEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val email: String,
    val passwordHash: String, // Database only - not in domain model
    val role: String, // Stored as string: "ADMIN", "MANAGER", "CASHIER"
    val pin: String? = null, // Database only - not in domain model
    val isActive: Boolean = true,
    val lastLogin: Long? = null,
    val createdAt: Long = 0L,
    val updatedAt: Long = 0L
)

fun UserEntity.toDomain(): User {
    return User(
        id = id,
        name = name,
        email = email,
        role = UserRole.valueOf(role),
        isActive = isActive,
        lastLogin = lastLogin
    )
}

fun User.toEntity(passwordHash: String = "", pin: String? = null): UserEntity {
    return UserEntity(
        id = id,
        name = name,
        email = email,
        passwordHash = passwordHash,
        role = role.name,
        pin = pin,
        isActive = isActive,
        lastLogin = lastLogin,
        createdAt = 0L, // Will be set by the database
        updatedAt = 0L  // Will be set by the database
    )
}
