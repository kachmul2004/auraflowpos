package com.theauraflow.pos.domain.model

import com.theauraflow.pos.util.MoneyUtils
import kotlinx.serialization.Serializable

/**
 * Domain model representing an item in the shopping cart.
 *
 * Contains product information along with quantity and any applied modifications.
 *
 * All monetary calculations use MoneyUtils to ensure:
 * - Proper rounding to 2 decimal places at every step
 * - No floating-point precision errors
 * - Compliance with accounting standards
 */
@Serializable
data class CartItem(
    val id: String,
    val product: Product,
    val variation: ProductVariation? = null, // Selected variation (e.g., "Medium" size)
    val quantity: Int,
    val modifiers: List<CartItemModifier> = emptyList(),
    val discount: Discount? = null,
    val notes: String? = null
) {
    /**
     * Get the effective price (variation price if present, otherwise product price).
     */
    private val effectivePrice: Double
        get() = variation?.price ?: product.price

    /**
     * Calculate base subtotal (price × quantity) with proper rounding.
     */
    val baseSubtotal: Double
        get() = MoneyUtils.multiply(effectivePrice, quantity.toDouble())

    /**
     * Calculate modifiers total with proper rounding.
     * Each modifier's totalCost already accounts for its quantity (price * modifier.quantity).
     * This sum will be added to basePrice before multiplying by cart item quantity.
     */
    val modifiersTotal: Double
        get() = MoneyUtils.sum(modifiers.map { it.totalCost })

    /**
     * Calculate subtotal before discount with proper rounding.
     * Formula: (effectivePrice + sum of modifiers) * cartItemQuantity
     * This matches web version: calculateCartItemPrice(basePrice, quantity, modifiers)
     */
    val subtotalBeforeDiscount: Double
        get() {
            val priceWithModifiers = MoneyUtils.add(effectivePrice, modifiersTotal)
            val result = MoneyUtils.multiply(priceWithModifiers, quantity.toDouble())
            // Debug: Print calculation steps
            println("CartItem[${product.name}]: price=$effectivePrice, modifiers=$modifiersTotal, qty=$quantity, result=$result")
            return result
        }

    /**
     * Calculate discount amount with proper rounding.
     */
    val discountAmount: Double
        get() = discount?.calculateDiscount(subtotalBeforeDiscount) ?: 0.0

    /**
     * Calculate final subtotal after discount with proper rounding.
     */
    val subtotal: Double
        get() = MoneyUtils.subtract(subtotalBeforeDiscount, discountAmount)

    /**
     * Calculate tax for this item with proper rounding.
     */
    val taxAmount: Double
        get() = MoneyUtils.calculatePercentage(subtotal, product.taxRate)

    /**
     * Calculate total including tax with proper rounding.
     */
    val total: Double
        get() = MoneyUtils.add(subtotal, taxAmount)

    /**
     * Check if quantity is valid.
     */
    fun isValidQuantity(): Boolean = quantity > 0

    /**
     * Create a copy with updated quantity.
     */
    fun withQuantity(newQuantity: Int): CartItem = copy(quantity = newQuantity)

    /**
     * Create a copy with added modifier.
     */
    fun withModifier(modifier: CartItemModifier): CartItem =
        copy(modifiers = modifiers + modifier)

    /**
     * Create a copy with applied discount.
     */
    fun withDiscount(newDiscount: Discount): CartItem = copy(discount = newDiscount)
}
