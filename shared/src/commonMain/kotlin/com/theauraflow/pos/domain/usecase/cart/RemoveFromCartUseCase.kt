package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for removing an item from the shopping cart
 */
class RemoveFromCartUseCase(
    private val cartRepository: CartRepository
) {
    /**
     * Removes an item from the cart by its ID
     *
     * @param itemId The ID of the cart item to remove
     * @return Result with success or error
     */
    suspend operator fun invoke(itemId: String): Result<Unit> {
        return cartRepository.removeFromCart(itemId)
    }
}