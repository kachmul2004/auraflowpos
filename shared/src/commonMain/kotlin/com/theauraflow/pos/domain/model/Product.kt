package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a product in the POS system.
 *
 * This is a pure domain model with business logic and validation.
 * It should NOT contain any platform-specific code or framework dependencies.
 */
@Serializable
data class Product(
    val id: String,
    val name: String,
    val sku: String? = null,
    val barcode: String? = null,
    val price: Double,
    val cost: Double? = null,
    val categoryId: String? = null,
    val categoryName: String? = null,
    val stockQuantity: Int = 0,
    val minStockLevel: Int = 0,
    val imageUrl: String? = null,
    val description: String? = null,
    val taxRate: Double = 0.0,
    val isActive: Boolean = true,
    val hasVariations: Boolean = false,
    val hasModifiers: Boolean = false,
    // Variations (e.g., Small/Medium/Large)
    val variationType: VariationType? = null,
    val variations: List<ProductVariation>? = null,
    // Modifiers (e.g., Extra Shot, Oat Milk)
    val modifiers: List<Modifier>? = null
) {
    /**
     * Check if product is in stock.
     */
    val isInStock: Boolean
        get() = stockQuantity > 0

    /**
     * Check if product needs restock (below minimum level).
     */
    val needsRestock: Boolean
        get() = stockQuantity <= minStockLevel

    /**
     * Calculate price with tax.
     */
    fun priceWithTax(): Double = price * (1 + taxRate)

    /**
     * Calculate profit margin.
     */
    fun profitMargin(): Double? {
        return cost?.let { (price - it) / price * 100 }
    }

    /**
     * Check if price is valid for POS operations.
     */
    fun isValidPrice(): Boolean = price > 0.0

    companion object {
        const val MIN_PRICE = 0.01
        const val MAX_PRICE = 999999.99
    }
}
