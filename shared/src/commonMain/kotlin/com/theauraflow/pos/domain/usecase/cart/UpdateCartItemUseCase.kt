package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for updating cart item quantity.
 *
 * Business logic:
 * - Validates quantity is positive
 * - Removes item if quantity is 0
 * - Checks stock availability for increased quantities
 */
class UpdateCartItemUseCase(
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(
        cartItemId: String,
        newQuantity: Int
    ): Result<CartItem?> {
        // Remove if quantity is 0 or negative
        if (newQuantity <= 0) {
            return cartRepository.removeFromCart(cartItemId)
                .map { null }
        }

        // Get current cart item
        val currentCart = cartRepository.getCart().getOrNull() ?: emptyList()
        val currentItem = currentCart.find { it.id == cartItemId }
            ?: return Result.failure(IllegalArgumentException("Cart item not found"))

        // If increasing quantity, check available stock
        if (newQuantity > currentItem.quantity) {
            val product = currentItem.product

            // Calculate available stock (total - items in cart EXCLUDING current item)
            val otherItemsQuantity = currentCart
                .filter { it.product.id == product.id && it.id != cartItemId }
                .sumOf { it.quantity }
            val availableStock = product.stockQuantity - otherItemsQuantity

            if (availableStock < newQuantity) {
                return Result.failure(
                    IllegalStateException("Insufficient stock. Available: $availableStock")
                )
            }
        }

        // Update quantity
        return cartRepository.updateQuantity(cartItemId, newQuantity)
    }

    /**
     * Increment cart item quantity by 1.
     */
    suspend fun increment(cartItemId: String): Result<CartItem> {
        return cartRepository.getCart()
            .mapCatching { items ->
                val item = items.find { it.id == cartItemId }
                    ?: throw IllegalArgumentException("Cart item not found")

                // Check available stock before incrementing
                val otherItemsQuantity = items
                    .filter { it.product.id == item.product.id && it.id != cartItemId }
                    .sumOf { it.quantity }
                val availableStock = item.product.stockQuantity - otherItemsQuantity

                if (availableStock < item.quantity + 1) {
                    throw IllegalStateException("Insufficient stock. Available: $availableStock")
                }

                cartRepository.updateQuantity(cartItemId, item.quantity + 1)
                    .getOrThrow()
            }
    }

    /**
     * Decrement cart item quantity by 1.
     */
    suspend fun decrement(cartItemId: String): Result<CartItem?> {
        return cartRepository.getCart()
            .mapCatching { items ->
                val item = items.find { it.id == cartItemId }
                    ?: throw IllegalArgumentException("Cart item not found")

                if (item.quantity <= 1) {
                    cartRepository.removeFromCart(cartItemId).getOrThrow()
                    null
                } else {
                    cartRepository.updateQuantity(cartItemId, item.quantity - 1)
                        .getOrThrow()
                }
            }
    }
}
