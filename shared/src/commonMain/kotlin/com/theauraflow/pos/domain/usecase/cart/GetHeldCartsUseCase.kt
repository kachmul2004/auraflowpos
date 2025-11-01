package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.model.HeldCart
import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for retrieving all held/parked carts.
 *
 * Business Rules:
 * - Returns carts sorted by creation date (newest first)
 *
 * Common use case: Display list of parked sales to cashier
 */
class GetHeldCartsUseCase(
    private val cartRepository: CartRepository
) {
    /**
     * Gets all held carts
     *
     * @return Result with list of held carts or error
     */
    suspend operator fun invoke(): Result<List<HeldCart>> {
        return cartRepository.getHeldCarts()
    }
}
