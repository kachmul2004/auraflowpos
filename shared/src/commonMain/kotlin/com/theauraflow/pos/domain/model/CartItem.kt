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
    val quantity: Int,
    val modifiers: List<Modifier> = emptyList(),
    val discount: Discount? = null,
    val notes: String? = null
) {
    /**
     * Calculate base subtotal (price × quantity).
     */
    val baseSubtotal: Double
        get() = product.price * quantity

    /**
     * Calculate modifiers total.
     */
    val modifiersTotal: Double
        get() = modifiers.sumOf { it.price } * quantity

    /**
     * Calculate subtotal before discount.
     */
    val subtotalBeforeDiscount: Double
        get() = baseSubtotal + modifiersTotal

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
    fun withModifier(modifier: Modifier): CartItem =
        copy(modifiers = modifiers + modifier)

    /**
     * Create a copy with applied discount.
     */
    fun withDiscount(newDiscount: Discount): CartItem = copy(discount = newDiscount)
}
