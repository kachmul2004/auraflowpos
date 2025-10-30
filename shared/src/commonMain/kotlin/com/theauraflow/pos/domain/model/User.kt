package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a user (employee) in the POS system.
 */
@Serializable
data class User(
    val id: String,
    val email: String,
    val name: String,
    val role: UserRole,
    val isActive: Boolean = true,
    val lastLogin: Long? = null
) {
    /**
     * Check if user is an admin.
     */
    val isAdmin: Boolean
        get() = role == UserRole.ADMIN

    /**
     * Check if user is a manager.
     */
    val isManager: Boolean
        get() = role == UserRole.MANAGER

    /**
     * Check if user can perform admin operations.
     */
    fun canPerformAdminOperations(): Boolean {
        return isActive && (isAdmin || isManager)
    }

    /**
     * Check if user can process refunds.
     */
    fun canProcessRefunds(): Boolean {
        return isActive && role != UserRole.CASHIER
    }

    /**
     * Check if user can manage products.
     */
    fun canManageProducts(): Boolean {
        return isActive && role != UserRole.CASHIER
    }
}

/**
 * User roles with different permission levels.
 */
@Serializable
enum class UserRole {
    /**
     * Full system access.
     */
    ADMIN,

    /**
     * Can manage most operations except system settings.
     */
    MANAGER,

    /**
     * Can process transactions but limited admin access.
     */
    CASHIER
}
