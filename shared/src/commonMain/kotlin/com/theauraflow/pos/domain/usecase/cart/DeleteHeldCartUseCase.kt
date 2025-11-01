package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for deleting a held/parked cart.
 *
 * Business Rules:
 * - Cart must exist
 * - Cannot be undone
 *
 * Common use case: Customer decides to cancel a parked sale
 */
class DeleteHeldCartUseCase(
    private val cartRepository: CartRepository
) {
    /**
     * Deletes a held cart by its ID
     *
     * @param cartId The ID of the held cart to delete
     * @return Result with success or error
     */
    suspend operator fun invoke(cartId: String): Result<Unit> {
        return cartRepository.deleteHeldCart(cartId)
    }
}
