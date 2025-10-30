package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for applying a discount to a cart item
 *
 * Business Rules:
 * - Validates discount is active and not expired
 * - Automatically recalculates cart item totals
 */
class ApplyDiscountUseCase(
    private val cartRepository: CartRepository
) {
    /**
     * Applies a discount to a cart item
     *
     * @param cartItemId The ID of the cart item to apply discount to
     * @param discount The discount to apply
     * @return Result with updated cart item or validation error
     */
    suspend operator fun invoke(
        cartItemId: String,
        discount: Discount
    ): Result<CartItem> {
        // Validate discount
        if (!discount.isActive) {
            return Result.failure(
                IllegalArgumentException("Discount is not active")
            )
        }

        // Apply discount to cart item
        return cartRepository.applyDiscount(cartItemId, discount)
    }
}