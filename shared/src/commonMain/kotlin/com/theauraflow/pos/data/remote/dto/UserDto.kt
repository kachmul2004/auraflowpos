package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.User
import com.theauraflow.pos.domain.model.UserRole
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for User API responses.
 */
@Serializable
data class UserDto(
    @SerialName("id") val id: String,
    @SerialName("email") val email: String,
    @SerialName("name") val name: String,
    @SerialName("role") val role: String,
    @SerialName("is_active") val isActive: Boolean = true,
    @SerialName("last_login") val lastLogin: Long? = null
)

/**
 * Convert UserDto to domain User model.
 */
fun UserDto.toDomain(): User = User(
    id = id,
    email = email,
    name = name,
    role = UserRole.valueOf(role.uppercase()),
    isActive = isActive,
    lastLogin = lastLogin
)

/**
 * Convert domain User to UserDto.
 */
fun User.toDto(): UserDto = UserDto(
    id = id,
    email = email,
    name = name,
    role = role.name.lowercase(),
    isActive = isActive,
    lastLogin = lastLogin
)