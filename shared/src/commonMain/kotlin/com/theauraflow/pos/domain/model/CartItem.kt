package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing an item in the shopping cart.
 *
 * Contains product information along with quantity and any applied modifications.
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
     * Calculate base subtotal (price × quantity).
     */
    val baseSubtotal: Double
        get() = effectivePrice * quantity

    /**
     * Calculate modifiers total.
     * Each modifier's totalCost already accounts for its quantity (price * modifier.quantity).
     * This sum will be added to basePrice before multiplying by cart item quantity.
     */
    val modifiersTotal: Double
        get() = modifiers.sumOf { it.totalCost }

    /**
     * Calculate subtotal before discount.
     * Formula: (effectivePrice + sum of modifiers) * cartItemQuantity
     * This matches web version: calculateCartItemPrice(basePrice, quantity, modifiers)
     */
    val subtotalBeforeDiscount: Double
        get() = (effectivePrice + modifiersTotal) * quantity

    /**
     * Calculate discount amount.
     */
    val discountAmount: Double
        get() = discount?.calculateDiscount(subtotalBeforeDiscount) ?: 0.0

    /**
     * Calculate final subtotal after discount.
     */
    val subtotal: Double
        get() = subtotalBeforeDiscount - discountAmount

    /**
     * Calculate tax for this item.
     */
    val taxAmount: Double
        get() = subtotal * product.taxRate

    /**
     * Calculate total including tax.
     */
    val total: Double
        get() = subtotal + taxAmount

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
