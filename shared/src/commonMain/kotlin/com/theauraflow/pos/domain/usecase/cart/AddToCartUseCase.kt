package com.theauraflow.pos.domain.usecase.cart

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.CartItemModifier
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.model.ProductVariation
import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for adding products to the shopping cart.
 *
 * Business logic:
 * - Validates product is active
 * - Validates product has valid price
 * - Validates quantity is positive
 * - Checks stock availability (total stock - items already in cart)
 * - Validates required modifiers are selected
 * - Supports product variations (e.g., sizes)
 */
class AddToCartUseCase(
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(
        product: Product,
        variation: ProductVariation? = null,
        quantity: Int = 1,
        modifiers: List<CartItemModifier> = emptyList()
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

        // Check available stock (total stock - items already in cart)
        val currentCart = cartRepository.getCart().getOrNull() ?: emptyList()
        val quantityInCart = currentCart
            .filter { it.product.id == product.id }
            .sumOf { it.quantity }
        val availableStock = product.stockQuantity - quantityInCart

        if (availableStock < quantity) {
            return Result.failure(
                IllegalStateException("Insufficient stock. Available: $availableStock")
            )
        }

        // Validate modifiers (if product requires modifiers)
        if (product.hasModifiers && modifiers.isEmpty()) {
            return Result.failure(
                IllegalArgumentException("Product requires modifiers")
            )
        }

        // Add to cart
        return cartRepository.addToCart(product, variation, quantity, modifiers)
    }
}
