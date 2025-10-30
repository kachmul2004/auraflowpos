package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for adding products to the shopping cart.
 *
 * Business logic:
 * - Validates product is active
 * - Validates product has valid price
 * - Validates quantity is positive
 * - Checks stock availability
 * - Validates required modifiers are selected
 */
class AddToCartUseCase(
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(
        product: Product,
        quantity: Int = 1,
        modifiers: List<Modifier> = emptyList()
    ): Result<CartItem> {
        // Validate product
        if (!product.isActive) {
            return Result.failure(
                IllegalArgumentException("Product is not active")
            )
        }

        if (!product.isValidPrice()) {
            return Result.failure(
                IllegalArgumentException("Product has invalid price")
            )
        }

        // Validate quantity
        if (quantity <= 0) {
            return Result.failure(
                IllegalArgumentException("Quantity must be positive")
            )
        }

        // Check stock
        if (product.stockQuantity < quantity) {
            return Result.failure(
                IllegalStateException("Insufficient stock. Available: ${product.stockQuantity}")
            )
        }

        // Validate modifiers (if product requires modifiers)
        if (product.hasModifiers && modifiers.isEmpty()) {
            return Result.failure(
                IllegalArgumentException("Product requires modifiers")
            )
        }

        // Add to cart
        return cartRepository.addToCart(product, quantity, modifiers)
    }
}
