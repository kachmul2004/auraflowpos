package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for holding (saving) the current cart for later retrieval
 *
 * Business Rules:
 * - Cart must have at least one item
 * - Generates unique ID for the held cart
 * - Current cart is cleared after holding
 *
 * Common use case: Customer wants to start a new order while keeping current cart
 */
class HoldCartUseCase(
    private val cartRepository: CartRepository
) {
    /**
     * Holds the current cart with an optional name
     *
     * @param name Optional name/description for the held cart
     * @return Result with the held cart ID or error
     */
    suspend operator fun invoke(name: String? = null): Result<String> {
        // Validate cart is not empty
        val cart = cartRepository.getCart().getOrElse {
            return Result.failure(IllegalStateException("Cannot hold empty cart"))
        }

        if (cart.isEmpty()) {
            return Result.failure(IllegalArgumentException("Cannot hold empty cart"))
        }

        // Hold the cart
        return cartRepository.holdCart(name)
    }
}