package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.HeldCart
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.model.ProductVariation
import com.theauraflow.pos.domain.model.CartItemModifier
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for shopping cart operations.
 *
 * Manages the current shopping cart state.
 */
interface CartRepository {

    /**
     * Observe the current cart items.
     *
     * @return Flow emitting current cart items
     */
    fun observeCart(): Flow<List<CartItem>>

    /**
     * Get current cart items.
     *
     * @return Result with cart items or error
     */
    suspend fun getCart(): Result<List<CartItem>>

    /**
     * Add a product to the cart.
     *
     * @param product Product to add
     * @param variation Optional product variation (e.g., size)
     * @param quantity Quantity to add
     * @param modifiers Optional modifiers with their quantities
     * @return Result with updated cart item or error
     */
    suspend fun addToCart(
        product: Product,
        variation: ProductVariation? = null,
        quantity: Int = 1,
        modifiers: List<CartItemModifier> = emptyList()
    ): Result<CartItem>

    /**
     * Update cart item quantity.
     *
     * @param cartItemId Cart item ID
     * @param quantity New quantity
     * @return Result with updated cart item or error
     */
    suspend fun updateQuantity(cartItemId: String, quantity: Int): Result<CartItem>

    /**
     * Add a modifier to a cart item.
     *
     * @param cartItemId Cart item ID
     * @param modifier Modifier to add (with quantity)
     * @return Result with updated cart item or error
     */
    suspend fun addModifier(cartItemId: String, modifier: CartItemModifier): Result<CartItem>

    /**
     * Remove modifier from a cart item.
     *
     * @param cartItemId Cart item ID
     * @param modifierId Modifier ID to remove
     * @return Result with updated cart item or error
     */
    suspend fun removeModifier(cartItemId: String, modifierId: String): Result<CartItem>

    /**
     * Apply discount to a cart item.
     *
     * @param cartItemId Cart item ID
     * @param discount Discount to apply
     * @return Result with updated cart item or error
     */
    suspend fun applyDiscount(cartItemId: String, discount: Discount): Result<CartItem>

    /**
     * Remove discount from a cart item.
     *
     * @param cartItemId Cart item ID
     * @return Result with updated cart item or error
     */
    suspend fun removeDiscount(cartItemId: String): Result<CartItem>

    /**
     * Remove an item from the cart.
     *
     * @param cartItemId Cart item ID
     * @return Result with success or error
     */
    suspend fun removeFromCart(cartItemId: String): Result<Unit>

    /**
     * Clear all items from the cart.
     *
     * @return Result with success or error
     */
    suspend fun clearCart(): Result<Unit>

    /**
     * Get cart totals (subtotal, tax, total).
     *
     * @return Result with cart totals
     */
    suspend fun getCartTotals(): Result<CartTotals>

    /**
     * Save cart for later (hold order).
     *
     * @param name Optional name for the held order
     * @return Result with saved cart ID or error
     */
    suspend fun holdCart(name: String? = null): Result<String>

    /**
     * Retrieve a held cart.
     *
     * @param cartId Held cart ID
     * @return Result with success or error
     */
    suspend fun retrieveCart(cartId: String): Result<Unit>

    /**
     * Get all held carts.
     *
     * @return Result with list of held carts or error
     */
    suspend fun getHeldCarts(): Result<List<HeldCart>>

    /**
     * Delete a held cart.
     *
     * @param cartId Held cart ID
     * @return Result with success or error
     */
    suspend fun deleteHeldCart(cartId: String): Result<Unit>

    /**
     * Observe held carts as a Flow.
     *
     * @return Flow emitting list of held carts
     */
    fun observeHeldCarts(): Flow<List<HeldCart>>
}

/**
 * Data class representing cart totals.
 */
data class CartTotals(
    val subtotal: Double,
    val tax: Double,
    val discount: Double,
    val total: Double,
    val itemCount: Int
)
