package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a product variation.
 *
 * Variations are different versions of a product (e.g., "Small", "Medium", "Large").
 * Each variation can have its own price and stock quantity.
 */
@Serializable
data class ProductVariation(
    val id: String,
    val name: String,
    val price: Double,
    val stockQuantity: Int = 0,
    val sku: String? = null,
    val barcode: String? = null,
    val imageUrl: String? = null
) {
    /**
     * Check if variation is in stock.
     */
    val isInStock: Boolean
        get() = stockQuantity > 0

    /**
     * Check if price is valid.
     */
    fun isValidPrice(): Boolean = price > 0.0
}

/**
 * Variation type (e.g., "Size", "Color", "Flavor")
 */
@Serializable
data class VariationType(
    val id: String,
    val name: String
)
