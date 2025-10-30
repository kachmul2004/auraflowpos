package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for clearing the shopping cart.
 *
 * Business logic:
 * - Clears all items from cart
 * - No validation needed (always allowed)
 */
class ClearCartUseCase(
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(): Result<Unit> {
        return cartRepository.clearCart()
    }
}
