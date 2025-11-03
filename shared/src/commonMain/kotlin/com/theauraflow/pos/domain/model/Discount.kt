package com.theauraflow.pos.domain.model

import com.theauraflow.pos.util.MoneyUtils
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
     * Uses MoneyUtils for proper rounding to avoid precision errors.
     *
     * @param amount The original amount before discount
     * @return The discount amount (properly rounded to 2 decimals)
     */
    fun calculateDiscount(amount: Double): Double {
        if (!isActive || amount <= 0) return 0.0

        return when (type) {
            DiscountType.PERCENTAGE -> {
                val discountPercent = value.coerceIn(0.0, 100.0)
                // Use MoneyUtils to calculate percentage with proper rounding
                MoneyUtils.calculatePercentage(amount, discountPercent / 100.0)
            }

            DiscountType.FIXED_AMOUNT -> {
                // Ensure fixed amount is rounded and doesn't exceed the total
                val roundedValue = MoneyUtils.roundToTwoDecimals(value)
                roundedValue.coerceAtMost(amount)
            }
        }
    }

    /**
     * Calculate final amount after discount.
     * Uses MoneyUtils for proper rounding.
     */
    fun applyTo(amount: Double): Double {
        val discountAmount = calculateDiscount(amount)
        return MoneyUtils.subtract(amount, discountAmount).coerceAtLeast(0.0)
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
