package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.CartTotals

/**
 * Use case for calculating cart totals.
 *
 * Business logic:
 * - Calculates subtotal, tax, discounts
 * - Returns formatted totals
 */
class GetCartTotalsUseCase(
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(): Result<CartTotals> {
        return cartRepository.getCartTotals()
    }
}
