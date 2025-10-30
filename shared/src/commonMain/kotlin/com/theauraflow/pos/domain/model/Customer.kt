package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a customer in the POS system.
 */
@Serializable
data class Customer(
    val id: String,
    val name: String,
    val email: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val loyaltyPoints: Int = 0,
    val totalSpent: Double = 0.0,
    val orderCount: Int = 0,
    val isActive: Boolean = true,
    val notes: String? = null
) {
    /**
     * Check if customer has contact information.
     */
    val hasContactInfo: Boolean
        get() = !email.isNullOrBlank() || !phone.isNullOrBlank()

    /**
     * Check if customer is in loyalty program.
     */
    val isInLoyaltyProgram: Boolean
        get() = loyaltyPoints > 0

    /**
     * Calculate average order value.
     */
    fun averageOrderValue(): Double {
        return if (orderCount > 0) totalSpent / orderCount else 0.0
    }

    /**
     * Check if email is valid format.
     */
    fun hasValidEmail(): Boolean {
        return email?.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) == true
    }
}
