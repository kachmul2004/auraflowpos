package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for retrieving a previously held cart
 *
 * Business Rules:
 * - Current cart must be empty or will be replaced
 * - Held cart is removed from storage after retrieval
 *
 * Common use case: Customer returns to complete their held order
 */
class RetrieveCartUseCase(
    private val cartRepository: CartRepository
) {
    /**
     * Retrieves a held cart by its ID
     *
     * @param cartId The ID of the held cart to retrieve
     * @param clearCurrent Whether to clear current cart before retrieving (default: true)
     * @return Result with success or error
     */
    suspend operator fun invoke(
        cartId: String,
        clearCurrent: Boolean = true
    ): Result<Unit> {
        // Optionally clear current cart first
        if (clearCurrent) {
            cartRepository.clearCart().getOrElse {
                return Result.failure(it)
            }
        }

        // Retrieve the held cart
        return cartRepository.retrieveCart(cartId)
    }
}