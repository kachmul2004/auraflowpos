package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a discount that can be applied to items or orders.
 */
@Serializable
data class Discount(
    val id: String,
    val name: String,
    val type: DiscountType,
    val value: Double,
    val code: String? = null,
    val isActive: Boolean = true
) {
    /**
     * Calculate discount amount based on the original amount.
     *
     * @param amount The original amount before discount
     * @return The discount amount
     */
    fun calculateDiscount(amount: Double): Double {
        if (!isActive || amount <= 0) return 0.0

        return when (type) {
            DiscountType.PERCENTAGE -> {
                val discountPercent = value.coerceIn(0.0, 100.0)
                amount * (discountPercent / 100.0)
            }

            DiscountType.FIXED_AMOUNT -> {
                value.coerceAtMost(amount)
            }
        }
    }

    /**
     * Calculate final amount after discount.
     */
    fun applyTo(amount: Double): Double {
        return (amount - calculateDiscount(amount)).coerceAtLeast(0.0)
    }
}

/**
 * Types of discounts supported in the POS system.
 */
@Serializable
enum class DiscountType {
    /**
     * Percentage discount (e.g., 10% off).
     */
    PERCENTAGE,

    /**
     * Fixed amount discount (e.g., $5 off).
     */
    FIXED_AMOUNT
}
