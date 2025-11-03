package com.theauraflow.pos.domain.model

import com.theauraflow.pos.util.MoneyUtils
import kotlinx.serialization.Serializable

/**
 * Domain model representing a modifier added to a cart item.
 *
 * Wraps a Modifier with a quantity to support multiple units of the same modifier
 * (e.g., "2x Extra Shot").
 */
@Serializable
data class CartItemModifier(
    val id: String,
    val name: String,
    val price: Double,
    val quantity: Int = 1,
    val groupId: String? = null,
    val groupName: String? = null
) {
    /**
     * Calculate total cost for this modifier (price × quantity) with proper rounding.
     */
    val totalCost: Double
        get() = MoneyUtils.multiply(price, quantity.toDouble())

    /**
     * Check if modifier has additional cost.
     */
    val hasCost: Boolean
        get() = price > 0.0

    /**
     * Check if modifier is free.
     */
    val isFree: Boolean
        get() = price == 0.0

    companion object {
        /**
         * Create a CartItemModifier from a Modifier with the specified quantity.
         */
        fun from(modifier: Modifier, quantity: Int = 1): CartItemModifier {
            return CartItemModifier(
                id = modifier.id,
                name = modifier.name,
                price = modifier.price,
                quantity = quantity,
                groupId = modifier.groupId,
                groupName = modifier.groupName
            )
        }
    }
}
