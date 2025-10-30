package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.CartTotals
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * In-memory implementation of CartRepository.
 *
 * For a production app, this would persist to local database.
 */
@OptIn(ExperimentalUuidApi::class)
class CartRepositoryImpl : CartRepository {

    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    private val _heldCarts = mutableMapOf<String, List<CartItem>>()

    override fun observeCart(): Flow<List<CartItem>> {
        return _cart.asStateFlow()
    }

    override suspend fun getCart(): Result<List<CartItem>> {
        return Result.success(_cart.value)
    }

    override suspend fun addToCart(
        product: Product,
        quantity: Int,
        modifiers: List<Modifier>
    ): Result<CartItem> {
        return try {
            // Check if item already exists with same product and modifiers
            val existing = _cart.value.find {
                it.product.id == product.id &&
                        it.modifiers.map { m -> m.id }.toSet() == modifiers.map { m -> m.id }
                    .toSet()
            }

            val cartItem = if (existing != null) {
                // Update quantity
                existing.copy(quantity = existing.quantity + quantity)
            } else {
                // Create new cart item
                CartItem(
                    id = Uuid.random().toString(),
                    product = product,
                    quantity = quantity,
                    modifiers = modifiers
                )
            }

            // Update cart
            _cart.value = if (existing != null) {
                _cart.value.map { if (it.id == existing.id) cartItem else it }
            } else {
                _cart.value + cartItem
            }

            Result.success(cartItem)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateQuantity(cartItemId: String, quantity: Int): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(quantity = quantity)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun addModifier(cartItemId: String, modifier: Modifier): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(modifiers = item.modifiers + modifier)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun removeModifier(cartItemId: String, modifierId: String): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(
                modifiers = item.modifiers.filter { it.id != modifierId }
            )
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun applyDiscount(cartItemId: String, discount: Discount): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(discount = discount)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun removeDiscount(cartItemId: String): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(discount = null)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun removeFromCart(cartItemId: String): Result<Unit> {
        return try {
            _cart.value = _cart.value.filter { it.id != cartItemId }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun clearCart(): Result<Unit> {
        return try {
            _cart.value = emptyList()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCartTotals(): Result<CartTotals> {
        return try {
            val items = _cart.value
            val subtotal = items.sumOf { it.subtotal }
            val tax = items.sumOf { it.taxAmount }
            val discount = items.sumOf { it.discountAmount }
            val total = items.sumOf { it.total }
            val itemCount = items.sumOf { it.quantity }

            val totals = CartTotals(
                subtotal = subtotal,
                tax = tax,
                discount = discount,
                total = total,
                itemCount = itemCount
            )

            Result.success(totals)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun holdCart(name: String?): Result<String> {
        return try {
            val cartId = Uuid.random().toString()
            _heldCarts[cartId] = _cart.value
            _cart.value = emptyList()
            Result.success(cartId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun retrieveCart(cartId: String): Result<Unit> {
        return try {
            val heldCart = _heldCarts[cartId]
                ?: return Result.failure(NoSuchElementException("Held cart not found"))

            _cart.value = heldCart
            _heldCarts.remove(cartId)

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}