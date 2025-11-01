package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a held/parked cart.
 */
@Serializable
data class HeldCart(
    val id: String,
    val items: List<CartItem>,
    val name: String? = null,
    val customerId: String? = null,
    val customerName: String? = null,
    val notes: String? = null,
    val createdAt: Long,
    val subtotal: Double,
    val tax: Double,
    val discount: Double,
    val total: Double
) {
    /**
     * Get total number of items.
     */
    val itemCount: Int
        get() = items.sumOf { it.quantity }
}
